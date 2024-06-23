import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, addProduct, selectProducts } from '../redux/productsSlice';
import { Form, Button, InputGroup, Modal } from 'react-bootstrap';

const ProductsTab = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });
  const [errors, setErrors] = useState({});

  const handleUpdateProduct = (productId, updatedDetails) => {
    if (validateProduct(updatedDetails)) {
      dispatch(updateProduct({ id: productId, ...updatedDetails }));
      setErrors({});
    } else {
      setErrors({ [productId]: 'Invalid product details' });
    }
  };

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct); 
    if (validateProduct(newProduct)) {
      dispatch(addProduct({ ...newProduct, id: Date.now().toString() }));
      console.log('Product added successfully'); 
      setNewProduct({ name: '', price: '' });
      setShowModal(false);
      setErrors({});
    } else {
      console.log('Product validation failed'); 
      setErrors({ form: 'Please provide valid product details' });
    }
  };

  const validateProduct = (product) => {
    return product.name && product.price > 0;
  };

  return (
    <div>
      <h2>Products</h2>
      {products && products.length > 0 ? (
        products.map(product => (
          <InputGroup key={product.id} className="mb-3">
            <Form.Control
              type="text"
              value={product.name}
              onChange={e => handleUpdateProduct(product.id, { name: e.target.value })}
              placeholder="Product Name"
              isInvalid={!!errors[product.id]}
            />
            <Form.Control
              type="number"
              value={product.price}
              onChange={e => handleUpdateProduct(product.id, { price: parseFloat(e.target.value) })}
              placeholder="Product Price"
              isInvalid={!!errors[product.id]}
            />
            <Form.Control.Feedback type="invalid">
              {errors[product.id]}
            </Form.Control.Feedback>
          </InputGroup>
        ))
      ) : (
        <p>No products available.</p>
      )}
      <Button onClick={() => setShowModal(true)}>Add Product</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
                isInvalid={!!errors.form}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                placeholder="Enter product price"
                isInvalid={!!errors.form}
              />
              <Form.Control.Feedback type="invalid">
                {errors.form}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductsTab;
