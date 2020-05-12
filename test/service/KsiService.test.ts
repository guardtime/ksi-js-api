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

import { KsiService } from '../../src/common/service/KsiService';
import { SigningService } from '../../src/common/service/SigningService';
import { TestServiceProtocol } from './TestServiceProtocol';
import { ServiceCredentials } from '../../src/common/service/ServiceCredentials';
import { HashAlgorithm } from '../../src/common/main';

describe('KsiService', () => {
  it('example test', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ksiService = new KsiService(
      new SigningService(
        new TestServiceProtocol(new Uint8Array(0)),
        new ServiceCredentials('', new Uint8Array(0), HashAlgorithm.SHA2_256)
      ),
      null,
      null
    );
  });
});
