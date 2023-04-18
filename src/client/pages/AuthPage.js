import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Card, Divider, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AuthPage = ({ type, title, formFields, buttonText, onSubmit, secondaryAction, tertiaryAction }) => {
  const handleFormSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Title level={2}>{title}</Title>
        <Form onFinish={handleFormSubmit}>
          {formFields.map((field) => (
            <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rules}>
              {field.type === 'password' ? <Input.Password prefix={<LockOutlined />} /> : <Input prefix={<UserOutlined />} />}
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="auth-submit-button">
              {buttonText}
            </Button>
          </Form.Item>
          {/* <Form.Item>
          <Link to="/Login"><Button onClick={onLogout}>Logout</Button></Link>
          </Form.Item> */}
        </Form>
        <Divider />
        <div className="auth-actions">
          {secondaryAction && <div className="auth-secondary-action">{secondaryAction}</div>}
          {tertiaryAction && <div className="auth-tertiary-action">{tertiaryAction}</div>}
        </div>
      </Card>
    </div>
  );
};

AuthPage.propTypes = {
  type: PropTypes.oneOf(['signin', 'signup', 'updatepassword']).isRequired,
  title: PropTypes.string.isRequired,
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      rules: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  buttonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  secondaryAction: PropTypes.node,
  tertiaryAction: PropTypes.node,
};

export default AuthPage;
