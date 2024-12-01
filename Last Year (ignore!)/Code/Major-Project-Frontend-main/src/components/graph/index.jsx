import './Graph.css';

import React, { useEffect, useRef, useState } from 'react';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import io from 'socket.io-client';

const CustomDot = (props) => {
	const { cx, cy, stroke, payload, value } = props;

	if (payload && payload.data && payload.index === payload.data.length - 1) {
		return (
			<g>
				<circle cx={cx} cy={cy} r={6} fill={stroke} />
				<text
					x={cx}
					y={cy - 10}
					dy={-12}
					textAnchor='middle'
					fill='#666'
				>
					{value}
				</text>
			</g>
		);
	}

	return null;
};

const Chart = () => {
	const [sensorData, setSensorData] = useState([]);

	const socketRef = useRef();

	useEffect(() => {
		console.log(process.env.REACT_APP_BACKEND_URL);
		socketRef.current = io.connect(process.env.REACT_APP_BACKEND_URL, {
			transports: ['websocket'],
		});

		socketRef.current.on('connect_error', (err) => {
			// the reason of the error, for example "xhr poll error"
			console.log(err.message);

			// some additional description, for example the status code of the initial HTTP response
			console.log(err.description);

			// some additional context, for example the XMLHttpRequest object
			console.log(err.context);
		});

		socketRef.current.on('sensorData', (data) => {
			console.log('Received sensor data from server:', data);
			setSensorData((prevData) => [...prevData, data]);
		});

		return () => {
			socketRef.current.off('sensorData');
			socketRef.current.disconnect();
		};
	}, []);

	console.log('socketRef.current: ', socketRef.current);

	return (
		<div className='chart-page'>
			<div style={{ width: 1000, height: 400 }}>
				<ResponsiveContainer>
					<LineChart
						width={800}
						height={400}
						data={sensorData}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis
							dataKey='time'
							height={50}
							label={{
								value: 'Time',
								position: 'insideBottom',
							}}
						/>
						<YAxis
							label={{
								value: 'Voltage',
								angle: -90,
								position: 'insideLeft',
							}}
						/>
						<Tooltip />
						<Line
							name=''
							type='monotone'
							dataKey='voltage'
							stroke='#8884d8'
							strokeWidth='2'
							animationDuration={0}
							dot={<CustomDot />}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default Chart;
