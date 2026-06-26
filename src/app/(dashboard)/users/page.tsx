"use client";

import { useState, useEffect, useCallback } from "react";
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
  Statistic,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usersApi, type User } from "@/lib/api/users";

const { Text, Title } = Typography;

const roleColors: Record<string, string> = {
  Admin: "purple",
  "Sub Admin": "blue",
};

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [roleInput, setRoleInput] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setSearch(searchInput);
    setRoleFilter(roleInput);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setRoleInput(undefined);
    setSearch("");
    setRoleFilter(undefined);
    setPage(1);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.getUsers({
        page,
        per_page: perPage,
        search: search || undefined,
        role: roleFilter,
      });
      setData(res.data);
      setTotal(res.meta.total);
    } catch {
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const adminCount = data.filter((u) => u.role === "Admin").length;
  const subAdminCount = data.filter((u) => u.role === "Sub Admin").length;

  const columns: ColumnsType<User> = [
    {
      title: "Người dùng",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar
            size={38}
            style={{
              background: `hsl(${(record.id * 37) % 360}, 60%, 55%)`,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {record.name.charAt(0).toUpperCase()}
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
      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <Title level={5} style={{ margin: "0 0 16px" }}>Tìm kiếm</Title>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm tên, email..."
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              variant="filled"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="Vai trò"
              allowClear
              style={{ width: "100%" }}
              options={["Admin", "Sub Admin"].map((r) => ({ label: r, value: r }))}
              onChange={setRoleInput}
              value={roleInput}
            />
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                style={{ background: "#6366f1", borderColor: "#6366f1" }}
              >
                Tìm kiếm
              </Button>
              <Button onClick={handleReset}>Đặt lại</Button>
            </Space>
          </Col>
        </Row>
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
            showTotal: (t) => `Tổng ${t} người dùng`,
            style: { marginTop: 16 },
            onChange: (p, ps) => {
              setPage(p);
              setPerPage(ps);
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
