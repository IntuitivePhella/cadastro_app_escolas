import { AppData, Aluno, Responsavel, Funcionario } from '../types';

const capitalizeParentesco = (parentesco: string): string => {
    const map: { [key: string]: string } = {
        'pai': 'Pai', 'mae': 'Mãe', 'avo_m': 'Avó', 'avo_h': 'Avô',
        'tio': 'Tio(a)', 'irmao': 'Irmão(ã)', 'responsavel_legal': 'Responsável Legal',
        'outro': 'Outro'
    };
    return map[parentesco] || parentesco;
};

const converterParaCSV = (dados: any[]): string => {
    const headers = [
        'lote_id', 'processo_id', 'categoria_entrada', 'nome_estudante', 'matricula_estudante',
        'serie_turma', 'responsaveis_do_aluno', 'nome_responsavel', 'cpf_responsavel',
        'whatsapp_responsavel', 'email_responsavel', 'vinculos_responsavel_alunos',
        'nome_funcionario', 'cpf_funcionario', 'whatsapp_funcionario', 'email_funcionario',
        'matricula_servidor', 'cargo', 'atribuicao_cargo', 'app_autorizado',
        'funcionario_tambem_responsavel', 'alunos_funcionario', 'origem_dados'
    ];
    
    if (dados.length === 0) {
        return headers.join(',');
    }

    const csvHeaders = headers.join(',');
    const csvRows = dados.map(row => {
        return headers.map(header => {
            const value = row[header] ?? '';
            let valStr = String(value);

            if (header === 'responsaveis_do_aluno' || header === 'vinculos_responsavel_alunos' || header === 'alunos_funcionario') {
                 if (valStr && valStr.startsWith('[')) {
                    return `"${valStr.replace(/"/g, '""')}"`;
                 }
            }
            if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n')) {
                return `"${valStr.replace(/"/g, '""')}"`;
            }
            return valStr;
        }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
};

export const exportDataAsCsv = (data: AppData, inepCode: string): void => {
    const { alunos, responsaveis, funcionarios, vinculos } = data;
    const dadosExportacao: any[] = [];

    const loteId = crypto.randomUUID();
    const currentDate = new Date().toISOString().split('T')[0];
    const processoId = `IMPORTACAO-${currentDate}-${inepCode}`;
    const origemDados = 'Sistema Web';

    // 1. Processar Responsáveis
    responsaveis.forEach(responsavel => {
        const vinculosDoResponsavel = vinculos.filter(
            v => v.tipo === 'responsavel' && Number(v.pessoaId) === responsavel.id
        );

        const alunosVinculados = vinculosDoResponsavel
            .map(v => alunos.find(a => a.id === Number(v.alunoId)))
            .filter((a): a is Aluno => a !== undefined);

        const vinculosJson = alunosVinculados.length > 0 ? JSON.stringify(
            alunosVinculados.map(a => ({ matricula: a.matricula }))
        ) : '';

        dadosExportacao.push({
            lote_id: loteId,
            processo_id: processoId,
            categoria_entrada: 'RESPONSAVEL',
            nome_responsavel: responsavel.nome,
            cpf_responsavel: responsavel.cpf,
            whatsapp_responsavel: responsavel.whatsapp,
            email_responsavel: responsavel.email,
            vinculos_responsavel_alunos: vinculosJson,
            origem_dados: origemDados
        });
    });

    // 2. Processar Alunos
    alunos.forEach(aluno => {
        const vinculosDoAluno = vinculos.filter(v => Number(v.alunoId) === aluno.id);

        const responsaveisDoAluno = vinculosDoAluno
            .map(v => {
                let pessoa;
                if (v.tipo === 'responsavel') {
                    pessoa = responsaveis.find(r => r.id === Number(v.pessoaId));
                } else { // 'funcionario'
                    pessoa = funcionarios.find(f => f.id === Number(v.pessoaId));
                }
                
                if (pessoa) {
                    return {
                        cpf: pessoa.cpf,
                        parentesco: capitalizeParentesco(v.parentesco)
                    };
                }
                return null;
            })
            .filter(Boolean);

        const responsaveisJson = responsaveisDoAluno.length > 0 ? JSON.stringify(responsaveisDoAluno) : '';

        dadosExportacao.push({
            lote_id: loteId,
            processo_id: processoId,
            categoria_entrada: 'ESTUDANTE',
            nome_estudante: aluno.nome,
            matricula_estudante: aluno.matricula,
            serie_turma: aluno.serie,
            responsaveis_do_aluno: responsaveisJson,
            origem_dados: origemDados
        });
    });
    
    // 3. Processar Funcionários
    funcionarios.forEach(funcionario => {
        const vinculosDoFuncionario = vinculos.filter(
            v => v.tipo === 'funcionario' && Number(v.pessoaId) === funcionario.id
        );

        const alunosVinculados = vinculosDoFuncionario
            .map(v => alunos.find(a => a.id === Number(v.alunoId)))
            .filter((a): a is Aluno => a !== undefined);

        const alunosJson = alunosVinculados.length > 0 ? JSON.stringify(
            alunosVinculados.map(a => ({ matricula: a.matricula }))
        ) : '';

        dadosExportacao.push({
            lote_id: loteId,
            processo_id: processoId,
            categoria_entrada: 'FUNCIONARIO',
            nome_funcionario: funcionario.nome,
            cpf_funcionario: funcionario.cpf,
            whatsapp_funcionario: funcionario.whatsapp,
            email_funcionario: funcionario.email,
            matricula_servidor: funcionario.matricula,
            cargo: funcionario.cargo,
            atribuicao_cargo: funcionario.atribuicao,
            app_autorizado: funcionario.appAutorizado ? 'Sim' : 'Não',
            funcionario_tambem_responsavel: funcionario.temFilho ? 'TRUE' : 'FALSE',
            alunos_funcionario: alunosJson,
            origem_dados: origemDados
        });
    });

    const csv = converterParaCSV(dadosExportacao);
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `onboarding_preenchido_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};