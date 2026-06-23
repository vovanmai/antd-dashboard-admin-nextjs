"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Rate,
  Progress,
  Tooltip,
  Popconfirm,
  Statistic,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ShoppingOutlined,
  StockOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { products } from "@/lib/mockData";

const { Text, Title } = Typography;

type Product = (typeof products)[0];

const categoryColors: Record<string, string> = {
  "Điện tử": "blue",
  "Thời trang": "pink",
  "Gia dụng": "orange",
  "Sách": "green",
};

const productIcons = ["💻", "📱", "🎧", "⌚", "📟"];

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const summaryCards = [
    {
      title: "Tổng sản phẩm",
      value: products.length,
      icon: <ShoppingOutlined />,
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      title: "Đang bán",
      value: products.filter((p) => p.status === "inStock").length,
      icon: <StockOutlined />,
      color: "#10b981",
      bg: "#ecfdf5",
    },
    {
      title: "Hết hàng",
      value: products.filter((p) => p.status === "outOfStock").length,
      icon: <ShoppingOutlined />,
      color: "#ef4444",
      bg: "#fef2f2",
    },
    {
      title: "Đã bán",
      value: products.reduce((sum, p) => sum + p.sold, 0),
      icon: <ShoppingOutlined />,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
  ];

  const columns: ColumnsType<Product> = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <Space>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {productIcons[Number(record.key) % 5]}
          </div>
          <div>
            <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
            <br />
            <Text code style={{ fontSize: 11 }}>{record.id}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (cat) => (
        <Tag color={categoryColors[cat] || "default"} style={{ borderRadius: 20 }}>
          {cat}
        </Tag>
      ),
      filters: ["Điện tử", "Thời trang", "Gia dụng", "Sách"].map((c) => ({
        text: c,
        value: c,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (v) => (
        <Text strong style={{ color: "#6366f1" }}>
          {v.toLocaleString("vi-VN")}₫
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (v) => {
        const percent = Math.min((v / 200) * 100, 100);
        return (
          <div style={{ minWidth: 100 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: 600 }}>{v}</Text>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              size="small"
              strokeColor={v < 20 ? "#ef4444" : v < 50 ? "#f59e0b" : "#10b981"}
            />
          </div>
        );
      },
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      render: (v) => <Text strong>{v}</Text>,
      sorter: (a, b) => a.sold - b.sold,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (v) => (
        <Space size={4}>
          <Rate disabled defaultValue={Number(v)} allowHalf style={{ fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>({v})</Text>
        </Space>
      ),
      sorter: (a, b) => Number(a.rating) - Number(b.rating),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) =>
        s === "inStock" ? (
          <Badge status="success" text={<Text style={{ color: "#10b981", fontSize: 13 }}>Còn hàng</Text>} />
        ) : (
          <Badge status="error" text={<Text style={{ color: "#ef4444", fontSize: 13 }}>Hết hàng</Text>} />
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
          <Popconfirm title="Xoá sản phẩm này?" okText="Xoá" cancelText="Huỷ" okType="danger">
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
          <Title level={5} style={{ margin: 0 }}>Danh sách sản phẩm</Title>
          <Space wrap>
            <Input
              placeholder="Tìm tên, mã sản phẩm..."
              prefix={<SearchOutlined style={{ color: "#bbb" }} />}
              style={{ width: 240 }}
              variant="filled"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: 150 }}
              options={["Điện tử", "Thời trang", "Gia dụng", "Sách"].map((c) => ({
                label: c,
                value: c,
              }))}
              onChange={setCategoryFilter}
              value={categoryFilter}
            />
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: "#6366f1" }} onClick={() => router.push("/products/new")}>
              Thêm sản phẩm
            </Button>
          </Space>
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
          }}
          size="middle"
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  );
}
