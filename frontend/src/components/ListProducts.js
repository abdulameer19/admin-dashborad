// ProductList.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsResponse = await axios.get('/api/products');
            setProducts(productsResponse.data);

            const categoriesResponse = await axios.get('/api/categories');
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`);
            fetchData();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleUpdate = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleSaveChanges = async () => {
        try {
            const selectedCategory = categories.find(category => category._id === selectedProduct.category);
            if (!selectedCategory) {
                throw new Error('Selected category not found');
            }

            const updatedProduct = { ...selectedProduct, category: selectedCategory._id };
            await axios.put(`/api/products/${selectedProduct._id}`, updatedProduct);
            setShowModal(false);
            setSelectedProduct(null);
            fetchData();
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };




    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>
                                <Button variant="info" onClick={() => handleUpdate(product)}>Update</Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(product._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProductName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={selectedProduct?.name || ''} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formProductDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={selectedProduct?.description || ''} onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formProductPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" value={selectedProduct?.price || ''} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formProductCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" value={selectedProduct?.category || ''} onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}>
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductList;
