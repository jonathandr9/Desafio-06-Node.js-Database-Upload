import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
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
    const transactionsRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    try {
      const categoryExists = await categoryRepository.findOne({
        title: category,
      });

      if (!categoryExists) {
        const categoryCreate = await categoryRepository.create({
          title: category,
        });

        await categoryRepository.save(categoryCreate);
      }

      const categorySaved = await categoryRepository.findOne({
        title: category,
      });

      // if (findAppointmentInSameDate) {
      //   throw AppError('This repository is already booked');
      // }

      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: categorySaved.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    } catch (err) {
      throw AppError('This repository is already booked');
    }
  }
}

export default CreateTransactionService;
