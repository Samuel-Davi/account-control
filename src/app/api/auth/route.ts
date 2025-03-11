import { SignInData } from "@/app/contexts/AuthContext";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { User } from "@/app/models/User";


const SECRET = "chave_super_secreta";



const setToken = async (mockUser:User, timeToken:string) => {
    if(timeToken === "1h"){
        return jwt.sign({ id: mockUser.id, email: mockUser.email }, SECRET, { expiresIn: "1h" });
    }else{
        return jwt.sign({ id: mockUser.id, email: mockUser.email }, SECRET, { expiresIn: "30d" });
    }
}
export async function POST(req:Request){
    const {email, password, timeToken}: SignInData = await req.json();

    const user:User|null = await prisma.users.findUnique({
        where: {
            email: email,
        },
    })

    if (!user){
        console.log("User not found")
        return NextResponse.json({ error: "Usuário não encontrado"}, { status: 404 });
    }

    if (email !== user.email || password !== user.password){
        return NextResponse.json({ error: "Usuário ou senha inválidos"}, { status: 401 });
    }

    // Gera o token JWT
    const token = await setToken(user, timeToken)
    

    // Salva o token no usuario
    user.timeToken = timeToken
    user.token = token

    const res = NextResponse.json(user, { status: 200 });

    return res
}