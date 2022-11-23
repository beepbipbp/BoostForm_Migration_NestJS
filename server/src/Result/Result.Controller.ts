import { Request, Response, NextFunction } from "express";
import BadRequestException from "../Common/Exceptions/BadRequest.Exception";
import resultService from "./Result.Service";

class ResultController {
  // eslint-disable-next-line class-methods-use-this
  async formResult(req: Request, res: Response, next: NextFunction) {
    const { formId } = req.params;
    if (!formId || typeof formId !== "string") {
      next(new BadRequestException());
      return;
    }

    try {
      await resultService.init(formId);
      const result = resultService.formResult();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ResultController();
