const nodemailer = require("nodemailer")

const sendMail = async(to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASSWORD
            }
        })
        const mailOptions = {
            from:`"BUFF & BEYOND" <${process.env.EMAIL_USER}>`,
            to,
            subject,html
        }
        await transporter.sendMail(mailOptions)
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email Error:", error.message);
    }

}
module.exports = sendMail