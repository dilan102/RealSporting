export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AccessDenied:
    "Tu cuenta de GitHub no tiene permiso para administrar el sitio. Contacta al equipo técnico del club.",
  Configuration:
    "La autenticación no está configurada correctamente. Revisa GITHUB_ID, GITHUB_SECRET y NEXTAUTH_SECRET.",
  Verification:
    "No se pudo verificar el inicio de sesión. Intenta de nuevo en unos minutos.",
  OAuthSignin:
    "No se pudo iniciar sesión con GitHub. Verifica la configuración de la aplicación OAuth.",
  OAuthCallback:
    "GitHub rechazó la autorización o la URL de callback no coincide con la registrada en GitHub.",
  OAuthCreateAccount:
    "No se pudo crear la sesión de administrador con GitHub.",
  EmailCreateAccount:
    "No se pudo crear la cuenta con el correo indicado.",
  Callback:
    "Ocurrió un error al completar el inicio de sesión.",
  OAuthAccountNotLinked:
    "Esta cuenta ya está vinculada a otro método de acceso.",
  SessionRequired:
    "Debes iniciar sesión para acceder al panel de administración.",
  Default:
    "No se pudo iniciar sesión. Intenta de nuevo o usa el acceso con contraseña.",
};

export function getAuthErrorMessage(errorCode?: string | null) {
  if (!errorCode) {
    return AUTH_ERROR_MESSAGES.Default;
  }

  return AUTH_ERROR_MESSAGES[errorCode] ?? AUTH_ERROR_MESSAGES.Default;
}
