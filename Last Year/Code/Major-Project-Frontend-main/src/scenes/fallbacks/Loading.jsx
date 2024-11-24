import './Loading.css';

const LoadingFallbackPage = () => {
	return (
		<div className='loading-container'>
			<div className='loading-spinner' />
			<h2 className='loading-message'>Loading...</h2>
		</div>
	);
};

export default LoadingFallbackPage;
