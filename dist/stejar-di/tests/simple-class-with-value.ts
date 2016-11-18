import { injectable } from "../src/injectable";

@injectable
export class Tester {

	protected variable: any = null;

	public constructor( value: any ) {
		this.variable = value;
	}

	public getVariable() {
		return this.variable;
	}
}
