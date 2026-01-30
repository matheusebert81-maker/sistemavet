
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Aqui você poderia enviar para um serviço de log como Sentry
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-lg text-center border border-slate-100">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <i className="fas fa-bug"></i>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Ops! Algo deu errado.</h1>
            <p className="text-slate-500 mb-6">
              O sistema encontrou uma instabilidade inesperada. Seus dados estão salvos localmente.
              Por favor, recarregue a página.
            </p>
            {this.state.error && (
                <div className="bg-slate-100 p-4 rounded-xl text-left mb-6 overflow-auto max-h-32">
                    <code className="text-[10px] text-slate-600 font-mono">
                        {this.state.error.toString()}
                    </code>
                </div>
            )}
            <button 
              onClick={this.handleReload}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Recarregar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
