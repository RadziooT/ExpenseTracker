export default interface TransactionData {
  id: string;
  isExpense: boolean;
  title: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
}
