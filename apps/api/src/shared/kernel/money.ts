import { ValueObject } from './value-object.js';

interface MoneyProps {
  readonly amount: number;
  readonly currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  static create(amount: number, currency: string): Money {
    if (!Number.isInteger(amount)) {
      throw new Error('Money amount must be stored in minor units.');
    }

    const normalizedCurrency = currency.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalizedCurrency)) {
      throw new Error('Money currency must be an ISO 4217 code.');
    }

    return new Money({ amount, currency: normalizedCurrency });
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }
}
