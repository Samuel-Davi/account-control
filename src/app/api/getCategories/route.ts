import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const categories = await prisma.categories.findMany()
    console.log(categories)
    return NextResponse.json({ categories })
}