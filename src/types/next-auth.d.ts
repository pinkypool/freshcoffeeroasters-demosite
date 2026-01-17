// src/types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        role: string;
        type: 'RETAIL' | 'WHOLESALE';
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            type: 'RETAIL' | 'WHOLESALE';
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        type: 'RETAIL' | 'WHOLESALE';
    }
}
