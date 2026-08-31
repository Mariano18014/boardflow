import { LayoutDashboard, ShieldCheck, Users, Workflow, type LucideIcon } from "lucide-react";

export type LandingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const landingFeatures: LandingFeature[] = [
  {
    icon: Workflow,
    title: "Sprints con time-box",
    description:
      "Planificá sprints con fechas claras y seguí el avance de tu equipo sin salir del tablero.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableros Scrum visuales",
    description:
      "Organizá el backlog y las tareas en columnas simples de entender, de un vistazo.",
  },
  {
    icon: Users,
    title: "Multi-organización",
    description:
      "Un mismo usuario puede pertenecer a varias organizaciones, cada una con sus propios proyectos.",
  },
  {
    icon: ShieldCheck,
    title: "Roles y permisos",
    description:
      "Definí quién puede ver o hacer qué con roles dinámicos y permisos granulares por organización.",
  },
];
