import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './gamepage.css';
import 'remixicon/fonts/remixicon.css'; 
import bf_icon from '../../assets/images/bf_icon.png';
import PetsimIcon from '../../assets/images/Petsim99_Icon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const gameMapping = {
    bloxfruit: {
        originalName: "Blox Fruit",
        icon: bf_icon,
    },
    petsimulator99: {
        originalName: "Pet Simulator 99",
        icon: PetsimIcon,
    },
};

const tutorialText = {
    Fruit: "Masukan username add friend lalu trade di second sea",
    Account: "Akun akan dikirimkan melalui WhatsApp dan harap ganti password setelah dikirimkan",
    Joki: "Harap memberikan password and key jika dipasang jika sudah melakukan pembelian",
    Gems : "Pesan dan pastikan username benar karena akan dikirimkan melalui mailbox"
};

const GamePage = ({ token }) => {
    const { gameName } = useParams();
    const navigate = useNavigate(); 
    const [items, setItems] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const gameData = gameMapping[gameName] || {};
    const { originalName, icon } = gameData;

    useEffect(() => {
        if (!originalName) {
            navigate('/404');
        } else {
            fetchCategories();
        }
        window.scrollTo(0, 0);
    }, [originalName, navigate]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/categories/${gameName}`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
            setSelectedCategory(data[0]);
            fetchItems(data[0]);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchItems = async (category) => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/items/${gameName}/${category}`);
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const [username, setUsername] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleItemSelection = (item) => {
        setSelectedItems(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const handleQuantityChange = (itemId, amount) => {
        setQuantity(prev => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 1) + amount, 1)
        }));
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedItems([]);  
        setQuantity({});  
    };
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        setPhoneNumber(numericValue);
    };

    const handleBuy = async () => {
        if (!username || !paymentMethod || !phoneNumber || selectedItems.length === 0) {
            toast.error('Please fill in all fields and select at least one item.');
            return;
        }
    
        const itemsString = selectedItems.map(item => `${quantity[item.id] || 1} ${item.name}`).join(', ');
    
        const purchaseData = {
            username,
            items: itemsString,
            paymentMethod,
            phoneNumber,
            totalPurchase: totalPrice
        };
    
        try {5000
            const response = await fetch('http://127.0.0.1:5000/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(purchaseData)
            });
    
            if (!response.ok) throw new Error('Failed to submit order');
    
            const data = await response.json();
            const orderId = data.order_id;
    
            toast.success('Order submitted successfully!');
            setTimeout(() => navigate(`/payment/${orderId}`), 2000);
    
        } catch (error) {
            toast.error('Error submitting order: ' + error.message);
        }
    };
    
    const formatPrice = (price) => {
        return `Rp.${price.toLocaleString('id-ID').split(',')[0]}`;
    };

    const totalPrice = selectedItems.reduce((sum, item) => {
        return sum + item.price * (quantity[item.id] || 1);
    }, 0);

    return (
        <div className="game-page">
            <div className="left-column">
                <div className="game-info">
                    <img src={icon} alt={originalName} className="game-icon" />
                    <h1 className="game-name">{originalName}</h1>
                    <p className="selected-category">{selectedCategory}</p>
                </div>
                <div className="tutorial">
                    <p>{tutorialText[selectedCategory] || "Select a category to see the tutorial."}</p>
                </div>
            </div>

            <div className="right-column">
                <div className="user-input-section">
                    <h3>1. Input Your Username</h3>
                    <label>Roblox Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>

                <div className="items-list">
                    <h3>2. Select Items</h3>
                    <div className="category-selector">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => {
                                    handleCategoryChange(category);
                                    fetchItems(category);
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {loading ? (
                        <p>Loading items...</p>
                    ) : (
                        <>
                            {items.length > 0 ? (
                                <div className="items-grid">
                                    {items.map(item => (
                                        <div key={item.id} className="item-container">
                                            <div className="item-content">
                                                <img src={item.image} alt={item.name} className="item-image" />
                                                <div className="item-details">
                                                    <p className="item-name">{item.name}</p>
                                                    <p className="item-price">{formatPrice(item.price)}</p>
                                                </div>
                                                <div className="checkbox-container">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(item)}
                                                        onChange={() => handleItemSelection(item)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No items available for this category.</p>
                            )}
                        </>
                    )}
                </div>

                <div className="payment-section">
                    <h3>3. Select Payment Method</h3>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select Payment Method</option>
                        <option value="qr_code">QR Code</option>
                        <option value="bca">BCA MOBILE</option>
                    </select>
                </div>

                <div className="contact-promo-section">
                    <h3>4. Contact</h3>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="08xxxxxxxx"
                        pattern="[0-9]{10,15}" 
                        inputMode="numeric"    
                    />
                </div>

                <div className="summary-section">
                    <h3>5. Product Summary</h3>
                    {selectedItems.length > 0 ? (
                        <div className="summary-content">
                            {selectedItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <p className="summary-item-name">{item.name}</p>
                                    <div className="quantity">
                                        <i 
                                            className="ri-indeterminate-circle-fill quantity-icon" 
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                        ></i>
                                        <span>{quantity[item.id] || 1}</span>
                                        <i 
                                            className="ri-add-circle-fill quantity-icon" 
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                        ></i>
                                    </div>
                                </div>
                            ))}
                            <p className="total-price">
                                Total Purchase: <span className="price-number">{formatPrice(totalPrice)}</span>
                            </p>
                        </div>
                    ) : (
                        <p>No items selected</p>
                    )}
                    <div className="summary-actions">
                        <button className="reset-button" onClick={() => window.location.reload()}>Reset</button>
                        <button className="buy-button"onClick={handleBuy}>Buy Now</button>
                        <ToastContainer position="top-right" autoClose={5000} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
