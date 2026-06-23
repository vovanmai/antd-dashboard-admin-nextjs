"use client";

import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Avatar,
  Space,
  Table,
  Progress,
  Statistic,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  revenueData,
  categoryData,
  weeklyVisitors,
  recentOrders,
} from "@/lib/mockData";
import type { ColumnsType } from "antd/es/table";
import { useIsMobile } from "@/hooks/useIsMobile";

const { Text, Title } = Typography;

const statCards = [
  {
    title: "Tổng doanh thu",
    value: 829000000,
    prefix: "₫",
    suffix: "",
    change: 12.5,
    up: true,
    icon: <DollarOutlined />,
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    title: "Người dùng mới",
    value: 2847,
    prefix: "",
    suffix: "",
    change: 8.2,
    up: true,
    icon: <UserOutlined />,
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    title: "Đơn hàng",
    value: 1284,
    prefix: "",
    suffix: "",
    change: 3.1,
    up: false,
    icon: <ShoppingCartOutlined />,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    title: "Tỷ lệ chuyển đổi",
    value: 3.6,
    prefix: "",
    suffix: "%",
    change: 1.2,
    up: true,
    icon: <RiseOutlined />,
    color: "#3b82f6",
    bg: "#eff6ff",
  },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: "success", label: "Hoàn thành" },
  pending: { color: "warning", label: "Chờ xử lý" },
  processing: { color: "processing", label: "Đang xử lý" },
  cancelled: { color: "error", label: "Đã huỷ" },
};

const formatCurrency = (value: number) =>
  `${(value / 1000000).toFixed(0)}M`;

export default function DashboardPage() {
  const isMobile = useIsMobile();

  const orderColumns: ColumnsType<(typeof recentOrders)[0]> = [
    {
      title: "Đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (id) => (
        <Text strong style={{ color: "#6366f1", fontSize: 12 }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <Space size={8}>
          <Avatar
            size={28}
            style={{ background: "#6366f1", fontSize: 11, fontWeight: 600 }}
          >
            {record.avatar}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 12 }}>
              {record.customer}
            </Text>
            {!isMobile && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {record.email}
                </Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    ...(!isMobile
      ? [
          {
            title: "Sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (v: string) => (
              <Text style={{ fontSize: 12 }}>{v}</Text>
            ),
          },
        ]
      : []),
    {
      title: "Giá trị",
      dataIndex: "amount",
      key: "amount",
      render: (v) => (
        <Text strong style={{ color: "#10b981", fontSize: 12 }}>
          {isMobile
            ? `${(v / 1000000).toFixed(1)}M`
            : `${v.toLocaleString("vi-VN")}₫`}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag
          color={statusConfig[s]?.color || "default"}
          style={{ borderRadius: 20, fontSize: 11 }}
        >
          {statusConfig[s]?.label || s}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 20 }}>
      {/* Stat Cards — 2 per row on mobile, 4 on desktop */}
      <Row gutter={[12, 12]}>
        {statCards.map((stat) => (
          <Col xs={12} sm={12} xl={6} key={stat.title}>
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text type="secondary" style={{ fontSize: isMobile ? 11 : 13 }}>
                    {stat.title}
                  </Text>
                  <div style={{ marginTop: 6 }}>
                    <Statistic
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      precision={stat.suffix === "%" ? 1 : 0}
                      styles={{ content: {
                        fontSize: isMobile ? 18 : 24,
                        fontWeight: 700,
                        color: "#1a1a2e",
                      } }}
                      formatter={
                        stat.prefix === "₫"
                          ? isMobile
                            ? (val) => `${(Number(val) / 1000000).toFixed(0)}M`
                            : (val) => `${Number(val).toLocaleString("vi-VN")}`
                          : undefined
                      }
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    {stat.up ? (
                      <ArrowUpOutlined style={{ color: "#10b981", fontSize: 11 }} />
                    ) : (
                      <ArrowDownOutlined style={{ color: "#ef4444", fontSize: 11 }} />
                    )}
                    <Text
                      style={{
                        color: stat.up ? "#10b981" : "#ef4444",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {stat.change}%
                    </Text>
                    {!isMobile && (
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        so với tháng trước
                      </Text>
                    )}
                  </div>
                </div>
                {!isMobile && (
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: stat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      color: stat.color,
                      flexShrink: 0,
                    }}
                  >
                    {stat.icon}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Revenue Chart + Category Pie */}
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div>
                <Title level={5} style={{ margin: 0, fontSize: isMobile ? 14 : 16 }}>
                  Doanh thu theo tháng
                </Title>
                {!isMobile && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tổng quan doanh thu và lợi nhuận năm 2025
                  </Text>
                )}
              </div>
            }
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: "#999" }}
                  axisLine={false}
                  tickLine={false}
                  interval={isMobile ? 1 : 0}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  tick={{ fontSize: isMobile ? 10 : 12, fill: "#999" }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 32 : 44}
                />
                <Tooltip
                  formatter={(val, name) => [
                    `${Number(val).toLocaleString("vi-VN")}₫`,
                    name === "revenue" ? "Doanh thu" : "Lợi nhuận",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorProfit)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              {[
                { color: "#6366f1", label: "Doanh thu" },
                { color: "#10b981", label: "Lợi nhuận" },
              ].map((l) => (
                <Space key={l.label} size={6}>
                  <div
                    style={{
                      width: 12,
                      height: 3,
                      background: l.color,
                      borderRadius: 2,
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {l.label}
                  </Text>
                </Space>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div>
                <Title level={5} style={{ margin: 0, fontSize: isMobile ? 14 : 16 }}>
                  Doanh thu theo danh mục
                </Title>
              </div>
            }
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <ResponsiveContainer width="100%" height={isMobile ? 160 : 190}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 45 : 55}
                  outerRadius={isMobile ? 70 : 80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginTop: 4,
              }}
            >
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Space size={6}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <Text style={{ fontSize: 12 }}>{item.name}</Text>
                  </Space>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Progress
                      percent={item.value}
                      size="small"
                      showInfo={false}
                      strokeColor={item.color}
                      style={{ width: isMobile ? 50 : 60 }}
                    />
                    <Text
                      strong
                      style={{ fontSize: 12, width: 32, textAlign: "right" }}
                    >
                      {item.value}%
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Weekly Visitors + Recent Orders */}
      <Row gutter={[12, 12]}>
        {/* Bar chart — hidden on mobile to save space, show full on tablet+ */}
        {!isMobile && (
          <Col xs={24} lg={8}>
            <Card
              title={
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    Lượt truy cập tuần này
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Khách & lượt xem trang
                  </Text>
                </div>
              }
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                height: "100%",
              }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyVisitors} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "#999" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#999" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(val, name) => [
                      Number(val).toLocaleString("vi-VN"),
                      name === "visitors" ? "Khách" : "Lượt xem",
                    ]}
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pageviews" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                {[
                  { color: "#6366f1", label: "Khách" },
                  { color: "#c7d2fe", label: "Lượt xem" },
                ].map((l) => (
                  <Space key={l.label} size={6}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: l.color,
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {l.label}
                    </Text>
                  </Space>
                ))}
              </div>
            </Card>
          </Col>
        )}

        <Col xs={24} lg={isMobile ? 24 : 16}>
          <Card
            title={
              <div>
                <Title level={5} style={{ margin: 0, fontSize: isMobile ? 14 : 16 }}>
                  Đơn hàng gần đây
                </Title>
                {!isMobile && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    5 đơn hàng mới nhất
                  </Text>
                )}
              </div>
            }
            style={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Table
              dataSource={recentOrders}
              columns={orderColumns}
              pagination={false}
              size="small"
              scroll={{ x: isMobile ? 360 : undefined }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
