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

import {DataHash} from '@guardtime/gt-js-common';
import {KsiSignature} from '../../KsiSignature';
import {VerificationContext} from '../VerificationContext';
import {VerificationError} from '../VerificationError';
import {VerificationResult, VerificationResultCode} from '../VerificationResult';
import {VerificationRule} from '../VerificationRule';

/**
 * This rule verifies that input hash algorithm is not deprecated at aggregation time.
 * If RFC3161 record is present then RFC3161 record input hash algorithm deprecation is checked.
 */
export class InputHashAlgorithmDeprecatedRule extends VerificationRule {
    constructor() {
        super('InputHashAlgorithmDeprecatedRule');
    }

    public async verify(context: VerificationContext): Promise<VerificationResult> {
        const signature: KsiSignature = context.getSignature();
        const inputHash: DataHash = signature.getInputHash();

        if (inputHash.hashAlgorithm.isDeprecated(signature.getAggregationTime().valueOf())) {
            // tslint:disable-next-line:max-line-length
            console.debug(`Input hash algorithm was deprecated at aggregation time. Algorithm: ${inputHash.hashAlgorithm.name}; Aggregation time: ${signature.getAggregationTime()}.`);

            return new VerificationResult(this.getRuleName(), VerificationResultCode.FAIL, VerificationError.INT_13());
        }

        return new VerificationResult(this.getRuleName(), VerificationResultCode.OK);
    }
}
