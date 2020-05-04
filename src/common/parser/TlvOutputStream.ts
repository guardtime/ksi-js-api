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

import { TlvTag } from './TlvTag';

/**
 * Specialized output stream for encoding TLV data from TLVTag classes.
 */
export class TlvOutputStream {
  private data: Uint8Array = new Uint8Array(0);

  /**
   * Get current stream output bytes.
   * @returns Output bytes.
   */
  public getData(): Uint8Array {
    return new Uint8Array(this.data);
  }

  /**
   * Write TLV object to stream.
   * @param tlvTag TLV object.
   */
  public writeTag(tlvTag: TlvTag): void {
    this.write(tlvTag.encode());
  }

  /**
   * Write bytes to stream.
   * @param data Data bytes.
   */
  public write(data: Uint8Array): void {
    const combinedData: Uint8Array = new Uint8Array(this.data.length + data.length);
    combinedData.set(this.data);
    combinedData.set(data, this.data.length);
    this.data = combinedData;
  }
}
