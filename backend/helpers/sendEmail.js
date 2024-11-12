const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: to,
    subject: subject,
    html: `
    <html>
      <body>
        ${text}
      </body>
    </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //   console.error("Error sending email: ", error);
    } else {
      //   console.log("Email sent: ", info.response);
    }
  });
};

module.exports = { sendEmail };
