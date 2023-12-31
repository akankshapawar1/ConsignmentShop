import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./login";
import StoreOwner from "./storeowner";
import SiteManager from './sitemanager';
import Customer from './customer/customer';
import StoreDetail from './StoreDetail'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/store-detail/:storeId" element={<StoreDetail />} />
        <Route path="/sitemanager" element={<SiteManager/>} />
        <Route path="/storeowner" element={<StoreOwner />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </Router>
  );
}
