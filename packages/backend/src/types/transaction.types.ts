export interface TransactionResponse {
  id: string;
  amount: number;
  description: string | null;
  date: Date;
  category: {
    id: string;
    name: string;
    type: string;
  };
  updatedAt: Date;
  userId: string;
}
