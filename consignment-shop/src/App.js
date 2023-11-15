import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./Login";
import StoreOwner from "./StoreOwner";
import SiteManager from './SiteManager';
import Customer from './customer/Customer';

/* const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    padding: 20,
    textAlign: 'center'
  }
}; */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/SiteManager" element={<SiteManager/>} />
        <Route path="/StoreOwner" element={<StoreOwner />} />
        <Route path="/Customer" element={<Customer/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}