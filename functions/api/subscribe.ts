import { Resend } from 'resend';

interface Env {
    RESEND_API_KEY: string;
    RESEND_AUDIENCE_ID?: string;
    DB?: D1Database;
}

const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const { email } = await request.json() as { email: string };

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return json({ error: 'Invalid email address' }, 400);
        }

        if (!env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return json({ error: 'Server configuration error' }, 500);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const resend = new Resend(env.RESEND_API_KEY);

        // 1. Persist to D1 as the durable, self-owned list.
        //    Non-fatal: a storage hiccup shouldn't fail the subscription.
        if (env.DB) {
            try {
                await env.DB.prepare(
                    'INSERT OR IGNORE INTO subscribers (email) VALUES (?)'
                ).bind(normalizedEmail).run();
            } catch (dbError) {
                console.error('D1 insert error:', dbError);
            }
        }

        // 2. Add to the Resend Audience — the list you'll actually send newsletters from.
        //    Non-fatal so a duplicate/API blip still counts the subscriber (already in D1).
        if (env.RESEND_AUDIENCE_ID) {
            try {
                await resend.contacts.create({
                    email: normalizedEmail,
                    audienceId: env.RESEND_AUDIENCE_ID,
                    unsubscribed: false,
                });
            } catch (contactError) {
                console.error('Resend contact error:', contactError);
            }
        }

        // 3. Notify the admin. Also non-fatal — the subscriber is already captured above.
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'oluwapamimoakinjide@gmail.com',
                subject: 'New Portfolio Subscriber',
                html: `<p>New subscriber: <strong>${normalizedEmail}</strong></p><p>Added to your D1 list and Resend Audience.</p>`
            });
        } catch (error) {
            console.error('Resend notification error:', error);
        }

        return json({ success: true }, 200);
    } catch (err) {
        return json({ error: 'Invalid request' }, 400);
    }
};
