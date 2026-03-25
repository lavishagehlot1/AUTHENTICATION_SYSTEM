export const forgotPasswordTemplate = (userName, otp) => {
  return `<div>
    <p>Hello ${userName},</p>
    <p>Use this OTP to reset your password: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  </div>`;
};