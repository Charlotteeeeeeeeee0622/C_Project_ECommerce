import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, Card, Row, Col, Spin, Button, message, Modal, Image, Space, Typography } from 'antd';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import axios from 'axios';
import ProductForm from './CreateProductForm';
import ShoppingCartModal from './ShoppingCart';

const { Header, Content } = Layout;
const { Option } = Select;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002'
});

const { Title } = Typography;

const ProductsListPage = () => {
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    search: '',
    category: '',
    sort: '',
  });
  // loading products
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/products', { params: filter })
      .then(response => {
        setProducts(response.data);
        console.log('Fetched products:', response.data); // Add this line
        setLoading(false);
      })
      .catch(error => {
        setError('Error loading products.');
        setLoading(false);
      });
  }, [filter]);

  // click the card
  const navigate = useNavigate();
  const onProductClick = (_id) => {
    navigate(`/products/${_id}`);
  };

  // search, category and sort
  const handleSearch = value => {
    setFilter({ ...filter, search: value });
  };
  const handleCategoryChange = value => {
    setFilter({ ...filter, category: value });
  };
  const handleSortChange = value => {
    setFilter({ ...filter, sort: value });
  };

  // create and edit product
  const [formMode, setFormMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCreateProduct = async (newProduct) => {
    try {
      await axiosInstance.post('/products', newProduct);
      message.success('Product created successfully');
      setFormMode(null);
      // Refresh the products list after creating a new product
      setFilter({ ...filter });
    } catch (error) {
      console.error(error);
      message.error('Error creating product');
    }
  };
  const handleEditProduct = async (updatedProduct) => {
    try {
      await axiosInstance.put(`/products/${updatedProduct._id}`, updatedProduct);
      message.success('Product updated successfully');
      setFormMode(null);
      // Refresh the products list after updating a product
      setFilter({ ...filter });
    } catch (error) {
      console.error(error);
      message.error('Error updating product');
    }
  };
  // create product modal
  const openCreateForm = () => {
    setSelectedProduct(null);
    setFormMode('create');
    setIsModalVisible(true);
  };
  // edit product modal
  const openEditForm = (product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setIsModalVisible(true);
  };
  // close these two modal
  const closeModal = () => {
    setIsModalVisible(false);
    setFormMode(null);
  };
  const onEditButtonClick = (product) => {
    openEditForm(product);
  };


  const [productQuantity, setProductQuantity] = useState(0);

  // card modal
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  // Initialize cartItems as an empty object
  const [cartItems, setCartItems] = useState({});
  // Function to handle adding an item to the cart
  const handleAddToCart = (product) => {
    if (!product) {
      console.error('handleAddToCart called with undefined product');
      return;
    }
    setCartItems(prevCartItems => {
      // Check if the product is already in the cart
      if (prevCartItems[product._id]) {
        // If it is, increment its quantity
        return { ...prevCartItems, [product._id]: { ...prevCartItems[product._id], quantity: prevCartItems[product._id].quantity + 1 } };
      } else {
        // If it's not, add it to the cart with a quantity of 1
        return { ...prevCartItems, [product._id]: { id: product._id, name: product.productName, price: product.price, quantity: 1 } };
      }
    });
  };
  // Function to handle removing an item from the cart
  const handleRemoveFromCart = (productId) => {
    if (!productId) {
      console.error('handleRemoveFromCart called with undefined productId');
      return;
    }
    setCartItems(prevCartItems => {
      // Check if the product is in the cart
      if (prevCartItems[productId]) {
        // If the quantity is greater than 1, decrement it
        if (prevCartItems[productId].quantity > 1) {
          return { ...prevCartItems, [productId]: { ...prevCartItems[productId], quantity: prevCartItems[productId].quantity - 1 } };
        } else {
          // If the quantity is 1, remove the product from the cart
          const updatedCartItems = { ...prevCartItems };
          delete updatedCartItems[productId];
          return updatedCartItems;
        }
      } else {
        // If the product is not in the cart, return the previous cart items
        return prevCartItems;
      }
    });
  };

  return (
    <Layout>
      <Header className='title' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ color: 'white', margin: 0 }}>Product List</Title>
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => setIsCartModalVisible(true)}>
          Shopping Cart
        </Button>
      </Header>
      <ShoppingCartModal
        cartItems={Object.values(cartItems)}
        visible={isCartModalVisible}
        onClose={() => setIsCartModalVisible(false)}
      />
      <Modal
        title={formMode === 'create' ? 'Add New Product' : 'Edit Product'}
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {formMode === 'create' && (
          <ProductForm onSubmit={handleCreateProduct} />
        )}
        {formMode === 'edit' && (
          <ProductForm onSubmit={handleEditProduct} productData={selectedProduct} />
        )}
      </Modal>
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large">
          <Space size="middle">
            <Input.Search placeholder="Search products..." onSearch={handleSearch} />
            <Select placeholder="Category" onChange={handleCategoryChange}>
              <Option value="">All</Option>
              <Option value="electronics">Electronics</Option>
              <Option value="clothing">Clothing</Option>
              <Option value="books">Books</Option>
            </Select>
            <Select placeholder="Sort by" onChange={handleSortChange}>
              <Option value="">Default</Option>
              <Option value="price_asc">Price (Low to High)</Option>
              <Option value="price_desc">Price (High to Low)</Option>
            </Select>
            <Button type="primary" onClick={openCreateForm}>
              Add New Product
            </Button>
          </Space>
          {error && <div>{error}</div>}
          {loading ? (
            <Spin />
          ) : (
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
              {products.map(product => (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  {/* <Link to={`/products/${product._id}`}> */}
                  <Card hoverable
                    onClick={() => onProductClick(product._id)}
                    cover={
                      <Image
                        width="100%"
                        height={200}
                        src={`http://localhost:3002${product.imageLink}`}
                        alt={product.productName}
                      />
                    }
                    actions={[
                      <Button
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditButtonClick(product);
                        }}
                      >
                        Edit
                      </Button>,
                      <Space>
                        <Button
                          className="decrease-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromCart(product);
                          }}
                        >
                          -
                        </Button>
                        <span>{cartItems[product._id] ? cartItems[product._id].quantity : 0}</span>
                        <Button
                          className="add-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          +
                        </Button>
                      </Space>,
                    ]}
                  >
                    <Card.Meta title={product.productName} description={`$${product.price}`} />
                  </Card>
                  {/* </Link> */}
                </Col>
              ))}
            </Row>
          )}
        </Space>
      </Content>
    </Layout>
  );

}

export default ProductsListPage;
