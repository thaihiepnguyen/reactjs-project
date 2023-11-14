import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/redux/provider";
import AuthProvider from "./components/AuthProvider";
import Index from "@/app/components/Navbar/Navbar";
import CircularProgress from "@/app/components/CircularProgress";
import StyledComponentsRegistry from "@/lib/registry";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Classroom Application",
  description: "Advanced Web - KHTN CLC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>
          <Providers>
            <StyledComponentsRegistry>
              <CircularProgress />
              <Index></Index>
              {children}
            </StyledComponentsRegistry>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
