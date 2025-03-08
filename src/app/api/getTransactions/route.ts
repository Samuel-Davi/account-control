import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const transactions = await prisma.transactions.findMany({
        orderBy: {
            transaction_date: 'desc'
        }
    })
    console.log(transactions)
    return NextResponse.json({ transactions })
}