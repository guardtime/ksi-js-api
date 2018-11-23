import { HashAlgorithm } from 'gt-js-common';
import { ICount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { ExtendRequestPayload } from './ExtendRequestPayload';
import { Pdu } from './Pdu';
import { PduHeader } from './PduHeader';
/**
 * Extend request PDU
 */
export declare class ExtendRequestPdu extends Pdu {
    private extenderConfigRequest;
    constructor(tlvTag: TlvTag);
    static CREATE(header: PduHeader, payload: ExtendRequestPayload, algorithm: HashAlgorithm, key: Uint8Array): Promise<ExtendRequestPdu>;
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ICount): void;
}
