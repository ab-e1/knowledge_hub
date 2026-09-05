import nodemailer from "nodemailer";
import { createTransporter } from "../config/nodemailer.js";
import { appUrl, nodeEnv } from "../config/loadEnv.js";

export const sendVerificationEmail = async (email, token) => {
  const verifyEmailUrl = `${appUrl}/api/v1/auth/verify-email?token=${token}`;

  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: '"Knowledge_hub" <mail@getgymscale.com>',
    to: email,
    subject: "verify your Knowledge_hub email/account ",
    html: `
      <h2>Welcome to KnowledgeHub!</h2>
      <p>Please click the link below to verify your email address (expires in 24 hours):</p>
      <a href="${verifyEmailUrl}">${verifyEmailUrl}</a>
    `,
  });
  if (nodeEnv !== "production") {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("📨 Ethereal Email Preview URL:", previewUrl);
    return previewUrl;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${appUrl}/api/v1/auth/reset-password?token=${token}`;

  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: `knowledge_hub <mail@getgymscale.com>`,
    to: email,
    subject: "reseting password link for kowledge hub",
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password (expires in 15 minutes):</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  });
  if (nodeEnv !== "production") {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("📨 Ethereal Email Preview URL:", previewUrl);
    return previewUrl;
  }
};
