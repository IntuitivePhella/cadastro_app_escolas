
import React, { useMemo } from 'react';
import { AppData } from '../types';
import { DownloadIcon, BookOpenIcon, UsersIcon, BriefcaseIcon } from './Icons';
import FormSection from './common/FormSection';
import Button from './common/Button';

interface Props {
    data: AppData;
    onExport: () => void;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 ${color}`}>
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-lg font-medium text-white">{title}</p>
            <p className="text-4xl font-bold text-white">{value}</p>
        </div>
    </div>
);


const Summary: React.FC<Props> = ({ data, onExport }) => {
    const { alunos, responsaveis, funcionarios, vinculos } = data;

    const progress = useMemo(() => {
        const totalSteps = 4;
        let completedSteps = 0;
        if (alunos.length > 0) completedSteps++;
        if (responsaveis.length > 0 || funcionarios.some(f => f.temFilho)) completedSteps++;
        if (funcionarios.length > 0) completedSteps++;
        if (vinculos.length > 0) completedSteps++;
        
        return Math.round((completedSteps / totalSteps) * 100);
    }, [alunos, responsaveis, funcionarios, vinculos]);

    return (
        <div className="animate-fadeIn">
            <FormSection title="Resumo dos Cadastros">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <StatCard title="Alunos" value={alunos.length} icon={<BookOpenIcon className="h-12 w-12 text-white/70" />} color="bg-gradient-to-br from-blue-500 to-blue-600" />
                    <StatCard title="Responsáveis" value={responsaveis.length} icon={<UsersIcon className="h-12 w-12 text-white/70" />} color="bg-gradient-to-br from-purple-500 to-purple-600" />
                    <StatCard title="Funcionários" value={funcionarios.length} icon={<BriefcaseIcon className="h-12 w-12 text-white/70" />} color="bg-gradient-to-br from-teal-500 to-teal-600" />
                </div>

                <div className="mb-12">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Progresso do Preenchimento</h3>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-brand-success h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">{progress}% concluído</p>
                </div>

                <div className="text-center bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Pronto para finalizar?</h3>
                    <p className="text-gray-600 mt-2 mb-4 max-w-2xl mx-auto">
                        Clique no botão abaixo para baixar a planilha completa no formato .csv, pronta para ser importada no sistema da escola.
                    </p>
                    <Button onClick={onExport} variant="primary">
                        <DownloadIcon className="mr-2 h-5 w-5" />
                        Baixar Planilha Completa
                    </Button>
                </div>
            </FormSection>
        </div>
    );
};

export default Summary;
