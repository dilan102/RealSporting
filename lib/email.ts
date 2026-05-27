type EmailDraft = {
  to: string;
  subject?: string;
  body?: string;
};

export function buildGmailComposeUrl({ to, subject = "", body = "" }: EmailDraft) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to,
    su: subject,
    body,
  });

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function buildMailtoUrl({ to, subject = "", body = "" }: EmailDraft) {
  const params = new URLSearchParams({
    subject,
    body,
  });

  return `mailto:${to}?${params.toString()}`;
}
