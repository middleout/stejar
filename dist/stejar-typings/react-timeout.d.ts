declare module "react-timeout" {
	export default function ReactTimeout( Componnet: any ): any;

	export interface WithTimeoutProps {
		setTimeout?: ( callback: Function, time?: number ) => number;
	}
}
