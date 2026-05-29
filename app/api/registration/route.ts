import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { club, social } from "@/lib/content";

type RegistrationPayload = {
  aspirante?: string;
  edad?: string;
  acudiente?: string;
  telefono?: string;
  mensaje?: string;
  correo?: string;
};

const requiredFields: Array<keyof RegistrationPayload> = [
  "aspirante",
  "edad",
  "acudiente",
  "telefono",
  "mensaje",
];

function buildEmailBody(payload: RegistrationPayload) {
  return [
    `Nombre del aspirante: ${payload.aspirante}`,
    `Edad / categoría: ${payload.edad}`,
    `Nombre del acudiente: ${payload.acudiente}`,
    `Teléfono: ${payload.telefono}`,
    payload.correo ? `Correo: ${payload.correo}` : "",
    "",
    `Mensaje: ${payload.mensaje}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendWithResend(payload: RegistrationPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return false;
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
  const body = buildEmailBody(payload);

  await resend.emails.send({
    from,
    to: social.email,
    replyTo: payload.correo || undefined,
    subject: `Inscripción — ${payload.aspirante} | ${club.name}`,
    text: body,
    html: body.replace(/\n/g, "<br />"),
  });

  return true;
}

async function sendWithSmtp(payload: RegistrationPayload) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST ?? (gmailUser ? "smtp.gmail.com" : undefined);
  const smtpPort = Number(process.env.SMTP_PORT ?? (gmailUser ? 465 : 587));
  const smtpUser = process.env.SMTP_USER ?? gmailUser;
  const smtpPass = process.env.SMTP_PASS ?? gmailPass;
  const smtpFrom = process.env.SMTP_FROM ?? smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: smtpFrom,
    to: social.email,
    replyTo: payload.correo || smtpFrom,
    subject: `Inscripción — ${payload.aspirante} | ${club.name}`,
    text: buildEmailBody(payload),
  });

  return true;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as RegistrationPayload;
  const missingField = requiredFields.find((field) => !payload[field]?.trim());

  if (missingField) {
    return NextResponse.json(
      { message: "Completa todos los campos del formulario." },
      { status: 400 },
    );
  }

  try {
    const sent = (await sendWithResend(payload)) || (await sendWithSmtp(payload));

    if (!sent) {
      return NextResponse.json(
        { message: "No se pudo enviar la solicitud en este momento." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      message: "Solicitud enviada correctamente. Te contactaremos pronto.",
    });
  } catch {
    return NextResponse.json(
      { message: "No se pudo enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." },
      { status: 500 },
    );
  }
}
