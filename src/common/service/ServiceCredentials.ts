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

import HashAlgorithm from '@guardtime/common/lib/hash/HashAlgorithm';
import { IServiceCredentials } from './IServiceCredentials';

/**
 * Service credentials for KSI service.
 */
export class ServiceCredentials implements IServiceCredentials {
  private readonly hmacAlgorithm: HashAlgorithm;
  private readonly loginId: string;
  private readonly loginKey: Uint8Array;

  /**
   * Service credentials constructor.
   * @param loginId Login ID.
   * @param loginKey Login key for HMAC calculation.
   * @param hmacAlgorithm HMAC algorithm, by default algorithm defined in js-common dependency HashAlgorithm.DEFAULT.
   */
  public constructor(loginId: string, loginKey: Uint8Array, hmacAlgorithm: HashAlgorithm = HashAlgorithm.DEFAULT) {
    this.loginId = loginId;
    this.loginKey = loginKey;
    this.hmacAlgorithm = hmacAlgorithm;
  }

  /**
   * @inheritDoc
   */
  public getHmacAlgorithm(): HashAlgorithm {
    return this.hmacAlgorithm;
  }

  /**
   * @inheritDoc
   */
  public getLoginId(): string {
    return this.loginId;
  }

  /**
   * @inheritDoc
   */
  public getLoginKey(): Uint8Array {
    return this.loginKey;
  }
}
