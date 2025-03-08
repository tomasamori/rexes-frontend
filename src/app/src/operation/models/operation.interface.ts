export interface Operation {
  id: number;
  operationTimestamp: Date;
  amount: number;
  type: string;
  description: string;
}
