import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";

const { Header } = Layout;

const AppHeader = ({ isAuthenticated, logout }) => {
  return (
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/products">Products</Link>
        </Menu.Item>
        <Menu.Item key="3" onClick={logout}>
          Logout
        </Menu.Item>
        {isAuthenticated ? (
          <Menu.Item key="4">
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        ) : (
          <Menu.Item key="5">
            <Link to="/about">About</Link>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default AppHeader;
