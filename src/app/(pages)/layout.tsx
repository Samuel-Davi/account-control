
import { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "../contexts/AuthContext";


export const metadata: Metadata = {
  title: "Roxyall Control",
  icons:{
    icon: {
      url: "/favicon2.png?v=1",
      sizes: "128x128"
    }
  }
}

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
