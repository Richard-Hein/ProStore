import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import {ThemeProvider} from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: {
    template: "%s | Prostore",
    default: APP_NAME
  },
 
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={` ${inter.className} antialiased`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="light" enableSystem disableTransitionOnChange>
        {children}
        <Toaster/>

        </ThemeProvider>
      </body>
    </html>
  );
}
