import {IKsiIdentity} from '../signature/IKsiIdentity';

/**
 * TlvTag interface
 */
export interface ITlvTag {
    readonly id: number;
    readonly tlv16BitFlag: boolean;
    readonly nonCriticalFlag: boolean;
    readonly forwardFlag: boolean;

    getValueBytes(): Uint8Array;

    encode(): Uint8Array;
}

export function isTlvTag(object: any): object is ITlvTag {
    return object instanceof Object
        && typeof object.id === 'number'
        && typeof object.tlv16BitFlag === 'boolean'
        && typeof object.nonCriticalFlag === 'boolean'
        && typeof object.forwardFlag === 'boolean'
        && typeof object.getValueBytes === 'function'
        && typeof object.encode === 'function';
}
