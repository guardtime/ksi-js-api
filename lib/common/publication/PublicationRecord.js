/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */
import { PUBLICATION_DATA_CONSTANTS, PUBLICATION_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { StringTag } from '../parser/StringTag';
import { TlvError } from '../parser/TlvError';
import { PublicationData } from './PublicationData';
/**
 * Publication Record TLV object
 */
export class PublicationRecord extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.publicationReferences = [];
        this.repositoryUri = [];
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getPublicationHash() {
        return this.publicationData.getPublicationHash();
    }
    getPublicationTime() {
        return this.publicationData.getPublicationTime();
    }
    getPublicationData() {
        return this.publicationData;
    }
    getPublicationReferences() {
        return this.publicationReferences.map((reference) => {
            return reference.getValue();
        });
    }
    getPublicationRepositories() {
        return this.repositoryUri.map((repository) => {
            return repository.getValue();
        });
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case PUBLICATION_DATA_CONSTANTS.TagType:
                return this.publicationData = new PublicationData(tlvTag);
            case PUBLICATION_RECORD_CONSTANTS.PublicationReferencesTagType:
                const reference = new StringTag(tlvTag);
                this.publicationReferences.push(reference);
                return reference;
            case PUBLICATION_RECORD_CONSTANTS.PublicationRepositoryUriTagType:
                const uri = new StringTag(tlvTag);
                this.repositoryUri.push(uri);
                return uri;
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(PUBLICATION_DATA_CONSTANTS.TagType) !== 1) {
            throw new TlvError('Exactly one publication data must exist in publication record.');
        }
    }
}
