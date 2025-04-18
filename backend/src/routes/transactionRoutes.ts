import express from 'express';
import * as transactionController from '../controllers/transactionController';

const router = express.Router();

router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById as any); // ข้ามการตรวจสอบ TypeScript
router.post('/', transactionController.createTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;