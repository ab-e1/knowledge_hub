import * as questionServices from "../services/questionService.js";
import { failure, success } from "../utils/response.js";

export const createQuestion = async (req, res, next) => {
  try {
    const result = await questionServices.createQuestion(
      Number(req.user.id),
      req.body,
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }

    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const result = await questionServices.getQuestions(req.query);
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const result = await questionServices.getQuestionById(
      Number(req.params.id),
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const result = await questionServices.updateQuestion(
      Number(req.user.id),
      Number(req.params.id),
      req.body,
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const result = await questionServices.deleteQuestion(
      Number(req.user.id),
      Number(req.params.id),
    );
    if (!result.ok) {
      return failure(res, result.error, result.status);
    }
    return success(res, result.data, result.status);
  } catch (err) {
    next(err);
  }
};
