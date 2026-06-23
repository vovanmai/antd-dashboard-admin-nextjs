"use client";

import { Card, Form, Input, Button, Checkbox, Divider, Typography, Space, Alert } from "antd";
import {
  LockOutlined,
  MailOutlined,
  GithubOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCurrentUser } from "@/lib/store/features/auth/authSlice";
import { login } from "@/lib/api/auth";

const { Text, Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      const { user, token } = await login(values);
      localStorage.setItem('access_token', token);
      dispatch(setCurrentUser(user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.data?.message ?? err?.message ?? 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Background decorations */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.15)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.1)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 20,
          border: "none",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
          position: "relative",
        }}
        styles={{ body: { padding: "40px 36px" } }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 26,
              margin: "0 auto 16px",
            }}
          >
            A
          </div>
          <Title level={3} style={{ margin: 0 }}>Chào mừng trở lại!</Title>
          <Text type="secondary">Đăng nhập vào AdminPro Dashboard</Text>
        </div>

        {error && (
          <Alert
            title={error}
            type="error"
            showIcon
            closable={{ onClose: () => setError(null) }}
            style={{ marginBottom: 20, borderRadius: 10 }}
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Email không hợp lệ!" }]}
            initialValue="admin@company.com"
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bbb" }} />}
              placeholder="admin@company.com"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            initialValue="password123"
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="••••••••"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Checkbox defaultChecked>Ghi nhớ đăng nhập</Checkbox>
            <Button type="link" style={{ padding: 0, color: "#6366f1" }}>
              Quên mật khẩu?
            </Button>
          </div>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: 10,
                height: 46,
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: "16px 0" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>hoặc đăng nhập bằng</Text>
        </Divider>

        <Space style={{ width: "100%", justifyContent: "center" }} size={12}>
          <Button
            icon={<GoogleOutlined />}
            size="large"
            style={{ borderRadius: 10, flex: 1 }}
          >
            Google
          </Button>
          <Button
            icon={<GithubOutlined />}
            size="large"
            style={{ borderRadius: 10, flex: 1 }}
          >
            GitHub
          </Button>
        </Space>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Chưa có tài khoản?{" "}
            <Button type="link" style={{ padding: 0, color: "#6366f1", fontWeight: 600 }}>
              Đăng ký ngay
            </Button>
          </Text>
        </div>
      </Card>
    </div>
  );
}
