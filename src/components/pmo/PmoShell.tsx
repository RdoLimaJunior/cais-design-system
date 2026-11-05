import type { ReactNode } from "react";
import { AppLayout } from "../farol/AppLayout";
import { TooltipProvider } from "../ui/tooltip";
import type { BreadcrumbItem } from "../farol/PageBreadcrumb";
import { PMO_ROLE_LABELS, pmoNavItemsFor, type PmoRole } from "./navigation";

interface PmoShellProps {
  activeHref: string;
  breadcrumb: BreadcrumbItem[];
  role?: PmoRole;
  userName?: string;
  children: ReactNode;
}

/** Casca das telas do CAIS PMO: menu lateral do design system, com os itens do papel ativo. */
export function PmoShell({
  activeHref,
  breadcrumb,
  role = "GESTOR",
  userName = "Ana Gestora",
  children,
}: PmoShellProps) {
  return (
    <TooltipProvider>
      <AppLayout
        frame="home"
        breadcrumb={breadcrumb}
        breadcrumbVariant="plain"
        activeHref={activeHref}
        userName={userName}
        userRole={PMO_ROLE_LABELS[role]}
        navItems={pmoNavItemsFor(role)}
        systemName="CAIS PMO"
        homeHref="/app/dashboard"
        profileHref="/app/config"
        hasRoleToggle={false}
        role="admin"
      >
        {children}
      </AppLayout>
    </TooltipProvider>
  );
}
