import React, { useState } from 'react';
import { Funcionario } from '../types';
import { formatarCPF, formatarTelefone } from '../utils/formatters';
import { SaveIcon, TrashIcon } from './Icons';
import FormSection from './common/FormSection';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';
import Table from './common/Table';

interface Props {
    data: Funcionario[];
    onAdd: (funcionario: Omit<Funcionario, 'id'>) => void;
    onRemove: (id: number) => void;
}

const StaffForm: React.FC<Props> = ({ data, onAdd, onRemove }) => {
    const [formState, setFormState] = useState({
        nome: '', cpf: '', whatsapp: '', email: '', matricula: '', cargo: '', atribuicao: '', appAutorizado: false, temFilho: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormState(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>, formatter: (val: string) => string) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: formatter(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { nome, cpf, whatsapp, email, matricula, cargo } = formState;
        if (!nome || !cpf || !whatsapp || !email || !matricula || !cargo) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        onAdd(formState);
        setFormState({ nome: '', cpf: '', whatsapp: '', email: '', matricula: '', cargo: '', atribuicao: '', appAutorizado: false, temFilho: false });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <FormSection title="Cadastro de Funcionário">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Nome Completo" name="nome" value={formState.nome} onChange={handleChange} required placeholder="Ex: Ana Costa" />
                        <Input label="CPF" name="cpf" value={formState.cpf} onChange={(e) => handleFormattedChange(e, formatarCPF)} required placeholder="000.000.000-00" maxLength={14} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="WhatsApp" type="tel" name="whatsapp" value={formState.whatsapp} onChange={(e) => handleFormattedChange(e, formatarTelefone)} required placeholder="(00) 00000-0000" maxLength={15} />
                        <Input label="Email" type="email" name="email" value={formState.email} onChange={handleChange} required placeholder="exemplo@escola.com" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Matrícula do Servidor" name="matricula" value={formState.matricula} onChange={handleChange} required placeholder="Ex: FUNC001" />
                        <Select label="Cargo" name="cargo" value={formState.cargo} onChange={handleChange} required>
                            <option value="">Selecione...</option>
                            <option value="professor">Professor(a)</option>
                            <option value="coordenador">Coordenador(a)</option>
                            <option value="diretor">Diretor(a)</option>
                            <option value="secretario">Secretário(a)</option>
                            <option value="auxiliar">Auxiliar</option>
                            <option value="servicos_gerais">Serviços Gerais</option>
                            <option value="porteiro">Porteiro(a)</option>
                            <option value="outro">Outro</option>
                        </Select>
                    </div>
                    <Input label="Atribuição/Função" name="atribuicao" value={formState.atribuicao} onChange={handleChange} placeholder="Ex: Professora de Matemática - Ensino Fundamental" />
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
                        <div className="flex items-center">
                            <input id="appAutorizado" name="appAutorizado" type="checkbox" checked={formState.appAutorizado} onChange={handleChange} className="h-4 w-4 text-brand-secondary border-gray-300 rounded focus:ring-brand-accent"/>
                            <label htmlFor="appAutorizado" className="ml-2 block text-sm text-gray-900">Autorizado a usar o aplicativo da escola</label>
                        </div>
                        <div className="flex items-center">
                            <input id="temFilho" name="temFilho" type="checkbox" checked={formState.temFilho} onChange={handleChange} className="h-4 w-4 text-brand-secondary border-gray-300 rounded focus:ring-brand-accent"/>
                            <label htmlFor="temFilho" className="ml-2 block text-sm text-gray-900">Tem filho(s) estudando na escola</label>
                        </div>
                    </div>
                    <div className="flex justify-end">
                         <Button type="submit" variant="success">
                            <SaveIcon className="mr-2 h-5 w-5" />
                            Salvar Funcionário
                        </Button>
                    </div>
                </form>
            </FormSection>

            <FormSection title="Funcionários Cadastrados">
                <Table headers={['Nome', 'Matrícula', 'Cargo', 'App Autorizado', 'Ações']} emptyMessage="Nenhum funcionário cadastrado ainda" itemCount={data.length}>
                    {data.map(func => (
                        <tr key={func.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{func.nome}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{func.matricula}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{func.cargo}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${func.appAutorizado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {func.appAutorizado ? 'Sim' : 'Não'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button variant="danger" onClick={() => onRemove(func.id)} className="px-3 py-1 text-xs">
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

export default StaffForm;