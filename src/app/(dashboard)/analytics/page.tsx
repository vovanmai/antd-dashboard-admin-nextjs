"use client";

import { Card, Row, Col, Typography, Space, Select, Table, Tag } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { revenueData, weeklyVisitors } from "@/lib/mockData";
import type { ColumnsType } from "antd/es/table";

const { Text, Title } = Typography;

const topProducts = [
  { key: "1", name: "MacBook Pro M3", category: "Điện tử", revenue: 127500000, orders: 3, growth: 23 },
  { key: "2", name: "iPhone 16 Pro", category: "Điện tử", revenue: 98260000, orders: 34, growth: 18 },
  { key: "3", name: "Samsung Galaxy S25", category: "Điện tử", revenue: 64500000, orders: 3, growth: -5 },
  { key: "4", name: "iPad Air M2", category: "Điện tử", revenue: 50400000, orders: 3, growth: 12 },
  { key: "5", name: "AirPods Pro 3", category: "Điện tử", revenue: 43400000, orders: 7, growth: 31 },
];

const radarData = [
  { subject: "Doanh thu", A: 85, B: 70 },
  { subject: "Đơn hàng", A: 72, B: 65 },
  { subject: "Người dùng", A: 90, B: 75 },
  { subject: "Chuyển đổi", A: 68, B: 80 },
  { subject: "Giữ chân", A: 78, B: 60 },
  { subject: "Hài lòng", A: 92, B: 85 },
];

const topProductColumns: ColumnsType<(typeof topProducts)[0]> = [
  {
    title: "Sản phẩm",
    dataIndex: "name",
    key: "name",
    render: (v) => <Text strong style={{ fontSize: 13 }}>{v}</Text>,
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    key: "category",
    render: (v) => <Tag color="blue" style={{ borderRadius: 20 }}>{v}</Tag>,
  },
  {
    title: "Doanh thu",
    dataIndex: "revenue",
    key: "revenue",
    render: (v) => <Text strong style={{ color: "#6366f1" }}>{v.toLocaleString("vi-VN")}₫</Text>,
    sorter: (a, b) => a.revenue - b.revenue,
    defaultSortOrder: "descend",
  },
  {
    title: "Đơn hàng",
    dataIndex: "orders",
    key: "orders",
    render: (v) => <Text>{v}</Text>,
  },
  {
    title: "Tăng trưởng",
    dataIndex: "growth",
    key: "growth",
    render: (v) => (
      <Text style={{ color: v >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
        {v >= 0 ? "+" : ""}{v}%
      </Text>
    ),
  },
];

export default function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Phân tích & Báo cáo</Title>
          <Text type="secondary">Tổng hợp dữ liệu kinh doanh chi tiết</Text>
        </div>
        <Select
          defaultValue="2025"
          options={[
            { label: "Năm 2025", value: "2025" },
            { label: "Năm 2024", value: "2024" },
          ]}
          style={{ width: 120 }}
        />
      </div>

      {/* Revenue detailed chart */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0 }}>Phân tích doanh thu năm 2025</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>Doanh thu, chi phí, lợi nhuận theo tháng</Text>
          </div>
        }
        style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
              tick={{ fontSize: 11, fill: "#999" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(val, name) => [
                `${Number(val).toLocaleString("vi-VN")}₫`,
                name === "revenue" ? "Doanh thu" : name === "expense" ? "Chi phí" : "Lợi nhuận",
              ]}
              contentStyle={{ borderRadius: 8 }}
            />
            <Legend
              formatter={(val) =>
                val === "revenue" ? "Doanh thu" : val === "expense" ? "Chi phí" : "Lợi nhuận"
              }
            />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#gRevenue)" />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#gExpense)" />
            <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#gProfit)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Weekly visitors bar chart */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div>
                <Title level={5} style={{ margin: 0 }}>Lượt truy cập theo tuần</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>Phân tích lưu lượng truy cập website</Text>
              </div>
            }
            style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyVisitors} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#999" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#999" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val, name) => [
                    Number(val).toLocaleString("vi-VN"),
                    name === "visitors" ? "Khách" : "Lượt xem",
                  ]}
                  contentStyle={{ borderRadius: 8 }}
                />
                <Legend formatter={(val) => (val === "visitors" ? "Khách" : "Lượt xem trang")} />
                <Bar dataKey="visitors" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pageviews" fill="#c7d2fe" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Radar chart */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <div>
                <Title level={5} style={{ margin: 0 }}>Hiệu suất kinh doanh</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>So sánh với kỳ trước</Text>
              </div>
            }
            style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#666" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#999" }} />
                <Radar name="Kỳ này" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Kỳ trước" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top products table */}
      <Card
        title={
          <div>
            <Title level={5} style={{ margin: 0 }}>Top sản phẩm bán chạy</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>Sắp xếp theo doanh thu</Text>
          </div>
        }
        style={{ borderRadius: 12, border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <Table
          dataSource={topProducts}
          columns={topProductColumns}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
}
