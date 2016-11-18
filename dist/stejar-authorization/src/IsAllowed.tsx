import { PureComponent } from "@stejar/react";
import { inject } from "@stejar/react-di";
import { AuthenticationService } from "@stejar/authentication";
import { AuthorizationService } from "./AuthorizationService";

let debug = true;

export function disableDebug() {
	debug = false;
}

export interface IsAllowedProps {
	children?: any;
	on: string;
	privilege?: string;
	defaultRole?: string;
	authenticationService?: AuthenticationService<any>,
	authorizationService?: AuthorizationService,
}

export interface IsAllowedState {
	isAllowed: boolean;
}

@inject({
	authenticationService: AuthenticationService,
	authorizationService : AuthorizationService
})
export class IsAllowed extends PureComponent<IsAllowedProps,IsAllowedState> {

	/**
	 * @type {{isAllowed: boolean}}
	 */
	state: IsAllowedState = {
		isAllowed: false,
	}

	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		return this.state.isAllowed ? this.props.children : null;
	}

	/**
	 * @returns {null}
	 */
	componentDidMount(): void {
		const role = this.props.authenticationService.hasIdentity() ? this.props.authenticationService.getRole() : (this.props.defaultRole || null);
		this.props.authorizationService
			.isAllowed(role, this.props.on, this.props.privilege || null)
			.then(() => this.setState({
				isAllowed: true
			}))
			.catch(e => debug ? console.log('IsAllowed() : ' + e) : null);

		return null;
	}
}
