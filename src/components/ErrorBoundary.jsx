import React from 'react';
import { showToast } from '../utils/toasts';

/**
 * 🛡️ ErrorBoundary: Evita que o app inteiro fique branco em caso de erro.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("🔴 [CRITICAL ERROR]:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] p-8 text-center">
                    <div className="max-w-md w-full bg-[#161618] border border-red-900/50 p-8 rounded-2xl shadow-2xl">
                        <h1 className="text-4xl mb-4">🧙‍♂️</h1>
                        <h2 className="text-2xl font-bold text-red-500 mb-2">Um feitiço deu errado!</h2>
                        <p className="text-gray-400 mb-6">
                            O sistema encontrou um erro crítico e não pôde continuar.
                        </p>
                        <div className="bg-black/50 p-4 rounded-lg text-left text-xs font-mono text-red-400 mb-6 overflow-auto max-h-40">
                            {this.state.error?.toString()}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Tentar Recarregar o Reino
                        </button>
                        <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest">
                            Modo de Recuperação Ativado
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
