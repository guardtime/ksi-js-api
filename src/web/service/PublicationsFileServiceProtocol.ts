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

import { KsiHttpProtocol } from '../../common/service/KsiHttpProtocol';

/**
 * HTTP publications file service protocol
 * @deprecated Use common/service/PublicationsFileServiceProtocol instead.
 */
export class PublicationsFileServiceProtocol extends KsiHttpProtocol {
  /**
   * HTTP publications file service protocol constructor.
   * @param url Publications file url.
   */
  public constructor(url: string) {
    super(url);
  }

  /**
   * @inheritDoc
   */
  public async getPublicationsFile(): Promise<Uint8Array> {
    return this.download();
  }
}
