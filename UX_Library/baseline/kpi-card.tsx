import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        type: "positive" | "negative" | "neutral";
        label?: string;
    };
    children?: React.ReactNode;
    className?: string;
}

/**
 * Componente Maestro de Tarjeta KPI
 * Sigue las reglas de la Guía de Identidad de BoardFlow:
 * - Alineación a la izquierda obligatoria.
 * - Padding interno p-6 (24px).
 * - Iconografía en color Secondary/Blue por defecto.
 */
export function KpiCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    children,
    className
}: KpiCardProps) {
    return (
        <Card className={cn(
            "h-full border border-border shadow-none rounded-2xl bg-card overflow-hidden p-6 hover:shadow-sm transition-shadow",
            className
        )}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-[13px] font-medium text-muted-foreground">{title}</span>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                {(value !== "" && value !== undefined && value !== null) && (
                    <>
                        <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
                        {description && (
                            <p className="text-[11px] text-muted-foreground font-medium">{description}</p>
                        )}
                    </>
                )}
                {children}
                {trend && (
                    <p className={cn(
                        "text-[11px] font-medium flex items-center gap-1 mt-2",
                        trend.type === "positive" ? "text-green-600" : trend.type === "negative" ? "text-red-500" : "text-amber-500"
                    )}>
                        {trend.value} {trend.label}
                    </p>
                )}
            </div>
        </Card>
    );
}
