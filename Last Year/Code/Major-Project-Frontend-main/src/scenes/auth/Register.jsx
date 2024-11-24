import './Register.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GoogleOauth from '../../components/auth/oauth';
import InputField from '../../components/inputfields/InputField';
import { useAuthContext } from '../../hooks/authContext';
import usePost from '../../hooks/usePost';

const Register = () => {
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');

	const auth = useAuthContext();
	const { loginHandler } = auth;

	const {
		isLoading: step0Loading,
		error: step0PostError,
		sendRequest: step0SendRequest,
	} = usePost(`${process.env.REACT_APP_BACKEND_URL}/auth/checkUsername`);

	const { sendRequest: step1SendRequest } = usePost(
		`${process.env.REACT_APP_BACKEND_URL}/auth/register`
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		setError('');

		if (!fullName || !username || !email || !password || !confirmPassword) {
			setError('All fields should be filled!');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		// Check username availability
		step0SendRequest(
			{
				username,
			},
			(data) => {
				if (data.usernameExists) {
					setError(
						'Username already exists. Please choose a different one.'
					);
				} else {
					// Proceed to the next step
					step1SendRequest(
						{
							username,
							name: fullName,
							email,
							password,
						},
						(data1) => {
							loginHandler(data1);
						}
					);
				}
			}
		);
	};

	const navigate = useNavigate();
	const handleSignIn = () => navigate('/login');

	return (
		<div className='register__content'>
			<div className='register__box'>
				<div className='register__social'>
					<GoogleOauth />
				</div>
				<div className='register__divider'>
					<span className='register__divider-line' />
					<span className='register__divider-text'>or</span>
					<span className='register__divider-line' />
				</div>
				<form className='register__form' onSubmit={handleSubmit}>
					<InputField
						label='Full Name'
						type='text'
						placeholder='Enter your full name'
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
					/>
					<InputField
						label='Username'
						type='text'
						placeholder='Enter your username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<InputField
						label='Email'
						type='text'
						placeholder='Enter your email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<InputField
						label='Password'
						type='password'
						placeholder='Enter your password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputField
						label='Confirm Password'
						type='password'
						placeholder='Confirm your password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<button type='submit' className='register__button'>
						Create Account
					</button>
				</form>
				{error && <p className='register__error'>{error}</p>}
				{step0Loading && <p className='register__error'>Loading...</p>}
				{step0PostError && (
					<p className='register__error'>{step0PostError}</p>
				)}
				<p className='register__signup-text'>
					Have an account already?{' '}
					<span
						className='register__signup-link'
						onClick={handleSignIn}
						onKeyDown={handleSignIn}
						role='button'
						tabIndex={0}
					>
						Sign In
					</span>
				</p>
			</div>
		</div>
	);
};

export default Register;
