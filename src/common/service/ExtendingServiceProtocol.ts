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

import { isNodePlatform } from '@guardtime/gt-js-common/lib/utils/Util';
import { IExtendingServiceProtocol } from './IExtendingServiceProtocol';
import { ExtendingServiceProtocol as NodeExtendingServiceProtocol } from '../../nodejs/service/ExtendingServiceProtocol';
import { ExtendingServiceProtocol as WebExtendingServiceProtocol } from '../../web/service/ExtendingServiceProtocol';
import { KsiRequestBase } from './KsiRequestBase';

/**
 * HTTP extending service protocol
 */
export class ExtendingServiceProtocol implements IExtendingServiceProtocol {
  private readonly extendingServiceProtocol: IExtendingServiceProtocol;

  constructor(url: string) {
    this.extendingServiceProtocol = this.getExtendingServiceProtocol(url);
  }

  getExtendingServiceProtocol(url: string): IExtendingServiceProtocol {
    if (isNodePlatform) {
      return new NodeExtendingServiceProtocol(url);
    } else {
      return new WebExtendingServiceProtocol(url);
    }
  }

  extend(requestBytes: Uint8Array): KsiRequestBase {
    return this.extendingServiceProtocol.extend(requestBytes);
  }
}
