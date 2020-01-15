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
import { CERTIFICATE_RECORD_CONSTANTS } from '../Constants';
import { CompositeTag } from '../parser/CompositeTag';
import { RawTag } from '../parser/RawTag';
import { TlvError } from '../parser/TlvError';
/**
 * Certificate Record TLV object
 */
export class CertificateRecord extends CompositeTag {
    constructor(tlvTag) {
        super(tlvTag);
        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));
        Object.freeze(this);
    }
    getX509Certificate() {
        return this.x509Certificate.getValue();
    }
    getCertificateId() {
        return this.certificateId.getValue();
    }
    parseChild(tlvTag) {
        switch (tlvTag.id) {
            case CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType:
                return this.certificateId = new RawTag(tlvTag);
            case CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType:
                return this.x509Certificate = new RawTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }
    // noinspection JSMethodCanBeStatic
    validate(tagCount) {
        if (tagCount.getCount(CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType) !== 1) {
            throw new TlvError('Exactly one certificate id must exist in certificate record.');
        }
        if (tagCount.getCount(CERTIFICATE_RECORD_CONSTANTS.X509CertificateTagType) !== 1) {
            throw new TlvError('Exactly one certificate must exist in certificate record.');
        }
    }
}
