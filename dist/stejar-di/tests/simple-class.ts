import { injectable } from "../src/injectable";

@injectable
export class Tester {

	protected variable: any = null;

	public constructor() {
		this.variable = 1;
	}

	public getVariable() {
		return this.variable;
	}
}
