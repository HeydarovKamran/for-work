import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/Login';
import PostPage from './Pages/Post';
import MyPosts from './Pages/MyPosts';
import RegisterPage from './Pages/Register';
import Header from './Layout/Header';
import PrivateRoute from './Routes/Private.routes';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute element={<PostPage />} />} />
        <Route path="/mypost" element={<PrivateRoute element={<MyPosts />} />} />
      </Routes>
    </Router>
  );
}

export default App;
