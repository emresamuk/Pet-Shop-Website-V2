import React from 'react';
import UserManagement from './UserManagement';
import ContactManagement from './ContactManagement';
import TestimonialManagement from './TestimonialManagement';
import './css/AdminPanel.css';
import ProductManagement from './ProductManagement';
import TeamManagement from './TeamManagement';
import SliderManagement from './SliderManagement';
import SubscribeManagement from './SubscribeManagement';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <UserManagement />
      <ContactManagement />
      <TestimonialManagement />
      <ProductManagement />
      <TeamManagement />
      <SliderManagement />
      <SubscribeManagement />
    </div>
  );
};

export default AdminPanel;
