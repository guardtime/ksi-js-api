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
import { UserProvidedPublicationExistenceRule } from '../rule/UserProvidedPublicationExistenceRule';
import { InternalVerificationPolicy } from './InternalVerificationPolicy';
import { PublicationsFileVerificationPolicy } from './PublicationsFileVerificationPolicy';
import { UserProvidedPublicationBasedVerificationPolicy } from './UserProvidedPublicationBasedVerificationPolicy';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature with publication.
 */
export class PublicationBasedVerificationPolicy extends VerificationPolicy {
    constructor() {
        super(new InternalVerificationPolicy()
            .onSuccess(new UserProvidedPublicationExistenceRule() // Gen-02
            .onSuccess(new UserProvidedPublicationBasedVerificationPolicy()) // Gen-02
            .onNa(new PublicationsFileVerificationPolicy())), 'PublicationBasedVerificationPolicy');
    }
}
