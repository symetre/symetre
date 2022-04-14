import { Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { Database } from 'https://deno.land/x/denodb/mod.ts';


/**
 * "Levels" of a {@link Scope}
 * * Read
 * * Write
 */
declare enum ScopeLevel {
    Read,
    /**
     * Grants write **AND** read permissions
     */
    Write
}

/**
 * Common interface for plugins
 * @private
 */
interface Plugin {
    /**
     * Plugin name, generated from folder name
     */
    name: string
}

/**
 * A scope
 */
interface Scope {
    /**
    * @param key - The scope name
    * @param value - The {@link ScopeLevel}
    */
    [key: string]: ScopeLevel;
}

/**
 * Importants given to plugin
 */
interface PluginGiven {
    /**
     * A common database client.
     * @remarks
     * Note the database has no protections against R/W, there is no need for public/private data currently.
     */
    db: Database,
    /**
     * A specialized router instance.  
     * @remarks
     * Routes are plugin specific and automatically prefixed with "{@link Plugin.name}/"
     */
    router: Router,
    /**
     * list of scopes
     */
    scopes: {
        /**
         * Plugins
         * @example
         * 
         * ```
         * {
         *     auth: ...,
         *     webmmention: ...
         * }
         * ```
         */
        [key: string]: [
            /**
             * Scopes for given plugin
             * @example
             * ```
             * [
             *     "WEBMENTIONS",
             *     "PAGES_WITH_WEBMENTIONS"
             * ]
             */
            string
        ]
    }
    /**
     * Provide list of scopes, get a True in return if the request is proper.
     * @remarks
     * Requests are stripped of autorization tokens by the time they reach the plugin's router.
     * @param scopes - A list of scopes that should have been granted.
     */
    authChecker(scopes: [PluginGiven["scopes"]]): Boolean,
}

/**
 * Data returned from the plugin 
 */
interface PluginReturn {
    router: Router,
    db: Database,
    scopes: [
        string
    ],
}

export function plugin(input: PluginGiven): PluginReturn