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
    <html lang="en" className="h-screen">
      <body
        className='antialiased'
      >
        <Header></Header>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
