import type { Metadata } from "next";
import { Londrina_Solid } from "next/font/google";
import "./globals.css";

const londrinaSolid = Londrina_Solid({
  variable: "--font-londrina-solid",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "SCOREBEATABLE",
  description: "the website where you see your scores so you can beat them",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${londrinaSolid.variable}`}>
      <body>{children}</body>
    </html>
  );
}
