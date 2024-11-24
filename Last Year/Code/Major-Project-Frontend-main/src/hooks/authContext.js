/* eslint-disable react/jsx-no-useless-fragment */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useSearchParams } from 'react-router-dom';

const AuthContext = createContext();

const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
	const [authState, setAuthState] = useState(() => {
		const storedToken = localStorage.getItem('stockbettoken');
		if (storedToken) {
			const parsedToken = JSON.parse(storedToken);
			if (!parsedToken.username)
				return { token: parsedToken.token, username: '' };
			return parsedToken;
		}
		return null;
	});

	const isAuth = authState !== null;

	const loginHandler = (token) => {
		setAuthState(token);
		localStorage.setItem('stockbettoken', JSON.stringify(token));
		toast.success('Logged-In Successfully');
	};

	const logoutHandler = (noToast = false) => {
		setAuthState(null);
		localStorage.removeItem('stockbettoken');
		if (!noToast) toast.success('Logged-Out Successfully');
	};

	useEffect(() => {
		// eslint-disable-next-line consistent-return
		const checkIsUserVerified = async () => {
			const url = `${process.env.REACT_APP_BACKEND_URL}/users/isUserVerified`;
			const headers = { Authorization: `Bearer ${authState?.token}` };

			try {
				const result = await fetch(url, { method: 'GET', headers });
				if (result.status === 403) {
					toast('Session timeout!');
					return logoutHandler();
				}
				const data = await result.json();
				if (data.error === 'User not found') {
					return logoutHandler();
				}
				const storedToken = localStorage.getItem('stockbettoken');
				const parsedToken = JSON.parse(storedToken);
				setAuthState({
					token: parsedToken.token,
					username: data.username,
				});
			} catch (error) {
				console.error(error);
			}
		};

		if (!authState?.username) {
			checkIsUserVerified();
		}
	}, [authState]);

	const authObject = useMemo(
		() => ({
			isAuth,
			authState,
			loginHandler,
			logoutHandler,
		}),
		[isAuth, authState]
	);

	return (
		<AuthContext.Provider value={authObject}>
			{children}
		</AuthContext.Provider>
	);
}

function RequireAuth({ children }) {
	const authObject = useAuthContext();

	if (!authObject.isAuth) {
		return (
			<Navigate
				to={`/login?callbackUrl=${encodeURIComponent(
					window.location.href
				)}`}
			/>
		);
	}

	return <>{children}</>;
}

function IfLoggedIn({ children }) {
	const authObject = useAuthContext();
	const [searchParams] = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');
	let pathName = '/dashboard';

	if (authObject?.isAuth) {
		if (callbackUrl) {
			const url = decodeURIComponent(callbackUrl);
			pathName = new URL(url).pathname;
		}

		return <Navigate to={pathName} replace />;
	}

	return <>{children}</>;
}

export { AuthProvider, IfLoggedIn, RequireAuth, useAuthContext };
