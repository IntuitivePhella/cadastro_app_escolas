
import React, { useState } from 'react';
import { Responsavel } from '../types';
import { formatarCPF, formatarTelefone } from '../utils/formatters';
import { SaveIcon, TrashIcon } from './Icons';
import FormSection from './common/FormSection';
import Input from './common/Input';
import Table from './common/Table';
import Button from './common/Button';

interface Props {
    data: Responsavel[];
    onAdd: (responsavel: Omit<Responsavel, 'id'>) => void;
    onRemove: (id: number) => void;
}

const GuardianForm: React.FC<Props> = ({ data, onAdd, onRemove }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome || !cpf || !whatsapp || !email) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        onAdd({ nome, cpf, whatsapp, email });
        setNome('');
        setCpf('');
        setWhatsapp('');
        setEmail('');
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <FormSection title="Cadastro de Responsável">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nome Completo" id="nomeResponsavel" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Maria da Silva" />
                        <Input label="CPF" id="cpfResponsavel" value={cpf} onChange={e => setCpf(formatarCPF(e.target.value))} required placeholder="000.000.000-00" maxLength={14} helpText="Apenas números." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="WhatsApp" type="tel" id="whatsappResponsavel" value={whatsapp} onChange={e => setWhatsapp(formatarTelefone(e.target.value))} required placeholder="(00) 00000-0000" maxLength={15} helpText="Com DDD." />
                        <Input label="Email" type="email" id="emailResponsavel" value={email} onChange={e => setEmail(e.target.value)} required placeholder="exemplo@email.com" />
                    </div>
                    <div className="flex justify-end">
                         <Button type="submit" variant="success">
                            <SaveIcon className="mr-2 h-5 w-5" />
                            Salvar Responsável
                        </Button>
                    </div>
                </form>
            </FormSection>

            <FormSection title="Responsáveis Cadastrados">
                <Table headers={['Nome', 'CPF', 'WhatsApp', 'Email', 'Ações']} emptyMessage="Nenhum responsável cadastrado ainda" itemCount={data.length}>
                    {data.map(resp => (
                        <tr key={resp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resp.nome}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resp.cpf}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resp.whatsapp}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resp.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                               <Button variant="danger" onClick={() => onRemove(resp.id)} className="px-3 py-1 text-xs">
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

export default GuardianForm;
