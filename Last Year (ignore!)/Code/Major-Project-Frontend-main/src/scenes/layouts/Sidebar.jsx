import './Sidebar.css';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import homeIcon from '../../assets/sidebar_home_icon.png';
import settingIcon from '../../assets/sidebar_setting_icon.png';
import userIcon from '../../assets/sidebar_user_icon.png';
import { useAuthContext } from '../../hooks/authContext';

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Set the default to false

	const handleMouseEnter = () => {
		setIsSidebarOpen(true);
	};

	const handleMouseLeave = () => {
		setIsSidebarOpen(false);
	};

	const authContext = useAuthContext();
	const { logoutHandler } = authContext;

	const handleMouseMovement = (e) => {
		const rect = e.target.getBoundingClientRect();
		const x = e.clientX - rect.left; // x position within the element
		const y = e.clientY - rect.top; // y position within the element
		e.target.style.setProperty('--x', `${x}px`);
		e.target.style.setProperty('--y', `${y}px`);
	};

	return (
		<div className='sidebar-container'>
			<aside
				className={`sidebar ${isSidebarOpen ? '' : 'sidebar--closed'}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className='sidebar__content'>
					<div className='sidebar__logo'>
						<h5>Menu</h5>
					</div>
					<Link
						to='/dashboard'
						className='sidebar__tab'
						onMouseMove={handleMouseMovement}
					>
						<img
							src={homeIcon}
							alt='Home'
							className='sidebar__icon'
						/>
						Home
					</Link>
					<Link
						to='/user'
						className='sidebar__tab'
						onMouseMove={handleMouseMovement}
					>
						<img
							src={userIcon}
							alt='User'
							className='sidebar__icon'
						/>
						Profile
					</Link>
					<span
						className='sidebar__tab sidebar__tab--logout'
						onMouseMove={handleMouseMovement}
						onClick={() => logoutHandler()}
						onKeyDown={() => logoutHandler()}
						role='button'
						tabIndex={0}
					>
						<img
							src={settingIcon}
							alt='Wallet'
							className='sidebar__icon'
						/>
						Log Out
					</span>
				</div>
				{!isSidebarOpen && (
					<div className='sidebar__icons-strip'>
						<img
							src={homeIcon}
							alt='Home'
							className='sidebar__icon sidebar__icon-strip-item'
						/>
						<img
							src={userIcon}
							alt='User'
							className='sidebar__icon sidebar__icon-strip-item'
						/>
						<img
							src={settingIcon}
							alt='Settings'
							className='sidebar__icon sidebar__icon-strip-item'
						/>
					</div>
				)}
			</aside>
		</div>
	);
};

export default Sidebar;
