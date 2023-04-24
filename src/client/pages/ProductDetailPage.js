import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Button, Spin, message } from 'antd';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

const ProductDetail = () => {
  const { _id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3002'
  });

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/products/${_id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error loading product details.');
        setLoading(false);
      });
  }, [_id]);

  const addToCart = () => {
    // Call your API to add the product to the user's cart
    message.success('Product added to cart!');
  };

  const addToWishlist = () => {
    // Call your API to add the product to the user's wishlist
    message.success('Product added to wishlist!');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {error}
        {/* Add a retry button if needed */}
      </div>
    );
  }

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>{product.productName}</Title>
        <img src={`http://localhost:3002${product.imageLink}`} alt={product.productName} style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }} />
        <p>{product.productDescription}</p>
        <p>Price: ${product.price}</p>
        <Button type="primary" onClick={addToCart} style={{ marginRight: '16px' }}>Add to Cart</Button>
        <Button type="default" onClick={addToWishlist}>Add to Wishlist</Button>
      </Content>
    </Layout>
  );
};

export default ProductDetail;
