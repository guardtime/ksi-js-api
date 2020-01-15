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

import {KsiRequestBase} from '../../common/service/KsiRequestBase';
import {PduPayload} from '../../common/service/PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    private readonly abortController: AbortController;
    private abortResponse: PduPayload;

    constructor(response: Promise<Uint8Array | null>, abortController: AbortController) {
        super(response);

        this.abortController = abortController;
    }

    public abort(payload: PduPayload): void {
        this.abortResponse = payload;
        this.abortController.abort();
    }

    public getAbortResponse(): PduPayload {
        return this.abortResponse;
    }

    public isAborted(): boolean {
        return this.abortController.signal.aborted;
    }

}
