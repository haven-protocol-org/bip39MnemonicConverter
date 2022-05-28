export default Module;
declare namespace Module {
    import FS_createDataFile = FS.createDataFile;
    export { FS_createDataFile };
    import FS_createPreloadedFile = FS.createPreloadedFile;
    export { FS_createPreloadedFile };
    export const ___wasm_call_ctors: (...args: any[]) => unknown;
    export const _secret_key_to_public_key: (...args: any[]) => unknown;
    export const _cn_fast_hash: (...args: any[]) => unknown;
    export const _sc_reduce32: (...args: any[]) => unknown;
    export const _get_subaddress_secret_key: (...args: any[]) => unknown;
    export const _scalarmultKey: (...args: any[]) => unknown;
    export const _sc_add: (...args: any[]) => unknown;
    export const ___errno_location: (...args: any[]) => unknown;
    export const ___stdio_exit: (...args: any[]) => unknown;
    export const _malloc: (...args: any[]) => unknown;
    export const _free: (...args: any[]) => unknown;
    export const _emscripten_stack_init: (...args: any[]) => unknown;
    export const _emscripten_stack_get_free: (...args: any[]) => unknown;
    export const _emscripten_stack_get_base: (...args: any[]) => unknown;
    export const _emscripten_stack_get_end: (...args: any[]) => unknown;
    export const stackSave: (...args: any[]) => unknown;
    export const stackRestore: (...args: any[]) => unknown;
    export const stackAlloc: (...args: any[]) => unknown;
    export const dynCall_jiji: (...args: any[]) => unknown;
    export { ccall };
    export { cwrap };
    export { writeStackCookie };
    export { checkStackCookie };
    export { run };
    export const preInit: any[];
}
declare namespace FS {
    function error(): void;
    function init(): void;
    function createDataFile(): void;
    function createPreloadedFile(): void;
    function createLazyFile(): void;
    function open(): void;
    function mkdev(): void;
    function registerDevice(): void;
    function analyzePath(): void;
    function loadFilesFromDB(): void;
    function ErrnoError(): void;
}
/** @param {string|null=} returnType
    @param {Array=} argTypes
    @param {Arguments|Array=} args
    @param {Object=} opts */
declare function ccall(ident: any, returnType?: (string | null) | undefined, argTypes?: any[] | undefined, args?: (Arguments | any[]) | undefined, opts?: Object | undefined): any;
/** @param {string=} returnType
    @param {Array=} argTypes
    @param {Object=} opts */
declare function cwrap(ident: any, returnType?: string | undefined, argTypes?: any[] | undefined, opts?: Object | undefined): (...args: any[]) => any;
declare function writeStackCookie(): void;
declare function checkStackCookie(): void;
/** @type {function(Array=)} */
declare function run(args: any[] | undefined): any;
