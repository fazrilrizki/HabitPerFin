import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

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

        console.log(user);

        return new Response(null, { status: 204 });
    } catch (reason) {
        const message =
            reason instanceof Error ? reason.message : 'Unexpected error';

        return new Response(message, { status: 500 });
    }
}