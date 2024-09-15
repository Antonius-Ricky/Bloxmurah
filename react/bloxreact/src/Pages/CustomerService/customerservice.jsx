import React from 'react';
import 'remixicon/fonts/remixicon.css'; 
import './customerservice.css';

const CustomerService = () => {
    const wa_number = '+6287748628680'
    const whatsappLink = `https://wa.me/${wa_number}`;
    const emailLink = 'mailto:bloxmurah@gmail.com'; 
    const instagramLink = 'https://instagram.com/bloxmurah'

    return (
        <div className="customer-service-container">
            <h2>Contact Us</h2>
            <div className="contact-card">
                <div className="card-item">
                    <div className="card-icon">
                        <i class="ri-whatsapp-fill"></i>
                    </div>
                    <div className="card-content">
                        <h3>Contact Whatsapp</h3>
                        <p>Punya keluhan dan butuh bantuan terkait layanan kami? Kamu bisa hubungi menggunakan whatsapp melalui tautan di bawah ini ya.</p>
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="card-link">Kunjungi</a>
                    </div>
                </div>

                <div className="card-item">
                    <div className="card-icon">
                        <i className="ri-mail-fill"></i>
                    </div>
                    <div className="card-content">
                        <h3>Contact Email</h3>
                        <p>Hubungi tim Bloxmurah untuk mendapatkan informasi yang relevan sesuai kebutuhan kamu.</p>
                        <a href={emailLink} className="card-link">contact@bloxmurah.com</a>
                    </div>
                </div>

                <div className="card-item">
                    <div className="card-icon">
                        <i class="ri-instagram-fill"></i>
                    </div>
                    <div className="card-content">
                        <h3>Contact Instagram</h3>
                        <p>Kamu bisa menggunakan instagram untuk menghubungi bloxmurah dan informasi promo menarik </p>
                        <a href={instagramLink} className="card-link">Kunjungi</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerService;
