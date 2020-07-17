import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    try {
      let categorySaved = await categoryRepository.findOne({
        title: category,
      });

      if (!categorySaved) {
        categorySaved = await categoryRepository.create({
          title: category,
        });

        await categoryRepository.save(categorySaved);
      }

      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: categorySaved.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    } catch (err) {
      // throw AppError('This repository is already booked');
    }
  }
}

export default CreateTransactionService;
