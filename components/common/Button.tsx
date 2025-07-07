
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'success' | 'danger' | 'secondary';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200";

    const variantClasses = {
        primary: "bg-brand-secondary hover:bg-blue-800 focus:ring-brand-accent",
        success: "bg-brand-success hover:bg-green-700 focus:ring-green-500",
        danger: "bg-brand-danger hover:bg-red-700 focus:ring-red-500",
        secondary: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500",
    };

    return (
        <button {...props} className={`${baseClasses} ${variantClasses[variant]}`}>
            {children}
        </button>
    );
};

export default Button;
