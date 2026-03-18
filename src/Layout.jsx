import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Syringe, 
  Package, 
  TrendingUp,
  PawPrint,
  DollarSign,
  UserCog,
  Megaphone
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Escala", url: createPageUrl("Escala"), icon: Calendar },
  { title: "Financeiro", url: createPageUrl("Financeiro"), icon: DollarSign },
  { title: "Marketing", url: createPageUrl("Marketing"), icon: Megaphone },
  { title: "Produtos", url: createPageUrl("Produtos"), icon: Package },
  { title: "Veterinário", url: createPageUrl("Veterinario"), icon: Syringe },
  { title: "Clientes", url: createPageUrl("Clientes"), icon: Users },
  { title: "Animais", url: createPageUrl("Animais"), icon: PawPrint },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-slate-100">
        <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
          <SidebarHeader className="p-4 border-b">
            <h2 className="font-bold text-lg text-slate-800">Petsoft</h2>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={location.pathname === item.url} 
                          className="group h-10 w-full justify-start hover:bg-slate-100"
                        >
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center lg:hidden">
             <SidebarTrigger />
             <span className="font-bold ml-2">Petsoft</span>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}