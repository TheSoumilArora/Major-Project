import './Layout.css';

import React from 'react';
import { Link } from 'react-router-dom';

const DashHeader = () => {
	return (
		<header className='dash-header'>
			<div className='dash-header__logo'>
				<Link to='/'>
					<h2 className='dash-header__title'>
						Wireless Geophone Sensor
					</h2>
				</Link>
			</div>
		</header>
	);
};

export default DashHeader;
