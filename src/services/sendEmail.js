import nodemailer from 'nodemailer';
import { registerTemplate } from './templatess/regissterTemplate.js';
import { resendOtpTemplate } from './templatess/resendOtpTemplate.js';
import { registerSuccessTemplate } from './templatess/registrationSuccess.js';
import { forgotPasswordTemplate } from './templatess/forgotPasswordTemplate.js';
import passwordResetSuccessTemplate from './templatess/passwordResetSuccessTemplate.js';

const sendEmail = async (to, otp, type = "register", userName = "") => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true if using port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // select template based on the email type
    let html = "";
    let subject = "";

    switch (type) {
      case "register":
        html = registerTemplate(userName, otp);
        subject = "OTP for registration";
        break;
      case "resendOtp":
        html = resendOtpTemplate(userName, otp);
        subject = "Resend OTP for verification";
        break;
      case "registrationSuccess":
        html = registerSuccessTemplate(userName, otp);
        subject = "Registration Successful";
        break;
      case "forgotPasswordTemplate":
        html=forgotPasswordTemplate(userName,otp);
        subject="link sent successfully";
        break;
      case "passwordResetSuccessTemplate":
        html=passwordResetSuccessTemplate(userName);
        subject="Password update successfully";
        break;
      default:
        html = registerTemplate(userName, otp);
        subject = "Your OTP code for verification";
    }

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`, // sender email
      to,
      subject,
      html,
    });

    console.log('Email sent successfully to', to);
  } catch (err) {
    console.log("ERROR WHILE SENDING:", err.name, err.message);
    throw err;
  }
};

export default sendEmail;