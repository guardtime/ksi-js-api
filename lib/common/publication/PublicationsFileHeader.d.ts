import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
/**
 * Publications File Header TLV Object
 */
export declare class PublicationsFileHeader extends CompositeTag {
    private version;
    private creationTime;
    private repositoryUri;
    constructor(tlvTag: TlvTag);
    private parseChild;
    private validate;
}
