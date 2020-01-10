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

import {CalendarHashChain} from '../../CalendarHashChain';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * Rule is used to verify calendar hash chain registration time (calculated from calendar hash  chain shape) equality
 * to calendar hash chain aggregation time. If calendar hash chain is missing then status VerificationResultCode.Ok is returned.
 */
export class CalendarHashChainRegistrationTimeRule extends VerificationRule {
    constructor() {
        super('CalendarHashChainRegistrationTimeRule');
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const calendarHashChain: CalendarHashChain | null = signature.getCalendarHashChain();

        if (calendarHashChain === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        return calendarHashChain.getAggregationTime().neq(calendarHashChain.calculateRegistrationTime())
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_05())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
