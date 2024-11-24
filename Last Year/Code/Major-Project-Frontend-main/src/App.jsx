import './App.css';

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { IfLoggedIn, RequireAuth } from './hooks/authContext';
import Loading from './scenes/fallbacks/Loading';

// oauth redirect funciton
const Error404 = React.lazy(() => import('./scenes/fallbacks/NotFound'));
const Layout = React.lazy(() => import('./scenes/layouts/Layout'));
const WelcomePage = React.lazy(() => import('./scenes/auth/WelcomePage'));
const Login = React.lazy(() => import('./scenes/auth/Login'));
const Register = React.lazy(() => import('./scenes/auth/Register'));
const Dashboard = React.lazy(() =>
	import('./scenes/dashboard/main/Dashboard.jsx')
);
const User = React.lazy(() => import('./scenes/dashboard/main/User'));
const Graph = React.lazy(() => import('./scenes/dashboard/main/Graph'));
const OauthRedirect = React.lazy(() => import('./scenes/auth/OauthRedirect'));

const App = () => {
	return (
		<Router>
			<Routes>
				{/* fallback is * path */}
				<Route exact path='*' element={<Error404 />} />
				<Route
					path='/'
					element={
						<Suspense fallback={<Loading />}>
							<Layout />
						</Suspense>
					}
				>
					<Route path='oauth' element={<OauthRedirect />} />
					<Route
						path='/'
						element={
							<Suspense fallback={<Loading />}>
								<WelcomePage />
							</Suspense>
						}
					/>
					<Route
						path='/register'
						element={
							<IfLoggedIn>
								<Suspense fallback={<Loading />}>
									<Register />
								</Suspense>
							</IfLoggedIn>
						}
					/>
					<Route
						path='/login'
						element={
							<IfLoggedIn>
								<Suspense fallback={<Loading />}>
									<Login />
								</Suspense>
							</IfLoggedIn>
						}
					/>
				</Route>
				{/* all below are protected routes */}

				<Route
					path='/dashboard'
					element={
						<RequireAuth>
							<Suspense fallback={<Loading />}>
								<Dashboard />
							</Suspense>
						</RequireAuth>
					}
				/>
				<Route
					path='/user'
					element={
						<RequireAuth>
							<Suspense fallback={<Loading />}>
								<User />
							</Suspense>
						</RequireAuth>
					}
				/>
				<Route
					path='/graph'
					element={
						<RequireAuth>
							<Suspense fallback={<Loading />}>
								<Graph />
							</Suspense>
						</RequireAuth>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
