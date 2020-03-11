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

const fs = require('fs');
const CONFIG = require('../config/ksi-config.js');
const KSI = require('../dist/main.node');

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
        new KSI.PublicationsFileFactory()
    ));

service.sign(KSI.DataHash.create(KSI.HashAlgorithm.SHA2_256, new Uint8Array(32)))
    .then((signature) => {
        console.log(signature);
    })
    .catch((err) => {
        console.log(err);
    });

fs.readFile('../web/sig.ksig', (_, data) => {
    const stream = new KSI.TlvInputStream(data);
    const tlvTag = stream.readTag();
    const signature = new KSI.KsiSignature(tlvTag);
    service.extend(signature.getAggregationTime())
        .then(calendarHashChain => {
            console.log(calendarHashChain);
        })
        .catch((err) => {
            console.log(err);
        });

    service.getPublicationsFile().then((publicationsFile) => {
        console.log(publicationsFile);

        const policy = new KSI.DefaultVerificationPolicy();
        const context = new KSI.VerificationContext(signature);
        context.setPublicationsFile(publicationsFile);
        context.setExtendingAllowed(false);
        context.setKsiService(service);
        policy.verify(context)
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            })
    }).catch((err) => {
        console.log(err);
    });
});
