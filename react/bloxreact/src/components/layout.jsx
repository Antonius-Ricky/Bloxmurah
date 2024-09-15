import React from 'react';
import Header from './header';

const Layout = ({ children, username, token }) => {
    return (
        <div>
            <Header username={username} token={token} />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
