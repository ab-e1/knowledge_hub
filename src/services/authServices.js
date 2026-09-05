import { prisma } from "../config/prisma.js";
import {
  signAccessToken,
  signEmailVerficationToken,
  signPasswordResetToken,
  signRefreshToken,
  verifyToken,
} from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { visibleInfo } from "../utils/response.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../utils/email.js";

//register
//
export const register = async (data) => {
  const duplicate = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (duplicate) {
    return {
      ok: false,
      error: "email is already registered",
      status: 409,
    };
  }

  const user = await prisma.user.create({
    data: {
      name: data.name, //create or insert the data in teh database
      email: data.email,
      password: await hashPassword(data.password),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true, //selecting thing that prisma or databse shoudl return
      reputation: true,
      createdAt: true,
    },
  });
  const token = signEmailVerficationToken(visibleInfo(user)); // creating teh short timed access token
  const previewUrl = await sendVerificationEmail(user.email, token);
  return {
    ok: true,
    data: {
      user: visibleInfo(user),
      message: "Verification email sent. Please verify your email to log in.",
      previewUrl,
    },
    status: 201,
  };
};

//
//                      login
//
//

export const login = async (data) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user) {
    return {
      //checking if teh user is registered
      ok: false,
      error: "email is not registered , register first",
      status: 404,
    };
  }
  if (!user.emailVerified) {
    //checking if email is verified
    return {
      ok: false,
      error:
        "Email not verified. Please verify your email first, or use resend verification to get a new link.",
      status: 401,
    };
  }
  const match = await verifyPassword(user.password, data.password); //verifiying the password
  if (!match) {
    return { ok: false, error: "invalid email or password", status: 401 };
  }
  const token = signAccessToken(visibleInfo(user)); //creating the access token valid for an hour

  await prisma.refreshToken.updateMany({
    where: { userId: user.id, revokedAt: null }, // revoking allpast refresh tokens before creating a new one on login for better security
    data: { revokedAt: new Date() },
  });

  const newRefreshToken = signRefreshToken(visibleInfo(user));
  await prisma.refreshToken.create({
    // creating the new refresh token  and inserting it into teh database
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    ok: true,
    data: visibleInfo(user),
    accessToken: token,
    refreshToken: newRefreshToken,
    status: 200,
  };
};

//refresh token endpoint
//
//
export const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return { ok: false, error: "refreshToken must be provided", status: 400 }; //sanitaizing empty input
  }
  let decoded;
  try {
    decoded = verifyToken(refreshToken); //verfiying the register token beofr chekcing teh exired dat , ro whether if it is revoked
  } catch (err) {
    return {
      ok: false,
      error: "invalid or expired refresh token",
      status: 401,
    };
  }

  const checkRefreshToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });
  if (
    !checkRefreshToken || //checking if it is revoked deleted or expired
    checkRefreshToken.revokedAt ||
    checkRefreshToken.expiresAt < new Date()
  ) {
    return {
      ok: false,
      error: "Token is revoked or expired. Please log in again.",
      status: 401,
    };
  }

  const newAccessToken = signAccessToken({
    userId: checkRefreshToken.user.id, //if it passes the above constraints it refreshed teh access token
    name: checkRefreshToken.user.name,
    email: checkRefreshToken.user.email,
    role: checkRefreshToken.user.role,
  });

  return { ok: true, data: { accessToken: newAccessToken }, status: 200 };
};

///             log out
//
//

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    return { ok: false, error: "refresh token required", status: 400 };
  }
  let decoded;
  try {
    decoded = verifyToken(refreshToken); //verfiying the refresh token before revokingit in db
  } catch (err) {
    return {
      ok: false,
      error: "token expired you are logged out, log back in to access",
      status: 400,
    };
  }

  const checkRefreshToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });
  if (
    !checkRefreshToken ||
    checkRefreshToken.revokedAt ||
    checkRefreshToken.expiresAt < new Date()
  ) {
    return {
      ok: false,
      error: "Token already expired or revoked. You are logged out.",
      status: 400,
    };
  }
  await prisma.refreshToken.update({
    where: { id: checkRefreshToken.id },
    data: { revokedAt: new Date() },
  });

  return {
    ok: true,
    data: { message: "Successfully logged out." },
    status: 200,
  };
};

export const verifyEmail = async (token) => {
  if (!token) {
    return {
      ok: false,
      error: "No token provided.",
      status: 400,
    };
  }
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return {
      ok: false,
      error:
        "Invalid or expired token. Please request a new verification link.",
      status: 401,
    };
  }

  // Enforce that this token is specifically an email verification token
  if (decoded.type !== "email_verification") {
    return {
      ok: false,
      error: "Invalid token type.",
      status: 400,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  if (!user) {
    return {
      ok: false,
      error: "User not found.",
      status: 404,
    };
  }
  if (user.emailVerified) {
    return {
      ok: true,
      data: { message: "Email is already verified. You can log in." },
      status: 200,
    };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });
  return {
    ok: true,
    data: { message: "Email verified successfully. You can now log in." },
    status: 200,
  };
};

//resend email verification link

export const resendVerification = async (email) => {
  if (!email) {
    return { ok: false, error: "email is required", status: 400 };
  }
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return {
      ok: true,
      data: {
        message: "If an account exists, a verification link has been sent.",
      },
      status: 200,
    };
  }
  if (user.emailVerified) {
    return { ok: false, error: "email is already verified", status: 400 };
  }

  const token = signEmailVerficationToken(visibleInfo(user));
  const previewUrl = await sendVerificationEmail(user.email, token);

  return {
    ok: true,
    data: { message: `verification link sent to your email.`, previewUrl },
    status: 200,
  };
};

export const forgotPassword = async (email) => {
  if (!email) {
    return { ok: false, error: "email is required", status: 400 };
  }
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    return {
      ok: true,
      data: "if an an account exists with this email, a link has been sent to the email",
      status: 200,
    };
  }
  if (!user.emailVerified) {
    const verifyTokenStr = signEmailVerficationToken({ userId: user.id });
    const previewUrl = await sendVerificationEmail(user.email, verifyTokenStr);
    return {
      ok: true,
      data: {
        message:
          "Account is not verified. We have resent a verification link to your email.",
        previewUrl,
      },
      status: 200,
    };
  }
  const token = signPasswordResetToken(visibleInfo(user));
  const previewUrl = await sendPasswordResetEmail(email, token);

  return {
    ok: true,
    data: {
      message:
        "a password reseting link has been sent to your email, enter you password and procceed",
      previewUrl,
    },
    status: 200,
  };
};

export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    return {
      ok: false,
      error: "Token and new password are required.",
      status: 400,
    };
  }
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return {
      ok: false,
      error:
        "Invalid or expired token. Please request a new password reset link.",
      status: 400,
    };
  }

  // Enforce that this token is specifically a password reset token
  if (decoded.type !== "password_reset") {
    return {
      ok: false,
      error: "Invalid token type.",
      status: 400,
    };
  }

  const hash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: decoded.id },
    data: { password: hash },
  });
  await prisma.refreshToken.updateMany({
    where: { userId: decoded.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return {
    ok: true,
    data: {
      message:
        "Password reset successfully. Please log in with your new password.",
    },
    status: 200,
  };
};
