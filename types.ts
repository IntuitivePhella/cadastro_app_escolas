
export interface Aluno {
    id: number;
    nome: string;
    matricula: string;
    serie: string;
    categoria: 'ESTUDANTE';
}

export interface Responsavel {
    id: number;
    nome: string;
    cpf: string;
    whatsapp: string;
    email: string;
}

export interface Funcionario {
    id: number;
    nome: string;
    cpf: string;
    whatsapp: string;
    email: string;
    matricula: string;
    cargo: string;
    atribuicao: string;
    appAutorizado: boolean;
    temFilho: boolean;
}

export interface Vinculo {
    id: number;
    tipo: 'responsavel' | 'funcionario';
    pessoaId: string;
    alunoId: string;
    parentesco: string;
}

export interface AppData {
    alunos: Aluno[];
    responsaveis: Responsavel[];
    funcionarios: Funcionario[];
    vinculos: Vinculo[];
}

export type TabID = 'alunos' | 'responsaveis' | 'funcionarios' | 'vinculos' | 'resumo';
