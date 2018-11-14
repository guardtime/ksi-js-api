/**
 * Compare typed arrays
 * @param arr1 Typed array 1
 * @param arr2 Typed array 2
 */
export function compareTypedArray(arr1: Uint8Array, arr2: Uint8Array): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i: number = 0; i < arr1.length; i += 1) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

export function compareArrayEquals<T extends IEquals>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i: number = 0; i < arr1.length; i += 1) {
        if (!arr1[i].equals(arr2[i])) {
            return false;
        }
    }

    return true;
}

interface IEquals {
    // tslint:disable-next-line:no-any
    equals(object: any): boolean;
}
