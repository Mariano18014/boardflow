import * as React from "react";
import { cn } from "@/lib/utils";

interface LayoutShellProps {
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    fullWidth?: boolean;
}

/**
 * Layout shell maestro de BoardFlow
 * Define la estructura global de la aplicación.
 * Sigue la regla de max-w-7xl para contenido centrado p-8.
 */
export function LayoutShell({
    sidebar,
    header,
    children,
    footer,
    fullWidth = false
}: LayoutShellProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Mobile Header (reutiliza el header si existe o se define ad-hoc) */}
            {header}

            {/* Desktop Sidebar */}
            {sidebar}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 bg-muted/30 min-h-screen">
                <div className={cn(
                    "mx-auto px-4 md:px-8 pb-32",
                    fullWidth ? "max-w-none" : "max-w-7xl"
                )}>
                    {children}
                </div>

                {/* Global Footer */}
                {footer}
            </main>
        </div>
    );
}

/**
 * Footer maestro de BoardFlow
 */
export function Footer({ appName = "BoardFlow" }: { appName?: string }) {
    return (
        <footer className="w-full border-t border-border py-8 bg-background/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-[11px] text-muted-foreground notranslate">
                    © {new Date().getFullYear()} {appName} — Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}
