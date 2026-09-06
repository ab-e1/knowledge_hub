import * as userService from "../services/userService.js";
import { failure, success } from "../utils/response.js";

export const getProfile = async (req, res, next) => {
  try {
    const idParam = req.params.userId === "me" || !req.params.userId ? req.user?.id : req.params.userId;
    const userId = Number(idParam);

    if (isNaN(userId)) {
      return failure(res, "Invalid user ID.", 400);
    }

    const result = await userService.getProfile(userId);
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(Number(req.user.id), req.body);
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return failure(res, "No image file provided.", 400);
    const result = await userService.uploadAvatar(Number(req.user.id), req.file.buffer);
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const result = await userService.deleteAccount(Number(req.user.id));
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};
