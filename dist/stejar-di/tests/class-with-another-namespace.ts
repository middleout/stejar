import { namespace } from "../src/namespaceUtils";
import { injectable } from "../src/injectable";

@namespace('Package2')
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
