export function TeamEvent() {
	return (
		<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
			<div style={{ alignSelf: 'center' }}>Logo</div>
			<div style={{ alignSelf: 'center', fontSize: '1.5rem' }}>TeamA vs. TeamB</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ fontSize: '0.75rem', alignSelf: 'start' }}>Qtr</div>
				<div style={{ height: '0.5rem'}}></div>
				<div>X</div>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ fontSize: '0.75rem' }}>Time Remaining</div>
				<div style={{ height: '0.5rem'}}></div>
				<div>XX:XX.XX</div>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div style={{ fontSize: '0.85rem' }}>TeamA</div>
						<div style={{ fontSize: '1.25rem' }}>XX</div>
					</div>
					<div style={{width: '1rem'}}></div>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<div style={{ fontSize: '0.85rem' }}>TeamB</div>
						<div style={{ fontSize: '1.25rem' }}>XX</div>
					</div>
				</div>
			</div>
		</div>
	);

}