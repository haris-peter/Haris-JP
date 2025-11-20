import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        // Validate input
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send email
        const { data, error } = await resend.emails.send({
            from: 'Portfolio Contact <onboarding@resend.dev>', // Use verified domain in production
            to: [process.env.CONTACT_EMAIL || 'harisjosinpeter@gmail.com'],
            replyTo: email,
            subject: `Portfolio Contact: ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00f0ff; border-bottom: 2px solid #00f0ff; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    <div style="margin: 20px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                    </div>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
                        <h3 style="margin-top: 0;">Message:</h3>
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                    <p style="color: #666; font-size: 12px;">
                        This email was sent from your portfolio contact form.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, messageId: data?.id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
