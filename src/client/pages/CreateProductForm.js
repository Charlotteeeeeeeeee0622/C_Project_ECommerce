import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, InputNumber, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from 'axios';

const { Option } = Select;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002'
});

const ProductForm = ({ onSubmit, productData = {} }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    form.setFieldsValue(productData);
    setImageUrl(productData.imageLink);
  }, [form, productData]);

  const handleSubmit = async (values) => {
    if (!imageFile) {
      message.error('Please upload an image');
      return;
    }
  
    const formData = new FormData();
    formData.append('productName', values.productName);
    formData.append('productDescription', values.productDescription);
    formData.append('category', values.category);
    formData.append('price', values.price);
    formData.append('inStockQuantity', values.inStockQuantity);
  
    formData.append('image', imageFile);
  
    try {
      await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Product created successfully');
      onSubmit();
    } catch (error) {
      console.error(error);
      message.error('Error creating product');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      setImageUrl("");
      setImageFile(null);
    }
  };

  return (
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[{ required: true, message: "Please input the product name!" }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="Product Description"
          name="productDescription"
          rules={[{ required: true, message: "Please input the product description!" }]}
        >
          <Input.TextArea />
        </Form.Item>
  
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select>
            <Option value="category1">Category 1</Option>
            <Option value="category2">Category 2</Option>
            {/* Add more categories as needed */}
          </Select>
        </Form.Item>
  
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
  
        <Form.Item
          label="In Stock Quantity"
          name="inStockQuantity"
          rules={[{ required: true, message: "Please input the in stock quantity!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
  
        <Form.Item label="Add Image">
          <input type="file" onChange={handleImageUpload} />
        </Form.Item>
  
        {imageUrl && (
          <div>
            <p>Image Preview:</p>
            <img src={imageUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
          </div>
        )}
  
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
};

export default ProductForm;
