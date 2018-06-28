=== ROUTER CHECKLIST ===

1. Must be able to load the routes map from API. Must NOT be able to load the routes paths map based on the current LOCALE.

2. Must be able to have routes paths as a function of params, query (and of course can use whatever). (this means that each part of the locale must be determined before going down the children since the params must be determined BEFORE matching)

3. Should be able to use route paths as a class with the method "generate" with params, query. Anything can be injected

4. Must be able to use middlewares per routes as a function of (from {name, params, query}, to {name, params, query}).

5. Should be able to use middlewares as a class with the method "invoke" with from, to. Anything can be injected

6. Must be able to support routes with name.

7. Must be able to suuport routes without a name & path. Must NOT be able to support routes with a name but no path or path and no name.

8. Must be able to support routes with child routes

9. Must be able to support matching a route ONLY when exact match happens but match children without matching that exact route

10. Must be able to match an exact route and its children . Its similar with matching without exact except that it allows composition of components (determines who is the parent)

11. must be able to build an URL to a route using the locale in the URL. This means it could build an URL to a route in another locale (thus having a different path). THis
also means that if the Routes Paths Map has not been loaded for that locale, it has to be loaded now which is very problematic since the URL building must be syncronous.
12. Must be able to redirect if matching exact

13. Must be able to redirect from a certain route to another route

14. Must be able to redirect from a certain PATH to another ROUTE

15. Must be able to catch 404 errors when no locale (using a generic 404 page)

15. Must be able to catch 404 errors when locale exists, providing the locale param (thus having the 404 page localized)

16. Must be able to render server-side. It means it must supprot both html5 history but also a memory history

17. Must be able to render server-side with data loading @ route level

18. Must support various state adapters. It menans its should NOT keep any state inside the router class

19. Must work without LOCALE in url

20. Must work with multiple top-level routes.

21. Must work without children routes

22. Must support dynamic imports (code splitting) for component and middleware (func/class) - if present

23. Must support multiple params inside a single route (/users/:id/:name/:foo/:bar)
