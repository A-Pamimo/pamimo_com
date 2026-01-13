/// <reference types="@cloudflare/workers-types" />

interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as { email?: string; source?: string };

        if (!body.email || !body.email.includes('@')) {
            return new Response(JSON.stringify({ error: 'Invalid email address' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const email = body.email.trim();
        const source = body.source || 'grocery-gap';

        // Insert into D1
        const { success } = await env.DB.prepare(
            'INSERT INTO subscribers (email, source) VALUES (?, ?)'
        )
            .bind(email, source)
            .run();

        if (!success) {
            throw new Error('Database insert failed');
        }

        return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err: any) {
        // Handle unique constraint violation (already subscribed) gracefully
        if (err.message && err.message.includes('UNIQUE constraint failed')) {
            return new Response(JSON.stringify({ success: true, message: 'Already subscribed' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ error: 'Server error', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
