import { site } from "@/content/site";
import { validateContact, type ContactPayload } from "@/lib/contact";

/**
 * POST /api/contact
 *
 * Email delivery uses Resend (https://resend.com) when RESEND_API_KEY is set:
 *   RESEND_API_KEY=re_...
 *   CONTACT_TO_EMAIL=you@yourdomain.com      (defaults to site.email)
 *   CONTACT_FROM_EMAIL="MAK Studio <hello@yourdomain.com>"  (must be a verified Resend domain)
 * Without a key the submission is logged on the server and the form still succeeds,
 * so you can develop and preview without configuring email.
 */
export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (body.website) return Response.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  const data = {
    name: body.name!.trim().slice(0, 200),
    email: body.email!.trim().slice(0, 200),
    projectType: body.projectType!,
    budget: body.budget!,
    message: body.message!.trim().slice(0, 5000),
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // TODO: set RESEND_API_KEY in Vercel → Project → Settings → Environment Variables
    console.info("[contact] RESEND_API_KEY not set — submission logged only:", { ...data, message: `${data.message.slice(0, 80)}…` });
    return Response.json({ ok: true, delivered: false });
  }

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#0B2419;color:#E9DFC7;padding:32px">
      <h2 style="color:#C9A24B;letter-spacing:.2em;text-transform:uppercase;font-weight:300">New enquiry — ${escapeHtml(site.studio)}</h2>
      <p><strong style="color:#E8CF8A">Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong style="color:#E8CF8A">Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong style="color:#E8CF8A">Project:</strong> ${escapeHtml(data.projectType)}</p>
      <p><strong style="color:#E8CF8A">Budget:</strong> ${escapeHtml(data.budget)}</p>
      <hr style="border:0;border-top:1px solid rgba(201,162,75,.3);margin:24px 0" />
      <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(data.message)}</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? `${site.studio} <onboarding@resend.dev>`,
        to: [process.env.CONTACT_TO_EMAIL ?? site.email],
        reply_to: data.email,
        subject: `New ${data.projectType} enquiry from ${data.name}`,
        html,
        text: `${data.name} <${data.email}>\n${data.projectType} · ${data.budget}\n\n${data.message}`,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return Response.json({ ok: false, error: "The message couldn't be sent. Please email me directly." }, { status: 502 });
    }
    return Response.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Network error", err);
    return Response.json({ ok: false, error: "The message couldn't be sent. Please email me directly." }, { status: 502 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
