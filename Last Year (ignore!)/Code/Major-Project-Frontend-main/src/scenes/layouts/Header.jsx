import './Layout.css';

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import logoutIcon from '../../assets/logout.png';
import { useAuthContext } from '../../hooks/authContext';

const Header = () => {
	const { pathname, hash, key } = useLocation();

	const { isAuth, logoutHandler } = useAuthContext();

	useEffect(() => {
		// if not a hash link, scroll to top
		if (hash === '') {
			window.scrollTo(0, 0);
		}
		// else scroll to id
		else {
			setTimeout(() => {
				const id = hash.replace('#', '');
				const element = document.getElementById(id);

				if (element) {
					// Get the height of the header
					const headerHeight =
						document.querySelector('.header').offsetHeight;
					// Calculate the adjusted scroll position
					const adjustedScrollPosition =
						element.offsetTop - headerHeight;

					// Scroll to the adjusted position
					window.scrollTo(0, adjustedScrollPosition);
				}
			}, 0);
		}
	}, [pathname, hash, key]);

	return (
		<header className='header'>
			<div className='header__logo'>
				<Link to='/'>
					<h2 className='header__title'>Wireless Geophone Sensor</h2>
				</Link>
			</div>
			<nav className='header__nav'>
				<ul className='header__nav-list'>
					<li className='header__nav-item'>
						<Link to='/'>Home</Link>
					</li>
					{isAuth ? (
						<>
							<li className='header__nav-item'>
								<Link
									to='/dashboard'
									className='header__signup-button'
								>
									Dashboard
								</Link>
							</li>
							<li className='header__nav-item'>
								<button
									type='button'
									className='header__signup-button'
									onClick={() => logoutHandler()}
								>
									<img
										src={logoutIcon}
										alt='Settings'
										className='header__logout-icon'
									/>
								</button>
							</li>
						</>
					) : (
						<>
							<li className='header__nav-item'>
								<Link to='/login'>Login</Link>
							</li>
							<li className='header__nav-item'>
								<Link
									to='/register'
									className='header__signup-button'
								>
									Register
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
