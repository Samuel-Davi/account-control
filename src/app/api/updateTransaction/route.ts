import { prisma } from "@/app/lib/prisma";
import { Transaction } from "@/app/models/Transaction";
import { NextResponse } from "next/server";

export async function PUT(req:Request){
    const {description, id, category_id, amount, transaction_date}: Transaction = await req.json();
    console.log(description, id, category_id, amount, transaction_date)
    const transaction = await prisma.transactions.update({
        where:{
            id: id
        },
        data:{
            amount: amount,
            description: description,
            category_id: category_id,
            transaction_date: transaction_date,
        }
    })

    return NextResponse.json(transaction, {status: 200})
}