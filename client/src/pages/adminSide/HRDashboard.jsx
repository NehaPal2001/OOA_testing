import React, { useState } from "react";
import {
  Home,
  Users,
  FileText,
  Settings,
  User,
  LogOut,
  FileQuestion,
  FileVideo2,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/common/ui/sheet";
import { Button } from "@/components/common/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
} from "@/components/common/ui/sidebar";

import AddCandidateDialog from "./AddCandidate";
import Assessments from "./Assesment/AssesmentMain";
import Questions from "./Question/Question";
import AdminProctorDashboard from "./AdminProctoring";
import Candidates from "./Candidate/Candidates";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: Home,
    tab: "dashboard",
  },
  {
    title: "Candidates",
    icon: Users,
    tab: "candidates",
  },
  {
    title: "Assessments",
    icon: FileText,
    tab: "assessments",
  },
  {
    title: "Questions",
    icon: FileQuestion,
    tab: "questions",
  },
  // {
  //   title: "Settings",
  //   icon: Settings,
  //   tab: "settings",
  // },
  {
    title: "AdminProctorDashboard",
    icon: FileVideo2,
    tab: "adminProctor",
  },
];

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isAdmin = userInfo.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-10 bg-gray-100 h-full">
            <h1 className="text-3xl font-bold mb-6 font-sans tracking-tight text-blue-800">
              Dashboard Overview
            </h1>

            {isAdmin && (
              <div className="mb-4">
                <AddCandidateDialog />
              </div>
            )}
          </div>
        );
      case "candidates":
        return (
          <div className="p-10 bg-gray-100 h-full">
            <Candidates />
          </div>
        );
      case "assessments":
        return (
          <div className="p-8 bg-gray-100 h-full">
            <Assessments />
          </div>
        );
      case "questions":
        return (
          <div className="p-8 bg-gray-100 h-full">
            <Questions />
          </div>
        );
      case "adminProctor":
        return (
          <div className="p-8 bg-gray-100">
            <AdminProctorDashboard />
          </div>
        );
      case "settings":
        return (
          <div className="p-10 bg-gray-100 h-full">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            {/* Add settings content here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider className="flex w-screen h-screen bg-gray-100">
      <Sidebar className="border-r w-[280px] bg-white">
        <SidebarContent>
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-blue-800">SDET Dashboard</h1>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem
                    key={item.tab}
                    active={activeTab === item.tab}
                  >
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.tab)}
                      className={activeTab === item.tab ? "bg-blue-100" : ""}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mt-auto border-t">
          <Sheet>
            <SheetTrigger asChild>
              <SidebarMenuButton>
                <User className="mr-2 h-2 w-4" />
                {userInfo.name || "User Profile"}
              </SidebarMenuButton>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>User Profile</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="font-medium">Name</p>
                  <p>{userInfo.fullName}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p>{userInfo.email}</p>
                </div>
                <div>
                  <p className="font-medium">Role</p>
                  <p>{userInfo.role}</p>
                </div>
                <Button
                  variant="destructive"
                  className="w-full mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </SidebarProvider>
  );
};

export default HRDashboard;
