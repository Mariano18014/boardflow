import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

const SHOW_ERROR_DETAILS = import.meta.env.MODE !== "production";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950/20 p-4">
                    <div className="bg-card p-6 rounded-lg shadow-lg max-w-2xl w-full border border-red-200 dark:border-red-900">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <AlertCircle className="h-8 w-8" />
                            <h1 className="text-2xl font-bold">Algo salió mal</h1>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Se ha producido un error inesperado en la aplicación. Por favor, reporta este error al administrador.
                        </p>
                        {SHOW_ERROR_DETAILS && this.state.error && (
                            <div className="bg-slate-900 text-slate-50 p-4 rounded-md overflow-x-auto text-sm font-mono mb-4">
                                <strong>Error:</strong> {this.state.error.toString()}
                            </div>
                        )}
                        {SHOW_ERROR_DETAILS && this.state.errorInfo && (
                            <details className="bg-muted/50 p-4 rounded-md text-xs text-foreground/90 font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
                                <summary className="cursor-pointer font-bold mb-2">Ver detalles del stack trace</summary>
                                {this.state.errorInfo.componentStack}
                            </details>
                        )}
                        <button
                            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Recargar página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
