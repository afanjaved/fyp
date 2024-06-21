import Eater from "../model/Eater.model.js";
import Provider from "../model/Provider.model.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../configuration/Nodemailer.js";

import crypto from "crypto";

export const Signup = async (req, res) => {
  console.log(req.body)
  const { email, password, role, name, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    if (role === "provider") {
      const existingUser = await Provider.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Account already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationCode = crypto.randomBytes(20).toString("hex");

      const user = new Provider({
        email,
        password: hashedPassword,
        role,
        name,
        verificationCode,
        phone,
      });

      await user.save();

      const verificationLink = `${verificationCode}`;
      await sendEmail(
        email,
        "Verify Your Email",
        `Please verify your email by providing this code: ${verificationLink}`
      );

      res.status(201).json({
        message:
          "Signup successful, please check your email to verify your account",
      });
    } else if (role === "eater") {
      const existingUser = await Eater.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Account already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verificationCode = crypto.randomBytes(20).toString("hex");

      const user = new Eater({
        email,
        password: hashedPassword,
        role,
        verificationCode,
      });

      await user.save();

      const verificationLink = `${verificationCode}`;
      await sendEmail(
        email,
        "Verify Your Email",
        `Please verify your email by providing this code: ${verificationLink}`
      );

      res.status(201).json({
        message:
          "Signup successful, please check your email to verify your account",
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user;
    if (role === "provider") {
      user = await Provider.findOne({ email });
    } else if (role === "eater") {
      user = await Eater.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = Jwt.sign({ id: user._id, role: user.role }, "secret", {
      expiresIn: "1h",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const verifyUser = async (req, res) => {
  const { code, email } = req.body;

  try {
    // Find the user in the Eater model
    let user = await Eater.findOne({ verificationCode: code, email });

    // If the user is not found in the Eater model, try finding them in the Provider model
    if (!user) {
      user = await Provider.findOne({ verificationCode: code, email });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Mark the user as verified and remove the verification code
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await Eater.findOne({ email });

    // If the user is not found in the Eater model, try finding them in the Provider model
    if (!user) {
      user = await Provider.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Generate a new verification code
    const newVerificationCode = crypto.randomBytes(20).toString("hex");

    // Update the user document with the new verification code
    user.verificationCode = newVerificationCode;
    await user.save();

    // Send the new verification code via email
    const verificationLink = `${newVerificationCode}`;
    await sendEmail(
      email,
      "Verify Your Email",
      `Please verify your email by clicking on the following link: ${verificationLink}`
    );

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Generate random verification code
  const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase();

  try {
    // Find user by email
    let user = await Eater.findOne({ email });

    if (!user) {
      user = await Provider.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update user's verification code and save
    user.verificationCode = verificationCode;
    user.isVerified = false;
    await user.save();

    // Send verification code to user's email
    await sendEmail(
      email,
      "Password Reset Verification Code",
      `Your verification code is: ${verificationCode}`
    );

    return res
      .status(200)
      .json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return res
      .status(500)
      .json({ message: "Server error when sending verification code" });
  }
};
export const resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword, confirmPassword } = req.body;

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }

  try {
    // Find user by email and verification code
    let user = await Eater.findOne({ email, verificationCode });

    if (!user) {
      user = await Provider.findOne({ email, verificationCode });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verificationCode = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({ message: "Server error when updating password" });
  }
};
export default {
  Signup,
  Login,
  verifyUser,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
};
