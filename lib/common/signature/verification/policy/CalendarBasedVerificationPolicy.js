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
import { CalendarHashChainExistenceRule } from '../rule/CalendarHashChainExistenceRule';
import { ExtendedSignatureCalendarChainAggregationTimeRule } from '../rule/ExtendedSignatureCalendarChainAggregationTimeRule';
import { ExtendedSignatureCalendarChainInputHashRule } from '../rule/ExtendedSignatureCalendarChainInputHashRule';
import { ExtendedSignatureCalendarChainRootHashRule } from '../rule/ExtendedSignatureCalendarChainRootHashRule';
import { ExtendedSignatureCalendarHashChainRightLinksMatchRule } from '../rule/ExtendedSignatureCalendarHashChainRightLinksMatchRule';
import { SignaturePublicationRecordExistenceRule } from '../rule/SignaturePublicationRecordExistenceRule';
import { InternalVerificationPolicy } from './InternalVerificationPolicy';
import { VerificationPolicy } from './VerificationPolicy';
/**
 * Calendar based verification policy
 */
export class CalendarBasedVerificationPolicy extends VerificationPolicy {
    constructor() {
        const verificationRule = new ExtendedSignatureCalendarChainInputHashRule() // Cal-02
            .onSuccess(new ExtendedSignatureCalendarChainAggregationTimeRule()); // Cal-03
        super(new InternalVerificationPolicy()
            .onSuccess(new CalendarHashChainExistenceRule() // // Gen-02
            .onSuccess(new SignaturePublicationRecordExistenceRule() // Gen-02
            .onSuccess(new ExtendedSignatureCalendarChainRootHashRule() // Cal-01
            .onSuccess(verificationRule))
            .onNa(new ExtendedSignatureCalendarHashChainRightLinksMatchRule() // Cal-4
            .onSuccess(verificationRule)))
            .onNa(verificationRule)), 'CalendarBasedVerificationPolicy');
    }
}
