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

import { KsiRequestBase } from './KsiRequestBase';
import { PduPayload } from './PduPayload';

/**
 * KSI request for PDU exchanging with KSI servers.
 */
export class KsiRequest extends KsiRequestBase {
  private readonly abortController: AbortController;
  private abortResponse: PduPayload;

  /**
   * KSI request constructor.
   * @param response Response promise.
   * @param abortController Abort controller for cancelling request.
   */
  public constructor(response: Promise<Uint8Array | null>, abortController: AbortController) {
    super(response);

    this.abortController = abortController;
  }

  /**
   * @inheritDoc
   */
  public abort(payload: PduPayload): void {
    this.abortResponse = payload;
    this.abortController.abort();
  }

  /**
   * @inheritDoc
   */
  public getAbortResponse(): PduPayload {
    return this.abortResponse;
  }

  /**
   * @inheritDoc
   */
  public isAborted(): boolean {
    return this.abortController.signal.aborted;
  }
}
