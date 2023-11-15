import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import login from "./login";
import storeOwner from "./storeowner";
import siteManager from './sitemanager';
import customer from './customer/customer';

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
        <Route path="/login" element={<login />} />
        <Route path="/sitemanager" element={<siteManager/>} />
        <Route path="/storeowner" element={<storeOwner />} />
        <Route path="/customer" element={<customer />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}