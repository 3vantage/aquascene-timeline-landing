import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from 'next/font/google';
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const sourceSans = Source_Sans_3({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-source-sans-pro',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Aquascene - Professional Aquascaping Services Bulgaria",
  description: "Bulgaria's premier professional aquascaping company. Authorized Green Aqua partner. Custom design, installation & maintenance services. Sofia, Bulgaria.",
  keywords: "aquascaping Bulgaria, professional aquascaping, Green Aqua partner, aquarium design Sofia, aquascape installation, aquarium maintenance",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`antialiased ${inter.variable} ${sourceSans.variable} overflow-x-hidden`}>
        {/* Skip Navigation Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:font-medium focus:shadow-lg focus:border-2 focus:border-primary"
        >
          Skip to main content
        </a>
        
        {/* Main content */}
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}