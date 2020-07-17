import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO

    const outcome = await this.find({ where: { type: 'outcome' } });

    const income = await await this.find({ where: { type: 'income' } });

    const [sum] = await this.createQueryBuilder('transactions')
      .select('SUM(transactions.value)', 'sum')
      .where('transactions.type = :type', { type: 'income' })
      .getRawOne();

    console.log(sum);
  }
}

export default TransactionsRepository;
