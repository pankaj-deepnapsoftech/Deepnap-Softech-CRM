const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { TryCatch, ErrorHandler } = require("../../helpers/error");
const { sendEmail } = require("../../helpers/sendEmail");
const adminModel = require("../../models/admin");
const otpModel = require("../../models/otp");
const websiteConfigurationModel = require("../../models/websiteConfiguration");
const settingModel = require("../../models/setting");

const register = TryCatch(async (req, res) => {
  const { name, email, phone, password, designation } = req.body;

  const isExistingUserWithEmail = await adminModel.findOne({ email });
  if (isExistingUserWithEmail) {
    throw new ErrorHandler("A user with this email id already exists", 409);
  }

  const isExistingUserWithPhone = await adminModel.findOne({ phone });
  if (isExistingUserWithPhone) {
    throw new ErrorHandler("A user with this phone no. already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const isFirstAdmin = await adminModel.find().countDocuments();

  let user;
  if (isFirstAdmin > 0) {
    user = await adminModel.create({
      name,
      email,
      phone,
      designation,
      password: hashedPassword,
    });
  } else {
    user = await adminModel.create({
      name,
      email,
      phone,
      designation,
      password: hashedPassword,
      role: "Super Admin",
      allowedroutes: [
        "admin",
        "dashboard",
        "people",
        "company",
        "lead",
        "product",
        "category",
        "expense",
        "expense-category",
        "offer",
        "proforma-invoice",
        "invoice",
        "payment",
        "customer",
        "user",
        "report",
        "support",
        "website configuration",
        "settings",
      ],
    });

    await websiteConfigurationModel.create({
      creator: user._id,
      indiamart_api: "",
      facebook_api: "",
    });
    await settingModel.create({ creator: user._id });
  }

  const otp = generateOTP();
  await otpModel.create({
    email,
    otp,
  });

  await sendEmail(
    email,
    "OTP Verification",
    `
    <div>Hi ${name}</div>
    <br>
    <div>${otp} is your OTP(One-Time-Password) to verify your account. OTP is valid for 5 minutes. Do not share your OTP with anyone.</div>
    <br>
    <div>Best Regards</div>
    <div>Deepnap Softech</div>
    `
  );

  res.status(200).json({
    status: 200,
    success: true,
    message: "OTP has been sent to your email id"
  });
});

const verifyOTPAfterRegister = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const isOTPValid = await otpModel.findOne({ email, otp });
  if (!isOTPValid) {
    throw new Error("Invalid OTP");
  }

  await otpModel.deleteOne({ email, otp });
  await adminModel.findOneAndUpdate({ email: email }, { verified: true });

  const user = await adminModel.findOne({ email });

  await sendEmail(
    email,
    "Registeration Successful",
    `
    <div>Hi ${user.name},</div>
    <br>
    <div>Congratulations and welcome!</div>
    <br>
    <div>We’re thrilled to let you know that your registration has been successfully completed.</div>
    <br>
    <div>Best Regards</div>
    <div>Deepnap Softech</div>
    `
  );

  res.status(200).json({
    status: 200,
    success: true,
    message: "OTP verified successfully",
  });
});

const login = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await adminModel
    .findOne({ email })
    .select("password email name role allowedroutes");

  if (!existingUser) {
    throw new ErrorHandler("User not found", 404);
  }

  const passwordMatched = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatched) {
    throw new Error("Make sure you have entered the correct credentials", 401);
  }

  const isVerified = await adminModel.findOne({ email }).select("verified");
  if (!isVerified.verified) {
    const otpExists = await otpModel.findOne({ email });
    if (!otpExists) {
      const otp = generateOTP();
      await otpModel.create({
        email,
        otp,
      });
    }

    return res.status(401).json({
      status: 401,
      success: false,
      verified: false,
      message: "Account not verified.",
    });
  }

  const access_token = jwt.sign(
    {
      _id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role,
      allowedroutes: existingUser.allowedroutes,
      iat: Math.floor(Date.now() / 1000) - 30,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    status: 200,
    success: true,
    access_token: access_token,
    message: "User logged in successfully",
    verified: true,
    user: {
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      allowedroutes: existingUser.allowedroutes,
    },
  });
});

const loginWithAccessToken = TryCatch(async (req, res, next) => {
  const access_token = req.headers.authorization.split(" ")[1];

  const verified = jwt.verify(access_token, process.env.JWT_SECRET);
  const currTimeInMilliSeconds = Math.floor(Date.now() / 1000);

  // access_token is not expired
  if (
    verified &&
    verified.iat < currTimeInMilliSeconds &&
    verified.exp > currTimeInMilliSeconds
  ) {
    const user = await adminModel.findById(verified._id);
    if (!user) {
      throw new Error("User doesn't exists");
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "User has been logged in successfully",
      user: {
        id: verified._id,
        email: verified.email,
        name: verified.name,
        role: verified.role,
        allowedroutes: user.allowedroutes,
      },
    });
  } else {
    throw new Error("Session expired!");
  }
});

const isAuthenticated = TryCatch(async (req, res, next) => {
  let access_token = req.headers?.authorization?.split(" ")[1];

  try {
    const verified = jwt.verify(access_token, process.env.JWT_SECRET);
    const currTimeInMilliSeconds = Math.floor(Date.now() / 1000);

    // access_token is not expired
    if (
      verified &&
      verified.iat < currTimeInMilliSeconds &&
      verified.exp > currTimeInMilliSeconds
    ) {
      const user = await adminModel.findById(verified._id);
      if (!user) {
        throw new Error("User doesn't exists");
      }

      req.user = {
        id: verified._id,
        email: verified.email,
        name: verified.name,
        role: verified.role,
        allowedroutes: user.allowedroutes,
      };

      next();
    } else {
      throw new Error("Session expired!");
    }
  } catch (err) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: err.message,
    });
  }
});

const generateOTP = () => {
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }

  return OTP;
};

const getOTP = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await adminModel.findOne({ email: email });
  if (!user) {
    throw new Error("User doesn't exists", 404);
  }
  const isExistingOtp = await otpModel.findOne({ email: email });

  if (isExistingOtp) {
    await sendEmail(
      email,
      "OTP Verification",
      `
    <div>Hi ${user.name},</div>
    <br>
    <div>${isExistingOtp.otp} is your OTP(One-Time-Password) to verify your account. OTP is valid for 5 minutes. Do not share your OTP with anyone.</div>
    <br>    
    <div>Best Regards</div>
    <div>Deepnap Softech</div>
    `
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "OTP has been sent to your email id",
    });
  }

  const otp = generateOTP();

  await otpModel.create({
    email: user.email,
    otp,
  });

  await sendEmail(
    email,
    "OTP Verification",
    `
    <div>Hi ${user.name},</div>
    <br>
    <div>${otp} is your OTP(One-Time-Password) to verify your account. OTP is valid for 5 minutes. Do not share your OTP with anyone.</div>
    <br>    
    <div>Best Regards</div>
    <div>Deepnap Softech</div>
    `
  );

  res.status(200).json({
    status: 200,
    success: true,
    message: "OTP has been sent to your email id",
  });
});

const verifyOTP = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const user = await adminModel.findOne({ email: email });
  if (!user) {
    throw new Error("User doesn't exists", 404);
  }

  const isOTPValid = await otpModel.findOne({ email: email, otp: otp });
  if (!isOTPValid) {
    throw new Error("Invalid OTP");
  }

  await otpModel.deleteOne({ email: email });

  const resetToken = jwt.sign(
    {
      email: email,
    },
    process.env.PASSWORD_RESET_SECRET,
    {
      expiresIn: "1m",
    }
  );

  res.status(200).json({
    status: 200,
    success: true,
    message: "OTP verified successfully",
    resetToken,
  });
});

const resetPassword = TryCatch(async (req, res) => {
  const { resetToken, email, newPassword } = req.body;

  try {
    const verified = jwt.verify(resetToken, process.env.PASSWORD_RESET_SECRET);
    const currTimeInMilliSeconds = Math.floor(Date.now() / 1000);

    if (
      verified &&
      verified.iat < currTimeInMilliSeconds &&
      verified.exp > currTimeInMilliSeconds &&
      verified.email === email
    ) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await adminModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Your password has been reset successfully",
      });
    }

    throw new Error("Invalid token");
  } catch (err) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Something went wrong",
    });
  }
});

module.exports = {
  register,
  login,
  isAuthenticated,
  loginWithAccessToken,
  getOTP,
  verifyOTP,
  resetPassword,
  verifyOTPAfterRegister,
};
