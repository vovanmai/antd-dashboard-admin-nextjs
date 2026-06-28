"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Typography,
  Row,
  Col,
  Breadcrumb,
  Divider,
  Space,
  Tag,
  message,
  Switch,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  InboxOutlined,
  TagOutlined,
  DollarOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload";
import Link from "next/link";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const CATEGORIES = ["Điện tử", "Thời trang", "Gia dụng", "Sách"];

const labelStyle = { fontWeight: 600, fontSize: 13 };

export default function NewProductPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log("Tạo sản phẩm:", { ...values, tags, images: fileList });
    message.success("Tạo sản phẩm thành công!");
    setSubmitting(false);
    router.push("/products");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { title: <Link href="/dashboard">Trang chủ</Link> },
            { title: <Link href="/products">Sản phẩm</Link> },
            { title: "Tạo mới" },
          ]}
          style={{ marginBottom: 12 }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            style={{ borderRadius: 8 }}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Tạo sản phẩm mới
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Điền đầy đủ thông tin để thêm sản phẩm vào hệ thống
            </Text>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: true, stock: 0, price: 0 }}
        requiredMark={false}
      >
        <Row gutter={[20, 20]}>
          {/* Left column */}
          <Col xs={24} lg={16}>
            {/* Basic info */}
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <AppstoreOutlined style={{ color: "#6366f1", fontSize: 16 }} />
                <Text strong style={{ fontSize: 14 }}>Thông tin cơ bản</Text>
              </div>

              <Form.Item
                name="name"
                label={<span style={labelStyle}>Tên sản phẩm</span>}
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input
                  placeholder="Ví dụ: iPhone 16 Pro Max 256GB"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={<span style={labelStyle}>Mô tả sản phẩm</span>}
              >
                <TextArea
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                  rows={5}
                  style={{ borderRadius: 8 }}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="sku"
                    label={<span style={labelStyle}>Mã SKU</span>}
                  >
                    <Input
                      placeholder="Ví dụ: PRD-0001"
                      style={{ borderRadius: 8 }}
                      prefix={<TagOutlined style={{ color: "#bbb" }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="brand"
                    label={<span style={labelStyle}>Thương hiệu</span>}
                  >
                    <Input
                      placeholder="Ví dụ: Apple, Samsung..."
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Tags */}
              <Form.Item label={<span style={labelStyle}>Thẻ tag</span>}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => handleRemoveTag(tag)}
                      style={{ borderRadius: 20, padding: "2px 10px" }}
                      color="purple"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    placeholder="Thêm tag (Nhấn Enter hoặc bấm +)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onPressEnter={handleAddTag}
                    style={{ borderRadius: "8px 0 0 8px" }}
                  />
                  <Button onClick={handleAddTag} icon={<PlusOutlined />} style={{ borderRadius: "0 8px 8px 0" }}>
                    Thêm
                  </Button>
                </Space.Compact>
              </Form.Item>
            </Card>

            {/* Pricing & Inventory */}
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <DollarOutlined style={{ color: "#10b981", fontSize: 16 }} />
                <Text strong style={{ fontSize: 14 }}>Giá cả & Kho hàng</Text>
              </div>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="price"
                    label={<span style={labelStyle}>Giá bán (₫)</span>}
                    rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: 8 }}
                      size="large"
                      min={0}
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      parser={(v) => Number(v!.replace(/\./g, "")) as unknown as 0}
                      placeholder="0"
                      addonAfter="₫"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="originalPrice"
                    label={<span style={labelStyle}>Giá gốc (₫)</span>}
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: 8 }}
                      size="large"
                      min={0}
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      parser={(v) => Number(v!.replace(/\./g, "")) as unknown as 0}
                      placeholder="0"
                      addonAfter="₫"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="stock"
                    label={<span style={labelStyle}>Số lượng tồn kho</span>}
                    rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: 8 }}
                      size="large"
                      min={0}
                      placeholder="0"
                      addonAfter="cái"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="weight"
                    label={<span style={labelStyle}>Khối lượng (g)</span>}
                  >
                    <InputNumber
                      style={{ width: "100%", borderRadius: 8 }}
                      size="large"
                      min={0}
                      placeholder="0"
                      addonAfter="g"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right column */}
          <Col xs={24} lg={8}>
            {/* Status & Category */}
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                marginBottom: 20,
              }}
            >
              <Text strong style={{ fontSize: 14, display: "block", marginBottom: 16 }}>
                Phân loại & Trạng thái
              </Text>

              <Form.Item
                name="category"
                label={<span style={labelStyle}>Danh mục</span>}
                rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  size="large"
                  style={{ width: "100%", borderRadius: 8 }}
                  options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                />
              </Form.Item>

              <Form.Item
                name="subCategory"
                label={<span style={labelStyle}>Danh mục phụ</span>}
              >
                <Input
                  placeholder="Ví dụ: Laptop, Điện thoại..."
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <Divider style={{ margin: "12px 0" }} />

              <Form.Item
                name="status"
                label={<span style={labelStyle}>Trạng thái bán hàng</span>}
                valuePropName="checked"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Hiển thị & Đang bán</Text>
                  <Switch
                    defaultChecked
                    checkedChildren="Còn hàng"
                    unCheckedChildren="Hết hàng"
                    style={{ background: "#6366f1" }}
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="featured"
                label={<span style={labelStyle}>Sản phẩm nổi bật</span>}
                valuePropName="checked"
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>Hiển thị ở trang chủ</Text>
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </div>
              </Form.Item>
            </Card>

            {/* Image upload */}
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                marginBottom: 20,
              }}
            >
              <Text strong style={{ fontSize: 14, display: "block", marginBottom: 12 }}>
                Hình ảnh sản phẩm
              </Text>

              <Dragger
                fileList={fileList}
                onChange={({ fileList: fl }) => setFileList(fl)}
                beforeUpload={() => false}
                multiple
                accept="image/*"
                listType="picture"
                style={{ borderRadius: 8 }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "#6366f1" }} />
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, margin: "8px 0 4px" }}>
                  Kéo thả hoặc click để tải ảnh
                </p>
                <p style={{ fontSize: 12, color: "#888" }}>
                  Hỗ trợ PNG, JPG, WEBP — tối đa 5MB/ảnh
                </p>
              </Dragger>
            </Card>

            {/* Action buttons */}
            <Card
              style={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={10}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  block
                  loading={submitting}
                  style={{ background: "#6366f1", borderRadius: 8, height: 44 }}
                >
                  Lưu sản phẩm
                </Button>
                <Button
                  size="large"
                  block
                  onClick={() => router.back()}
                  style={{ borderRadius: 8, height: 44 }}
                >
                  Huỷ bỏ
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
