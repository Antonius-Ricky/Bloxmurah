import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './orderhistory.css';

const OrderHistory = ({ category }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/orders/history?category=${category}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [category]);

    const formatOrderId = (id) => {
        return `BM${id.toString().padStart(7, '0')}`;
    };

    const handleCardClick = (orderId) => {
        const formattedId = formatOrderId(orderId);  
        navigate(`/payment/${formattedId}`);  
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="order-history-container">
            {orders.length === 0 ? (
                <div>No orders found for this category</div>
            ) : (
                orders.map((order) => (
                    <div 
                        key={order.id} 
                        className="order-card" 
                        onClick={() => handleCardClick(order.id)} 
                    >
                        <div className="order-history-status">
                            <span>{order.order_status}</span>
                        </div>
                        <div className="order-header">
                            <span className="order-id">{formatOrderId(order.id)}</span>
                            <span className="order-date">{new Date(order.created_at).toLocaleString()}</span>
                        </div>
                        <div className="order-history-details">
                            <div className="order-info">
                                <h3>{order.items}</h3>
                            </div>
                        </div>
                        <div className="order-total">
                            <span>Total Pembelian</span>
                            <span className="order-total-price">Rp. {order.total_purchase}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderHistory;
