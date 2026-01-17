import { Response } from "express";
import { TransactionService } from "../services/transaction.service";
import { AuthenticatedRequest } from "../types/api.types";
import {
  TransactionInput,
  TransactionQuery,
} from "../validation/transaction.validation";
import { ResponseUtil } from "../utils/response.util";

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;

    const transactionData = req.body as TransactionInput;

    const transaction = await this.transactionService.create(
      userId,
      transactionData
    );

    ResponseUtil.success(
      res,
      transaction,
      "Transaction created successfully.",
      201
    );
  };

  getAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const { page, limit, ...queryData } =
      req.query as unknown as TransactionQuery;

    const { data, total } = await this.transactionService.getAll(userId, {
      page: page ?? 1,
      limit: limit ?? 10,
      ...queryData,
    });

    const totalPages = Math.ceil(total / (limit ?? 10));

    ResponseUtil.success(
      res,
      data,
      "Transactions retrieved successfully.",
      200,
      {
        timestamp: new Date().toISOString(),
        pagination: {
          page: page ?? 1,
          limit: limit ?? 10,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        filters: queryData,
      }
    );
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const { id } = req.params as { id: string };

    const transaction = await this.transactionService.getById(id, userId);

    ResponseUtil.success(res, transaction);
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const { id: transactionId } = req.params as { id: string };
    const transactionData = req.body as TransactionInput;

    const transaction = await this.transactionService.update(
      transactionId,
      userId,
      transactionData
    );

    ResponseUtil.success(res, transaction, "Transaction updated successfully.");
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id: userId } = req.user;
    const { id } = req.params as { id: string };

    await this.transactionService.delete(id, userId);

    ResponseUtil.success(res, null, "Transaction deleted successfully.");
  };
}
