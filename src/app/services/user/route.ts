import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { CookieValueTypes, getCookie } from "cookies-next";
import { parseCookies } from "nookies";

const SECRET = "chave_super_secreta"; // 🔥 Alterar para variável de ambiente

type User = {
  id: number;
  email: string;
  avatarUrl: string;
}

//simula bd
const users = [
  {
    id: 1,
    name: "samuca",
    email: "samuelchess.2005@gmail.com",
    avatarUrl: 'https://github.com/Samuel-Davi.png',
  }
]

export async function GET(req: NextRequest) {
  try {
    // Obtém o token do cookie
    const token = await getCookie("account-token", { req });//+

    //console.log("Token recebido no backend:", token);

    if (!token) throw new Error("Token não encontrado");

    // Verifica e decodifica o token
    const decoded:any = jwt.verify(token, SECRET);
    console.log("decoded: ", decoded)
    const user: User | undefined = users.find(u => u.id === decoded.id)

    return NextResponse.json({ user });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
}
