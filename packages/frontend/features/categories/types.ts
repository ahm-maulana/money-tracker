export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string | null;
  userId: string;
}
