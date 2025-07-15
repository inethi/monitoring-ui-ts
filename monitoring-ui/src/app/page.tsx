"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import LoginForm from "@/components/ui/LoginForm";
import RegisterForm from "@/components/ui/RegisterForm";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        router.replace("/dashboard");
      }, 400); // match the animation duration
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, loading, router]);

  if (!isAuthenticated)
    return (
      <div
        className={`transition-opacity duration-400 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {showRegister ? (
          <RegisterForm onSwitch={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitch={() => setShowRegister(true)} />
        )}
      </div>
    );
  return null;
}
