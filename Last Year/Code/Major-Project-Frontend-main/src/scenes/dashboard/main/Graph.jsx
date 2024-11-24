import Chart from '../../../components/graph';
import DashLayout from '../../layouts/DashLayout';
import Sidebar from '../../layouts/Sidebar';

const Graph = () => {
	return (
		<DashLayout>
			<Sidebar />
			<Chart />
		</DashLayout>
	);
};

export default Graph;
