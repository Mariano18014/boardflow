import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface SidebarProps {
    items: NavItem[];
    currentLocation: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    appName: string;
    logoSrc: string;
    userProfileSlot?: React.ReactNode;
}

/**
 * Sidebar maestro de BoardFlow
 * Soporta variantes Light/Dark y estado colapsado.
 * Implementa las reglas de branding de la Guía de Identidad.
 */
export function Sidebar({
    items,
    currentLocation,
    isCollapsed,
    onToggleCollapse,
    appName,
    logoSrc,
    userProfileSlot
}: SidebarProps) {
    return (
        <aside
            className={cn(
                "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-screen sticky top-0 overflow-y-auto scrollbar-hide transition-all duration-300 shadow-[2px_0_8px_rgba(0,0,0,0.08)]",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Branding Area */}
            <div className={cn("p-6 flex flex-col items-center gap-2 transition-opacity duration-300", isCollapsed ? "px-2" : "p-6")}>
                <div className="relative group transition-all duration-300 rounded-2xl border border-transparent bg-transparent p-0 dark:bg-card/70 dark:border-border dark:p-3">
                    <img
                        src={logoSrc}
                        alt="Product Logo"
                        className={cn("w-auto object-contain transition-all duration-300", isCollapsed ? "h-10" : "h-[90px] dark:h-[70px]")}
                    />
                </div>
                {!isCollapsed && (
                    <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-500">
                        <span className="block text-[15px] font-heading font-bold text-foreground tracking-wide notranslate">
                            {appName}
                        </span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <TooltipProvider delayDuration={0}>
                <nav className="flex-1 px-3 py-6 space-y-1.5">
                    {items.map((item) => {
                        const isActive = currentLocation === item.href;

                        const NavContent = (
                            <div
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl text-sm transition-all duration-200 cursor-pointer overflow-hidden",
                                    isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 py-2.5",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold"
                                        : "text-muted-foreground font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4 flex-none transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                            </div>
                        );

                        return (
                            <Link key={item.href} href={item.href}>
                                {isCollapsed ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>{NavContent}</TooltipTrigger>
                                        <TooltipContent side="right" className="font-heading font-semibold text-xs py-1.5">
                                            {item.label}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : NavContent}
                            </Link>
                        );
                    })}
                </nav>
            </TooltipProvider>

            {/* Collapse Toggle */}
            <div className="hidden lg:block px-4 pb-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-8 hover:bg-sidebar-accent text-muted-foreground"
                    onClick={onToggleCollapse}
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* User slot */}
            {userProfileSlot && (
                <div className="mt-auto">
                    {userProfileSlot}
                </div>
            )}
        </aside>
    );
}
