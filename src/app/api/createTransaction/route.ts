import { prisma } from "@/app/lib/prisma";
import { Transaction } from "@/app/models/Transaction";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {description, user_id, category_id, amount}: Transaction = await req.json();

    const transaction = await prisma.transactions.create({
        data:{
            description: description,
            user_id: user_id,
            category_id: category_id,
            amount: amount
        }
    })

    

    return NextResponse.json(transaction, { status: 200 });
}