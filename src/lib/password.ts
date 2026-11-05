const MINIMUM_PASSWORD_LENGTH = 8

/** Regra de senha do FAROL: 8+ caracteres, com maiúscula, minúscula, número e caractere especial. */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= MINIMUM_PASSWORD_LENGTH &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}
