import type { Metadata } from "next";
import "./globals.css";
import { AlertProvider } from "@/components/Alert";

export const metadata: Metadata = {
  title: "House Daybook",
  description: "House daybook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  );
}
