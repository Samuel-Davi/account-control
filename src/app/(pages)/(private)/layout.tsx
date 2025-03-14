'use client'

import "../../styles/globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import Header from "@/app/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
      <div>
        <Header></Header>
        <AuthProvider>
          {children}
        </AuthProvider>
      </div>
  );
}
