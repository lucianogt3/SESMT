
export function onlyDigits(v: string): string {
  return (v || "").replace(/\D+/g, "");
}

export function isValidCPF(input: string): boolean {
  const cpf = onlyDigits(input);
  if (cpf.length !== 11) return false;
  if (cpf === cpf[0].repeat(11)) return false;

  const calc = (digs: string) => {
    let sum = 0;
    for (let i = 0; i < digs.length; i++) {
      sum += Number(digs[i]) * (digs.length + 1 - i);
    }
    const r = (sum * 10) % 11;
    return r === 10 ? "0" : String(r);
  };

  const d1 = calc(cpf.slice(0, 9));
  const d2 = calc(cpf.slice(0, 9) + d1);
  return cpf.slice(-2) === d1 + d2;
}

export function formatCPF(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  let out = "";
  if (d.length > 0) out += d.slice(0, 3);
  if (d.length > 3) out += "." + d.slice(3, 6);
  if (d.length > 6) out += "." + d.slice(6, 9);
  if (d.length > 9) out += "-" + d.slice(9, 11);
  return out;
}

export function formatCEP(v: string): string {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function formatPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatSUS(v: string): string {
  const d = onlyDigits(v).slice(0, 15);
  return d.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4').trim();
}

export function formatPIS(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  return d.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4').trim();
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('pt-BR');
}
