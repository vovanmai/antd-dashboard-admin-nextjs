"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Spin,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { usersApi } from "@/lib/api/users";
import { rolesApi, type Role } from "@/lib/api/roles";
import globalMessage from "@/lib/message";

const { Title } = Typography;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([
      usersApi.getUser(id),
      rolesApi.getRoles({ less_than: true }),
    ])
      .then(([user, roleList]) => {
        setRoles(roleList);
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          role_id: user.role_id,
        });
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [id, form]);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    role_id: number;
    password?: string;
    password_confirmation?: string;
  }) => {
    setLoading(true);
    try {
      await usersApi.updateUser(id, values);
      globalMessage.success("Cập nhật người dùng thành công");
      router.push("/users");
    } catch (err: any) {
      const errors: Record<string, string> | undefined = err?.data?.errors;
      if (errors) {
        form.setFields(
          Object.entries(errors).map(([name, msg]) => ({
            name,
            errors: [msg],
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/users")}>
          Quay lại
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Chỉnh sửa người dùng
        </Title>
      </div>

      <Card
        style={{
          borderRadius: 12,
          border: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          maxWidth: 600,
        }}
      >
        <Spin spinning={fetching}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="role_id"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select
                placeholder="Chọn vai trò"
                options={roles.map((r) => ({ label: r.display_name, value: r.id }))}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[{ min: 8, message: "Mật khẩu tối thiểu 8 ký tự" }]}
            >
              <Input.Password placeholder="Để trống nếu không đổi mật khẩu" />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="password_confirmation"
              dependencies={["password"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const pwd = getFieldValue("password");
                    if (!pwd || pwd === value) return Promise.resolve();
                    return Promise.reject("Mật khẩu xác nhận không khớp");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  Lưu
                </Button>
                <Button onClick={() => form.resetFields()}>Xoá</Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
