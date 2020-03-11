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

import {CalendarAuthenticationRecordExistenceRule} from '../rule/CalendarAuthenticationRecordExistenceRule';
import {CalendarAuthenticationRecordSignatureVerificationRule} from '../rule/CalendarAuthenticationRecordSignatureVerificationRule';
import {CalendarHashChainAlgorithmDeprecatedRule} from '../rule/CalendarHashChainAlgorithmDeprecatedRule';
import {CalendarHashChainExistenceRule} from '../rule/CalendarHashChainExistenceRule';
import {CertificateExistenceRule} from '../rule/CertificateExistenceRule';
import {VerificationRule} from '../VerificationRule';
import {InternalVerificationPolicy} from './InternalVerificationPolicy';
import {VerificationPolicy} from './VerificationPolicy';

/**
 * Policy for verifying KSI signature with PKI.
 */
export class KeyBasedVerificationPolicy extends VerificationPolicy {

    constructor(skipInternalVerification: boolean = false) {
        let verificationRule: VerificationRule = new CalendarHashChainExistenceRule() // Gen-02
            .onSuccess(new CalendarHashChainAlgorithmDeprecatedRule() // Gen-02
                .onSuccess(new CalendarAuthenticationRecordExistenceRule() // Gen-02
                    .onSuccess(new CertificateExistenceRule() // Key-01
                        .onSuccess(new CalendarAuthenticationRecordSignatureVerificationRule())))); // Key-02, Key-03

        if (!skipInternalVerification) {
            verificationRule = new InternalVerificationPolicy().onSuccess(verificationRule);
        }

        super(verificationRule, 'KeyBasedVerificationPolicy');
    }
}
