import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./login";
import StoreOwner from "./storeowner";
import SiteManager from './sitemanager';
import Customer from './customer/customer';

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
        <Route path="/sitemanager" element={<SiteManager/>} />
        <Route path="/storeowner" element={<StoreOwner />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </Router>
  );
}
