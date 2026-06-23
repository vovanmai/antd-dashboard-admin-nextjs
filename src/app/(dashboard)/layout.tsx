"use client";

import { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setIsMobile(mobile);
      if (tablet) setCollapsed(true);
      if (window.innerWidth >= 1024) setCollapsed(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen((o) => !o);
    } else {
      setCollapsed((c) => !c);
    }
  };

  const marginLeft = isMobile ? 0 : collapsed ? 70 : 256;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Layout
        style={{
          marginLeft,
          transition: "margin-left 0.2s",
          minWidth: 0,
        }}
      >
        <Header
          collapsed={collapsed}
          isMobile={isMobile}
          onToggle={handleToggle}
        />
        <Content
          style={{
            background: "#f5f6fa",
            minHeight: "calc(100vh - 64px)",
            padding: isMobile ? 12 : 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
