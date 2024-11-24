import './Slider.css';

import React, { useEffect, useState } from 'react';

import DashPost1 from '../../../../assets/dashpost-1.png';
import DashPost2 from '../../../../assets/dashpost-2.png';

const images = [
	DashPost1, // Replaced the first image with DashPost1
	DashPost2, // Replaced the first image with DashPost1
];

const Slider = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const handleNextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const handlePrevSlide = () => {
		setCurrentIndex(
			(prevIndex) => (prevIndex - 1 + images.length) % images.length
		);
	};

	useEffect(() => {
		const interval = setInterval(handleNextSlide, 10000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className='slider-container'>
			<div
				className='slide-wrapper'
				style={{
					transform: `translateX(-${currentIndex * 100}%)`,
					transition: 'transform 1s ease', // Add the transition property for smooth animation
				}}
			>
				{images.map((imageUrl, index) => (
					<img
						key={imageUrl}
						src={imageUrl}
						alt={`Slide ${index + 1}`}
						className='slide-image'
					/>
				))}
			</div>
			<div
				className='arrow left-arrow'
				onClick={handlePrevSlide}
				onKeyDown={handlePrevSlide}
				role='button'
				tabIndex={0}
			>
				&lt;
			</div>
			<div
				className='arrow right-arrow'
				onClick={handleNextSlide}
				onKeyDown={handleNextSlide}
				role='button'
				tabIndex={0}
			>
				&gt;
			</div>
		</div>
	);
};

export default Slider;
