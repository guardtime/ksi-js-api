import { TlvTag } from './TlvTag';
export interface ICount {
    getCount(id: number): number;
}
/**
 * Composite TLV object
 */
export declare abstract class CompositeTag extends TlvTag {
    value: TlvTag[];
    private readonly elementCounter;
    protected constructor(tlvTag: TlvTag);
    static CREATE_FROM_LIST(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: TlvTag[], tlv16BitFlag?: boolean): TlvTag;
    protected static createFromCompositeTag(id: number, tlvTag: CompositeTag): TlvTag;
    protected static parseTlvTag(tlvTag: TlvTag): TlvTag;
    toString(): string;
    protected decodeValue(createFunc: (tlvTag: TlvTag, position: number) => TlvTag): void;
    protected validateValue(validate: (tlvCount: ICount) => void): void;
}
