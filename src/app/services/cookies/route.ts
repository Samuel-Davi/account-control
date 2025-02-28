import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";

const SECRET = "chave_super_secreta"; // 🔥 Alterar para variável de ambiente

export async function GET(req: NextRequest) {
  try {
    // Obtém o token do cookie
    const token = getCookie("account-token", { req });
    if (!token) throw new Error("Token não encontrado");

    // Verifica e decodifica o token
    const decoded = jwt.verify(token.toString(), SECRET);

    return NextResponse.json({ user: decoded });
  } catch (error) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
