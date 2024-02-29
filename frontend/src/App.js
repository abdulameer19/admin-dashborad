import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CreateCategory from './components/CreateCategory';
import Dashboard from './components/DashBoard';
import CategoryList from './components/ListCategories';
import ProductList from './components/ListProducts';
import CreateProduct from './components/CreateProducts';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/dash" element={<Dashboard />}>
          <Route path="addCategory" element={<CreateCategory />} />
          <Route path="allCategories" element={<CategoryList />} />
          <Route path="allProducts" element={<ProductList />} />
          <Route path="addProducts" element={<CreateProduct />} />


        </Route>
      </Routes>
    </Router>
  );
}

export default App;
