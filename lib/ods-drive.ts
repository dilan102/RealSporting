/** Convierte un enlace de vista de Google Drive al modo preview para iframe. */
export function odsDrivePreviewUrl(viewUrl: string) {
  const match = viewUrl.match(/\/d\/([^/]+)/);
  if (!match) {
    return viewUrl;
  }
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}
