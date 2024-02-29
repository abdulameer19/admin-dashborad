import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import './styles.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const Login = ({ loginUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
            alert("Logged In");
            navigate('/dash');
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Col xs={12} md={6}>
                    <div className="form-container">
                        <h2 className="form-title text-center">Login</h2>
                        {error && <Alert variant="danger" className="error-message">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="email" className="mb-3">
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="password" className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="btn-submit w-100">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
