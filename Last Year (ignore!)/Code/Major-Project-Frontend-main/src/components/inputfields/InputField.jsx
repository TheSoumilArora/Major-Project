import './InputField.css';

import React, { useState } from 'react';

const InputField = ({ type, placeholder, value, onChange }) => {
	const [focused, setFocused] = useState(false);

	const handleFocus = () => {
		setFocused(true);
	};

	return (
		<div className='input-field-container'>
			<input
				className={`input-field ${
					focused || value ? 'input-field--focused' : ''
				}`}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onFocus={handleFocus}
			/>
		</div>
	);
};

export default InputField;
