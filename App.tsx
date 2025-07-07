import React, { useState, useMemo, useCallback } from 'react';
import { Aluno, Responsavel, Funcionario, Vinculo, TabID, AppData } from './types';
import { exportDataAsCsv } from './services/csvExporter';
import StudentForm from './components/StudentForm';
import GuardianForm from './components/GuardianForm';
import StaffForm from './components/StaffForm';
import LinkForm from './components/LinkForm';
import Summary from './components/Summary';
import Modal from './components/Modal';
import { BookOpenIcon, UsersIcon, BriefcaseIcon, LinkIcon, ChartBarIcon, InformationCircleIcon } from './components/Icons';
import Input from './components/common/Input';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabID>('alunos');
    const [data, setData] = useState<AppData>({
        alunos: [],
        responsaveis: [],
        funcionarios: [],
        vinculos: []
    });
    const [modal, setModal] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
    const [inepCode, setInepCode] = useState('');

    const showModal = (message: string) => {
        setModal({ show: true, message });
    };

    const addAluno = (aluno: Omit<Aluno, 'id'>) => {
        setData(prev => ({ ...prev, alunos: [...prev.alunos, { ...aluno, id: Date.now() }] }));
        showModal('Aluno cadastrado com sucesso!');
    };

    const removeAluno = (id: number) => {
        if (window.confirm('Tem certeza que deseja remover este aluno? Seus vínculos também serão removidos.')) {
            setData(prev => ({
                ...prev,
                alunos: prev.alunos.filter(a => a.id !== id),
                vinculos: prev.vinculos.filter(v => v.alunoId !== String(id))
            }));
        }
    };
    
    const addResponsavel = (responsavel: Omit<Responsavel, 'id'>) => {
        setData(prev => ({ ...prev, responsaveis: [...prev.responsaveis, { ...responsavel, id: Date.now() }] }));
        showModal('Responsável cadastrado com sucesso!');
    };
    
    const removeResponsavel = (id: number) => {
        if (window.confirm('Tem certeza que deseja remover este responsável? Seus vínculos também serão removidos.')) {
            setData(prev => ({
                ...prev,
                responsaveis: prev.responsaveis.filter(r => r.id !== id),
                vinculos: prev.vinculos.filter(v => !(v.tipo === 'responsavel' && v.pessoaId === String(id)))
            }));
        }
    };

    const addFuncionario = (funcionario: Omit<Funcionario, 'id'>) => {
        setData(prev => ({ ...prev, funcionarios: [...prev.funcionarios, { ...funcionario, id: Date.now() }] }));
        showModal('Funcionário cadastrado com sucesso!');
    };

    const removeFuncionario = (id: number) => {
         if (window.confirm('Tem certeza que deseja remover este funcionário? Seus vínculos também serão removidos.')) {
            setData(prev => ({
                ...prev,
                funcionarios: prev.funcionarios.filter(f => f.id !== id),
                vinculos: prev.vinculos.filter(v => !(v.tipo === 'funcionario' && v.pessoaId === String(id)))
            }));
        }
    };
    
    const addVinculo = (vinculo: Omit<Vinculo, 'id'>) => {
        setData(prev => ({ ...prev, vinculos: [...prev.vinculos, { ...vinculo, id: Date.now() }] }));
        showModal('Vínculo criado com sucesso!');
    };
    
    const removeVinculo = (id: number) => {
        if (window.confirm('Tem certeza que deseja remover este vínculo?')) {
            setData(prev => ({ ...prev, vinculos: prev.vinculos.filter(v => v.id !== id) }));
        }
    };

    const handleExport = useCallback(() => {
        if (!inepCode.trim()) {
            alert('Por favor, preencha o Código INEP da Escola antes de exportar.');
            return;
        }
        try {
            exportDataAsCsv(data, inepCode.trim());
            showModal('Planilha exportada com sucesso no formato para importação!');
        } catch (error) {
            console.error("Erro ao exportar dados:", error);
            showModal('Ocorreu um erro ao gerar a planilha.');
        }
    }, [data, inepCode]);


    const TABS = useMemo(() => [
        { id: 'alunos', label: 'Alunos', icon: <BookOpenIcon /> },
        { id: 'responsaveis', label: 'Responsáveis', icon: <UsersIcon /> },
        { id: 'funcionarios', label: 'Funcionários', icon: <BriefcaseIcon /> },
        { id: 'vinculos', label: 'Vínculos', icon: <LinkIcon /> },
        { id: 'resumo', label: 'Resumo', icon: <ChartBarIcon /> },
    ], []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'alunos':
                return <StudentForm data={data.alunos} onAdd={addAluno} onRemove={removeAluno} />;
            case 'responsaveis':
                return <GuardianForm data={data.responsaveis} onAdd={addResponsavel} onRemove={removeResponsavel} />;
            case 'funcionarios':
                return <StaffForm data={data.funcionarios} onAdd={addFuncionario} onRemove={removeFuncionario} />;
            case 'vinculos':
                return <LinkForm data={data} onAdd={addVinculo} onRemove={removeVinculo} />;
            case 'resumo':
                return <Summary data={data} onExport={handleExport} />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-300/30 overflow-hidden">
                <header className="p-6 md:p-8 bg-gray-50 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-brand-primary tracking-tight text-center">Cadastro para Sistema Max Escola Segura</h1>
                    <p className="text-center text-gray-500 mt-2">
                        Preencha os dados com calma. Campos com <span className="text-brand-danger font-semibold">*</span> são obrigatórios.
                    </p>
                    <div className="max-w-md mx-auto mt-6">
                        <Input
                            label="Código INEP da Escola"
                            id="inepCode"
                            value={inepCode}
                            onChange={(e) => setInepCode(e.target.value)}
                            required
                            placeholder="Digite o código INEP de 8 dígitos"
                        />
                    </div>
                </header>

                <main className="p-6 md:p-8">
                    <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md mb-8 flex items-start">
                        <InformationCircleIcon className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <strong className="font-semibold">Dica:</strong> Preencha uma aba por vez. O sistema foi projetado para um fluxo de trabalho sequencial para garantir a integridade dos dados.
                        </div>
                    </div>

                    <div className="border-b border-gray-200 mb-8">
                        <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabID)}
                                    className={`
                                        ${activeTab === tab.id
                                            ? 'border-brand-secondary text-brand-secondary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                        group inline-flex items-center py-4 px-1 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 rounded-t-md
                                    `}
                                >
                                    {React.cloneElement(tab.icon, { className: 'h-5 w-5 mr-2' })}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        {renderTabContent()}
                    </div>
                </main>
            </div>
             <Modal
                show={modal.show}
                onClose={() => setModal({ show: false, message: '' })}
                message={modal.message}
            />
            <footer className="text-center text-gray-400 text-sm mt-8">
                <p>&copy; {new Date().getFullYear()} Sistema de Cadastro Escolar. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default App;