import express from "express";
import * as TransactionController from "../controllers/transactionController";

const router = express.Router();

router.get("/", TransactionController.getTransactions);
router.get("/:id", TransactionController.getTransaction);
router.post("/", TransactionController.createTransaction);
router.put("/:id", TransactionController.updateTransaction);
router.delete("/:id", TransactionController.deleteTransaction);

export default router;
