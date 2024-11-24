import Landing from '../../auth/Landing';
import DashLayout from '../../layouts/DashLayout';
import Sidebar from '../../layouts/Sidebar';

const Dashboard = () => {
	return (
		<DashLayout>
			<Sidebar />
			<Landing />
		</DashLayout>
	);
};

export default Dashboard;
