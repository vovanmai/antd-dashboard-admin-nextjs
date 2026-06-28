"use client";

import { useState } from "react";
import { Layout, Menu, Typography, Avatar, Drawer } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  ShopOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { selectCurrentUser, setCurrentUser } from "@/lib/store/features/auth/authSlice";
import globalMessage from "@/lib/message";
import { authApi } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/axiosClient";

const { Sider } = Layout;
const { Text } = Typography;

const menuKeyMap: Array<{ prefix: string; key: string }> = [
  { prefix: "/users", key: "/users" },
  { prefix: "/orders", key: "/orders" },
  { prefix: "/products", key: "/products" },
];

function getSelectedKey(pathname: string): string {
  const match = menuKeyMap.find((m) => pathname.startsWith(m.prefix));
  return match ? match.key : pathname;
}

const menuItems: MenuProps["items"] = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "Tổng quan",
  },
  {
    key: "ecommerce",
    icon: <ShopOutlined />,
    label: "Thương mại",
    children: [
      {
        key: "/orders",
        icon: <ShoppingCartOutlined />,
        label: "Đơn hàng",
      },
      {
        key: "/products",
        icon: <AppstoreOutlined />,
        label: "Sản phẩm",
      },
    ],
  },
  {
    key: "/users",
    icon: <TeamOutlined />,
    label: "Người dùng",
  },
  {
    key: "/analytics",
    icon: <BarChartOutlined />,
    label: "Phân tích",
  },
  {
    type: "divider",
  },
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "Cài đặt",
  },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({
  collapsed,
  onMenuClick,
  pathname,
  openKeys,
  onOpenChange,
  userName,
  userEmail,
  onLogout,
}: {
  collapsed: boolean;
  onMenuClick: (key: string) => void;
  pathname: string;
  openKeys: string[];
  onOpenChange: (keys: string[]) => void;
  userName: string;
  userEmail: string;
  onLogout: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 64,
          justifyContent: collapsed ? "center" : "flex-start",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          A
        </div>
        {!collapsed && (
          <div>
            <Text
              strong
              style={{
                color: "white",
                fontSize: 16,
                display: "block",
                lineHeight: 1.2,
              }}
            >
              Management
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
              Dashboard v2.0
            </Text>
          </div>
        )}
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: "12px 0", overflowY: "auto", overflowX: "hidden" }}>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey(pathname)]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={({ key }) => onMenuClick(key)}
          items={menuItems}
          inlineCollapsed={collapsed}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.65)",
          }}
          theme="dark"
        />
      </div>

      {/* User profile at bottom */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <Avatar
          size={36}
          style={{
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            flexShrink: 0,
            fontWeight: 600,
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </Avatar>
        {!collapsed && (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Text
              strong
              style={{
                color: "white",
                fontSize: 13,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userEmail}
            </Text>
          </div>
        )}
        {!collapsed && (
          <LogoutOutlined
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, cursor: "pointer" }}
            onClick={onLogout}
          />
        )}
      </div>
    </div>
  );
}

export default function Sidebar({
  collapsed,
  onCollapse,
  isMobile,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const userName = currentUser?.name ?? "";
  const userEmail = currentUser?.email ?? "";

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAuthToken(null);
      dispatch(setCurrentUser(null));
      globalMessage.success("Đăng xuất thành công!");
      router.push("/login");
    }
  };

  const getOpenKeys = () => {
    if (pathname.startsWith("/orders") || pathname.startsWith("/products")) {
      return ["ecommerce"];
    }
    return [];
  };

  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys);

  const handleMenuClick = (key: string) => {
    if (key.startsWith("/")) {
      router.push(key);
      if (isMobile) onMobileClose();
    }
  };

  const sidebarBg = "#1e1b4b";

  if (isMobile) {
    return (
      <Drawer
        open={mobileOpen}
        onClose={onMobileClose}
        placement="left"
        width={256}
        closeIcon={
          <CloseOutlined style={{ color: "rgba(255,255,255,0.6)" }} />
        }
        styles={{
          body: { padding: 0, background: sidebarBg },
          header: {
            background: sidebarBg,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 16px",
            minHeight: 0,
          },
          mask: { background: "rgba(0,0,0,0.5)" },
          wrapper: { boxShadow: "4px 0 24px rgba(0,0,0,0.3)" },
        }}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              A
            </div>
            <Text strong style={{ color: "white", fontSize: 15 }}>
              Management
            </Text>
          </div>
        }
      >
        {/* Menu only (no logo since it's in the Drawer header) */}
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 0px)" }}>
          <div style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey(pathname)]}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              onClick={({ key }) => handleMenuClick(key)}
              items={menuItems}
              style={{ background: "transparent", border: "none" }}
              theme="dark"
            />
          </div>
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <Avatar
              size={36}
              style={{
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Text
                strong
                style={{
                  color: "white",
                  fontSize: 13,
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userName}
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 11,
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userEmail}
              </Text>
            </div>
            <LogoutOutlined
              style={{ color: "rgba(255,255,255,0.45)", cursor: "pointer" }}
              onClick={handleLogout}
            />
          </div>
        </div>
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={256}
      collapsedWidth={70}
      className="dashboard-sider"
      style={{
        background: sidebarBg,
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflow: "hidden",
      }}
      trigger={null}
    >
      <SidebarContent
        collapsed={collapsed}
        onMenuClick={handleMenuClick}
        pathname={pathname}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
    </Sider>
  );
}
