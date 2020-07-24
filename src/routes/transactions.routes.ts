import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import csv from 'csv-parse';
import fs from 'fs';

import uploadConfig from '../Config/upload';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import AppError from '../errors/AppError';
// import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionRepository);

  const transactions = await transactionRepository.find();

  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransactionService = new CreateTransactionService();

  const transactionCreated = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transactionCreated);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const transactionRepository = getCustomRepository(TransactionRepository);

  const transaction = await transactionRepository.findOne(id);

  if (transaction) {
    await transactionRepository.remove(transaction);
  }

  return response.json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { file } = request;

    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
