import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuthContext } from './authContext';

const useGet = (url, header, method, token) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const authObject = useAuthContext();
	const authToken = authObject.authState.token;
	const { logoutHandler } = authObject;

	const sendRequest = useCallback(
		async (handleData) => {
			setIsLoading(true);
			setError(null);

			const headers = {};
			if (token) headers.Authorization = `Bearer ${authToken}`;
			if (header) Object.assign(headers, header); // Corrected headers assignment

			try {
				const response = await fetch(url, {
					method: method || 'GET',
					headers,
				});
				if (response.status === 403) {
					toast('Session timeout!');
					logoutHandler(true);
				}
				const responseData = await response.json();
				handleData(responseData);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		},
		[authToken, url, header, token, method, logoutHandler]
	);

	return {
		isLoading,
		error,
		sendRequest,
	};
};

export default useGet;
