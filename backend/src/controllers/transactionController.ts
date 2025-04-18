import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getTransactionById = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(Number(id));
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { description, amount, date, isIncome } = req.body;
    const transaction = await transactionService.createTransaction({
      description,
      amount,
      date: new Date(date),
      isIncome,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await transactionService.deleteTransaction(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};