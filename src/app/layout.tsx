import type { Metadata } from "next";
import { Londrina_Solid, Noto_Sans, Rubik, Rubik_Mono_One } from "next/font/google";
import "./globals.css";

const londrinaSolid = Londrina_Solid({
  variable: "--font-londrina-solid",
  subsets: ["latin"],
  weight: "400",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: "400",
})

const rubikBlack = Rubik({
  variable: "--font-rubik-black",
  subsets: ["latin"],
  weight: "900",
});

const rubikMonoOne = Rubik_Mono_One({
  variable: "--font-rubik-mono-one",
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
    <html lang="en" className={`${londrinaSolid.variable} ${notoSans.variable} ${rubikBlack.variable} ${rubikMonoOne.variable}`}>
      <body>{children}</body>
    </html>
  );
}
