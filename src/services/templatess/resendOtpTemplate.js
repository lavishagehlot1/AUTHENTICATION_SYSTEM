export const resendOtpTemplate = (userName, otp) => {
  return `<div>
    <p>Hello ${userName},</p>
    <p>Your OTP has been resent: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  </div>`;
};