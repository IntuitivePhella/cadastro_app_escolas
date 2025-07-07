
import React, { useState, useMemo } from 'react';
import { AppData, Vinculo } from '../types';
import { SaveIcon, TrashIcon, WarningIcon, PlusIcon } from './Icons';
import FormSection from './common/FormSection';
import Select from './common/Select';
import Table from './common/Table';
import Button from './common/Button';

interface Props {
    data: AppData;
    onAdd: (vinculo: Omit<Vinculo, 'id'>) => void;
    onRemove: (id: number) => void;
}

const LinkForm: React.FC<Props> = ({ data, onAdd, onRemove }) => {
    const { alunos, responsaveis, funcionarios, vinculos } = data;
    const [tipoVinculo, setTipoVinculo] = useState<'responsavel' | 'funcionario' | ''>('');
    const [pessoaId, setPessoaId] = useState('');
    const [alunoId, setAlunoId] = useState('');
    const [parentesco, setParentesco] = useState('');
    
    const pessoasDisponiveis = useMemo(() => {
        if (tipoVinculo === 'responsavel') return responsaveis;
        if (tipoVinculo === 'funcionario') return funcionarios.filter(f => f.temFilho);
        return [];
    }, [tipoVinculo, responsaveis, funcionarios]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tipoVinculo || !pessoaId || !alunoId || !parentesco) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        onAdd({ tipo: tipoVinculo, pessoaId, alunoId, parentesco });
        setPessoaId('');
        setAlunoId('');
        setParentesco('');
    };

    const getPessoaNome = (tipo: string, pId: string) => {
        const id = Number(pId);
        if (tipo === 'responsavel') {
            return responsaveis.find(r => r.id === id)?.nome;
        }
        return funcionarios.find(f => f.id === id)?.nome;
    };
    
    const getAlunoNome = (aId: string) => {
        const id = Number(aId);
        return alunos.find(a => a.id === id)?.nome;
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-amber-50 border-l-4 border-amber-400 text-amber-800 p-4 rounded-md flex items-start">
                <WarningIcon className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0 text-amber-500"/>
                <div>
                    <strong className="font-semibold">Atenção:</strong> Cadastre primeiro os alunos e os responsáveis/funcionários antes de criar os vínculos aqui.
                </div>
            </div>

            <FormSection title="Criar Vínculo">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Select label="Tipo de Vínculo" required value={tipoVinculo} onChange={e => {setTipoVinculo(e.target.value as any); setPessoaId('');}}>
                        <option value="">Selecione...</option>
                        <option value="responsavel">Responsável por Aluno</option>
                        <option value="funcionario">Funcionário com Filho na Escola</option>
                    </Select>

                    {tipoVinculo && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select label={`Selecione o ${tipoVinculo === 'responsavel' ? 'Responsável' : 'Funcionário'}`} required value={pessoaId} onChange={e => setPessoaId(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {pessoasDisponiveis.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </Select>
                                <Select label="Selecione o Aluno" required value={alunoId} onChange={e => setAlunoId(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {alunos.map(a => (
                                        <option key={a.id} value={a.id}>{a.nome}</option>
                                    ))}
                                </Select>
                            </div>
                            <Select label="Tipo de Parentesco" required value={parentesco} onChange={e => setParentesco(e.target.value)}>
                                <option value="">Selecione...</option>
                                <option value="pai">Pai</option>
                                <option value="mae">Mãe</option>
                                <option value="avo_m">Avó</option>
                                <option value="avo_h">Avô</option>
                                <option value="tio">Tio(a)</option>
                                <option value="irmao">Irmão(ã)</option>
                                <option value="responsavel_legal">Responsável Legal</option>
                                <option value="outro">Outro</option>
                            </Select>
                            <div className="flex justify-end">
                                 <Button type="submit" variant="success">
                                    <PlusIcon className="mr-2 h-5 w-5" />
                                    Criar Vínculo
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </FormSection>

            <FormSection title="Vínculos Cadastrados">
                <Table headers={['Tipo', 'Pessoa', 'Aluno', 'Parentesco', 'Ações']} emptyMessage="Nenhum vínculo cadastrado ainda" itemCount={vinculos.length}>
                    {vinculos.map(v => (
                        <tr key={v.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{v.tipo}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPessoaNome(v.tipo, v.pessoaId) || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getAlunoNome(v.alunoId) || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{v.parentesco.replace(/_/g, ' ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button variant="danger" onClick={() => onRemove(v.id)} className="px-3 py-1 text-xs">
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </FormSection>
        </div>
    );
};

export default LinkForm;
