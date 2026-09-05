import * as authServices from "../services/authServices.js";
import { success, failure } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const result = await authServices.register(req.body);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }

    return success(
      res,
      result.data,
      result.status,
      result.accessToken,
      result.refreshToken,
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authServices.login(req.body);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(
      res,
      result.data,
      result.status,
      result.accessToken,
      result.refreshToken,
    );
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const result = await authServices.refreshToken(req.body.refreshToken);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status, result.accessToken);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const result = await authServices.logout(req.body.refreshToken);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const result = await authServices.verifyEmail(req.params.token);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const result = await authServices.resendVerification(req.body.email);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const result = await authServices.forgotPassword(req.body.email);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const result = await authServices.resetPassword(
      req.body.token,
      req.body.password,
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};
