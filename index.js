export default {
  async fetch(request, env) {

    // Only allow POST to /send-email
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/') {
      return json({ status: 'resendapi is running' });
    }

    if (request.method !== 'POST' || url.pathname !== '/send-email') {
      return json({ error: 'Not found' }, 404);
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const { subject, body: emailBody } = body;

    if (!subject || !emailBody) {
      return json({ error: 'Missing required fields: subject, body' }, 400);
    }

    // Recipient comes from env, not the app
    const to = env.RECIPIENT_EMAIL;
    if (!to) {
      return json({ error: 'Server misconfiguration: RECIPIENT_EMAIL not set' }, 500);
    }

    // Send via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SKU Trainer <onboarding@resend.dev>', // use resend's default until you add a domain
        to: [to],
        subject: subject,
        text: emailBody,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      return json({ error: 'Failed to send email', details: resendData }, 500);
    }

    return json({ success: true, id: resendData.id });
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
