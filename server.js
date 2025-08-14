const express = require("express");
const sendMail = require("./lib/utils/sendMail");
const Razorpay = require("razorpay")
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

app.post("/create-order", async(req, res) => {
    try {
        const {amount} = req.body
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        }
        const order = await razorpay.orders.create(options)
        res.status(200).json({ success: true, order });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ success: false });
    }
})
app.post("/bookslot", async (req, res) => {
  const { customerName, email, service, timeSlot, type } = req.body;
  console.log(req.body);
  try {
    const subject = "Appointment Confirmation -- BUFF & BEYOND";
    const html = `<p>Hi ${customerName},</p>

        <p>Thank you for booking your service with <strong>BUFF & BEYOND</strong>.</p>
        
        <p>Here are your appointment details:</p>
        <ul>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Car Type:</strong> ${type}</li>
          <li><strong>Date:</strong>${new Date().toLocaleDateString()}</li>
          <li><strong>Time Slot:</strong> ${timeSlot}</li>
        </ul>
        
        <p>Please arrive 10 minutes early to ensure smooth check-in.</p>
        
        <p>If you need to reschedule, reply to this email or call us at <strong>9876543210</strong>.</p>
        
        <p>We look forward to serving you!</p>
        
        <p>Best regards,<br>
        BUFF & BEYOND Team</p>
        `;
    await sendMail(email, subject, html);
    res.status(200).json({ message: "Booking Confirmed" });
  } catch (error) {
    console.error("Apply Job Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log("Your app is running");
});
