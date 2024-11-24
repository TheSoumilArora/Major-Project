import './NotFound.css';

import React from 'react';

const NotFoundPage = () => {
	return (
		<div className='not-found-container'>
			<h1 className='not-found-message'>404 Not Found</h1>
			<p className='not-found-description'>
				The page you are looking for does not exist.
			</p>
		</div>
	);
};

export default NotFoundPage;
