export function getRouteName( routes: any[] ): string {
	try {
		return routes[routes.length - 1].name;
	} catch (error) {
		return "";
	}
}
