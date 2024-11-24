import './Layout.css';

import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './Header';

function Layout() {
	return (
		<div className='home-layout'>
			<Header />
			<Outlet />
		</div>
	);
}

export default Layout;
