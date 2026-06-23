"use client";

import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Divider,
  Avatar,
  Upload,
  Space,
  Tabs,
  Tag,
  List,
  Radio,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const sessions = [
  { device: "MacBook Pro (Chrome)", location: "Hà Nội, Việt Nam", time: "Đang hoạt động", current: true },
  { device: "iPhone 16 Pro (Safari)", location: "Hà Nội, Việt Nam", time: "2 giờ trước", current: false },
  { device: "iPad Air (Chrome)", location: "TP. Hồ Chí Minh", time: "Hôm qua", current: false },
];

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [notifSettings, setNotifSettings] = useState({
    emailOrders: true,
    emailMarketing: false,
    browserOrders: true,
    browserUsers: true,
    browserSystem: false,
  });

  const handleProfileSave = () => {
    message.success("Đã lưu thông tin hồ sơ!");
  };

  const handlePasswordSave = () => {
    message.success("Đã cập nhật mật khẩu!");
    passwordForm.resetFields();
  };

  const tabs = [
    {
      key: "profile",
      label: (
        <Space>
          <UserOutlined />
          Hồ sơ
        </Space>
      ),
      children: (
        <Row gutter={[24, 0]}>
          <Col xs={24} md={8} style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar
              size={100}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                fontSize: 36,
                fontWeight: 700,
              }}
            >
              AD
            </Avatar>
            <div style={{ marginTop: 16 }}>
              <Upload showUploadList={false} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />} size="small">Thay ảnh</Button>
              </Upload>
            </div>
            <div style={{ marginTop: 12 }}>
              <Tag color="purple" style={{ borderRadius: 20, padding: "2px 12px" }}>Super Admin</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
              Tham gia từ 01/01/2024
            </Text>
          </Col>
          <Col xs={24} md={16}>
            <Form form={form} layout="vertical" initialValues={{ name: "Admin User", email: "admin@company.com", phone: "0901234567", timezone: "Asia/Ho_Chi_Minh", language: "vi" }}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                    <Input prefix="@" readOnly />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input prefix="+84" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Múi giờ" name="timezone">
                    <Select options={[
                      { label: "Việt Nam (UTC+7)", value: "Asia/Ho_Chi_Minh" },
                      { label: "Thái Lan (UTC+7)", value: "Asia/Bangkok" },
                      { label: "Singapore (UTC+8)", value: "Asia/Singapore" },
                    ]} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Ngôn ngữ" name="language">
                    <Select options={[
                      { label: "🇻🇳 Tiếng Việt", value: "vi" },
                      { label: "🇺🇸 English", value: "en" },
                      { label: "🇯🇵 日本語", value: "ja" },
                    ]} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Chức vụ" name="position">
                    <Input placeholder="Ví dụ: CTO, Product Manager..." />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Giới thiệu" name="bio">
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn về bạn..." />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" style={{ background: "#6366f1" }} onClick={handleProfileSave}>
                Lưu thay đổi
              </Button>
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      key: "security",
      label: (
        <Space>
          <LockOutlined />
          Bảo mật
        </Space>
      ),
      children: (
        <div style={{ maxWidth: 520 }}>
          <Title level={5}>Đổi mật khẩu</Title>
          <Form form={passwordForm} layout="vertical">
            <Form.Item label="Mật khẩu hiện tại" name="currentPassword" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, min: 8 }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                    return Promise.reject("Mật khẩu không khớp!");
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" style={{ background: "#6366f1" }} onClick={handlePasswordSave}>
              Cập nhật mật khẩu
            </Button>
          </Form>

          <Divider />

          <Title level={5}>Xác thực 2 yếu tố (2FA)</Title>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <Text>Bảo mật tài khoản với Google Authenticator</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>Yêu cầu mã xác minh khi đăng nhập</Text>
            </div>
            <Switch />
          </div>

          <Divider />

          <Title level={5}>Phiên đăng nhập</Title>
          <List
            dataSource={sessions}
            renderItem={(item) => (
              <List.Item
                actions={[
                  !item.current && (
                    <Button size="small" danger icon={<DeleteOutlined />}>
                      Thu hồi
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: item.current ? "#eef2ff" : "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: item.current ? "#6366f1" : "#999",
                      }}
                    >
                      <GlobalOutlined />
                    </div>
                  }
                  title={
                    <Space>
                      <Text strong style={{ fontSize: 13 }}>{item.device}</Text>
                      {item.current && <Tag color="success" style={{ borderRadius: 20, fontSize: 10 }}>Hiện tại</Tag>}
                    </Space>
                  }
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.location} · {item.time}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "notifications",
      label: (
        <Space>
          <BellOutlined />
          Thông báo
        </Space>
      ),
      children: (
        <div style={{ maxWidth: 560 }}>
          <Title level={5}>Thông báo email</Title>
          {[
            { key: "emailOrders", label: "Đơn hàng mới", desc: "Nhận email khi có đơn hàng mới" },
            { key: "emailMarketing", label: "Báo cáo Marketing", desc: "Nhận báo cáo hàng tuần" },
          ].map((item) => (
            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div>
                <Text strong style={{ fontSize: 14 }}>{item.label}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
              </div>
              <Switch
                checked={notifSettings[item.key as keyof typeof notifSettings]}
                onChange={(v) => setNotifSettings((p) => ({ ...p, [item.key]: v }))}
              />
            </div>
          ))}

          <Title level={5} style={{ marginTop: 24 }}>Thông báo trình duyệt</Title>
          {[
            { key: "browserOrders", label: "Đơn hàng mới", desc: "Thông báo popup khi có đơn hàng" },
            { key: "browserUsers", label: "Người dùng mới", desc: "Thông báo khi có tài khoản mới" },
            { key: "browserSystem", label: "Cảnh báo hệ thống", desc: "Thông báo lỗi và cảnh báo" },
          ].map((item) => (
            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
              <div>
                <Text strong style={{ fontSize: 14 }}>{item.label}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>
              </div>
              <Switch
                checked={notifSettings[item.key as keyof typeof notifSettings]}
                onChange={(v) => setNotifSettings((p) => ({ ...p, [item.key]: v }))}
              />
            </div>
          ))}

          <Button type="primary" style={{ marginTop: 24, background: "#6366f1" }}>
            Lưu cài đặt thông báo
          </Button>
        </div>
      ),
    },
    {
      key: "appearance",
      label: (
        <Space>
          <BgColorsOutlined />
          Giao diện
        </Space>
      ),
      children: (
        <div style={{ maxWidth: 480 }}>
          <Title level={5}>Chủ đề màu sắc</Title>
          <Radio.Group defaultValue="indigo" style={{ marginBottom: 24 }}>
            <Space wrap>
              {[
                { label: "Indigo", value: "indigo", color: "#6366f1" },
                { label: "Blue", value: "blue", color: "#3b82f6" },
                { label: "Purple", value: "purple", color: "#8b5cf6" },
                { label: "Green", value: "green", color: "#10b981" },
                { label: "Orange", value: "orange", color: "#f59e0b" },
              ].map((theme) => (
                <Radio.Button
                  key={theme.value}
                  value={theme.value}
                  style={{
                    borderRadius: 8,
                    borderColor: theme.color,
                  }}
                >
                  <Space size={6}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: theme.color,
                        display: "inline-block",
                      }}
                    />
                    {theme.label}
                  </Space>
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>

          <Title level={5}>Ngôn ngữ giao diện</Title>
          <Select
            defaultValue="vi"
            style={{ width: 200, marginBottom: 24 }}
            options={[
              { label: "🇻🇳 Tiếng Việt", value: "vi" },
              { label: "🇺🇸 English", value: "en" },
            ]}
          />

          <Title level={5}>Mật độ hiển thị</Title>
          <Radio.Group defaultValue="default" style={{ marginBottom: 24 }}>
            <Space>
              <Radio.Button value="compact" style={{ borderRadius: 8 }}>Gọn</Radio.Button>
              <Radio.Button value="default" style={{ borderRadius: 8 }}>Mặc định</Radio.Button>
              <Radio.Button value="comfortable" style={{ borderRadius: 8 }}>Thoáng</Radio.Button>
            </Space>
          </Radio.Group>

          <br />
          <Button type="primary" style={{ background: "#6366f1" }} onClick={() => message.success("Đã lưu cài đặt giao diện!")}>
            Áp dụng
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card
      style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <Title level={4} style={{ marginBottom: 4 }}>Cài đặt hệ thống</Title>
      <Text type="secondary" style={{ fontSize: 13 }}>Quản lý thông tin tài khoản và tuỳ chỉnh hệ thống</Text>
      <Divider />
      <Tabs items={tabs} tabPosition="left" />
    </Card>
  );
}
