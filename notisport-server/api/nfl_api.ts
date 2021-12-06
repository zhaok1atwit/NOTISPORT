
const TEAMS_LIST_REQUEST = 'teams_list';

const EVENTS_LIST_REQUEST = 'events_list';

export function verifyNFLRequest(message: any) {

	const [ isMalformedRequest, malformedError ] = malformedRequestCheck(message);
	if (isMalformedRequest){
		return [ true, malformedError ];
	}

	switch (message[0]) {

		case TEAMS_LIST_REQUEST:
			// no expected parameters
			break;

		case EVENTS_LIST_REQUEST: {
			// no expected parameters
			break;
		}
		
		default:
			return [ true, new Error('Unrecognized Request Type') ];
	}

	return [ false, null ];

}

/** @returns {[ boolean, Error ]} [ isError, error ] */
function malformedRequestCheck(request: any) {

	//  Request must be an array
	if (typeof request === 'object' && Array.isArray(request)) {

		//  Request must have a length of 3
		if (request.length === 3) {

			//  First element is command
			if (typeof request[0] === 'string') {

				//  Second element is request ID (client-side purposes)
				if (typeof request[1] === 'number') {
					return [ false, null ];
				}

			}

		}

	}

	return [ true, new Error('Malformed Request')];

}

/** @returns {[ boolean, Error ]} [ isError, error ] */
function expectedParameterCheck(requestParameters: any, ...expectedParameters: any){
	
	const missingParameters = expectedParameters.filter((expectedParameter: any) => !requestParameters[expectedParameter]);
	
	if (missingParameters.length > 0){
		return [ true, new Error('Incomplete request') ];
	}

	return [ false, null ];

}

/** @returns {[ boolean, Error ]} [ isError, error ] */
function illegalCharacterCheck(string: string){

	//	Ensure sessionName and clientName are acceptable.
	//	Dont allow slashes, spaces, or quotes
	const UNACCEPTABLE_CHARACTERS = ['/', ' ', '\\', '\'', '"'];

	const illegalChars = UNACCEPTABLE_CHARACTERS.filter(char => string.includes(char));

	if (illegalChars.length > 0){
		//throw new APIError(INVALID_REQUEST_PARAMETER);
		return [ true, new Error('Invalid Request Parameter') ];
	}

	return [ false, null ];

}
