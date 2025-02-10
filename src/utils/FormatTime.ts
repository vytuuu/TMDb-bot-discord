export function GetDuration(minutos: number): string {
  if (minutos < 60) return `${minutos} minuto${minutos !== 1 ? "s" : ""}`;

  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;

  if (minutosRestantes === 0) return `${horas} hora${horas !== 1 ? "s" : ""}`;

  return `${horas} hora${horas !== 1 ? "s" : ""} e ${minutosRestantes} minuto${
    minutosRestantes !== 1 ? "s" : ""
  }`;
}
