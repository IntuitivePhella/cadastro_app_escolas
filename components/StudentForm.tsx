
import React, { useState } from 'react';
import { Aluno } from '../types';
import { SaveIcon, TrashIcon } from './Icons';
import FormSection from './common/FormSection';
import Input from './common/Input';
import Table from './common/Table';
import Button from './common/Button';

interface Props {
    data: Aluno[];
    onAdd: (aluno: Omit<Aluno, 'id'>) => void;
    onRemove: (id: number) => void;
}

const StudentForm: React.FC<Props> = ({ data, onAdd, onRemove }) => {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [serie, setSerie] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !matricula || !serie) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        onAdd({ nome, matricula, serie, categoria: 'ESTUDANTE' });
        setNome('');
        setMatricula('');
        setSerie('');
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <FormSection title="Cadastro de Aluno">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nome Completo do Aluno" id="nomeAluno" value={nome} onChange={(e) => setNome(e.target.value)} required helpText="Digite o nome completo como está na certidão." placeholder="Ex: João Pedro da Silva"/>
                        <Input label="Matrícula" id="matriculaAluno" value={matricula} onChange={(e) => setMatricula(e.target.value)} required helpText="Número da matrícula do aluno." placeholder="Ex: 2024001" />
                    </div>
                    <Input label="Série/Turma" id="serieTurma" value={serie} onChange={(e) => setSerie(e.target.value)} required helpText="Ex: 1º Ano A, 2º Ano B..." placeholder="Ex: 9º Ano C" />
                    <div className="flex justify-end">
                        <Button type="submit" variant="success">
                            <SaveIcon className="mr-2 h-5 w-5" />
                            Salvar Aluno
                        </Button>
                    </div>
                </form>
            </FormSection>

            <FormSection title="Alunos Cadastrados">
                <Table headers={['Nome', 'Matrícula', 'Série/Turma', 'Ações']} emptyMessage="Nenhum aluno cadastrado ainda" itemCount={data.length}>
                    {data.map(aluno => (
                        <tr key={aluno.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aluno.nome}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aluno.matricula}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{aluno.serie}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button variant="danger" onClick={() => onRemove(aluno.id)} className="px-3 py-1 text-xs">
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

export default StudentForm;
