import { DataHash } from '@guardtime/gt-js-common';
import { TlvTag } from './TlvTag';
/**
 * DataHash TLV object
 */
export declare class ImprintTag extends TlvTag {
    private readonly value;
    constructor(tlvTag: TlvTag);
    static CREATE(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: DataHash): ImprintTag;
    getValue(): DataHash;
    toString(): string;
}
