import {injectable} from "../src/injectable";

@injectable
export class DepTester {

    public constructor() {
    }
}

@injectable
export class Tester {

    public constructor( public dep: DepTester ) {
    }
}
