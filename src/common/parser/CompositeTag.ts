import {tabPrefix} from 'gt-js-common';
import {TlvError} from './TlvError';
import {TlvInputStream} from './TlvInputStream';
import {TlvOutputStream} from './TlvOutputStream';
import {TlvTag} from './TlvTag';

export interface ICount {
    getCount(id: number): number;
}

/**
 * Counter for elements in composite TLV
 */
class ElementCounter implements ICount {
    private counts: {[key: number]: number} = {};

    public getCount(id: number): number {
        return this.counts[id] || 0;
    }

    public addCount(id: number): void {
        if (!this.counts.hasOwnProperty(id)) {
            this.counts[id] = 0;
        }

        this.counts[id] += 1;
    }
}

/**
 * Composite TLV object
 */
export abstract class CompositeTag extends TlvTag {

    public value: TlvTag[] = [];
    private readonly elementCounter: ElementCounter = new ElementCounter();

    protected constructor(tlvTag: TlvTag) {
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes(), tlvTag.tlv16BitFlag);
    }

    public static CREATE_FROM_LIST(id: number, nonCriticalFlag: boolean, forwardFlag: boolean,
                                   value: TlvTag[], tlv16BitFlag: boolean = false): TlvTag {
        const stream: TlvOutputStream = new TlvOutputStream();
        for (const tlvTag of value) {
            stream.writeTag(tlvTag);
        }

        return new TlvTag(id, nonCriticalFlag, forwardFlag, stream.getData(), tlv16BitFlag);
    }

    protected static createFromCompositeTag(id: number, tlvTag: CompositeTag): TlvTag {
        return new TlvTag(id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes());
    }

    protected static parseTlvTag(tlvTag: TlvTag): TlvTag {
        if (!tlvTag.nonCriticalFlag) {
            throw new TlvError(`Unknown TLV tag: 0x${tlvTag.id.toString(16)}`);
        }

        return tlvTag;
    }

    public toString(): string {
        let result: string = `TLV[0x${this.id.toString(16)}`;
        if (this.nonCriticalFlag) {
            result += ',N';
        }

        if (this.forwardFlag) {
            result += ',F';
        }

        result += ']:\n';

        for (let i: number = 0; i < this.value.length; i += 1) {
            result += tabPrefix(this.value[i].toString());
            if (i < (this.value.length - 1)) {
                result += '\n';
            }
        }

        return result;
    }

    protected decodeValue(createFunc: (tlvTag: TlvTag, position: number) => TlvTag): void {
        const valueBytes: Uint8Array = this.getValueBytes();
        const stream: TlvInputStream = new TlvInputStream(valueBytes);
        let position: number = 0;
        while (stream.getPosition() < stream.getLength()) {
            const tlvTag: TlvTag = createFunc(stream.readTag(), position);
            this.value.push(tlvTag);

            this.elementCounter.addCount(tlvTag.id);
            position += 1;
        }

        Object.freeze(this.elementCounter);
    }

    protected validateValue(validate: (tlvCount: ICount) => void): void {
        validate(this.elementCounter);
    }
}
