import { useState } from 'react';
import { supabase, testConnection } from '../../lib/supabase';
import { ICONS } from '../../utils/icons';

export default function TestSupabase() {
    const [status, setStatus] = useState('idle'); // idle, testing, success, error
    const [message, setMessage] = useState('');

    const handleTest = async () => {
        setStatus('testing');
        setMessage('Testando conexão...');

        const result = await testConnection();

        if (result.success) {
            setStatus('success');
            setMessage(`✅ ${result.message}`);
        } else {
            setStatus('error');
            setMessage(`❌ Erro: ${result.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)]">
                <h1 className="text-3xl font-bold text-[var(--color-brand)] mb-6 flex items-center gap-3">
                    <ICONS.SETTINGS className="text-4xl" />
                    Teste de Conexão Supabase
                </h1>

                <div className="space-y-4">
                    <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                        <h2 className="font-bold mb-2 text-[var(--text-primary)]">Status da Configuração:</h2>
                        <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                            <li>
                                {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}
                                {' '}VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? 'Configurado' : 'Não encontrado'}
                            </li>
                            <li>
                                {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}
                                {' '}VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurado' : 'Não encontrado'}
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleTest}
                        disabled={status === 'testing'}
                        className="w-full py-3 px-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-lg shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {status === 'testing' ? (
                            <>
                                <ICONS.WAIT className="animate-spin" />
                                Testando...
                            </>
                        ) : (
                            <>
                                <ICONS.CONFIRM />
                                Testar Conexão
                            </>
                        )}
                    </button>

                    {message && (
                        <div className={`p-4 rounded-lg ${status === 'success' ? 'bg-green-500/20 border border-green-500' :
                            status === 'error' ? 'bg-red-500/20 border border-red-500' :
                                'bg-[var(--bg-secondary)]'
                            }`}>
                            <p className={`font-medium ${status === 'success' ? 'text-green-400' :
                                status === 'error' ? 'text-red-400' :
                                    'text-[var(--text-primary)]'
                                }`}>
                                {message}
                            </p>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                        <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                            <ICONS.WAIT />
                            Próximos Passos:
                        </h3>
                        <ol className="text-sm text-[var(--text-secondary)] space-y-1 list-decimal list-inside">
                            <li>Edite o arquivo <code className="bg-black/30 px-1 rounded">.env.local</code></li>
                            <li>Cole sua URL e Anon Key do Supabase</li>
                            <li>Reinicie o servidor (Ctrl+C e <code className="bg-black/30 px-1 rounded">npm run dev</code>)</li>
                            <li>Volte aqui e clique em "Testar Conexão"</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
