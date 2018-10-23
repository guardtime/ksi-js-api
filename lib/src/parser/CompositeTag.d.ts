import { TlvTag } from './TlvTag';
export interface ITlvCount {
    [key: number]: number;
}
/**
 * Composite TLV object
 */
export declare abstract class CompositeTag extends TlvTag {
    value: TlvTag[];
    private readonly tlvCount;
    protected constructor(tlvTag: TlvTag);
    protected static createFromList(id: number, nonCriticalFlag: boolean, forwardFlag: boolean, value: TlvTag[], tlv16BitFlag?: boolean): TlvTag;
    protected static createFromCompositeTag(id: number, tlvTag: CompositeTag): TlvTag;
    protected static parseTlvTag(tlvTag: TlvTag): TlvTag;
    toString(): string;
    protected decodeValue(createFunc: (tlvTag: TlvTag, position: number) => TlvTag): void;
    protected validateValue(validate: (tlvCount: ITlvCount) => void): void;
}
