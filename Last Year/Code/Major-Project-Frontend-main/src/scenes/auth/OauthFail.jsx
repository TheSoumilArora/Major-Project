import './OauthFail.css';

import React from 'react';
import { Link } from 'react-router-dom';

const OauthFail = () => {
	return (
		<div className='oauth-fail'>
			<h2>Login has failed.</h2>
			<p>
				Go back to the <Link to='/login'>Login page</Link>.
			</p>
		</div>
	);
};

export default OauthFail;
