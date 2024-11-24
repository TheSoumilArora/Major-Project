import './DashLayout.css';

import React from 'react';

import DashHeader from './DashHeader';

function DashLayout({ children }) {
	return (
		<div className='dash-layout'>
			<DashHeader />
			<main className='dash-layout-main-content'>{children}</main>
		</div>
	);
}

export default DashLayout;
