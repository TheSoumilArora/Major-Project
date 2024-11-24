import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuthContext } from './authContext';

const usePost = (url, header, token) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const resetError = useCallback(() => setError(null), []);

	const authObject = useAuthContext();
	const authToken = token ? authObject.authState.token : null;
	const { logoutHandler } = authObject;

	const sendRequest = useCallback(
		async (data, handleData) => {
			setIsLoading(true);
			setError(null);

			const headers = {
				Accept: 'application/json, text/plain, */*',
				'Content-type': 'application/json',
				...(token && { Authorization: `Bearer ${authToken}` }),
				...(header && header),
			};

			try {
				const response = await fetch(url, {
					method: 'POST',
					headers,
					body: JSON.stringify(data),
				});
				if (response.status === 403) {
					toast('Session timeout!');
					logoutHandler(true);
				}

				if (response.ok) {
					const responseData = await response.json();
					handleData(responseData);
				} else {
					const errorMessage = await response.json();
					setError(errorMessage.message);
				}
			} catch (err) {
				console.log(err);
				setError('Something went wrong!' || err.message);
			} finally {
				setIsLoading(false);
			}
		},
		[authToken, header, token, url, logoutHandler]
	);

	return {
		isLoading,
		error,
		sendRequest,
		resetError,
	};
};

export default usePost;
