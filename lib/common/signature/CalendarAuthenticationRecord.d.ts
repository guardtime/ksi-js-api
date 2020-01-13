import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { PublicationData } from '../publication/PublicationData';
import { SignatureData } from './SignatureData';
/**
 * Calendar Authentication Record TLV Object
 */
export declare class CalendarAuthenticationRecord extends CompositeTag {
    private publicationData;
    private signatureData;
    constructor(tlvTag: TlvTag);
    getPublicationData(): PublicationData;
    getSignatureData(): SignatureData;
    private parseChild;
    private validate;
}
