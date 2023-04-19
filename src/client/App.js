import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
// import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import Home from './pages/Home'
import ProductsListPage from './pages/ProductListPage';
// import ProductsPage from './ProductsPage';
// import axios from 'axios';


const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <Content>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/products" element={< ProductsListPage/>} />
            <Route exact path="/signin" element={<LoginPage />} />
            <Route exact path="/signup" element={<SignUpPage />} />
            <Route exact path="/update-password" element={<UpdatePasswordPage />} />
          </Routes>
          </Content>
        <Footer />
      </div>
    </Router>
  );
};


export default App;
