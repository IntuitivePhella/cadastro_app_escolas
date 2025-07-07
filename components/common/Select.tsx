
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, required, children, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-brand-danger">*</span>}
            </label>
            <select
                {...props}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                {children}
            </select>
        </div>
    );
};

export default Select;
