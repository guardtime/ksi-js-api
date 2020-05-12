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
