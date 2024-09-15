import React, { useEffect, useState } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import axios from 'axios';
import './payment.css';
import qr_code from '../../assets/images/qr_code.png';
import 'remixicon/fonts/remixicon.css';

const PaymentPage = ({ token }) => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const POLLING_INTERVAL = 10000;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/order/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrder(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
            
                    navigate('/404');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
        const intervalId = setInterval(fetchOrder, POLLING_INTERVAL);
        return () => clearInterval(intervalId);
    }, [orderId, token]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'orange';
            case 'Processing':
                return 'yellow';
            case 'Completed':
                return 'green';
            default:
                return 'black';
        }
    };

    const getPaymentStatusColor = (status) => {
        return status === 'Unpaid' ? 'red' : 'green';
    };

    const transactionid = (id) => {
        return `BM${id.toString().padStart(7, '0')}`;
    };

    const generateWhatsAppMessage = () => {
        const message = `
            *I made an order on BloxMurah website,this is my order details:*

Transaction ID: *${transactionid(order.id)}*
Roblox Username: *${order.username}*
Total Purchase: *Rp ${order.total_purchase}*
Product Detail: *${order.items}*
Payment Status: *${order.payment_status}*
Order Status: *${order.order_status}*`;
        return encodeURIComponent(message);
    };
    const wa_number = '+6287748628680'
    const whatsappLink = `https://wa.me/${wa_number}?text=${generateWhatsAppMessage()}`;

    return (
        <div className="payment-container">
            {order ? (
                <div className="order-details">
                    <h1>Order Details</h1>

                    <p>Transaction ID: <span className="transaction-id">{transactionid(order.id)}</span></p>
                    <p>Roblox Username: <span className="username">{order.username}</span></p>
                    <p>Total Purchase: <span className="total-purchase">Rp {order.total_purchase}</span></p>
                    <p>Product Detail: <span className="product-detail">{order.items}</span></p>
                    <p className="payment-status">
                        Payment Status: <span style={{ color: getPaymentStatusColor(order.payment_status) }}>{order.payment_status}</span>
                    </p>
                    <p className="order-status">
                        Order Status: <span style={{ color: getOrderStatusColor(order.order_status) }}>{order.order_status}</span>
                    </p>
                    <p>
                        <span className="note">
                        Please complete the payment so we can process the order immediately.
                        If you need help, please contact us.
                        </span>
                    </p>
                </div>
            ) : (
                <p>No order data available.</p>
            )}

            <div className="payment-methods">
                <h1>Payment Methods</h1>
                {order && order.payment_method === 'qr_code' && (
                    <div className="qr-container">
                        <p>Amory Store</p>
                        <p>NMID: ID102307938986</p>
                        <img src={qr_code} alt="QR Code" className="qr-image" />
                    </div>
                )}
                {order && order.payment_method === 'bca' && (
                    <div className="bca-instructions">
                        <h2>BCA Payment Instructions</h2>
                        <p>1. Log in to your BCA mobile banking app.</p>
                        <p>2. Select 'Transfer' and choose 'BCA Virtual Account'.</p>
                        <p>3. Enter the virtual account number and the amount.</p>
                        <p>4. Confirm your transaction and complete the payment.</p>
                    </div>
                )}
                <div className="contact-us">
                    <span>Contact Us :</span>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <i className="ri-whatsapp-fill contact-us-icon"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
