import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

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

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Balance amount less than the withdrawal amount');
    }

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
  }
}

export default CreateTransactionService;
