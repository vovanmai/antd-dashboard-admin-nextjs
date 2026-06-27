"use client";

import {
  Layout,
  Button,
  Badge,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Input,
  Drawer,
} from "antd";
import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { selectCurrentUser, setCurrentUser } from "@/lib/store/features/auth/authSlice";
import { authApi } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/api/axiosClient";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const pageTitles: Record<string, string> = {
  "/dashboard": "Tổng quan",
  "/users": "Quản lý người dùng",
  "/orders": "Quản lý đơn hàng",
  "/products": "Quản lý sản phẩm",
  "/analytics": "Phân tích & Báo cáo",
  "/settings": "Cài đặt hệ thống",
};

const notifications = [
  {
    key: "1",
    label: (
      <div style={{ padding: "4px 0", maxWidth: 260 }}>
        <Text strong style={{ fontSize: 13 }}>Đơn hàng mới #ORD-7892</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>Nguyễn Văn An đặt MacBook Pro M3</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 11 }}>5 phút trước</Text>
      </div>
    ),
  },
  {
    key: "2",
    label: (
      <div style={{ padding: "4px 0", maxWidth: 260 }}>
        <Text strong style={{ fontSize: 13 }}>Người dùng mới đăng ký</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>Trần Thị Bình vừa tạo tài khoản</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 11 }}>12 phút trước</Text>
      </div>
    ),
  },
  {
    key: "3",
    label: (
      <div style={{ padding: "4px 0", maxWidth: 260 }}>
        <Text strong style={{ fontSize: 13 }}>Sản phẩm sắp hết hàng</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>AirPods Pro 3 còn 5 sản phẩm</Text>
        <br />
        <Text type="secondary" style={{ fontSize: 11 }}>1 giờ trước</Text>
      </div>
    ),
  },
  { type: "divider" as const },
  {
    key: "viewAll",
    label: (
      <Text style={{ color: "#6366f1", fontWeight: 500 }}>Xem tất cả thông báo →</Text>
    ),
  },
];

const userMenuItems: MenuProps["items"] = [
  { key: "profile", icon: <UserOutlined />, label: "Hồ sơ cá nhân" },
  { key: "settings", icon: <SettingOutlined />, label: "Cài đặt tài khoản" },
  { key: "help", icon: <QuestionCircleOutlined />, label: "Trợ giúp" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
];

interface HeaderProps {
  collapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

export default function Header({ collapsed, isMobile, onToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const title = pageTitles[pathname] || "Dashboard";
  const [searchOpen, setSearchOpen] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const userName = currentUser?.name ?? "";
  const userRole = currentUser?.role_display_name ?? "";

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "logout") {
      try {
        await authApi.logout();
      } finally {
        setAuthToken(null);
        dispatch(setCurrentUser(null));
        router.push("/login");
      }
    }
  };

  return (
    <AntHeader
      style={{
        background: "#fff",
        padding: isMobile ? "0 12px" : "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 8 : 16,
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Hamburger / toggle button */}
      <Button
        type="text"
        icon={
          isMobile
            ? <MenuOutlined />
            : collapsed
            ? <MenuUnfoldOutlined />
            : <MenuFoldOutlined />
        }
        onClick={onToggle}
        style={{ fontSize: 16, width: 36, height: 36, flexShrink: 0 }}
      />

      {/* Page title */}
      <Text
        strong
        style={{
          fontSize: isMobile ? 15 : 17,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Text>

      {/* Search — desktop only, inline */}
      {!isMobile && (
        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ width: 220, borderRadius: 8 }}
          variant="filled"
        />
      )}

      {/* Search icon — mobile only */}
      {isMobile && (
        <Button
          type="text"
          icon={<SearchOutlined />}
          style={{ fontSize: 18, width: 36, height: 36, flexShrink: 0 }}
          onClick={() => setSearchOpen(true)}
        />
      )}

      {/* Notifications */}
      <Dropdown
        menu={{ items: notifications }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: 18, width: 36, height: 36, flexShrink: 0 }}
          />
        </Badge>
      </Dropdown>

      {/* User avatar + name */}
      <Dropdown
        menu={{ items: userMenuItems, onClick: handleMenuClick }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Space style={{ cursor: "pointer", flexShrink: 0 }} size={8}>
          <Avatar
            size={34}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          {!isMobile && (
            <div style={{ lineHeight: 1.3 }}>
              <Text strong style={{ fontSize: 13, display: "block" }}>{userName}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>{userRole}</Text>
            </div>
          )}
        </Space>
      </Dropdown>

      {/* Mobile search drawer */}
      <Drawer
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        placement="top"
        closeIcon={<CloseOutlined />}
        styles={{
          wrapper: { height: 72 },
          body: {
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          },
          header: { display: "none" },
        }}
      >
        <Input
          autoFocus
          placeholder="Tìm kiếm trang, người dùng, đơn hàng..."
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          size="large"
          style={{ borderRadius: 10, flex: 1 }}
          variant="filled"
          onPressEnter={() => setSearchOpen(false)}
        />
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setSearchOpen(false)}
        />
      </Drawer>
    </AntHeader>
  );
}
