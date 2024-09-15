import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://127.0.0.1:5000/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders. Make sure you are an admin.');
    }
  };

  const updateOrder = async (orderId, paymentStatus, orderStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:5000/admin/orders/${orderId}`,
        { payment_status: paymentStatus, order_status: orderStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(); 
    } catch (err) {
      setError('Failed to update order status.');
    }
  };

  return (
    <div>
      <h1>Admin Orders</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Username</th>
            <th>Payment Method</th>
            <th>Phone Number</th>
            <th>Items</th>
            <th>Total Purchase</th>
            <th>Payment Status</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.username}</td>
              <td>{order.payment_method}</td>
              <td>{order.phone_number}</td>
              <td>{order.items}</td>
              <td>{order.total_purchase}</td>
              <td>
                <select
                  value={order.payment_status}
                  onChange={(e) => updateOrder(order.id, e.target.value, order.order_status)}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </td>
              <td>
                <select
                  value={order.order_status}
                  onChange={(e) => updateOrder(order.id, order.payment_status, e.target.value)}
                >
                  <option value="Pending">Pending (waiting for payment)</option>
                  <option value="Processing">Processing (waiting for admin to process)</option>
                  <option value="Completed">Completed (success)</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
