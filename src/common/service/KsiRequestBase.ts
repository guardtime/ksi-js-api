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

import { PduPayload } from './PduPayload';

/**
 * KSI request base class for PDU exchanging with KSI servers.
 */
export abstract class KsiRequestBase {
  private readonly response: Promise<Uint8Array | null>;

  protected constructor(response: Promise<Uint8Array | null>) {
    this.response = response;
  }

  public async getResponse(): Promise<Uint8Array | null> {
    return this.response;
  }

  public abstract getAbortResponse(): PduPayload;

  public abstract isAborted(): boolean;

  public abstract abort(responsePdu: PduPayload): void;
}
