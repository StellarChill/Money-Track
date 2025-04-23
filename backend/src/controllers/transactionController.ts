import { Request, Response } from "express";
import * as TransactionService from "../services/transactionService";
import { z, ZodError } from "zod";


const TransactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  isIncome: z.boolean(),
});

export const getTransactions = async (_req: Request, res: Response) => {
  const transactions = await TransactionService.getAllTransactions();
  res.json(transactions);
};

export const getTransaction = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const transaction = await TransactionService.getTransactionById(id);
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404).json({ error: "Transaction not found" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const validatedData = TransactionSchema.parse(req.body);
    const transaction = await TransactionService.createTransaction(validatedData);
    res.status(201).json(transaction);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const validatedData = TransactionSchema.parse(req.body);
    const transaction = await TransactionService.updateTransaction(id, validatedData);
    res.json(transaction);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.errors });
    } else if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await TransactionService.deleteTransaction(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Transaction not found" });
  }
};