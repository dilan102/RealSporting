import emailjs from "@emailjs/browser";

export type EmailJsTemplateParams = {
  nombre: string;
  correo: string;
  mensaje: string;
  telefono?: string;
  categoria?: string;
};

export function getEmailJsConfig() {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ??
    process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

  return {
    serviceId,
    templateId,
    publicKey,
    isConfigured: Boolean(serviceId && templateId && publicKey),
  };
}

export function buildEmailJsTemplateParams(
  params: EmailJsTemplateParams,
): Record<string, string> {
  const telefono = params.telefono?.trim() || "No registrado";
  const categoria = params.categoria?.trim() || "No indicada";
  const mensaje = params.mensaje.trim();

  return {
    nombre: params.nombre.trim(),
    correo: params.correo.trim(),
    mensaje,
    telefono,
    categoria,
    from_name: params.nombre.trim(),
    from_email: params.correo.trim(),
    message: mensaje,
    phone: telefono,
    reply_to: params.correo.trim(),
  };
}

export async function sendEmailJsMessage(params: EmailJsTemplateParams) {
  const { serviceId, templateId, publicKey, isConfigured } = getEmailJsConfig();

  if (!isConfigured || !serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS no está configurado. Revisa NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID y NEXT_PUBLIC_EMAILJS_USER_ID.",
    );
  }

  await emailjs.send(serviceId, templateId, buildEmailJsTemplateParams(params), publicKey);
}
