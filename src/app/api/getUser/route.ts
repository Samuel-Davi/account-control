import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { prisma } from "@/app/lib/prisma";
import { User } from "@/app/models/User";

const SECRET = "chave_super_secreta"; // 🔥 Alterar para variável de ambiente

interface DecodedToken {
  id: number;
}

export async function GET(req: NextRequest) {
  try {
    // Obtém o token do cookie
    
    const token = await getCookie("account-token", { req });//+

    //console.log("Token recebido no backend:", token);

    const users = await prisma.users.findMany()

    if (!token) throw new Error("Token não encontrado");

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, SECRET) as DecodedToken;

    if (!decoded || !decoded.id) throw new Error("Token inválido");

    const user: User | undefined = users.find(u => u.id === decoded.id)

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
