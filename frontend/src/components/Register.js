// Register.js

import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import './styles.css'; // Import the CSS file


const Register = ({ registerUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [pic, setPic] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users', { name, email, password, pic });
            registerUser(response.data);
        } catch (error) {
            setError('User already exists');
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <div className="form-container">
                        <h2 className="form-title">Register</h2>
                        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="name">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            {/* <Form.Group controlId="pic">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter profile picture URL"
                                    value={pic}
                                    onChange={(e) => setPic(e.target.value)}
                                />
                            </Form.Group> */}
                            <Button variant="primary" type="submit" className="btn-submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
