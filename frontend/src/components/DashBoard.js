import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import CreateCategory from './CreateCategory';

const Dashboard = () => {
    const [selected, setSelected] = useState(null);

    const handleSelect = (key) => {
        setSelected(key);
    };

    return (
        <Container fluid>
            <Row>
                <Col sm={2} style={{ backgroundColor: '#343a40', minHeight: '100vh', paddingTop: '20px', boxShadow: '5px 0px 15px rgba(0, 0, 0, 0.1)' }}>
                    <Nav className="flex-column" style={{ width: '80%', margin: '0 auto' }}>
                        <Nav.Link eventKey="addProducts" as={Link} to="/dash/addProducts" onSelect={() => handleSelect('addProducts')}>Add Products</Nav.Link>
                        <Nav.Link eventKey="allProducts" as={Link} to="/dash/allProducts" onSelect={() => handleSelect('allProducts')}>All Products</Nav.Link>
                        <Nav.Link eventKey="addCategory" as={Link} to="/dash/addCategory" onSelect={() => handleSelect('addCategory')}>Add Category</Nav.Link>
                        <Nav.Link eventKey="allCategories" as={Link} to="/dash/allCategories" onSelect={() => handleSelect('allCategories')}>All Category</Nav.Link>
                    </Nav>
                </Col>
                <Col sm={10} style={{ padding: '20px' }}>
                    <Outlet />
                    {selected === 'addProduct' && <Card>Add Products Component</Card>}
                    {selected === 'allProducts' && <Card>All Products Component</Card>}
                    {selected === 'category' && <Card>Category Component</Card>}
                    {selected === 'allCategories' && <Card>All Categories Component</Card>}
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
