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
import { PublicationsFileServiceProtocol as NodePublicationsFileServiceProtocol } from '../../nodejs/service/PublicationsFileServiceProtocol';
import { PublicationsFileServiceProtocol as WebPublicationsFileServiceProtocol } from '../../web/service/PublicationsFileServiceProtocol';
import { IPublicationsFileServiceProtocol } from './IPublicationsFileServiceProtocol';

/**
 * HTTP publications file service protocol
 */
export class PublicationsFileServiceProtocol implements IPublicationsFileServiceProtocol {
  private readonly publicationsFileServiceProtocol: IPublicationsFileServiceProtocol;

  constructor(url: string) {
    this.publicationsFileServiceProtocol = this.getPublicationsFileServiceProtocol(url);
  }

  getPublicationsFileServiceProtocol(url: string): IPublicationsFileServiceProtocol {
    if (isNodePlatform) {
      return new NodePublicationsFileServiceProtocol(url);
    } else {
      return new WebPublicationsFileServiceProtocol(url);
    }
  }

  async getPublicationsFile(): Promise<Uint8Array> {
    return this.publicationsFileServiceProtocol.getPublicationsFile();
  }
}
