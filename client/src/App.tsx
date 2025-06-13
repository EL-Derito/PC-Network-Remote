import React, { useState } from "react";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import RecoverPassword from "@/pages/recover";
import Dashboard from "@/pages/dashboard";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  const [page, setPage] = useState<"login" | "signup" | "recover" | "dashboard">("login");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
    setPage("dashboard");
  };
  const handleLogout = () => {
    setLoggedIn(false);
    setPage("login");
  };
  const handleSignup = () => setPage("login");
  const handleRecover = () => setPage("login");
  const handleBack = () => setPage("login");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {page === "login" && (
          <Login
            onLogin={handleLogin}
            onSignup={() => setPage("signup")}
            onRecover={() => setPage("recover")}
          />
        )}
        {page === "signup" && <Signup onSignup={handleSignup} onBack={handleBack} />}
        {page === "recover" && <RecoverPassword onRecover={handleRecover} onBack={handleBack} />}
        {page === "dashboard" && loggedIn && <Dashboard onLogout={handleLogout} />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
