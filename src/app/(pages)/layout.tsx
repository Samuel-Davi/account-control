
import { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "../contexts/AuthContext";


export const metadata: Metadata = {
  title: "Roxyall Control"
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
