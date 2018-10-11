import {tabPrefix} from 'gt-js-common';
import {TlvError} from './TlvError';
import {TlvInputStream} from './TlvInputStream';
import {TlvOutputStream} from './TlvOutputStream';
import {TlvTag} from './TlvTag';

export interface ITlvCount {
    [key: number]: number;
}

/**
 * Composite TLV object
 */
export abstract class CompositeTag extends TlvTag {

    public value: TlvTag[];
    private readonly tlvCount: ITlvCount;

    protected constructor(tlvTag: TlvTag) {
        super(tlvTag.id, tlvTag.nonCriticalFlag, tlvTag.forwardFlag, tlvTag.getValueBytes());
        this.value = [];
        this.tlvCount = {};
    }

    protected static createCompositeTagTlv(id: number, nonCriticalFlag: boolean, forwardFlag: boolean,
                                           value: TlvTag[]): TlvTag {
        const stream: TlvOutputStream = new TlvOutputStream();
        for (const tlvTag of value) {
            stream.writeTag(tlvTag);
        }

        return new TlvTag(id, nonCriticalFlag, forwardFlag, stream.getData());
    }

    protected static parseTlvTag(tlvTag: TlvTag): TlvTag {
        if (!tlvTag.nonCriticalFlag) {
            throw new TlvError(`Unknown TLV tag: ${tlvTag.id.toString(16)}`);
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

            if (!this.tlvCount.hasOwnProperty(tlvTag.id)) {
                this.tlvCount[tlvTag.id] = 0;
            }

            this.tlvCount[tlvTag.id] += 1;
            position += 1;
        }
    }

    protected validateValue(validate: (tlvCount: ITlvCount) => void): void {
        validate({...this.tlvCount});
    }
}
