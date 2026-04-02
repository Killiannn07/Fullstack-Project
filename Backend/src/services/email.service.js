const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendResetPasswordEmail(email, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<h2>Reset Your Password</h2>
      <p>Anda menerima email ini karena permintaan reset password.</p>
      <p>Klik link dibawah untuk reset password Anda :</p>
      <a href="${resetLink}" target="_blank">
        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; cursor: pointer; border: none; border-radius: 4px;">
          Reset Password
        </button>
      </a>
      <p>Link ini berlaku selama 30 menit.</p>
      <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      <hr>
      <p>Link: ${resetLink}</p>`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendResetPasswordEmail };
