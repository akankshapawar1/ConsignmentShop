// InventoryList.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const InventoryList = () => {
  const location = useLocation();
  const { computerList } = location.state || { computerList: [] }; // Fallback to an empty list if state is undefined

  if (computerList.length === 0) {
    return <div>No computers found in the inventory.</div>;
  }

  return (
    <div>
      <h2>Inventory Report</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Computer ID</th>
            <th>Store ID</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Memory</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {computerList.map(computer => (
            <tr key={computer.computer_id}>
              <td>{computer.computer_id}</td>
              <td>{computer.store_id}</td>
              <td>{computer.brand}</td>
              <td>{computer.price}</td>
              <td>{computer.memory}</td>
              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;
