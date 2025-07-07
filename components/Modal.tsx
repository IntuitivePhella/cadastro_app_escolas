
import React, { useEffect } from 'react';
import { CheckCircleIcon } from './Icons';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    message: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, message }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (show) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [show, onClose]);

    if (!show) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="relative mx-auto p-8 border w-full max-w-md shadow-lg rounded-xl bg-white animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckCircleIcon className="h-10 w-10 text-brand-success" />
                    </div>
                    <h3 className="text-xl leading-6 font-semibold text-gray-900">Sucesso!</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-gray-600">{message}</p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-brand-success text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
