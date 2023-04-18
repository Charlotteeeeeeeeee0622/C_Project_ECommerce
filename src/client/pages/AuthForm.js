import React from 'react';
import { Form, Input, Button } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const AuthForm = ({ title, fields, onFinish, onFinishFailed }) => {
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <h2>{title}</h2>
      {fields.map(({ label, name, rules }) => (
        <Form.Item key={name} label={label} name={name} rules={rules}>
          <Input />
        </Form.Item>
      ))}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {title}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
