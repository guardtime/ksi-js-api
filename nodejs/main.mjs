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

import * as fs from 'fs';
import { default as CONFIG } from '../config/ksi-config.js';
import { default as KSI } from '../dist/main.node.cjs';

const service = new KSI.KsiService(
  new KSI.SigningService(
    new KSI.SigningServiceProtocol(CONFIG.AGGREGATION_URL),
    new KSI.ServiceCredentials(CONFIG.LOGIN_ID, CONFIG.LOGIN_KEY)
  ),
  new KSI.ExtendingService(
    new KSI.ExtendingServiceProtocol(CONFIG.EXTENDER_URL),
    new KSI.ServiceCredentials(CONFIG.LOGIN_ID, CONFIG.LOGIN_KEY)
  ),
  new KSI.PublicationsFileService(
    new KSI.PublicationsFileServiceProtocol(CONFIG.PUBLICATIONS_FILE_URL),
    new KSI.PublicationsFileFactory(new KSI.BrowserSpkiFactory())
  ));

service.sign(KSI.DataHash.create(KSI.HashAlgorithm.SHA2_256, new Uint8Array(32)))
  .then((signature) => {
    console.log(signature.toString());
  })
  .catch((err) => {
    console.log(err);
  });

fs.readFile('../web/sig.ksig', async (_, data) => {
  const stream = new KSI.TlvInputStream(data);
  const tlvTag = stream.readTag();
  const signature = new KSI.KsiSignature(tlvTag);
  const calendarHashChain = await service.extend(signature.getAggregationTime());
  console.log(calendarHashChain.toString());

  const publicationsFile = await service.getPublicationsFile();

  const policy = new KSI.DefaultVerificationPolicy(new KSI.BrowserSpkiFactory());
  const context = new KSI.VerificationContext(signature);
  context.setPublicationsFile(publicationsFile);
  context.setExtendingAllowed(false);
  context.setKsiService(service);
  console.log((await policy.verify(context)).toString());

});
