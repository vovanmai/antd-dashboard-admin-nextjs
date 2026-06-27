"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Card,
  Table,
  Input,
  Button,
  Tag,
  Avatar,
  Space,
  Typography,
  Select,
  Row,
  Col,
  Tooltip,
  Form,
  Modal,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usersApi, type User } from "@/lib/api/users";
import { rolesApi, type Role } from "@/lib/api/roles";
import { usePermissions } from "@/hooks/usePermission";

const { Text, Title } = Typography;

const roleColors: Record<string, string> = {
  Admin: "purple",
  "Sub Admin": "blue",
};

function UsersPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("email") ?? "";
  const roleFilter = searchParams.get("role_id") ?? undefined;
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("per_page") ?? "15");

  const perms = usePermissions(["user.create", "user.edit", "user.delete"]);

  const [form] = Form.useForm();
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    rolesApi.getRoles().then(setRoles).catch(() => {});
  }, []);

  useEffect(() => {
    form.setFieldsValue({ email: search || undefined, role_id: roleFilter ?? null });
  }, [search, roleFilter, form]);

  const pushParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleSearch = (values: { email?: string; role_id?: string }) => {
    pushParams({ email: values.email || undefined, role_id: values.role_id || undefined, page: "1" });
    setFetchTrigger((t) => t + 1);
  };

  const handleReset = () => {
    router.replace(pathname);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getUsers({
        page,
        per_page: perPage,
        email: search || undefined,
        role_id: roleFilter,
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, roleFilter, fetchTrigger]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <Space>
          {/* <Avatar
            size={38}
            style={{
              background: `hsl(${(record.id * 37) % 360}, 60%, 55%)`,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {record.name.charAt(0).toUpperCase()}
          </Avatar> */}
          <div>
            <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => <Text code style={{ fontSize: 12 }}>#{id}</Text>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={roleColors[role] || "default"} style={{ borderRadius: 20, fontWeight: 500 }}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title={perms["user.edit"] ? "Chỉnh sửa" : "Không có quyền chỉnh sửa"}>
            <Button type="text" icon={<EditOutlined />} size="small" style={{ color: "#6366f1" }} disabled={!perms["user.edit"]} />
          </Tooltip>
          <Tooltip title={!perms["user.delete"] || !record.can_delete ? "Không có quyền xoá" : "Xoá"}>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              disabled={!perms["user.delete"] || !record.can_delete}
              onClick={() =>
                Modal.confirm({
                  title: "Bạn có chắc muốn xoá người dùng này?",
                  icon: <ExclamationCircleFilled />,
                  content: `${record.name} (${record.email})`,
                  okText: "Xoá",
                  okType: "danger",
                  cancelText: "Huỷ",
                  onOk: () =>
                    usersApi.deleteUser(record.id).then(() => {
                      message.success("Xoá người dùng thành công");
                      setFetchTrigger((t) => t + 1);
                    }),
                })
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <Title level={5} style={{ margin: "0 0 16px" }}>Tìm kiếm</Title>
        <Form form={form} onFinish={handleSearch}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="email" style={{ margin: 0 }}>
                <Input
                  placeholder="Tìm kiếm email..."
                  prefix={<SearchOutlined style={{ color: "#bbb" }} />}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="role_id" style={{ margin: 0 }}>
                <Select
                  placeholder="Vai trò"
                  allowClear
                  style={{ width: "100%" }}
                  options={roles.map((r) => ({ label: r.display_name, value: String(r.id) }))}
                />
              </Form.Item>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  style={{ background: "#6366f1", borderColor: "#6366f1" }}
                >
                  Tìm kiếm
                </Button>
                <Button onClick={handleReset}>Đặt lại</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Title level={5} style={{ margin: 0 }}>Danh sách người dùng</Title>
          <Space wrap>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#6366f1", borderColor: "#6366f1" }}
              disabled={!perms["user.create"]}
              onClick={() => router.push("/users/create")}
            >
              Thêm người dùng
            </Button>
          </Space>
        </div>

        {selectedKeys.length > 0 && (
          <div
            style={{
              background: "#eef2ff",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text style={{ color: "#6366f1" }}>Đã chọn {selectedKeys.length} người dùng</Text>
            <Button size="small" danger>Xoá đã chọn</Button>
          </div>
        )}

        <Table<User>
          dataSource={data}
          rowKey="id"
          columns={columns}
          loading={loading}
          pagination={{
            current: page,
            pageSize: perPage,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["15", "30", "50"],
            showTotal: (t) => `Tổng ${t}`,
            style: { marginTop: 16 },
            onChange: (p, ps) => {
              pushParams({ page: String(p), per_page: String(ps) });
            },
          }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          size="middle"
          scroll={{ x: 700 }}
        />
      </Card>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense>
      <UsersPageInner />
    </Suspense>
  );
}
