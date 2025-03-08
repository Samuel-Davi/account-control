import { Decimal } from "@prisma/client/runtime/library";

export type Transaction = {
    id: number;
    user_id: number;
    category_id: number;
    description: string;
    amount: Decimal;
    transaction_date: Date;
}