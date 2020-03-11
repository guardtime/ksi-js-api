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

import {DataHash, DataHasher} from '@guardtime/gt-js-common';
import {KsiSignature} from '../../KsiSignature';
import {Rfc3161Record} from '../../Rfc3161Record';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies RFC3161 output hash equals to aggregation chain input hash.
 * If RFC3161 record is not present then <see cref="VerificationResultCode.Ok" /> is returned.
 */
export class Rfc3161RecordOutputHashVerificationRule extends VerificationRule {
    constructor() {
        super('Rfc3161RecordOutputHashVerificationRule');
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const rfc3161Record: Rfc3161Record | null = signature.getRfc3161Record();

        if (rfc3161Record === null) {
            return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
        }

        const aggregationHashChainInputHash: DataHash = signature.getAggregationHashChains()[0].getInputHash();
        const inputHash: DataHash = await new DataHasher(aggregationHashChainInputHash.hashAlgorithm)
            .update((await rfc3161Record.getOutputHash()).imprint)
            .digest();

        return !inputHash.equals(aggregationHashChainInputHash)
            ? new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_01())
            : new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
