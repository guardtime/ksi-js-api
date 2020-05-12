/*
 * Copyright 2013-2019 Guardtime, Inc.
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

import { ISigningServiceProtocol } from '../../src/common/service/ISigningServiceProtocol';
import { IExtendingServiceProtocol } from '../../src/common/service/IExtendingServiceProtocol';
import { IPublicationsFileServiceProtocol } from '../../src/common/service/IPublicationsFileServiceProtocol';
import { KsiRequestBase } from '../../src/common/service/KsiRequestBase';
import { KsiRequest } from '../../src/nodejs/service/KsiRequest';
import { EventEmitter } from 'events';

/**
 * Test service protocol for mocking queries to server
 */
export class TestServiceProtocol
  implements ISigningServiceProtocol, IExtendingServiceProtocol, IPublicationsFileServiceProtocol {
  private readonly resultBytes: Uint8Array;

  public constructor(resultBytes: Uint8Array) {
    this.resultBytes = resultBytes;
  }

  public extend(): KsiRequestBase {
    return new KsiRequest(Promise.resolve(this.resultBytes), new EventEmitter());
  }

  public getPublicationsFile(): Promise<Uint8Array> {
    return Promise.resolve(this.resultBytes);
  }

  public sign(): KsiRequestBase {
    return new KsiRequest(Promise.resolve(this.resultBytes), new EventEmitter());
  }
}
