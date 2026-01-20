import { Resend } from 'resend';

interface Env {
    RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const { email } = await request.json() as { email: string };

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify({ error: 'Invalid email address' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const resend = new Resend(env.RESEND_API_KEY);

        try {
            // Send notification to admin (you)
            // Using onboarding domain for instant setup
            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'oluwapamimoakinjide@gmail.com',
                subject: 'New Portfolio Subscriber',
                html: `<p>New subscriber: <strong>${email}</strong></p><p>Check Resend dashboard to manage.</p>`
            });

            return new Response(JSON.stringify({ success: true, data }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Resend API error:', error);
            return new Response(JSON.stringify({ error: 'Failed to subscribe' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
