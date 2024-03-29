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

import { CERTIFICATE_RECORD_CONSTANTS } from '../../src/common/Constants.js';
import { CompositeTag } from '../../src/common/parser/CompositeTag.js';
import { RawTag } from '../../src/common/parser/RawTag.js';
import { TlvTag } from '../../src/common/parser/TlvTag.js';

/**
 * Test Composite TLV object
 */
export class TestCompositeTag extends CompositeTag {
  public constructor(tlvTag: TlvTag) {
    super(tlvTag);

    this.decodeValue(this.parseChild.bind(this));
  }

  private parseChild(tlvTag: TlvTag): TlvTag {
    switch (tlvTag.id) {
      case CERTIFICATE_RECORD_CONSTANTS.CertificateIdTagType:
        return new RawTag(tlvTag);
      default:
        return this.validateUnknownTlvTag(tlvTag);
    }
  }
}
