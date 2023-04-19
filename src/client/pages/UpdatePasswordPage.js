import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002',
});

const UpdatePasswordPage = ({ onLogout }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (values) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/update-password', values);

      if (response.status === 200) {
        // Display success message and clear form
        message.success('Password updated successfully');
        form.resetFields();

        // Logout the user after changing the password
        onLogout();
      } else {
        console.error('Password update failed:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        console.error('Error updating password:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      label: 'Email',
      name: 'email',
      rules: [{ required: true, message: 'Please enter your user ID' }],
      type: 'text',
    },
    {
      label: 'Old Password',
      name: 'oldPassword',
      rules: [{ required: true, message: 'Please enter your old password' }],
      type: 'password',
    },
    {
      label: 'New Password',
      name: 'newPassword',
      rules: [
        { required: true, message: 'Please enter your new password' },
        { min: 6, message: 'Password must be at least 8 characters long' },
      ],
      type: 'password',
    },
    {
      label: 'Confirm New Password',
      name: 'confirmPassword',
      rules: [
        { required: true, message: 'Please confirm your new password' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords do not match'));
          },
        }),
      ],
      type: 'password',
    },
  ];

  const [form] = Form.useForm();

  return (
    <div>
      <h1>Update Password</h1>
      <Form form={form} onFinish={handleUpdatePassword}>
        {formFields.map(({ label, name, rules, type }) => (
          <Form.Item key={name} label={label} name={name} rules={rules}>
            <Input type={type} />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Update Password
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/"><Button onClick={onLogout}>Logout</Button></Link>
          </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePasswordPage;