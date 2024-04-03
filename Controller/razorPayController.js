const { catchAsyncErrors } = require("../Middleware/catchAsyncErrors");
const Razorpay = require("razorpay");
const Car = require("../Models/carSchema");
const crypto = require("crypto");

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.makePayment = catchAsyncErrors(async (req, res, next) => {
  const { carId } = req.body;
  const car = await Car.findById(carId);
  // const amount = Number(
  //   car.bargained.price != -1 ? car.bargained.price : car.price
  // );
  // console.log({
  //   car,
  //   amount,
  //   type: typeof amount,
  //   bargained: car.bargained.price,
  //   price: car.price,
  // });
  const order = await razorpay.orders.create({
    amount: car.price,
    currency: "INR",
    receipt: car._id,
    partial_payment: false,
  });

  console.log({ order });
  res.status(200).json(order);
});

//Payment Verification
exports.paymentVerification = catchAsyncErrors(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  console.log({ razorpay_payment_id, razorpay_order_id, razorpay_signature });

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log({ expectedSignature, signature: razorpay_signature });

  var response = { signatureValid: false };

  const isAuthentic = expectedSignature == razorpay_signature;

  if (isAuthentic) {
    res.redirect(
      `http://localhost:5173/paymentSuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }

  res.send(response);
});
