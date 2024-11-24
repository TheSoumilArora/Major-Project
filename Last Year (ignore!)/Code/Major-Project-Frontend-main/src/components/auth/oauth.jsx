import './oauth.css';

import GoogleIcon from '../../assets/login_google.png';

function GoogleOauth() {
	const googleOAuthUrl = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;

	const handleSignInWithGoogle = () => {
		window.open(googleOAuthUrl, '_self');
	};

	return (
		<button
			className='login__social-button'
			onClick={handleSignInWithGoogle}
			type='button'
		>
			<img
				className='login__social-icon'
				src={GoogleIcon}
				alt='Google Icon'
			/>
			Sign in with Google
		</button>
	);
}

export default GoogleOauth;
