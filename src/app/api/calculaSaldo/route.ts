import { prisma } from "@/app/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

async function calculaDepositos(){
    const depositos = await prisma.transactions.findMany({
        where:{
            categories: {
                type: 'deposit'
            }
        }
    })
    let valor: Decimal = new Decimal(0); // Initialize valor with 0//+

    depositos.forEach((deposit) =>{
        valor = valor.add(deposit.amount) // Assign the result back to valor//+
    })
    return valor.toNumber()
}

async function calculaGastos(){
    const gastos = await prisma.transactions.findMany({
        where:{
            categories: {
                type: 'withdrawal'
            }
        }
    })
    let valor: Decimal = new Decimal(0); // Initialize valor with 0//+
    gastos.forEach((gasto) =>{
        valor = valor.add(gasto.amount) // Assign the result back to valor//+
    })
    return valor.toNumber()
}

export async function GET(){
    try {
        const gastos:number = await calculaGastos()
        const depositos:number = await calculaDepositos()
        const saldo:number = depositos-gastos
        return NextResponse.json({ saldo });
    } catch (error) {
        console.error('Erro ao acessar o banco de dados:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, {status: 500});
    }
}