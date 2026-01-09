import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Printer,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Briefcase,
  Calendar,
  MapPin,
  X,
} from "lucide-react";

import { formatCPF, isValidCPF, onlyDigits, formatDate } from "../lib/utils";
import type { Notificacao } from "../types";
import { mockDataService } from "../services/mockDataService";

type Viewing = { type: "SINAN" | "CAT"; data: Notificacao };

const BuscarImprimir: React.FC = () => {
  const [cpf, setCpf] = useState("");
  const [dataValidacao, setDataValidacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Notificacao[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewingForm, setViewingForm] = useState<Viewing | null>(null);

  const handleSearch = () => {
    if (!isValidCPF(cpf)) {
      setError("CPF inválido.");
      return;
    }
    if (!dataValidacao) {
      setError("Informe a data de nascimento ou a data do acidente.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    setTimeout(() => {
      try {
        const found = mockDataService.search(onlyDigits(cpf), dataValidacao);
        setResults(found);
        if (found.length === 0) setError("Nenhum registro encontrado.");
      } catch (e) {
        setError("Erro ao consultar. Verifique o serviço de dados.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Voltar ao início
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Consultar e Imprimir
        </h1>
        <p className="text-slate-400">
          Localize sua notificação para gerar as guias SINAN e CAT.
        </p>
      </div>

      <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-blue-500/10 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              CPF
            </label>
            <input
              type="text"
              value={formatCPF(cpf)}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              className="w-full glass border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Data validada (nascimento OU acidente)
            </label>
            <input
              type="date"
              value={dataValidacao}
              onChange={(e) => setDataValidacao(e.target.value)}
              className="w-full glass border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 transition text-white rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
              Consultar
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {results && results.length > 0 && (
        <div className="space-y-4">
          {results.map((notif: any) => {
            const col: any = notif?.colaborador || {};
            const nome = col?.nome || "Sem nome";
            const setor =
              notif?.setorAcidente || notif?.localOcorrencia || col?.setor || "-";
            const profissao = col?.profissao || col?.funcao || "-";

            return (
              <div
                key={notif.id}
                className="glass p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between gap-6 group hover:border-blue-500/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                      Nº {notif.id}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">
                      {formatDate(notif.dataRegistro || "")}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{nome}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {formatDate(notif.dataAcidente)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {setor}
                    </span>
                    <span className="flex items-center gap-1 sm:col-span-2">
                      <Briefcase size={14} /> {profissao}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setViewingForm({ type: "SINAN", data: notif })}
                    className="px-4 py-2 glass hover:bg-blue-600 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Printer size={14} /> SINAN
                  </button>
                  <button
                    onClick={() => setViewingForm({ type: "CAT", data: notif })}
                    className="px-4 py-2 glass hover:bg-emerald-600 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
                  >
                    <Printer size={14} /> CAT
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewingForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#0b1020]/80 backdrop-blur-md py-4 -mt-4 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Printer className="text-blue-400" /> Pré-visualização de{" "}
                {viewingForm.type}
              </h2>
              <button
                onClick={() => setViewingForm(null)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-white text-black p-8 rounded-lg shadow-inner space-y-6 font-serif">
              <div className="border-2 border-black p-4 text-center space-y-1 uppercase">
                <div className="text-xs font-bold">
                  República Federativa do Brasil - Ministério da Saúde
                </div>
                <div className="text-lg font-bold">
                  {viewingForm.type === "SINAN"
                    ? "Ficha de Investigação - Acidente de Trabalho"
                    : "Comunicação de Acidente de Trabalho - CAT"}
                </div>
                <div className="text-[10px] font-bold">
                  Documento Alimentado Automaticamente via SESMT Digital
                </div>
              </div>

              {(() => {
                const d: any = viewingForm.data;
                const col: any = d?.colaborador || {};
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-[10px]">
                      <div className="border border-black p-2">
                        <div className="font-bold border-b border-black mb-1">
                          DADOS DO COLABORADOR
                        </div>
                        <div>
                          Nome: <span className="font-bold">{col?.nome}</span>
                        </div>
                        <div>
                          CPF:{" "}
                          <span className="font-bold">
                            {formatCPF(col?.cpf || "")}
                          </span>
                        </div>
                        <div>
                          Nascimento:{" "}
                          <span className="font-bold">
                            {formatDate(col?.dataNascimento || "")}
                          </span>
                        </div>
                        <div>
                          Função/Profissão:{" "}
                          <span className="font-bold">
                            {col?.profissao || col?.funcao || "-"}
                          </span>
                        </div>
                        <div>
                          Setor:{" "}
                          <span className="font-bold">
                            {col?.setor ||
                              d?.setorAcidente ||
                              d?.localOcorrencia ||
                              "-"}
                          </span>
                        </div>
                      </div>

                      <div className="border border-black p-2">
                        <div className="font-bold border-b border-black mb-1">
                          DETALHES DO ACIDENTE
                        </div>
                        <div>
                          Data do Acidente:{" "}
                          <span className="font-bold">
                            {formatDate(d?.dataAcidente || "")}
                          </span>
                        </div>
                        <div>
                          Hora:{" "}
                          <span className="font-bold">{d?.horaAcidente || "-"}</span>
                        </div>
                        <div>
                          Tipo:{" "}
                          <span className="font-bold">{d?.tipoAcidente || "-"}</span>
                        </div>
                        <div>
                          Parte do Corpo:{" "}
                          <span className="font-bold">{d?.parteCorpo || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-black p-4 text-[10px]">
                      <div className="font-bold border-b border-black mb-1">
                        DESCRIÇÃO DOS FATOS
                      </div>
                      <div className="italic text-justify">
                        {d?.descricaoFato || d?.descricao || "-"}
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-12">
                      <div className="w-1/3 border-t border-black text-center text-[8px] pt-1 uppercase font-bold">
                        Assinatura do Responsável
                      </div>
                      <div className="w-1/3 border-t border-black text-center text-[8px] pt-1 uppercase font-bold">
                        Assinatura do Colaborador
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 transition text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Printer /> Imprimir Agora
              </button>
              <button
                onClick={() => setViewingForm(null)}
                className="flex-1 py-4 glass border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarImprimir;
