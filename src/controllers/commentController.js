import * as commentService from "../services/commentService.js";
import { failure, success } from "../utils/response.js";

export const createCommentOnQuestion = async (req, res, next) => {
  try {
    const result = await commentService.createComment(
      Number(req.user.id),
      req.body.content,
      Number(req.params.questionId),
      null,
    );
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const createCommentOnAnswer = async (req, res, next) => {
  try {
    const result = await commentService.createComment(
      Number(req.user.id),
      req.body.content,
      null,
      Number(req.params.answerId),
    );
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const getCommentsByQuestion = async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByQuestion(
      Number(req.params.questionId),
    );
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const getCommentsByAnswer = async (req, res, next) => {
  try {
    const result = await commentService.getCommentsByAnswer(
      Number(req.params.answerId),
    );
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const result = await commentService.deleteComment(
      Number(req.user.id),
      Number(req.params.commentId),
    );
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};
