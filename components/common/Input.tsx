
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    required?: boolean;
    helpText?: string;
}

const Input: React.FC<InputProps> = ({ label, required, helpText, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-brand-danger">*</span>}
            </label>
            <input
                {...props}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
        </div>
    );
};

export default Input;
