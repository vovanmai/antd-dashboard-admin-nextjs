"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Select,
  Row,
  Col,
  Tooltip,
  Statistic,
  DatePicker,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  ExportOutlined,
  PrinterOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { orders } from "@/lib/mockData";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

type Order = (typeof orders)[0];

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  completed: { color: "success", label: "Hoàn thành", icon: <CheckCircleOutlined /> },
  pending: { color: "warning", label: "Chờ xử lý", icon: <ClockCircleOutlined /> },
  processing: { color: "processing", label: "Đang xử lý", icon: <SyncOutlined spin /> },
  cancelled: { color: "error", label: "Đã huỷ", icon: <CloseCircleOutlined /> },
  refunded: { color: "default", label: "Hoàn tiền", icon: <SyncOutlined /> },
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const summaryCards = [
    {
      title: "Tổng đơn hàng",
      value: orders.length,
      icon: <ShoppingCartOutlined />,
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      title: "Hoàn thành",
      value: orders.filter((o) => o.status === "completed").length,
      icon: <CheckCircleOutlined />,
      color: "#10b981",
      bg: "#ecfdf5",
    },
    {
      title: "Chờ xử lý",
      value: orders.filter((o) => o.status === "pending").length,
      icon: <ClockCircleOutlined />,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      title: "Đã huỷ",
      value: orders.filter((o) => o.status === "cancelled").length,
      icon: <CloseCircleOutlined />,
      color: "#ef4444",
      bg: "#fef2f2",
    },
  ];

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn",
      dataIndex: "orderId",
      key: "orderId",
      render: (id) => <Text strong style={{ color: "#6366f1" }}>{id}</Text>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (v) => <Text strong style={{ fontSize: 13 }}>{v}</Text>,
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: "Giá trị",
      dataIndex: "amount",
      key: "amount",
      render: (v) => (
        <Text strong style={{ color: "#10b981" }}>
          {v.toLocaleString("vi-VN")}₫
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (v) => <Tag style={{ borderRadius: 20 }}>{v}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const cfg = statusConfig[s];
        return (
          <Tag
            color={cfg?.color}
            icon={cfg?.icon}
            style={{ borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            {cfg?.label || s}
          </Tag>
        );
      },
      filters: Object.entries(statusConfig).map(([key, val]) => ({
        text: val.label,
        value: key,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (v) => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text>,
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: () => (
        <Space size={4}>
          <Tooltip title="Xem chi tiết">
            <Button type="text" icon={<EyeOutlined />} size="small" style={{ color: "#6366f1" }} />
          </Tooltip>
          <Tooltip title="In đơn hàng">
            <Button type="text" icon={<PrinterOutlined />} size="small" />
          </Tooltip>
          <Popconfirm title="Huỷ đơn hàng này?" okText="Huỷ đơn" cancelText="Không" okType="danger">
            <Tooltip title="Huỷ đơn">
              <Button type="text" icon={<CloseCircleOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary */}
      <Row gutter={[16, 16]}>
        {summaryCards.map((card) => (
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
                <Statistic
                  title={<Text type="secondary" style={{ fontSize: 12 }}>{card.title}</Text>}
                  value={card.value}
                  styles={{ content: { fontSize: 24, fontWeight: 700 } }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
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
          <Title level={5} style={{ margin: 0 }}>Danh sách đơn hàng</Title>
          <Space wrap>
            <Input
              placeholder="Tìm theo mã, khách hàng..."
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              style={{ width: 240 }}
              variant="filled"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 150 }}
              options={Object.entries(statusConfig).map(([key, val]) => ({
                label: val.label,
                value: key,
              }))}
              onChange={setStatusFilter}
              value={statusFilter}
            />
            <RangePicker style={{ borderRadius: 8 }} placeholder={["Từ ngày", "Đến ngày"]} />
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
          </Space>
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
          }}
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
