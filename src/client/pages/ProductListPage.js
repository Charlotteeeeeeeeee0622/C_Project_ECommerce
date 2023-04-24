import { Link ,useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Input, Select, Card, Row, Col, Spin, Button, message, Modal } from 'antd';
import axios from 'axios';
import ProductForm from './CreateProductForm';
import './productlist.css';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002'
});

const ProductsListPage = () => {
  // ... your existing code
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');

  const [filter, setFilter] = useState({
    search: '',
    category: '',
    sort: '',
  });

  const navigate = useNavigate();

  const onProductClick = (_id) => {
    navigate(`/products/${_id}`);
  };
  // Add a new state variable to track the form mode
  const [formMode, setFormMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ... your existing useEffect and other functions
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


  const handleSearch = value => {
    setFilter({ ...filter, search: value });
  };

  const handleCategoryChange = value => {
    setFilter({ ...filter, category: value });
  };

  const handleSortChange = value => {
    setFilter({ ...filter, sort: value });
  };

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

  const openCreateForm = () => {
    setSelectedProduct(null);
    setFormMode('create');
    setIsModalVisible(true);
  };

  const openEditForm = (product) => {
    setSelectedProduct(product);
    setFormMode('edit');
    setIsModalVisible(true);
  };

  const onEditButtonClick = (product) => {
    openEditForm(product);
  };
  
  const closeModal = () => {
    setIsModalVisible(false);
    setFormMode(null);
  };


  return (
    <Layout>
      <Header className='title'>Product List</Header>

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
        <Input.Search className="search-input" placeholder="Search products..." onSearch={handleSearch} />
        <Select className="category-select" placeholder="Category" onChange={handleCategoryChange}>
          <Option value="">All</Option>
          <Option value="electronics">Electronics</Option>
          <Option value="clothing">Clothing</Option>
          <Option value="books">Books</Option>
        </Select>
        <Select className="sort-select" placeholder="Sort by" onChange={handleSortChange}>
          <Option value="">Default</Option>
          <Option value="price_asc">Price (Low to High)</Option>
          <Option value="price_desc">Price (High to Low)</Option>
        </Select>
        <Button type="primary" className="add-product-button" onClick={openCreateForm}>
          Add New Product
        </Button>

        {error && <div>{error}</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <Spin />
          </div>
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            {console.log('Rendering products:', products)} {/* Add this line */}
            {products.map(product => (
  <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
    {/* <Link to={`/products/${product._id}`}> */}
      <Card hoverable 
        onClick={() => onProductClick(product._id)}

        cover={<div className="product-image-wrapper"><img src={`http://localhost:3002${product.imageLink}`} alt={product.productName} /></div>}
        actions={[
          <Button type="primary" onClick={(e) => {e.stopPropagation(); onEditButtonClick(product)}}>
            Edit
          </Button>,
        ]}
      >
        <Card.Meta title={product.productName} description={`$${product.price}`} />
      </Card>
    {/* </Link> */}
  </Col>
))}

          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default ProductsListPage;
