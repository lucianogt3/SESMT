
export enum Lateralidade {
  DIREITA = 'Direita',
  ESQUERDA = 'Esquerda',
  BILATERAL = 'Bilateral',
  NAO_APLICA = 'Não se aplica'
}

export interface Colaborador {
  id: string;
  cpf: string;
  nome: string;
  nomeMae: string;
  dataNascimento: string;
  cartaoSUS: string;
  pisPasep: string;
  racaCor: string;
  escolaridade: string;
  profissao: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  complemento?: string;
  municipio: string;
  estado: string;
}

export interface Notificacao {
  id: string;
  colaboradorId: string;
  dataRegistro: string;
  dataAcidente: string;
  horaAcidente: string;
  tipoAcidente: 'Típico' | 'Trajeto' | 'Retorno' | 'Doença';
  localAcidente: string;
  setorAcidente: string; // Used for "Setor" in Typical or "Onde" in Trajeto
  parteCorpo: string;
  lateralidade: Lateralidade;
  agenteCausador: string;
  descricaoFato: string;
  situacaoMercado: string;
  cnae?: string;
  eTerceiro: boolean;
  nomeEmpresa?: string;
  cnpjEmpresa?: string;
  materialBiologico: boolean;
  tipoExposicao?: string;
  epiUtilizado: string[];
  condutaImediata?: string;
  status: 'registrado' | 'analise' | 'encerrado';
  colaborador?: Colaborador;
}

export interface AppSettings {
  setores: string[];
  partesCorpo: string[];
  locais: string[];
}
