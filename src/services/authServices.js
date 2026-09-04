import { prisma } from "../config/prisma.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { visibleInfo } from "../utils/response.js";

//register
//
export const register = async (data) => {
  const duplicate = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (duplicate) {
    //check for duplaicte email
    return {
      ok: false,
      error: "email already been registered",
      status: 401,
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
  const token = signAccessToken(visibleInfo(user)); // creating teh short timed access token
  const refreshToken = await prisma.refreshToken.create({
    data: {
      token: signRefreshToken(visibleInfo(user)), //creating teh refresh token that will be 7days long
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    ok: true,
    data: user,
    accessToken: token,
    refreshToken: refreshToken,
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
      error: "email not verified verify your email first",
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
    decoded = verifyRefreshToken(refreshToken); //verfiying the register token beofr chekcing teh exired dat , ro whether if it is revoked
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
      error: "token is reviked or expired, please login in again",
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
    decoded = verifyRefreshToken(refreshToken); //verfiying the refresh token before revokingit in db
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
      error: "token already expired or reocker, you are logged out ",
      status: 400,
    };
  }
  await prisma.refreshToken.update({
    where: { id: checkRefreshToken.id },
    data: { revokedAt: new Date() },
  });

  return { ok: true, data: "succesfully logged out", status: 200 };
};
