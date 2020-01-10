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
import { CalendarHashChainAlgorithmDeprecatedRule } from '../rule/CalendarHashChainAlgorithmDeprecatedRule';
import { ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule } from '../rule/ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule';
import { ExtendingPermittedVerificationRule } from '../rule/ExtendingPermittedVerificationRule';
import { SignaturePublicationRecordExistenceRule } from '../rule/SignaturePublicationRecordExistenceRule';
import { UserProvidedPublicationCreationTimeVerificationRule } from '../rule/UserProvidedPublicationCreationTimeVerificationRule';
import { UserProvidedPublicationExistenceRule } from '../rule/UserProvidedPublicationExistenceRule';
import { UserProvidedPublicationExtendedSignatureInputHashRule } from '../rule/UserProvidedPublicationExtendedSignatureInputHashRule';
import { UserProvidedPublicationHashMatchesExtendedResponseRule } from '../rule/UserProvidedPublicationHashMatchesExtendedResponseRule';
import { UserProvidedPublicationTimeMatchesExtendedResponseRule } from '../rule/UserProvidedPublicationTimeMatchesExtendedResponseRule';
import { UserProvidedPublicationVerificationRule } from '../rule/UserProvidedPublicationVerificationRule';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Policy for verifying KSI signature with user provided publication.
 */
export class UserProvidedPublicationBasedVerificationPolicy extends VerificationPolicy {
    constructor() {
        const verificationRule = new UserProvidedPublicationCreationTimeVerificationRule() // Gen-02
            .onSuccess(new ExtendingPermittedVerificationRule() // Gen-02
            .onSuccess(new ExtenderResponseCalendarHashChainAlgorithmDeprecatedRule() // Gen-02
            .onSuccess(new UserProvidedPublicationHashMatchesExtendedResponseRule() // Pub-01
            .onSuccess(new UserProvidedPublicationTimeMatchesExtendedResponseRule() // Pub-02
            .onSuccess(new UserProvidedPublicationExtendedSignatureInputHashRule())))));
        super(new UserProvidedPublicationExistenceRule() // Gen-02
            .onSuccess(new SignaturePublicationRecordExistenceRule() // Gen-02
            .onSuccess(new UserProvidedPublicationVerificationRule() // Pub-04, Gen-02
            .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule()) // Gen-02
            .onNa(verificationRule))
            .onNa(verificationRule)), 'UserProvidedPublicationBasedVerificationPolicy'); // Pub-03
    }
}
