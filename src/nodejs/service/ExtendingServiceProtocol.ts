/*
 * Copyright 2013-2020 Guardtime, Inc.
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

import { EventEmitter } from 'events';
import { IExtendingServiceProtocol } from '../../common/service/IExtendingServiceProtocol';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { KsiHttpProtocol } from './KsiHttpProtocol';
import { KsiRequest } from './KsiRequest';

/**
 * HTTP extending service protocol.
 * @deprecated Use common/service/ExtendingServiceProtocol instead.
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
    const eventEmitter: EventEmitter = new EventEmitter();

    return new KsiRequest(this.requestKsi(requestBytes, eventEmitter), eventEmitter);
  }
}
