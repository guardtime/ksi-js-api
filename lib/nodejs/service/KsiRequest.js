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
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
    constructor(response, eventEmitter) {
        super(response);
        this.aborted = false;
        this.eventEmitter = eventEmitter;
    }
    abort(responsePdu) {
        this.responsePayload = responsePdu;
        this.eventEmitter.emit(KsiRequest.ABORT_EVENT);
    }
    getAbortResponse() {
        return this.responsePayload;
    }
    isAborted() {
        return this.aborted;
    }
}
KsiRequest.ABORT_EVENT = 'ABORT';
