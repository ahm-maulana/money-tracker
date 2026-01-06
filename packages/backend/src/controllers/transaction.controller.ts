import { Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { AuthenticatedRequest } from '../types/api.types';
import { createSuccessResponse, createPaginatedResponse } from '../utils/response.util';
import { CreateTransactionInput, UpdateTransactionInput, TransactionQuery } from '../validation/transaction.validation';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const transactionData = req.body as CreateTransactionInput;

    const transaction = await this.transactionService.create(userId, transactionData);

    res.status(201).json(
      createSuccessResponse(transaction, 'Transaction created successfully')
    );
  };

  findById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await this.transactionService.findById(id, userId);

    res.json(createSuccessResponse(transaction));
  };

  findAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const query = req.query as TransactionQuery;

    const result = await this.transactionService.findAll(userId, query);

    res.json(
      createPaginatedResponse(
        result.transactions,
        'Transactions retrieved successfully',
        {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        }
      )
    );
  };

  update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body as UpdateTransactionInput;

    const transaction = await this.transactionService.update(id, userId, updateData);

    res.json(createSuccessResponse(transaction, 'Transaction updated successfully'));
  };

  delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.transactionService.delete(id, userId);

    res.json(createSuccessResponse(null, 'Transaction deleted successfully'));
  };

  getStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const stats = await this.transactionService.getStats(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.json(createSuccessResponse(stats, 'Transaction statistics retrieved successfully'));
  };

  export = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const query = req.query as TransactionQuery;
    const format = (req.query.format as 'csv' | 'json') || 'json';

    const data = await this.transactionService.exportTransactions(userId, query, format);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="transactions.csv"`);
      res.send(data);
    } else {
      res.json(createSuccessResponse(data, 'Transactions exported successfully'));
    }
  };

  bulkCreate = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const transactions = req.body.transactions as CreateTransactionInput[];

    if (!Array.isArray(transactions) || transactions.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Transactions array is required and cannot be empty',
      });
      return;
    }

    if (transactions.length > 100) {
      res.status(400).json({
        success: false,
        message: 'Cannot create more than 100 transactions at once',
      });
      return;
    }

    const results = await this.transactionService.bulkCreate(userId, transactions);

    res.status(201).json(
      createSuccessResponse(results, `${results.length} transactions created successfully`)
    );
  };

  bulkDelete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user.id;
    const { transactionIds } = req.body;

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Transaction IDs array is required and cannot be empty',
      });
      return;
    }

    await this.transactionService.bulkDelete(userId, transactionIds);

    res.json(
      createSuccessResponse(null, `${transactionIds.length} transactions deleted successfully`)
    );
  };
}