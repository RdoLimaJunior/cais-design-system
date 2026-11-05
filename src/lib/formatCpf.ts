const CPF_DIGIT_COUNT = 11

/** Aplica a máscara 000.000.000-00 enquanto o usuário digita. */
export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, CPF_DIGIT_COUNT)
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}
