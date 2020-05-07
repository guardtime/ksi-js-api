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
