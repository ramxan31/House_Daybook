"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import Login from "@/components/Login";
import { apiClient } from "@/lib/apiClient";
import { UserProfile } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await apiClient.getMe();
          if (user) {
            setUserProfile(user);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error("Session expired or invalid", e);
          localStorage.removeItem("authToken");
        }
      }
      setIsAuthChecking(false);
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await apiClient.logout();

    setIsAuthenticated(false);
    setUserProfile({
      email: "",
      id: "",
      name: "",
    });
  };

  const handleLogin = (newProfile: UserProfile) => {
    if (newProfile) {
      setUserProfile(newProfile);
    }
    setIsAuthenticated(true);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-900">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
      </div>
    );
  }

  // If not authenticated, show Login screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard user={userProfile} handleLogout={handleLogout} />;
};

export default Home;
