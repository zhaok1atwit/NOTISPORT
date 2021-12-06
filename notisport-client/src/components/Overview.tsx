import { Fragment, useEffect, useRef, useState } from "react";
import { listEvents, listTeams, NFLAPIConnection } from "../lib/NFLApi";
import logo from '../logo.jpg';

interface NFLTeam {
	id: number,
	abbrev: string,
	name: string,
	wins: number,
	losses: number,
	ties: number,
	standing: number,
	logo_url: string
}

interface NFLEvent {
	id: number,
	drives: any[],
	home_team: number,
	away_team: number,
	awayScore: number,
	homeScore: number,
	date: Date
}

export default function Overview() {

	const [ nflAPIConnection, setNflAPIConnection ] = useState<NFLAPIConnection>();
	const teams = useRef<any>({});

	const [ lastTenGames, setLastTenGames ] = useState<NFLEvent[]>([]);

	useEffect(() => {

		console.log('finna connect')
		const initialNFLConnection = new NFLAPIConnection(null);

		initialNFLConnection.getSocket()
		.then(() => {
			console.log('NFL Connection Socket Established');
			setNflAPIConnection(initialNFLConnection);
		});

	}, []);

	useEffect(() => {

		if (nflAPIConnection) {
			listTeams(nflAPIConnection)
			.then(response => {
				response.map((team: NFLTeam) => teams.current[team.id] = team);
				return;
			})
			.then(() => listEvents(nflAPIConnection, 10))
			.then((response: NFLEvent[]) => setLastTenGames(response));
			console.log(teams)
		}
		

	}, [ nflAPIConnection ]);

	return (
		<div style={{ display: 'flex', width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgb(243, 151, 102)' }}>
			<div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
				<img src={logo} width={'100%'} alt={'logo'}/>
				<div style={{ border: 'solid 2px', flexGrow: 5, margin: '0.5rem' }}>
					Description
				</div>
			</div>
			<div style={{ width: '33%', display: 'flex', flexDirection: 'column' }}>
				<div style={{ border: 'solid 2px', flexGrow: 1, margin: '0.5rem', padding: '0.25rem' }}>
					<Widget name={'Live / Upcoming Games'}>
						<LiveGameEntry teamA='PIT' teamARecord='6-5-1' teamB='MIN' teamBRecord='5-7' time='8:20PM' />
						<LiveGameEntry teamA='DAL' teamARecord='8-4' teamB='WSH' teamBRecord='6-6' time='1:00PM' />
						<LiveGameEntry teamA='JAX' teamARecord='2-10' teamB='TEN' teamBRecord='8-4' time='1:00PM' />
						<LiveGameEntry teamA='SEA' teamARecord='4-8' teamB='HOU' teamBRecord='2-10' time='1:00PM' />
						<LiveGameEntry teamA='LV' teamARecord='6-6' teamB='KC' teamBRecord='8-4' time='1:00PM' />
						<LiveGameEntry teamA='NO' teamARecord='5-7' teamB='NYJ' teamBRecord='3-9' time='1:00PM' />
					</Widget>
				</div>
				<div style={{ border: 'solid 2px', flexGrow: 1, margin: '0.5rem', padding: '0.25rem' }}>
					<Widget name={'Leagues'} />
				</div>
			</div>
			<div style={{ width: '33%', height: '100%', display: 'flex', flexDirection: 'column' }}>
				<div style={{ border: 'solid 2px', flexGrow: 1, margin: '0.5rem', padding: '0.25rem' }}>
					<Widget name={'Past Games'} >
						{lastTenGames.map(event => <PastGameEntry 
							teamA={teams.current[event.home_team].abbrev}
							teamARecord={`${teams.current[event.home_team].wins}-${teams.current[event.home_team].losses}`}
							teamAScore={event.homeScore}
							teamB={teams.current[event.away_team].abbrev}
							teamBRecord={`${teams.current[event.away_team].wins}-${teams.current[event.away_team].losses}`}
							teamBScore={event.awayScore}
							time={`${new Date(event.date).getMonth()+1}/${new Date(event.date).getDate()}`}
							/>
						)}
						<PastGameEntry teamA='WSH' teamARecord='8-2-4' teamAScore={4} teamB='CBJ' teamBRecord='7-4-0' teamBScore={3} time='11/12'/>
					</Widget>
				</div>
				<div style={{ border: 'solid 2px', flexGrow: 1, margin: '0.5rem', padding: '0.25rem' }}>
					<Widget name={'Highlights'}/>
				</div>
			</div>
		</div>
	);
}

interface WidgetProps {
	name: string,
	children?: any
}

function Widget({ name, children }: WidgetProps) {
	return (
		<Fragment>
			<div style={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '0.75rem' }}>{name}</div>
			{children}
		</Fragment>
	);
}

interface LiveGameEntryProps {
	teamA: string,
	teamARecord: string,
	teamB: string,
	teamBRecord: string,
	time: string
}

function LiveGameEntry({ teamA, teamARecord, teamB, teamBRecord, time }: LiveGameEntryProps) {
	return (
		<div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '0.75rem' }}>
			<div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div>{teamA}</div>
					<div style={{ fontSize: '0.75rem', color: 'gray', marginLeft: '0.5rem' }}>{teamARecord}</div>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div>{teamB}</div>
					<div style={{ fontSize: '0.75rem', color: 'gray', marginLeft: '0.5rem' }}>{teamBRecord}</div>
				</div>
			</div>
			<div></div>
			<div style={{ verticalAlign: 'center' }}>{time}</div>
		</div>
	);
}

interface PastGameEntryProps {
	teamA: string,
	teamARecord: string,
	teamAScore: number,
	teamB: string,
	teamBRecord: string,
	teamBScore: number,
	time: string
}

function PastGameEntry({ teamA, teamARecord, teamAScore, teamB, teamBRecord, teamBScore, time }: PastGameEntryProps) {
	return (
		<div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '0.75rem' }}>
			<div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div>{teamA}</div>
					<div style={{ fontSize: '0.75rem', color: 'gray', marginLeft: '0.5rem', marginRight: '1rem' }}>{teamARecord}</div>
					<div>{teamAScore}</div>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div>{teamB}</div>
					<div style={{ fontSize: '0.75rem', color: 'gray', marginLeft: '0.5rem', marginRight: '1rem' }}>{teamBRecord}</div>
					<div>{teamBScore}</div>
				</div>
			</div>
			<div></div>
			<div style={{ verticalAlign: 'center' }}>{time}</div>
		</div>
	);
}
