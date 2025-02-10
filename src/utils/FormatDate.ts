export function FormatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR");
}