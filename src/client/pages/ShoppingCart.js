import React from 'react';
import { Modal, Button, List ,Typography} from 'antd';

const ShoppingCartModal = ({ cartItems, visible, onClose }) => {
    // Check if cartItems is an array, and if not, set it to an empty array
const items = Array.isArray(cartItems) ? cartItems : [];

return (
  <Modal
    title="Shopping Cart"
    visible={visible}
    onCancel={onClose}
    footer={[
      <Button key="back" onClick={onClose}>
        Close
      </Button>,
    ]}
  >
    {items.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <List
        itemLayout="horizontal"
        dataSource={items}  // Use items here instead of cartItems
        renderItem={item => (
            <List.Item>
            <List.Item.Meta
              title={item.name}
              description={`$${item.price}`}
            />
            <Typography.Text>Quantity: {item.quantity}</Typography.Text>
          </List.Item>
        )}
      />
    )}
  </Modal>
);
};

export default ShoppingCartModal;
