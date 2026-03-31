
# Node.js Authentication System

A complete **Node.js authentication system** with secure user registration, OTP verification, JWT-based login, refresh token mechanism, password reset using crypto tokens, and email notifications.

---

##  Tech Stack

- **Node.js & Express** – Backend framework  
- **MongoDB & Mongoose** – Database  
- **JWT** – Access & refresh tokens  
- **Crypto** – Secure password reset tokens  
- **Joi** – Request validation  
- **Nodemailer** – Email notifications  
- **HTTP-only cookies** – Secure storage of refresh tokens  

---

##  Features

1. **User Registration**
   - Sends OTP via email (10-minute validity)  
   - Allows resending OTP if not verified  
   - Sends registration successful email after verification  

2. **Login**
   - Generates **access token** and **refresh token**  
   - Refresh token stored in DB & sent via HTTP-only cookie  

3. **Refresh Token**
   - `/refresh-token` endpoint issues a new access token when the access token expires  

4. **Logout**
   - Clears refresh token in DB, ending the session  

5. **Forgot Password**
   - Generates secure reset token using `crypto`  
   - Sends reset link via email (10-minute validity)  

6. **Reset Password**
   - Compares hashed token from request with DB  
   - Updates password and clears reset token on success  
   - Sends confirmation email  

7. **Verify OTP**
   - Verifies OTP for registration  
   - Allows resending OTP without creating duplicate users  

8. **Validation**
   - Request payloads validated using **Joi** schemas  

9. **Global Error Handling**
   - Handles server errors (500) via middleware  

---

## ⚡ API Endpoints

| Method | Endpoint | Description |
|--------|---------|------------|
| POST | `/registerUser` | User registration (sends OTP) |
| POST | `/verify-otp` | Verify OTP for registration |
| POST | `/resend-otp` | Resend OTP |
| POST | `/loginUser` | Login (access & refresh tokens) |
| POST | `/refresh-token` | Generate new access token |
| POST | `/logoutUser` | Logout, clears refresh token |
| POST | `/forgotPassword` | Send password reset link |
| POST | `/resetPassword` | Reset password using token |

---

##  Project Structure


project-root/
│
├─ src/
│   │
│   ├─ config/
│   │   └─ db.js                          # MongoDB connection and config
│   │
│   ├─ controllers/
│   │   ├─ authController.js              # Registration, login, logout, refresh, forgot/reset password
│   │   └─ otpController.js               # OTP verification and resend
│   │
│   ├─ models/
│   │   └─ authModel.js                   # User schema
│   │
│   ├─ routes/
│   │   ├─ authRoutes.js                  # Routes for authController
│   │   └─ otpRoutes.js                   # Routes for otpController
│   │
│   ├─ middleware/
│   │   ├─ validate.js                    # Joi validation middleware
│   │   ├─ authMiddleware.js              # JWT authentication middleware
│   │   └─ globalErrorHandler.js          # Global 500 error handler
│   │
│   ├─ services/
│   │   ├─ generateToken.js               # JWT token generation
│   │   ├─ sendEmail.js                   # Nodemailer utility
│   │   └─ templates/                     # Email templates
│   │       ├─ forgotPasswordTemplate.js
│   │       ├─ passwordResetSuccessTemplate.js
│   │       ├─ regissterTemplate.js
│   │       ├─ registrationSuccess.js
│   │       └─ resendOtpTemplate.js
│   │
│   ├─ utils/
│   │   ├─ apiResponse.js                 # Standard API response format
│   │   ├─ appError.js                    # Custom error handler class
│   │   ├─ generateOtp.js                 # OTP generation utility
│   │   └─ statusCodes.js                 # HTTP status codes
│   │
│   ├─ validation/
│   │   └─ authValidation.js              # Joi schemas for auth routes
│   │
│   └─ app.js                              # Express app setup
│
├─ index.js                                # Entry point (starts server from src/app.js)
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ LICENSE
└─ README.md
````

---

##  Installation & Setup

1. **Clone the repository**:

```bash
git clone <repo-url>
cd <project-root>
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create a `.env` file** in the root folder:

```text
PORT=3000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
JWT_ACCESS_EXPIRES=<access-token-expiry>      # Example: 15m
JWT_REFRESH_EXPIRES=<refresh-token-expiry>    # Example: 7d
SMTP_HOST=<smtp-host>
SMTP_PORT=<smtp-port>
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-pass>
CLIENT_URL=<frontend-url>
```

4. **Start the server**:

```bash
npm start
```

---

##  Testing Emails with YOPmail

* Use **YOPmail** for testing email flows like OTPs, password reset links, and registration success emails.
* Example email: `testuser@yopmail.com`
* Emails appear instantly at [https://yopmail.com](https://yopmail.com).
* You don’t need a real mailbox for testing; SMTP credentials (e.g., Gmail, Mailtrap) can be used for development.

> **Tip:** Use the exact YOPmail address in your registration or forgot password request to see the emails.

---

##  Token, OTP & Password Reset Flow


[ User Registration ]
       │
       ├─> Submits registration → Joi validation
       │
       ├─> OTP sent to email (10 min)
       │
       ├─> Verifies OTP → Registration complete
       │
       └─> Registration Success Email sent

[ Login ]
       │
       ├─> Access & Refresh tokens created
       │
       ├─> Access token used for APIs
       │
       └─> Refresh token stored in DB + HTTP-only cookie
               └─> Used to generate new access token on expiry

[ Forgot Password ]
       │
       ├─> Generates secure reset token (hashed in DB)
       │
       ├─> Email sent with reset link (10 min validity)
       │
       └─> User submits new password + token → Password updated
               └─> Confirmation email sent
```

---

##  Notes

* All passwords and reset tokens are **hashed securely**.
* Refresh tokens are **stored in HTTP-only cookies** for security.
* OTPs and password reset links are valid for **10 minutes only**.
* **Global error handler** ensures consistent responses for server errors.
* Validation via **Joi** guarantees correct payloads.
* **YOPmail** can be used for all email testing during development.

---

```


