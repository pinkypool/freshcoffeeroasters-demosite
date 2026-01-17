// src/app/api/auth/register/route.ts
// Demo: Registration (returns success but doesn't actually save)

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name, phone } = body;

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Заполните все обязательные поля' },
                { status: 400 }
            );
        }

        // Demo: Just log and return success
        console.log('[DEMO] Registration request:', { email, name, phone });

        return NextResponse.json({
            user: {
                id: `new-user-${Date.now()}`,
                email,
                name,
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Ошибка регистрации' }, { status: 500 });
    }
}
