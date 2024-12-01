import './User.css';

import React, { useEffect, useState } from 'react';

import useGet from '../../../hooks/useGet';
import DashLayout from '../../layouts/DashLayout';
import Sidebar from '../../layouts/Sidebar';
import ProfileSection from './user-components/ProfileSection';

const User = () => {
	const [profileData, setProfileData] = useState({});
	const [profileDetails, setProfileDetails] = useState({});

	const { sendRequest } = useGet(
		`${process.env.REACT_APP_BACKEND_URL}/users/getUserData`,
		null,
		null,
		true
	);

	useEffect(() => {
		sendRequest((data) => {
			setProfileDetails(data.profileDetails);
			setProfileData(data.profile);
		});
	}, [sendRequest]);

	return (
		<DashLayout>
			<div className='user'>
				<Sidebar />
				<div className='user__content'>
					<div className='user__center-panel'>
						<div className='user__top-section'>
							<div className='user__section-box'>
								<h2 className='user__section-heading'>
									Profile Section
								</h2>
								{profileData && (
									<ProfileSection
										data={profileData}
										details={profileDetails}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashLayout>
	);
};

export default User;
