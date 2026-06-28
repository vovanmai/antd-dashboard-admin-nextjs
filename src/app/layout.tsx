import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StoreProvider from "@/components/StoreProvider";
import MessageProvider from "@/components/MessageProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Modern admin dashboard built with Next.js and Ant Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <StoreProvider>
          <AntdRegistry>
            <MessageProvider>{children}</MessageProvider>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
