import React, { useState, useEffect } from 'react';
import { Layout, Typography, Input, Select, Card, Row, Col, Spin } from 'antd';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const ProductsListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    search: '',
    category: '',
    sort: '',
  });

  useEffect(() => {
    setLoading(true);
    axios.get('/products', { params: filter })
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error loading products.');
        setLoading(false);
      });
  }, [filter]);

  const handleSearch = value => {
    setFilter({ ...filter, search: value });
  };

  const handleCategoryChange = value => {
    setFilter({ ...filter, category: value });
  };

  const handleSortChange = value => {
    setFilter({ ...filter, sort: value });
  };

  return (
    <Layout>
      <Header>
        <Title level={2}>Products List</Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Input.Search placeholder="Search products..." onSearch={handleSearch} style={{ width: '300px', marginRight: '24px' }} />
        <Select placeholder="Category" style={{ width: '200px', marginRight: '24px' }} onChange={handleCategoryChange}>
          <Option value="">All</Option>
          <Option value="electronics">Electronics</Option>
          <Option value="clothing">Clothing</Option>
          <Option value="books">Books</Option>
        </Select>
        <Select placeholder="Sort by" style={{ width: '200px' }} onChange={handleSortChange}>
          <Option value="">Default</Option>
          <Option value="price_asc">Price (Low to High)</Option>
          <Option value="price_desc">Price (High to Low)</Option>
        </Select>
        {error && <div>{error}</div>}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <Spin />
          </div>
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            {products.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card hoverable cover={<img src={product.image} alt={product.name} />}>
                  <Card.Meta title={product.name} description={`$${product.price}`} />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default ProductsListPage;
