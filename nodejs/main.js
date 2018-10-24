const fs = require('fs');

const CONFIG = require('./config.js');
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
