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
	addRole( role: string, parent?: string ): AuthorizationService {
		this.guard.addRole(role, parent);
		return this;
	}

	/**
	 * @param role
	 * @param resource
	 * @param privilege
	 */
	allow( role: string, resource: string, privilege?: string ): AuthorizationService {
		this.guard.allow(role, resource, privilege);
		return this;
	}

	/**
	 * @param role
	 * @param resource
	 * @param privilege
	 */
	deny( role: string, resource: string, privilege?: string ): AuthorizationService {
		this.guard.deny(role, resource, privilege);
		return this;
	}

	/**
	 * @param role
	 * @param resource
	 * @param privilege
	 * @returns {Promise<T>}
	 */
	isAllowed( role: string, resource: string, privilege?: string ): Promise<void> {
		return new Promise<void>(( resolve, reject ) => {
			this.guard.query(role, resource, privilege, ( error, isAllowed ) => {
				if ( !isAllowed ) {
					return reject(error || `[Stejar.AuthorizationService] "${role || "(no-role)"}" not allowed on "${resource || "(no-resource)"}" "${privilege || "(no-privilege)"}"`);
				}

				return resolve();
			});
		});
	}
}
