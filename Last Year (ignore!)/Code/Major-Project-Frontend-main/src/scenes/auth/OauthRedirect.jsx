import { useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { useAuthContext } from '../../hooks/authContext';
import OauthFail from './OauthFail';

const OauthRedirect = () => {
	const authObject = useAuthContext();
	const setToken = authObject?.loginHandler;

	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const username = searchParams.get('username');

	useEffect(() => {
		if (token) {
			const data = { token, username };
			setToken(data);
		}
	}, [token, username, setToken]);

	return token ? <Navigate to='/dashboard' /> : <OauthFail />;
};

export default OauthRedirect;
