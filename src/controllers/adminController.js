import * as adminService from "../services/adminService.js";
import { failure, success } from "../utils/response.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(Number(req.params.userId));
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const result = await adminService.toggleBlockUser(Number(req.params.userId));
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const adminDeleteQuestion = async (req, res, next) => {
  try {
    const result = await adminService.adminDeleteQuestion(Number(req.params.questionId));
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const adminDeleteAnswer = async (req, res, next) => {
  try {
    const result = await adminService.adminDeleteAnswer(Number(req.params.answerId));
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const adminDeleteComment = async (req, res, next) => {
  try {
    const result = await adminService.adminDeleteComment(Number(req.params.commentId));
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const getAllTags = async (req, res, next) => {
  try {
    const result = await adminService.getAllTags();
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const deleteTag = async (req, res, next) => {
  try {
    const result = await adminService.deleteTag(Number(req.params.tagId));
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const getStats = async (req, res, next) => {
  try {
    const result = await adminService.getStats();
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};
