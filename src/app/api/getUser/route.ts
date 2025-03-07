import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { prisma } from "@/app/lib/prisma";
import { User } from "@/app/models/User";

const SECRET = "chave_super_secreta"; // 🔥 Alterar para variável de ambiente


//get users
const users = await prisma.users.findMany()
//console.log(users)

export async function GET(req: NextRequest) {
  try {
    // Obtém o token do cookie
    const token = await getCookie("account-token", { req });//+

    //console.log("Token recebido no backend:", token);

    if (!token) throw new Error("Token não encontrado");

    // Verifica e decodifica o token
    const decoded:any = jwt.verify(token, SECRET);
    const user: User | undefined = users.find(u => u.id === decoded.id)

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
