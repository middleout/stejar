import { EVENTS } from "./../src/Events";
import { MemoryHistoryAdapter } from "./../src/memory-history-routing-adapter/index";
import { Route } from "./../src/Route";
import { RouteMatcher } from "./../src/RouteMatcher";
import { Router } from "./../src/Router";
import { RouteWithParent } from "./../src/RouteWithParent";
require("es6-promise/auto");

describe("Router", () => {
	it("can render a simple route", function ( done ) {
		const router = new Router(new MemoryHistoryAdapter());
		router.add(new Route({
			name    : "base",
			path    : "/",
			callback: () => done()
		}));

		router.subscribe(EVENTS.ROUTE_MATCHED, ( route: RouteMatcher ) => {
			route.callback();
		});

		router.start();
	});

	it("can match a route with params", function ( done ) {
		const router = new Router(new MemoryHistoryAdapter({
			initialEntries: [
				"/5"
			]
		}));
		router.add(new Route({
			name    : "base",
			path    : "/:id",
			callback: ( params: any ) => {
				expect(params.id).toEqual("5");
				done();
			}
		}));

		router.subscribe(EVENTS.ROUTE_MATCHED, ( route: RouteMatcher, params: Object ) => {
			route.callback(params);
		});

		router.start();
	});

	it("can match a route with query params", function ( done ) {
		const router = new Router(new MemoryHistoryAdapter({
			initialEntries: [
				"/?foo=bar"
			]
		}));
		router.add(new Route({
			name    : "base",
			path    : "/",
			callback: ( query: any ) => {
				expect(query.foo).toEqual("bar");
				done();
			}
		}));

		router.subscribe(EVENTS.ROUTE_MATCHED, ( route: RouteMatcher, params: Object, query: Object ) => {
			route.callback(query);
		});

		router.start();
	});

	it("can navigate to another route", function ( done ) {
		let base   = 0;
		let locale = 0;

		const router = new Router(new MemoryHistoryAdapter());
		router.add(new Route({
			name    : "base",
			path    : "/",
			callback: () => base++,
		}));
		router.add(new Route({
			name    : "locale",
			path    : "/:locale",
			callback: () => locale++
		}))

		router.subscribe(EVENTS.ROUTE_MATCHED, ( route: RouteWithParent ) => {
			let callbacks = [];
			while ( route ) {
				callbacks.push(route.callback);
				route = route.parent;
			}
			callbacks.reverse().forEach(callback => callback());
		});

		router.start().then(() => {
			router.navigate('locale', {locale: "en-GB"});

			setTimeout(() => {
				expect(base).toEqual(1, 'base');
				expect(locale).toEqual(1, 'locale');
				done();
			}, 1);
		}).catch(err => {
			done()
		});
	});

	it("can navigate to child route", function ( done ) {
		let base   = 0;
		let locale = 0;

		const router = new Router(new MemoryHistoryAdapter());
		router.add(new Route({
			name    : "base",
			path    : "/",
			callback: () => base++,
			children: [
				new Route({
					name    : "locale",
					path    : "/:locale",
					callback: () => locale++
				})
			]
		}));

		router.subscribe(EVENTS.ROUTE_MATCHED, ( route: RouteWithParent ) => {
			let callbacks = [];
			while ( route ) {
				callbacks.push(route.callback);
				route = route.parent;
			}
			callbacks.reverse().forEach(callback => callback());
		});

		router.start().then(() => {
			router.navigate('base.locale', {locale: "en-GB"});

			setTimeout(() => {
				expect(base).toEqual(2, 'base');
				expect(locale).toEqual(1, 'locale');
				done();
			}, 1);
		}).catch(err => {
			done()
		});
	});
});
