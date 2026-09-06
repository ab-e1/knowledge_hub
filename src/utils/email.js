import nodemailer from "nodemailer";
import { createTransporter } from "../config/nodemailer.js";
import { appUrl, nodeEnv } from "../config/loadEnv.js";

export const sendVerificationEmail = async (email, token) => {
  if (nodeEnv === "test" || process.env.NODE_ENV === "test") return;
  const verifyEmailUrl = `${appUrl}/api/v1/auth/verify-email/${token}`;

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
  if (nodeEnv === "test" || process.env.NODE_ENV === "test") return;
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

export const sendNewAnswerNotificationEmail = async (email, questionTitle, answerContent) => {
  if (nodeEnv === "test" || process.env.NODE_ENV === "test") return;
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: '"Knowledge_hub" <mail@getgymscale.com>',
    to: email,
    subject: `New Answer on your question: "${questionTitle}"`,
    html: `
      <h2>Your question received a new answer!</h2>
      <p><strong>Question:</strong> ${questionTitle}</p>
      <p><strong>Answer snippet:</strong></p>
      <blockquote>${answerContent}</blockquote>
    `,
  });
  if (nodeEnv !== "production") {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("📨 Ethereal Answer Notification URL:", previewUrl);
    return previewUrl;
  }
};

export const sendAnswerAcceptedNotificationEmail = async (email, questionTitle) => {
  if (nodeEnv === "test" || process.env.NODE_ENV === "test") return;
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: '"Knowledge_hub" <mail@getgymscale.com>',
    to: email,
    subject: `Congratulations! Your answer was accepted for "${questionTitle}"`,
    html: `
      <h2>Your answer was accepted! 🎉</h2>
      <p>Your answer for the question <strong>"${questionTitle}"</strong> was selected as the accepted answer (+15 reputation).</p>
    `,
  });
  if (nodeEnv !== "production") {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("📨 Ethereal Accepted Answer Notification URL:", previewUrl);
    return previewUrl;
  }
};
