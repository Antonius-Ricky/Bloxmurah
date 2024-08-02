import React, { useState } from 'react';
import Header from '../../components/header';
import Content from '../../components/content';
import Footer from '../../components/footer';
import Sidebar from '../../components/sidebar';
import './landingpage.css';

const LandingPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="App">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className={`main-content ${isSidebarOpen ? '' : 'expanded'}`}>
                <Header />
                <Content />
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
