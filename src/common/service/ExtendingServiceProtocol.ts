/*
 * Copyright 2013-2022 Guardtime, Inc.
 *
 * This file is part of the Guardtime client SDK.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES, CONDITIONS, OR OTHER LICENSES OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

import { IExtendingServiceProtocol } from './IExtendingServiceProtocol.js';
import { KsiHttpProtocol } from './KsiHttpProtocol.js';
import { KsiRequest } from './KsiRequest.js';
import { KsiRequestBase } from './KsiRequestBase.js';

/**
 * HTTP extending service protocol.
 */
export class ExtendingServiceProtocol extends KsiHttpProtocol implements IExtendingServiceProtocol {
  /**
   * HTTP extending service protocol constructor.
   * @param url Extender URL.
   */
  public constructor(url: string) {
    super(url);
  }

  /**
   * @inheritDoc
   */
  public extend(requestBytes: Uint8Array): KsiRequestBase {
    const abortController: AbortController = new AbortController();

    return new KsiRequest(this.requestKsi(requestBytes, abortController), abortController);
  }
}
