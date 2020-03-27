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

import { EventEmitter } from 'events';
import { IExtendingServiceProtocol } from '../../common/service/IExtendingServiceProtocol';
import { KsiRequestBase } from '../../common/service/KsiRequestBase';
import { KsiHttpProtocol } from './KsiHttpProtocol';
import { KsiRequest } from './KsiRequest';

/**
 * HTTP extending service protocol
 */
export class ExtendingServiceProtocol extends KsiHttpProtocol implements IExtendingServiceProtocol {
  constructor(url: string) {
    super(url);
  }

  public extend(requestBytes: Uint8Array): KsiRequestBase {
    const eventEmitter: EventEmitter = new EventEmitter();

    return new KsiRequest(this.requestKsi(requestBytes, eventEmitter), eventEmitter);
  }
}
