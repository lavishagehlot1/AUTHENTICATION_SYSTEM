export const registerTemplate = (userName, otp) => {
  return `<div>
    <p>Welcome ${userName}!</p>
    <p>Your OTP for registration is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>
  </div>`;
};