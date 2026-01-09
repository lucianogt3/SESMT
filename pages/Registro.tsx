import React, { useEffect, useMemo, useState } from "react";
import { FileText, MapPin, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { mockDataService } from "../services/mockDataService";
import type { AppSettings, Notificacao } from "../types";
import { formatCPF, onlyDigits } from "../lib/utils";

type StepKey = "COLABORADOR" | "ACIDENTE" | "LOCAL" | "AGENTE" | "FINAL";

const initialForm: Partial<Notificacao> = {
  status: "aberto",
  colaborador: {
    nome: "",
    cpf: "",
    dataNascimento: "",
    sexo: "",
    funcao: "",
    setor: "",
    matricula: "",
    telefone: "",
    email: "",
  } as any,
  dataAcidente: "",
  horaAcidente: "",
  tipoAcidente: "típico",
  houveAfastamento: "não",
  diasAfastamento: "",
  descricao: "",
  parteCorpo: "",
  localOcorrencia: "",
  endereco: {
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  } as any,
  agenteCausador: "",
  classificacao: "",
  observacoes: "",
};

const pill = (active: boolean) =>
  active
    ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10";

const inputBase =
  "w-full glass border border-white/10 rounded-2xl px-4 py-3 outline-none text-white placeholder:text-slate-500 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10 transition";

const labelBase =
  "text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1";

const cardBase =
  "glass border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/20";

const SectionTitle: React.FC<{ title: string; desc?: string; icon?: React.ReactNode }> = ({
  title,
  desc,
  icon,
}) => (
  <div className="flex items-start gap-3 mb-6">
    <div className="p-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
      {icon}
    </div>
    <div>
      <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">{title}</h2>
      {desc ? <p className="text-sm text-slate-400 mt-1">{desc}</p> : null}
    </div>
  </div>
);

const Divider: React.FC = () => <div className="h-px w-full bg-white/10 my-6" />;

const Registro: React.FC = () => {
  const [savedNotif, setSavedNotif] = useState<Notificacao | null>(null);

  const [settings, setSettings] = useState<AppSettings>({
    setores: [],
    partesCorpo: [],
    locais: [],
  } as any);

  const [step, setStep] = useState<StepKey>("COLABORADOR");
  const [form, setForm] = useState<Partial<Notificacao>>({ ...initialForm });

  const [loadingCep, setLoadingCep] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = mockDataService.getSettings();
      setSettings(s as any);
    } catch {
      // mantém defaults
    }
  }, []);

  const setColaborador = (patch: any) =>
    setForm((prev) => ({
      ...prev,
      colaborador: { ...(prev.colaborador as any), ...patch },
    }));

  const setEndereco = (patch: any) =>
    setForm((prev) => ({
      ...prev,
      endereco: { ...(prev.endereco as any), ...patch },
    }));

  const canNext = useMemo(() => {
    const col = (form.colaborador as any) || {};
    if (step === "COLABORADOR") return !!col.nome && !!onlyDigits(col.cpf) && !!col.dataNascimento;
    if (step === "ACIDENTE") return !!form.dataAcidente && !!(form.descricao || "").toString().trim();
    if (step === "LOCAL") return !!form.localOcorrencia && !!((form.endereco as any)?.cep || "");
    return true;
  }, [form, step]);

  const order: StepKey[] = ["COLABORADOR", "ACIDENTE", "LOCAL", "AGENTE", "FINAL"];
  const nextStep = () => setStep(order[Math.min(order.indexOf(step) + 1, order.length - 1)]);
  const prevStep = () => setStep(order[Math.max(order.indexOf(step) - 1, 0)]);

  const buscarCep = async () => {
    const cep = ((form.endereco as any)?.cep || "").replace(/\D/g, "");
    if (cep.length !== 8) return;

    setLoadingCep(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data?.erro) throw new Error("CEP não encontrado");

      setEndereco({
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      });
    } catch {
      setErrorMsg("Não foi possível buscar o CEP. Verifique e tente novamente.");
    } finally {
      setLoadingCep(false);
    }
  };

  const salvar = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const col = (form.colaborador as any) || {};
      const cpfClean = onlyDigits(col.cpf || "");

      const payload: any = {
        ...form,
        colaborador: { ...col, cpf: cpfClean },
      };

      const saved = await (mockDataService as any).saveNotificacao(payload);

      setSavedNotif(saved);
      setSuccessMsg(`Registro salvo com sucesso! Nº ${saved?.id || "-"}`);
      setStep("FINAL");
    } catch {
      setErrorMsg("Falha ao salvar. Verifique os campos e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const resetAll = () => {
    setForm({ ...initialForm });
    setSavedNotif(null);
    setSuccessMsg(null);
    setErrorMsg(null);
    setStep("COLABORADOR");
  };

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 glass p-6 md:p-8 mb-8">
          <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold tracking-widest uppercase">
                <FileText size={14} />
                Registro SINAN & CAT
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-3">
                Novo Registro de Acidente / Incidente
              </h1>
              <p className="text-slate-400 mt-2 text-sm md:text-base">
                Preencha os dados em etapas para garantir consistência e melhor rastreabilidade.
              </p>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-slate-500">Status</span>
              <span className="mt-1 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-200 text-sm font-semibold">
                {(form.status as any) || "aberto"}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
          {[
            ["COLABORADOR", "Colaborador"],
            ["ACIDENTE", "Acidente"],
            ["LOCAL", "Local"],
            ["AGENTE", "Agente"],
            ["FINAL", "Finalizar"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setStep(k as StepKey)}
              className={`px-3 py-2 rounded-2xl text-sm font-semibold transition border ${
                step === k
                  ? "bg-blue-600/20 border-blue-500/30 text-blue-200"
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
              }`}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {successMsg ? (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-200 flex gap-3">
            <CheckCircle2 className="mt-0.5" size={18} />
            <div className="text-sm">{successMsg}</div>
          </div>
        ) : null}

        {errorMsg ? (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200 flex gap-3">
            <AlertTriangle className="mt-0.5" size={18} />
            <div className="text-sm">{errorMsg}</div>
          </div>
        ) : null}

        <div className={cardBase}>
          {step === "COLABORADOR" && (
            <>
              <SectionTitle
                title="Dados do Colaborador"
                desc="CPF e data de nascimento são usados para consulta."
                icon={<FileText size={18} />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Nome completo</label>
                  <input
                    className={inputBase}
                    value={((form.colaborador as any)?.nome || "") as any}
                    onChange={(e) => setColaborador({ nome: e.target.value })}
                    placeholder="Ex.: João da Silva"
                  />
                </div>

                <div>
                  <label className={labelBase}>CPF</label>
                  <input
                    className={inputBase}
                    value={formatCPF(((form.colaborador as any)?.cpf || "") as any)}
                    onChange={(e) => setColaborador({ cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                  />
                  <p className="text-xs text-slate-500 mt-1 px-1">
                    O sistema salva apenas números internamente.
                  </p>
                </div>

                <div>
                  <label className={labelBase}>Data de nascimento</label>
                  <input
                    className={inputBase}
                    type="date"
                    value={((form.colaborador as any)?.dataNascimento || "") as any}
                    onChange={(e) => setColaborador({ dataNascimento: e.target.value })}
                  />
                </div>

                <div>
                  <label className={labelBase}>Sexo</label>
                  <select
                    className={inputBase}
                    value={((form.colaborador as any)?.sexo || "") as any}
                    onChange={(e) => setColaborador({ sexo: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Matrícula</label>
                  <input
                    className={inputBase}
                    value={((form.colaborador as any)?.matricula || "") as any}
                    onChange={(e) => setColaborador({ matricula: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>

                <div>
                  <label className={labelBase}>Função</label>
                  <input
                    className={inputBase}
                    value={((form.colaborador as any)?.funcao || "") as any}
                    onChange={(e) => setColaborador({ funcao: e.target.value })}
                    placeholder="Ex.: Técnico de Enfermagem"
                  />
                </div>

                <div>
                  <label className={labelBase}>Setor</label>
                  <select
                    className={inputBase}
                    value={((form.colaborador as any)?.setor || "") as any}
                    onChange={(e) => setColaborador({ setor: e.target.value })}
                  >
                    <option value="">Selecione</option>
                    {(settings?.setores || []).map((s: string) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Telefone</label>
                  <input
                    className={inputBase}
                    value={((form.colaborador as any)?.telefone || "") as any}
                    onChange={(e) => setColaborador({ telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>Email</label>
                  <input
                    className={inputBase}
                    value={((form.colaborador as any)?.email || "") as any}
                    onChange={(e) => setColaborador({ email: e.target.value })}
                    placeholder="nome@empresa.com"
                  />
                </div>
              </div>
            </>
          )}

          {step === "ACIDENTE" && (
            <>
              <SectionTitle
                title="Dados do Acidente"
                desc="Data, tipo e descrição do ocorrido."
                icon={<FileText size={18} />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelBase}>Data do acidente</label>
                  <input
                    className={inputBase}
                    type="date"
                    value={(form.dataAcidente as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, dataAcidente: e.target.value }))}
                  />
                </div>

                <div>
                  <label className={labelBase}>Hora do acidente</label>
                  <input
                    className={inputBase}
                    type="time"
                    value={(form.horaAcidente as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, horaAcidente: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>Tipo</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["típico", "Típico"],
                      ["trajeto", "Trajeto"],
                      ["doença", "Doença ocupacional"],
                      ["retorno", "Retorno/Recidiva"],
                    ].map(([val, lab]) => (
                      <button
                        key={val}
                        type="button"
                        className={`px-4 py-2 rounded-2xl text-sm font-semibold border transition ${pill(
                          (form.tipoAcidente as any) === val
                        )}`}
                        onClick={() => setForm((p) => ({ ...p, tipoAcidente: val as any }))}
                      >
                        {lab}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelBase}>Houve afastamento?</label>
                  <select
                    className={inputBase}
                    value={(form.houveAfastamento as any) || "não"}
                    onChange={(e) => setForm((p) => ({ ...p, houveAfastamento: e.target.value as any }))}
                  >
                    <option value="não">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Dias de afastamento</label>
                  <input
                    className={inputBase}
                    value={(form.diasAfastamento as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, diasAfastamento: e.target.value }))}
                    placeholder="0"
                    disabled={(form.houveAfastamento as any) !== "sim"}
                  />
                </div>

                <div>
                  <label className={labelBase}>Parte do corpo</label>
                  <select
                    className={inputBase}
                    value={(form.parteCorpo as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, parteCorpo: e.target.value as any }))}
                  >
                    <option value="">Selecione</option>
                    {(settings?.partesCorpo || []).map((p: string) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Classificação</label>
                  <input
                    className={inputBase}
                    value={(form.classificacao as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, classificacao: e.target.value }))}
                    placeholder="Ex.: Sem afastamento"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>Descrição do ocorrido</label>
                  <textarea
                    className={`${inputBase} min-h-[120px]`}
                    value={(form.descricao as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
                    placeholder="Circunstâncias e medidas imediatas..."
                  />
                </div>
              </div>
            </>
          )}

          {step === "LOCAL" && (
            <>
              <SectionTitle
                title="Local e Endereço"
                desc="Onde ocorreu + endereço para registro/impressão."
                icon={<MapPin size={18} />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelBase}>Local da ocorrência</label>
                  <select
                    className={inputBase}
                    value={(form.localOcorrencia as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, localOcorrencia: e.target.value as any }))}
                  >
                    <option value="">Selecione</option>
                    {(settings?.locais || []).map((l: string) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>CEP</label>
                  <div className="flex gap-2">
                    <input
                      className={inputBase}
                      value={((form.endereco as any)?.cep || "") as any}
                      onChange={(e) => setEndereco({ cep: e.target.value })}
                      placeholder="00000-000"
                    />
                    <button
                      type="button"
                      onClick={buscarCep}
                      disabled={loadingCep}
                      className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition disabled:opacity-60"
                    >
                      {loadingCep ? "..." : "Buscar"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelBase}>Número</label>
                  <input
                    className={inputBase}
                    value={((form.endereco as any)?.numero || "") as any}
                    onChange={(e) => setEndereco({ numero: e.target.value })}
                    placeholder="123"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>Logradouro</label>
                  <input
                    className={inputBase}
                    value={((form.endereco as any)?.logradouro || "") as any}
                    onChange={(e) => setEndereco({ logradouro: e.target.value })}
                    placeholder="Rua/Avenida..."
                  />
                </div>

                <div>
                  <label className={labelBase}>Bairro</label>
                  <input
                    className={inputBase}
                    value={((form.endereco as any)?.bairro || "") as any}
                    onChange={(e) => setEndereco({ bairro: e.target.value })}
                    placeholder="Bairro"
                  />
                </div>

                <div>
                  <label className={labelBase}>Cidade</label>
                  <input
                    className={inputBase}
                    value={((form.endereco as any)?.cidade || "") as any}
                    onChange={(e) => setEndereco({ cidade: e.target.value })}
                    placeholder="Cidade"
                  />
                </div>

                <div>
                  <label className={labelBase}>UF</label>
                  <input
                    className={inputBase}
                    value={((form.endereco as any)?.uf || "") as any}
                    onChange={(e) => setEndereco({ uf: e.target.value })}
                    placeholder="UF"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>Complemento</label>
                  <input
                    className={inputBase}
                    value={((form.endereco as any)?.complemento || "") as any}
                    onChange={(e) => setEndereco({ complemento: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </>
          )}

          {step === "AGENTE" && (
            <>
              <SectionTitle
                title="Agente e Observações"
                desc="Agente causador e observações adicionais."
                icon={<FileText size={18} />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelBase}>Agente causador</label>
                  <input
                    className={inputBase}
                    value={(form.agenteCausador as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, agenteCausador: e.target.value }))}
                    placeholder="Ex.: Perfurocortante, queda..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelBase}>Observações</label>
                  <textarea
                    className={`${inputBase} min-h-[120px]`}
                    value={(form.observacoes as any) || ""}
                    onChange={(e) => setForm((p) => ({ ...p, observacoes: e.target.value }))}
                    placeholder="Condutas, encaminhamentos..."
                  />
                </div>
              </div>

              <Divider />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep("FINAL")}
                  className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition"
                >
                  Revisar e Finalizar
                </button>
              </div>
            </>
          )}

          {step === "FINAL" && (
            <>
              <SectionTitle
                title="Finalizar"
                desc="Revise os dados e salve o registro."
                icon={<Save size={18} />}
              />

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InfoRow label="Colaborador" value={((form.colaborador as any)?.nome || "-") as any} />
                  <InfoRow label="CPF" value={formatCPF(((form.colaborador as any)?.cpf || "") as any)} />
                  <InfoRow label="Data do acidente" value={(form.dataAcidente as any) || "-"} />
                  <InfoRow label="Tipo" value={(form.tipoAcidente as any) || "-"} />
                  <InfoRow label="Local" value={(form.localOcorrencia as any) || "-"} />
                  <InfoRow label="CEP" value={((form.endereco as any)?.cep || "-") as any} />
                </div>

                {savedNotif?.id ? (
                  <div className="mt-4 text-xs text-emerald-200">
                    Registro salvo com nº <b>{savedNotif.id}</b>.
                  </div>
                ) : null}
              </div>

              <Divider />

              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div className="text-xs text-slate-500">
                  Ao salvar, o registro fica disponível para consulta e impressão.
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition"
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={salvar}
                    disabled={saving}
                    className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-500 transition disabled:opacity-60 flex items-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? "Salvando..." : "Salvar Registro"}
                  </button>

                  <button
                    type="button"
                    onClick={resetAll}
                    className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition"
                  >
                    Novo Registro
                  </button>
                </div>
              </div>
            </>
          )}

          <Divider />

          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="text-xs text-slate-500">
              Etapa atual: <span className="text-slate-300 font-semibold">{step}</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === "COLABORADOR"}
                className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition disabled:opacity-40"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={nextStep}
                disabled={!canNext || step === "FINAL"}
                className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-500 transition disabled:opacity-40"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
    <span className="text-slate-400 text-xs uppercase tracking-widest">{label}</span>
    <span className="text-slate-100 font-semibold truncate">{value || "-"}</span>
  </div>
);

export default Registro;
