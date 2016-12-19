import { Acl } from "virgen-acl";
import { injectable } from "@stejar/di";

@injectable
export class AuthorizationService {

	/**
	 * @type {"virgen-acl".Acl}
	 */
	private guard = new Acl();

	/**
	 * @param resource
	 * @param parent
	 */
	addResource( resource: string, parent?: string ): AuthorizationService {
		this.guard.addResource(resource, parent);
		return this;
	}

	/**
	 * @param role
	 * @param parent
	 */
	addRole( role: string|Function, parent?: string|Function ): AuthorizationService {
		this.guard.addRole(typeof role === "string" ? role : role.name, parent ? typeof parent === "string" ? parent : parent.name : null);
		return this;
	}

	/**
	 * @param role
	 * @param resource
	 * @param privilege
	 */
	allow( role: string|Function, resource: string, privilege?: string ): AuthorizationService {
		this.guard.allow(typeof role === "string" ? role : role.name, resource, privilege);
		return this;
	}

	/**
	 * @param role
	 * @param resource
	 * @param privilege
	 */
	deny( role: string|Function, resource: string, privilege?: string ): AuthorizationService {
		this.guard.deny(typeof role === "string" ? role : role.name, resource, privilege);
		return this;
	}

	/**
	 * @param role
	 * @param resource
	 * @param privilege
	 * @returns {Promise<T>}
	 */
	isAllowed( role: string|Function, resource: string, privilege?: string ): Promise<void> {
		return new Promise<void>(( resolve, reject ) => {
			this.guard.query(typeof role === "string" ? role : role.name, resource, privilege, ( error, isAllowed ) => {
				if ( !isAllowed ) {
					return reject(error || `[Stejar.AuthorizationService] "${typeof role === "string" ? role : role.name || "(no-role)"}" not allowed on "${resource || "(no-resource)"}" "${privilege || "(no-privilege)"}"`);
				}

				return resolve();
			});
		});
	}
}
