import bigInteger from 'big-integer';
import { DataHash } from 'gt-js-common';
import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { PublicationData } from './PublicationData';
/**
 * Publication Record TLV object
 */
export declare class PublicationRecord extends CompositeTag {
    private publicationData;
    private publicationReferences;
    private repositoryUri;
    constructor(tlvTag: TlvTag);
    getPublicationHash(): DataHash;
    getPublicationTime(): bigInteger.BigInteger;
    getPublicationData(): PublicationData;
    private parseChild;
    private validate;
}
