import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TeamEvent } from './components/TeamEvent';
import Overview from './components/Overview';

function App() {
	return (
		<div className="App">
			{/*<TeamEvent />*/}
			<Overview />
		</div>
	);
}

export default App;
