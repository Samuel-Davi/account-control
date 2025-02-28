import bcrypt from "bcryptjs";
import { setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const mockUser = {
    id: 1,
    email: "samuelchess.2005@gmail.com",
    password: bcrypt.hashSync("123123", 10), // Senha criptografada
};

const SECRET = "chave_super_secreta";

export async function POST(req:Request){
    const {email, password} = await req.json();

    if (email !== mockUser.email || !bcrypt.compareSync(password, mockUser.password)){
        return NextResponse.json({ error: "Usuário ou senha inválidos"}, { status: 401 });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, SECRET, { expiresIn: "1h" });

    // Salva o token no usuario

    const user = {
        token: token,
        name: 'samuca',
        email: mockUser.email,
        avatarUrl: 'https://github.com/Samuel-Davi.png',
    }

    const res = NextResponse.json(user, { status: 200 });

    return res
}

/*export async function GET(req: Request){
    return {
        user: {
            name: 'samuca',
            email: mockUser.email,
            avatarUrl: 'https://github.com/Samuel-Davi.png',
        }
    }
}*/