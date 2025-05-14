export default interface Transaction {
  id: string;
  isExpense: boolean;
  title: string;
  amount: number;
  currency: string;
  date: string;
  category: string;
}
