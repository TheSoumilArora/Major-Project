/* eslint-disable no-alert */
import './ProfileSection.css';

import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import profilePic from '../../../../assets/user-placeholder.jpg';
import usePost from '../../../../hooks/usePost';

const ProfileSection = ({ data }) => {
	const navigate = useNavigate();

	const {
		error: updateProfileError,
		sendRequest: updateProfile,
		isLoading,
	} = usePost(
		`${process.env.REACT_APP_BACKEND_URL}/users/editProfile`,
		null,
		true
	);

	const handleUpdateProfile = () => {
		const newUsername = prompt('Please enter new username');
		if (!newUsername) {
			return;
		}
		if (data.username === newUsername) {
			alert('Please enter a new username');
			return;
		}
		updateProfile({ username: newUsername }, (response) => {
			if (updateProfileError) {
				toast.error(response.message);
			} else {
				toast.success(response.message);
				// reload page
				navigate(0);
			}
		});
	};

	return (
		<div className='profile-section'>
			<div className='profile-section__header'>
				<img
					src={profilePic}
					alt='Profile Pic'
					className='profile-section__profile-pic'
				/>
			</div>
			<div className='profile-section__info'>
				<h3 className='profile-section__name'>{data?.username}</h3>
				<p className='profile-section__username'>{data?.name}</p>
				<button
					type='button'
					onClick={handleUpdateProfile}
					disabled={
						isLoading ||
						(data?.username && data.username.length === 0)
					}
				>
					Edit Username
				</button>
				<p className='profile-section__bio'>{data?.bio}</p>
				{data?.website && (
					<a
						href={data?.website}
						className='profile-section__social-link'
					>
						Social Media Link
					</a>
				)}
			</div>
		</div>
	);
};

export default ProfileSection;
