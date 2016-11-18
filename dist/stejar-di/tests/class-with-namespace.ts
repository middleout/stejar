import { namespace } from "../src/namespaceUtils";
import { injectable } from "../src/injectable";

@namespace('Package1')
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
