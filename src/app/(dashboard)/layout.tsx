"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Layout, message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectJustLoggedIn, setJustLoggedIn } from "@/lib/store/features/auth/authSlice";

const MessageContext = createContext<MessageInstance | null>(null);

export function useMessage() {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessage must be used within DashboardLayout");
  return ctx;
}

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const justLoggedIn = useAppSelector(selectJustLoggedIn);
  const loginMsgShown = useRef(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (justLoggedIn && !loginMsgShown.current) {
      loginMsgShown.current = true;
      dispatch(setJustLoggedIn(false));
      messageApi.open({ type: "success", content: "Đăng nhập thành công!" });
    }
  }, [justLoggedIn, dispatch, messageApi]);

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
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
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
    </MessageContext.Provider>
  );
}
