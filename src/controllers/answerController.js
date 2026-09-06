import * as answerService from "../services/answerService.js";
import { failure, success } from "../utils/response.js";

export const createAnswer = async (req, res, next) => {
  try {
    const result = await answerService.createAnswer(
      Number(req.user.id),
      Number(req.params.questionId),
      req.body.content,
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const getAnswers = async (req, res, next) => {
  try {
    const result = await answerService.getAnswers(Number(req.params.questionId));
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const updateAnswer = async (req, res, next) => {
  try {
    const result = await answerService.updateAnswer(
      Number(req.user.id),
      Number(req.params.answerId),
      req.body.content,
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const deleteAnswer = async (req, res, next) => {
  try {
    const result = await answerService.deleteAnswer(
      Number(req.user.id),
      Number(req.params.answerId),
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const acceptAnswer = async (req, res, next) => {
  try {
    const result = await answerService.acceptAnswer(
      Number(req.user.id),
      Number(req.params.answerId),
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};
