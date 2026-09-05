import nodemailer from "nodemailer";
// fro production we will use real smrp provider to send to emails directly
import * as env from "./loadEnv.js";

export const createTransporter = async () => {
  if (env.nodeEnv.toLowerCase().trim() === "production") {
    return nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort || 465,
      secure: true,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  //for devlopment stage we ue ethereal

  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};
