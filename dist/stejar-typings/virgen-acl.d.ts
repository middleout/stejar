declare module "virgen-acl" {
    export class Acl {
        
        /**
         * @param role
         * @param state
         * @param privilege
         * @param callback
         */
        query( role: string, state: string, privilege: string, callback: ( error: string, isAllowed: boolean ) => void ): void;

        /**
         * @param resource
         * @param parent
         */
        addResource( resource: string, parent?: string ): Acl;

        /**
         * @param role
         * @param parent
         */
        addRole( role: string, parent?: string ): Acl;

        /**
         * @param role
         * @param resource
         * @param privilege
         */
        allow( role: string, resource: string, privilege?: string ): Acl;

        /**
         * @param role
         * @param resource
         * @param privilege
         */
        deny( role: string, resource: string, privilege?: string ): Acl;
    }
}