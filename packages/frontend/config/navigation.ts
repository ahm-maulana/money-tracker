import {
  ChartNoAxesColumn,
  ChartPie,
  LayoutDashboard,
  LucideProps,
  Receipt,
  Wallet,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface NavItem {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

// Menu items.
export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Receipt,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: ChartPie,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Wallets",
    url: "/wallets",
    icon: Wallet,
  },
];
