
import { Notificacao, Colaborador, Lateralidade, AppSettings } from '../types';
import { onlyDigits } from '../lib/utils';

const STORAGE_NOTIF_KEY = 'sesmt_notificacoes_v1';
const STORAGE_COLAB_KEY = 'sesmt_colaboradores_v1';
const STORAGE_SETTINGS_KEY = 'sesmt_settings_v1';

/**
 * CONFIGURAÇÃO PADRÃO DO SISTEMA
 * Utilizada apenas se o banco (localStorage) estiver vazio.
 */
const DEFAULT_SETTINGS: AppSettings = {
  setores: [
    'UTI Adulto', 'UTI Pediátrica', 'Centro Cirúrgico', 'Pronto Socorro', 
    'Ambulatório', 'Copa', 'Lavanderia', 'Laboratório', 'Manutenção', 
    'Administrativo', 'Higienização'
  ],
  partesCorpo: [
    'Cabeça', 'Pescoço', 'Ombro', 'Braço', 'Antebraço', 'Mão', 'Dedo da mão', 
    'Tórax', 'Abdome', 'Pelve', 'Coxa', 'Joelho', 'Perna', 'Pé', 'Dedo do pé'
  ],
  locais: [
    'Instalações do contratante', 'Instalações de terceiros', 
    'Via pública', 'Domicílio próprio'
  ]
};

/**
 * SERVIÇO DE DADOS (ABSTRAÇÃO PARA PRODUÇÃO)
 * Esta estrutura está pronta para ser substituída por chamadas fetch()
 * para um backend real (Python/Flask, PHP, Node.js + SQL).
 */
export const mockDataService = {
  // Configurações (Sectores, Partes do Corpo, etc)
  getSettings: (): AppSettings => {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  },

  updateSettings: async (settings: AppSettings): Promise<boolean> => {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    return true;
  },

  // Notificações e Colaboradores
  getNotificacoes: (): Notificacao[] => {
    const raw = localStorage.getItem(STORAGE_NOTIF_KEY);
    const notifs: Notificacao[] = raw ? JSON.parse(raw) : [];
    const colabs = mockDataService.getColaboradores();
    return notifs.map(n => ({
      ...n,
      colaborador: colabs.find(c => c.id === n.colaboradorId)
    }));
  },

  getColaboradores: (): Colaborador[] => {
    const raw = localStorage.getItem(STORAGE_COLAB_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  // Cálculo de Dias sem Acidentes (Safety Scoreboard)
  getDaysWithoutAccidents: (): number => {
    const notifs = mockDataService.getNotificacoes();
    if (notifs.length === 0) return 0;
    
    // Considera apenas acidentes registrados
    const dates = notifs.map(n => new Date(n.dataAcidente).getTime());
    const latestAccident = Math.max(...dates);
    const today = new Date().setHours(0, 0, 0, 0);
    
    const diffTime = today - latestAccident;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? 0 : diffDays;
  },

  // Gravação (Simula POST/SQL)
  saveNotificacao: async (data: any): Promise<Notificacao> => {
    // Simula delay de rede/backend
    await new Promise(resolve => setTimeout(resolve, 800));

    const colabs = mockDataService.getColaboradores();
    const cleanCpf = onlyDigits(data.colaborador.cpf);
    let colab = colabs.find(c => onlyDigits(c.cpf) === cleanCpf);
    
    if (!colab) {
      colab = {
        ...data.colaborador,
        id: Math.random().toString(36).substr(2, 9),
        cpf: cleanCpf
      };
      colabs.push(colab);
      localStorage.setItem(STORAGE_COLAB_KEY, JSON.stringify(colabs));
    }

    const notifs = mockDataService.getNotificacoes();
    const newNotif: Notificacao = {
      ...data,
      id: (notifs.length + 1).toString().padStart(4, '0'),
      colaboradorId: colab.id,
      dataRegistro: new Date().toISOString(),
      status: 'registrado',
      colaborador: undefined // Evita circularidade no JSON
    };

    notifs.push(newNotif);
    localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(notifs));
    return newNotif;
  },

  // Busca Validada
  search: (cpf: string, dataValidacao: string): Notificacao[] => {
    const cleanCpf = onlyDigits(cpf);
    return mockDataService.getNotificacoes().filter(n => 
      onlyDigits(n.colaborador?.cpf || '') === cleanCpf && 
      (n.colaborador?.dataNascimento === dataValidacao || n.dataAcidente === dataValidacao)
    );
  }
};
