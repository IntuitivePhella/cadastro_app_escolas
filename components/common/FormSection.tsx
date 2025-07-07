
import React from 'react';

interface FormSectionProps {
    title: string;
    children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4">{title}</h2>
            {children}
        </div>
    );
};

export default FormSection;
