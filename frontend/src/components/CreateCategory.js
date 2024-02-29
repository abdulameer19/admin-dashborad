// CreateCategory.js
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/categories', { name, description });
            setSuccess(true);
            setName('');
            setDescription('');
        } catch (error) {
            setError('Failed to create category');
        }
    };

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Category created successfully</Alert>}
            <div className="card mt-4">
                <div className="card-body">
                    <h5 className="card-title text-center mb-4">Create Category</h5>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <style jsx>{`
                .card {
                    width: 80%;
                    margin: 0 auto;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .card-body {
                    padding: 0;
                }
                .card-title {
                    font-size: 1.25rem;
                }
                .mb-3 {
                    margin-bottom: 1rem;
                }
                .text-center {
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default CreateCategory;
