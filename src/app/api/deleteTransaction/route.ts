import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request){
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ message: 'ID é obrigatório' }, { status: 400 });
    }

    const deleteUser = await prisma.transactions.delete({
        where: {
            id: parseInt(id)
        }
    })
    return NextResponse.json(deleteUser, { status: 200 })
}