export interface AddUserTransactionsRequestDTO {
  userId: string;
  isExpense: boolean;
  title: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
}
