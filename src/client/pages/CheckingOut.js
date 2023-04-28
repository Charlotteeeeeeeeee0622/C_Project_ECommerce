import React from 'react';
import { Modal, Button, List } from 'antd';

const CheckoutModal = ({ isVisible, cartItems, onClose }) => {
  return (
    <Modal
      title="Checkout"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Close
        </Button>,
        <Button key="submit" type="primary">
          Proceed to Payment
        </Button>,
      ]}
    >
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <p>Please review your items:</p>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`$${item.price}`}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </Modal>
  );
};

export default CheckoutModal;
