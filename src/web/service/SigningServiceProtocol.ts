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

import { ISigningServiceProtocol } from '../../common/service/ISigningServiceProtocol';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { KsiHttpProtocol } from '../../common/service/KsiHttpProtocol';
import { KsiRequest } from '../../common/service/KsiRequest';

/**
 * HTTP signing service protocol
 * @deprecated Use common/service/SigningServiceProtocol instead.
 */
export class SigningServiceProtocol extends KsiHttpProtocol implements ISigningServiceProtocol {
  constructor(url: string) {
    super(url);
  }

  public sign(requestBytes: Uint8Array): KsiRequestBase {
    const abortController: AbortController = new AbortController();

    return new KsiRequest(this.requestKsi(requestBytes, abortController), abortController);
  }
}
