import { ServiceManager, injectable } from "@stejar3/di";

export default function() {
    const sm = new ServiceManager();

    @injectable
    class Tester2 {
        constructor() {
            console.log("Tester 2 constructor");
        }
    }

    @injectable
    class Tester1 {
        constructor(public tester2: Tester2) {
            console.log("Tester 1 constructor");
        }
    }

    console.log(sm.get(Tester1));
}
