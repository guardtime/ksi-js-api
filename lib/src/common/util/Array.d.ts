/**
 * Compare typed arrays
 * @param arr1 Typed array 1
 * @param arr2 Typed array 2
 */
export declare function compareTypedArray(arr1: Uint8Array, arr2: Uint8Array): boolean;
export declare function compareArrayEquals<T extends IEquals>(arr1: T[], arr2: T[]): boolean;
interface IEquals {
    equals(object: any): boolean;
}
export {};
