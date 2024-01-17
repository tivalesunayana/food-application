const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transpoter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: "harshdeep <had9821@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //   console.log(transpoter);
  await transpoter.sendMail(mailOptions);
};
module.exports = sendEmail;
