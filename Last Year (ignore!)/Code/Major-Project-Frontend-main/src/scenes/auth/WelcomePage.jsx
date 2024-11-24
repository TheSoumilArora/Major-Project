// WelcomePage.jsx
import './WelcomePage.css';

import React from 'react';

const WelcomePage = () => {
	return (
		<div className='welcome-page'>
			<div className='welcome-page-header'>
				<h1>Welcome to Ground Vibration Monitoring System</h1>
				<p>
					Real-time monitoring and analysis of wireless ground
					vibrations
				</p>
			</div>
			<main>
				<section>
					<h2>About Us</h2>
					<p>
						As part of our Major Project, we've made a wireless
						ground vibration detection and monitoring system. This
						website collects live data from the sensors and plots
						the data on the map.
					</p>
				</section>
				<section>
					<h2>Live Data Visualization</h2>
					<p>
						See live data visualizations of ground vibrations. Our
						system provides real-time updates and analysis.
					</p>
				</section>
				<section>
					<h2>Get Started</h2>
					<p>
						Ready to explore the world of wireless ground vibration
						monitoring? Sign up now or log in to access the full
						features of our platform.
					</p>
				</section>
			</main>
		</div>
	);
};

export default WelcomePage;
