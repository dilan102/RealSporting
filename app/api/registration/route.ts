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

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM ?? smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
    return NextResponse.json(
      {
        message:
          "El envío de correo aún no está configurado en el servidor. Agrega SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y SMTP_FROM.",
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
    subject: `Inscripcion - ${club.name}`,
    text: body,
  });

  return NextResponse.json({
    message: "Solicitud enviada correctamente. Te contactaremos pronto.",
  });
}
