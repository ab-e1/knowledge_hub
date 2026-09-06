import * as voteService from "../services/voteService.js";
import { failure, success } from "../utils/response.js";

export const voteOnQuestion = async (req, res, next) => {
  try {
    const result = await voteService.vote(
      Number(req.user.id),
      req.body.type,
      Number(req.params.questionId),
      null,
    );
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};

export const voteOnAnswer = async (req, res, next) => {
  try {
    const result = await voteService.vote(
      Number(req.user.id),
      req.body.type,
      null,
      Number(req.params.answerId),
    );
    if (!result.ok) return failure(res, result.error, result.status);
    return success(res, result.data, result.status);
  } catch (err) { next(err); }
};
