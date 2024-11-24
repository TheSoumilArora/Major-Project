import { Link } from 'react-router-dom';

const Landing = () => {
	const outlineStyle = {
		outline: 'none',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		flexShrink: '0',
		transform: 'none',
	};

	const fontStyle1 = {
		'--font-selector': 'R0Y7SnVhLXJlZ3VsYXI=',
		'--framer-font-family': '"Jua", "Jua Placeholder", sans-serif',
		'--framer-font-size': '32px',
		'--framer-text-alignment': 'left',
		'--framer-text-color': 'rgb(255, 255, 255)',
	};

	const fontStyle2 = {
		'--font-selector': 'R0Y7SW5zdHJ1bWVudCBTYW5zLTUwMA==',
		'--framer-font-family': '"Instrument Sans", sans-serif',
		'--framer-font-weight': '500',
		'--framer-line-height': '1.5em',
		'--framer-text-alignment': 'left',
		'--framer-text-color': 'rgb(221, 229, 182)',
	};

	const fontStyle3 = {
		position: 'absolute',
		borderRadius: 'inherit',
		top: '0',
		right: '0',
		bottom: '0',
		left: '0',
	};

	const fontStyle4 = {
		display: 'block',
		width: '100%',
		height: '100%',
		borderRadius: 'inherit',
		objectPosition: 'center',
		objectFit: 'cover',
		imageRendering: 'auto',
	};

	return (
		<div
			id='about-section'
			className='framer-LTjJs'
			style={{ display: 'contents' }}
		>
			<div
				className='framer-72rtr7'
				style={{ minHeight: '100vh', width: 'auto' }}
			>
				<div
					className='framer-300rmv'
					data-framer-name='Hero'
					name='Hero'
				>
					<div
						className='framer-1psibwp'
						data-framer-name='Menu'
						name='Menu'
					>
						<div className='framer-12wthjx' />
						<div
							className='framer-12a43f2'
							style={{
								outline: 'none',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-start',
								flexShrink: '0',
								transform: 'none',
							}}
							data-framer-component-type='RichTextContainer'
						>
							<p
								style={{
									'--font-selector':
										'R0Y7SW5zdHJ1bWVudCBTYW5zLTUwMA==',
									'--framer-font-family':
										'"Instrument Sans", sans-serif',
									'--framer-font-weight': '500',
									'--framer-text-alignment': 'left',
								}}
								className='framer-text'
							>
								Major Project
							</p>
						</div>
						<div className='framer-1hooom3' />
					</div>
					<div
						className='framer-14605e9'
						data-framer-name='Text'
						name='Text'
					>
						<svg
							className='framer-1qoarig'
							style={{
								outline: 'none',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-start',
								flexShrink: '0',
								transform: 'none',
							}}
							data-framer-component-type='RichTextContainer'
							viewBox='0 0 979 77'
						>
							<foreignObject
								width='100%'
								height='100%'
								transform='scale(1)'
								style={{
									overflow: 'visible',
									'transform-origin': 'center center',
								}}
							>
								<h1
									style={{
										'--font-selector':
											'R0Y7SnVhLXJlZ3VsYXI=',
										'--framer-font-family':
											'"Jua", "Jua Placeholder", sans-serif',
										'--framer-font-size': '64px',
										'--framer-text-alignment': 'center',
									}}
									className='framer-text'
								>
									Ground Vibration Detection Sensor
								</h1>
							</foreignObject>
						</svg>
						<div
							className='framer-uiwh8d'
							style={{
								outline: 'none',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-start',
								flexShrink: '0',
								transform: 'none',
							}}
							data-framer-component-type='RichTextContainer'
						>
							<h1
								style={{
									'--font-selector':
										'R0Y7SW5zdHJ1bWVudCBTYW5zLTUwMA==',
									'--framer-font-family':
										'"Instrument Sans", sans-serif',
									'--framer-font-size': '20px',
									'--framer-font-weight': '500',
									'--framer-line-height': '1.4em',
									'--framer-text-alignment': 'center',
								}}
								className='framer-text'
							>
								Wirelessly monitor Earth's vibrations in
								real-time with advanced geophone sensors.
								Experience the future of ground vibration
								analysis, tailored for governmental insights.
							</h1>
						</div>
						<div
							className='framer-16o8swl'
							data-framer-name='Buttons'
							name='Buttons'
						>
							<div
								className='framer-19kb2qo'
								data-framer-name='Button'
								name='Button'
								style={{ cursor: 'pointer' }}
							>
								<div
									className='framer-14pbceh'
									style={{
										outline: 'none',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'flex-start',
										flexShrink: '0',
										transform: 'none',
									}}
									data-framer-component-type='RichTextContainer'
								>
									<p
										style={{
											'--font-selector':
												'R0Y7SW5zdHJ1bWVudCBTYW5zLTUwMA==',
											'--framer-font-family':
												'"Instrument Sans", sans-serif',
											'--framer-font-weight': '500',
											'--framer-line-height': '1.5em',
											'--framer-text-alignment': 'left',
											'--framer-text-color':
												'rgb(221, 229, 182)',
										}}
										className='framer-text'
									>
										Explore Features
									</p>
								</div>
							</div>
							<div
								className='framer-102k0k9'
								data-framer-name='Button'
								name='Button'
								style={{ cursor: 'pointer' }}
							>
								<div
									className='framer-609iwz'
									style={{
										outline: 'none',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'flex-start',
										flexShrink: '0',
										transform: 'none',
									}}
									data-framer-component-type='RichTextContainer'
								>
									<Link
										to='/graph'
										style={{
											'--font-selector':
												'R0Y7SW5zdHJ1bWVudCBTYW5zLTUwMA==',
											'--framer-font-family':
												'"Instrument Sans", sans-serif',
											'--framer-font-weight': '500',
											'--framer-line-height': '1.5em',
											'--framer-text-alignment': 'left',
										}}
										className='framer-text'
										onClick={() => {}}
									>
										Graph Page
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					className='framer-8rslw7'
					data-framer-name='Features'
					name='Features'
				>
					<div className='framer-wy88gt'>
						<div
							className='framer-1jdxh6'
							data-border='true'
							data-framer-name='Decoration'
							name='Decoration'
						/>
						<div
							className='framer-1bfwpd5'
							data-border='true'
							data-framer-name='Decoration'
							name='Decoration'
						/>
						<div
							className='framer-14g95h2'
							data-framer-name='Card'
							name='Card'
						>
							<div
								className='framer-1w5r30y'
								data-framer-name='Text'
								name='Text'
							>
								<div
									className='framer-1pivd8g'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<h3
										style={fontStyle1}
										className='framer-text'
									>
										Data
									</h3>
								</div>
								<div
									className='framer-fdhk0n'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<p
										style={fontStyle2}
										className='framer-text'
									>
										Unparalleled precision in voltage
										tracking
									</p>
								</div>
							</div>
							<div
								className='framer-plgyex'
								data-framer-name='Image'
								name='Image'
							>
								<div
									style={fontStyle3}
									data-framer-background-image-wrapper='true'
								>
									<img
										src='https://framerusercontent.com/images/C0Dwu0FCqhMrMqHNZ6Se3tY6UA.jpg?scale-down-to=512'
										alt=''
										srcSet='https://framerusercontent.com/images/C0Dwu0FCqhMrMqHNZ6Se3tY6UA.jpg?scale-down-to=512 341w, https://framerusercontent.com/images/C0Dwu0FCqhMrMqHNZ6Se3tY6UA.jpg?scale-down-to=1024 682w, https://framerusercontent.com/images/C0Dwu0FCqhMrMqHNZ6Se3tY6UA.jpg 1200w'
										sizes='calc(max((min(100vw - 100px, 1000px) - 20px) / 2, 40px) * 2 - 60px)'
										style={fontStyle4}
									/>
								</div>
							</div>
						</div>
						<div
							className='framer-18m7cjm'
							data-framer-name='Card'
							name='Card'
						>
							<div
								className='framer-1hai62f'
								data-framer-name='Text'
								name='Text'
							>
								<div
									className='framer-tcnb3j'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<h3
										style={fontStyle1}
										className='framer-text'
									>
										Map
									</h3>
								</div>
								<div
									className='framer-f2emm6'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<p
										style={fontStyle2}
										className='framer-text'
									>
										Pinpointed sensor locations
									</p>
								</div>
							</div>
							<div
								className='framer-1687glj'
								data-framer-name='Image'
								name='Image'
							>
								<div
									style={fontStyle3}
									data-framer-background-image-wrapper='true'
								>
									<img
										src='https://framerusercontent.com/images/njH2Dzd9KzqKnrVCdl84rjBnPQI.jpg?scale-down-to=512'
										alt=''
										srcSet='https://framerusercontent.com/images/njH2Dzd9KzqKnrVCdl84rjBnPQI.jpg?scale-down-to=512 512w, https://framerusercontent.com/images/njH2Dzd9KzqKnrVCdl84rjBnPQI.jpg?scale-down-to=1024 1024w, https://framerusercontent.com/images/njH2Dzd9KzqKnrVCdl84rjBnPQI.jpg 1200w'
										sizes='calc(max((min(100vw - 100px, 1000px) - 20px) / 2, 40px) - 80px)'
										style={fontStyle4}
										loading='lazy'
									/>
								</div>
							</div>
						</div>
						<div
							className='framer-hw03md'
							data-framer-name='Card'
							name='Card'
						>
							<div
								className='framer-73j0rg'
								data-framer-name='Text'
								name='Text'
							>
								<div
									className='framer-5la8ot'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<h3
										style={fontStyle1}
										className='framer-text'
									>
										Real-time
									</h3>
								</div>
								<div
									className='framer-1y0fvr4'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<p
										style={fontStyle2}
										className='framer-text'
									>
										Live updates like magic
									</p>
								</div>
							</div>
							<div
								className='framer-1bpwpzj'
								data-framer-name='Image'
								name='Image'
							>
								<div
									style={fontStyle3}
									data-framer-background-image-wrapper='true'
								>
									<img
										src='https://framerusercontent.com/images/za0P2n6FPYzNS5LIba4medP3I.jpg?scale-down-to=512'
										alt=''
										srcSet='https://framerusercontent.com/images/za0P2n6FPYzNS5LIba4medP3I.jpg?scale-down-to=512 512w, https://framerusercontent.com/images/za0P2n6FPYzNS5LIba4medP3I.jpg?scale-down-to=1024 1024w, https://framerusercontent.com/images/za0P2n6FPYzNS5LIba4medP3I.jpg 1200w'
										sizes='calc(max((min(100vw - 100px, 1000px) - 20px) / 2, 40px) - 80px)'
										style={fontStyle4}
										loading='lazy'
									/>
								</div>
							</div>
						</div>
						<div
							className='framer-1ua9uup'
							data-framer-name='Card'
							name='Card'
						>
							<div
								className='framer-mcd5qs'
								data-framer-name='Text'
								name='Text'
							>
								<div
									className='framer-3alk3'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<h3
										style={fontStyle1}
										className='framer-text'
									>
										Wireless
									</h3>
								</div>
								<div
									className='framer-yh8i5i'
									style={outlineStyle}
									data-framer-component-type='RichTextContainer'
								>
									<p
										style={fontStyle2}
										className='framer-text'
									>
										Future-driven sensor connectivity
									</p>
								</div>
							</div>
							<div
								className='framer-a5631x'
								data-framer-name='Image'
								name='Image'
							>
								<div
									style={fontStyle3}
									data-framer-background-image-wrapper='true'
								>
									<img
										src='https://framerusercontent.com/images/sW5EVaa5RkPB2pdcWNP2v0y55A.jpg?scale-down-to=512'
										alt=''
										srcSet='https://framerusercontent.com/images/sW5EVaa5RkPB2pdcWNP2v0y55A.jpg?scale-down-to=512 512w, https://framerusercontent.com/images/sW5EVaa5RkPB2pdcWNP2v0y55A.jpg?scale-down-to=1024 1024w, https://framerusercontent.com/images/sW5EVaa5RkPB2pdcWNP2v0y55A.jpg 1200w'
										sizes='calc(max((min(100vw - 100px, 1000px) - 20px) / 2, 40px) * 2 - 60px)'
										style={fontStyle4}
										loading='lazy'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
