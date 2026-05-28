import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { club, social } from "@/lib/content";

type RegistrationPayload = {
  aspirante?: string;
  edad?: string;
  acudiente?: string;
  telefono?: string;
  mensaje?: string;
};

const requiredFields: Array<keyof RegistrationPayload> = [
  "aspirante",
  "edad",
  "acudiente",
  "telefono",
  "mensaje",
];

export async function POST(request: Request) {
  const payload = (await request.json()) as RegistrationPayload;

  const missingField = requiredFields.find((field) => !payload[field]?.trim());

  if (missingField) {
    return NextResponse.json(
      { message: "Completa todos los campos del formulario." },
      { status: 400 }
    );
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST ?? (gmailUser ? "smtp.gmail.com" : undefined);
  const smtpPort = Number(process.env.SMTP_PORT ?? (gmailUser ? 465 : 587));
  const smtpUser = process.env.SMTP_USER ?? gmailUser;
  const smtpPass = process.env.SMTP_PASS ?? gmailPass;
  const smtpFrom = process.env.SMTP_FROM ?? smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return NextResponse.json(
      {
        message:
          "El envío por Gmail aún no está configurado en el servidor. Agrega GMAIL_USER y GMAIL_APP_PASSWORD, o SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y SMTP_FROM.",
      },
      { status: 503 }
    );
  }

  const body = [
    `Nombre del aspirante: ${payload.aspirante}`,
    `Edad: ${payload.edad}`,
    `Nombre del acudiente: ${payload.acudiente}`,
    `Telefono: ${payload.telefono}`,
    "",
    `Mensaje: ${payload.mensaje}`,
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: smtpFrom,
    to: social.email,
    replyTo: smtpFrom,
    subject: `Inscripción - ${club.name}`,
    text: body,
  });

  return NextResponse.json({
    message: "Solicitud enviada correctamente. Te contactaremos pronto.",
  });
}
