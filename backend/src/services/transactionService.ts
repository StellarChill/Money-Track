import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTransactions = async () => {
  return await prisma.transaction.findMany();
};

export const getTransactionById = async (id: number) => {
  return await prisma.transaction.findUnique({
    where: { id },
  });
};

export const createTransaction = async (data: {
  description: string;
  amount: number;
  date: Date;
  isIncome: boolean;
}) => {
  return await prisma.transaction.create({
    data,
  });
};

export const deleteTransaction = async (id: number) => {
  return await prisma.transaction.delete({
    where: { id },
  });
};