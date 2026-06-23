"use client";

import { useState } from "react";
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
  Popconfirm,
  Tooltip,
  Badge,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  FilterOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { users } from "@/lib/mockData";

const { Text, Title } = Typography;

type User = (typeof users)[0];

const roleColors: Record<string, string> = {
  Admin: "purple",
  Manager: "blue",
  Editor: "cyan",
  Viewer: "default",
  User: "green",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchStatus = !statusFilter || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const activeCount = users.filter((u) => u.status === "active").length;
  const adminCount = users.filter((u) => u.role === "Admin").length;

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar
            size={38}
            style={{
              background: `hsl(${record.id.charCodeAt(4) * 20 % 360}, 60%, 55%)`,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {record.avatar}
          </Avatar>
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
      render: (id) => <Text code style={{ fontSize: 12 }}>{id}</Text>,
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
      filters: ["Admin", "Manager", "Editor", "Viewer", "User"].map((r) => ({
        text: r,
        value: r,
      })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "active" ? (
          <Badge status="success" text={<Text style={{ color: "#10b981", fontSize: 13 }}>Hoạt động</Text>} />
        ) : (
          <Badge status="default" text={<Text type="secondary" style={{ fontSize: 13 }}>Không hoạt động</Text>} />
        ),
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Không hoạt động", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày tham gia",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (d) => <Text type="secondary" style={{ fontSize: 12 }}>{d}</Text>,
    },
    {
      title: "Đơn hàng",
      dataIndex: "orders",
      key: "orders",
      align: "center",
      render: (v) => <Text strong>{v}</Text>,
      sorter: (a, b) => a.orders - b.orders,
    },
    {
      title: "Chi tiêu",
      dataIndex: "spent",
      key: "spent",
      render: (v) => (
        <Text strong style={{ color: "#6366f1" }}>
          {v.toLocaleString("vi-VN")}₫
        </Text>
      ),
      sorter: (a, b) => a.spent - b.spent,
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: () => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} size="small" style={{ color: "#6366f1" }} />
          </Tooltip>
          <Popconfirm title="Bạn có chắc muốn xoá người dùng này?" okText="Xoá" cancelText="Huỷ" okType="danger">
            <Tooltip title="Xoá">
              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary cards */}
      <Row gutter={[16, 16]}>
        {[
          {
            title: "Tổng người dùng",
            value: users.length,
            icon: <TeamOutlined />,
            color: "#6366f1",
            bg: "#eef2ff",
          },
          {
            title: "Đang hoạt động",
            value: activeCount,
            icon: <CheckCircleOutlined />,
            color: "#10b981",
            bg: "#ecfdf5",
          },
          {
            title: "Không hoạt động",
            value: users.length - activeCount,
            icon: <CloseCircleOutlined />,
            color: "#ef4444",
            bg: "#fef2f2",
          },
          {
            title: "Quản trị viên",
            value: adminCount,
            icon: <UserOutlined />,
            color: "#8b5cf6",
            bg: "#f5f3ff",
          },
        ].map((card) => (
          <Col xs={12} lg={6} key={card.title}>
            <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <Statistic
                    title={<Text type="secondary" style={{ fontSize: 12 }}>{card.title}</Text>}
                    value={card.value}
                    valueStyle={{ fontSize: 24, fontWeight: 700, color: "#1a1a2e" }}
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main table */}
      <Card
        style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        {/* Toolbar */}
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
            <Input
              placeholder="Tìm kiếm tên, email, ID..."
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              style={{ width: 240 }}
              variant="filled"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              placeholder="Vai trò"
              allowClear
              style={{ width: 130 }}
              options={["Admin", "Manager", "Editor", "Viewer", "User"].map((r) => ({
                label: r,
                value: r,
              }))}
              onChange={setRoleFilter}
              value={roleFilter}
            />
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 150 }}
              options={[
                { label: "Hoạt động", value: "active" },
                { label: "Không hoạt động", value: "inactive" },
              ]}
              onChange={setStatusFilter}
              value={statusFilter}
            />
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: "#6366f1", borderColor: "#6366f1" }}>
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

        <Table
          dataSource={filtered}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
            style: { marginTop: 16 },
          }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys,
          }}
          size="middle"
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
