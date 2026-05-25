import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const loginSchema = z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

export async function GET() {
    return NextResponse.json({ pesan: "Halo dari Backend Next.js!" });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const parsed = loginSchema.safeParse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        if (!parsed.success) {
            return NextResponse.json(
                { errors: parsed.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { errors: { email: ["Your email or password is incorrect."] } },
                { status: 401 }
            );
        }

        const hash = user.password.replace(/^\$2y\$/, '$2b$');
        const passwordMatch = await bcrypt.compare(password, hash);

        if (!passwordMatch) {
            return NextResponse.json(
                { errors: { password: ["Your email or password is inccorect."] } },
                { status: 401 }
            );
        }

        return NextResponse.json({ message: "Login berhasil" }, { status: 200 });
    } catch (reason) {
        const message =
            reason instanceof Error ? reason.message : 'Unexpected error';

        return new Response(message, { status: 500 });
    }
}