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
