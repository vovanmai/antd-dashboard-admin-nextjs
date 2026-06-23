import dayjs from "dayjs";

export const revenueData = [
  { month: "T1", revenue: 42000, expense: 28000, profit: 14000 },
  { month: "T2", revenue: 48000, expense: 31000, profit: 17000 },
  { month: "T3", revenue: 55000, expense: 34000, profit: 21000 },
  { month: "T4", revenue: 51000, expense: 29000, profit: 22000 },
  { month: "T5", revenue: 63000, expense: 38000, profit: 25000 },
  { month: "T6", revenue: 71000, expense: 42000, profit: 29000 },
  { month: "T7", revenue: 68000, expense: 39000, profit: 29000 },
  { month: "T8", revenue: 75000, expense: 44000, profit: 31000 },
  { month: "T9", revenue: 82000, expense: 48000, profit: 34000 },
  { month: "T10", revenue: 79000, expense: 46000, profit: 33000 },
  { month: "T11", revenue: 91000, expense: 52000, profit: 39000 },
  { month: "T12", revenue: 104000, expense: 58000, profit: 46000 },
];

export const categoryData = [
  { name: "Điện tử", value: 35, color: "#6366f1" },
  { name: "Thời trang", value: 25, color: "#f59e0b" },
  { name: "Gia dụng", value: 20, color: "#10b981" },
  { name: "Sách", value: 10, color: "#3b82f6" },
  { name: "Khác", value: 10, color: "#8b5cf6" },
];

export const weeklyVisitors = [
  { day: "T2", visitors: 1200, pageviews: 3400 },
  { day: "T3", visitors: 1900, pageviews: 4200 },
  { day: "T4", visitors: 1500, pageviews: 3800 },
  { day: "T5", visitors: 2200, pageviews: 5100 },
  { day: "T6", visitors: 2800, pageviews: 6300 },
  { day: "T7", visitors: 3100, pageviews: 7200 },
  { day: "CN", visitors: 2600, pageviews: 5900 },
];

export const recentOrders = [
  {
    key: "1",
    orderId: "#ORD-7892",
    customer: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    product: "MacBook Pro M3",
    amount: 42500000,
    status: "completed",
    date: dayjs().subtract(1, "hour").format("DD/MM/YYYY HH:mm"),
    avatar: "NA",
  },
  {
    key: "2",
    orderId: "#ORD-7891",
    customer: "Trần Thị Bình",
    email: "binh.tran@email.com",
    product: "iPhone 16 Pro",
    amount: 28900000,
    status: "pending",
    date: dayjs().subtract(2, "hour").format("DD/MM/YYYY HH:mm"),
    avatar: "TB",
  },
  {
    key: "3",
    orderId: "#ORD-7890",
    customer: "Lê Minh Cường",
    email: "cuong.le@email.com",
    product: "Samsung Galaxy S25",
    amount: 21500000,
    status: "processing",
    date: dayjs().subtract(3, "hour").format("DD/MM/YYYY HH:mm"),
    avatar: "LC",
  },
  {
    key: "4",
    orderId: "#ORD-7889",
    customer: "Phạm Thu Dung",
    email: "dung.pham@email.com",
    product: "AirPods Pro 3",
    amount: 6200000,
    status: "completed",
    date: dayjs().subtract(5, "hour").format("DD/MM/YYYY HH:mm"),
    avatar: "PD",
  },
  {
    key: "5",
    orderId: "#ORD-7888",
    customer: "Hoàng Văn Em",
    email: "em.hoang@email.com",
    product: "iPad Air M2",
    amount: 16800000,
    status: "cancelled",
    date: dayjs().subtract(8, "hour").format("DD/MM/YYYY HH:mm"),
    avatar: "HE",
  },
];

export const users = Array.from({ length: 50 }, (_, i) => ({
  key: String(i + 1),
  id: `USR-${1000 + i}`,
  name: [
    "Nguyễn Văn An",
    "Trần Thị Bình",
    "Lê Minh Cường",
    "Phạm Thu Dung",
    "Hoàng Văn Em",
    "Đỗ Thị Phương",
    "Vũ Đức Giang",
    "Bùi Thị Hoa",
    "Đinh Văn Inh",
    "Ngô Thị Kim",
  ][i % 10],
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Manager", "Editor", "Viewer", "User"][i % 5],
  status: i % 7 === 0 ? "inactive" : "active",
  joinDate: dayjs()
    .subtract(Math.floor(Math.random() * 365), "day")
    .format("DD/MM/YYYY"),
  orders: Math.floor(Math.random() * 100),
  spent: Math.floor(Math.random() * 50000000),
  avatar: ["NA", "TB", "LC", "PD", "HE", "DP", "VG", "BH", "DI", "NK"][
    i % 10
  ],
}));

export const products = Array.from({ length: 40 }, (_, i) => ({
  key: String(i + 1),
  id: `PRD-${2000 + i}`,
  name: [
    "MacBook Pro M3",
    "iPhone 16 Pro",
    "Samsung Galaxy S25",
    "AirPods Pro 3",
    "iPad Air M2",
    "Dell XPS 15",
    "Sony WH-1000XM6",
    "Apple Watch Ultra 3",
    "ASUS ROG Zephyrus",
    "Google Pixel 9",
  ][i % 10],
  category: ["Điện tử", "Thời trang", "Gia dụng", "Sách"][i % 4],
  price: [42500000, 28900000, 21500000, 6200000, 16800000, 38000000, 9500000, 22000000, 35000000, 18500000][i % 10],
  stock: Math.floor(Math.random() * 200),
  sold: Math.floor(Math.random() * 500),
  status: i % 8 === 0 ? "outOfStock" : "inStock",
  rating: (3.5 + Math.random() * 1.5).toFixed(1),
}));

export const orders = Array.from({ length: 60 }, (_, i) => ({
  key: String(i + 1),
  orderId: `#ORD-${7800 + i}`,
  customer: [
    "Nguyễn Văn An",
    "Trần Thị Bình",
    "Lê Minh Cường",
    "Phạm Thu Dung",
    "Hoàng Văn Em",
  ][i % 5],
  product: [
    "MacBook Pro M3",
    "iPhone 16 Pro",
    "Samsung Galaxy S25",
    "AirPods Pro 3",
    "iPad Air M2",
  ][i % 5],
  amount: [42500000, 28900000, 21500000, 6200000, 16800000][i % 5],
  status: ["completed", "pending", "processing", "cancelled", "refunded"][
    i % 5
  ],
  paymentMethod: ["COD", "Thẻ tín dụng", "Chuyển khoản", "MoMo", "ZaloPay"][
    i % 5
  ],
  date: dayjs()
    .subtract(i, "day")
    .format("DD/MM/YYYY"),
}));
