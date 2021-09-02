# KSI JavaScript SDK

Guardtime's KSI Blockchain is an industrial scale blockchain platform that cryptographically ensures data integrity and proves time of existence. The KSI signatures, based on hash chains, link data to this global calendar blockchain. The checkpoints of the blockchain, published in newspapers and electronic media, enable long term integrity of any digital asset without the need to trust any system. There are many applications for KSI, a classical example is signing of any type of logs - system logs, financial transactions, call records, etc. For more, see https://guardtime.com

The KSI JavaScript SDK is a software development kit for developers who want to integrate KSI with their JavaScript based applications and systems. It provides an API for all KSI functionality, including the core functions - signing of data, extending and verifying the signatures.

## Installation

### In the Browser

To use the SDK in the browser, add the following `<script>` tag to your HTML pages:

```html
<script src="dist/main.js"></script>
```

### In Node.js

To install the SDK for Node.js, use [npm](http://npmjs.org) package manager:
```shell
npm install "@guardtime/ksi-js-api"
```

## Usage

In Node.js:

```js
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
```

## Development

Install system dependencies:

* [Node/npm](https://nodejs.org/en/download/current/) for development and package management.

Setup project:
```shell
git clone git@github.com:guardtime/ksi-js-api.git
cd ksi-js-api
npm install
```

Add KSI gateway configuration:
```shell
cat << EOF > config/ksi-config.js
const CONFIG = {
    AGGREGATION_URL: 'http://tryout.guardtime.net:8080/gt-signingservice',
    EXTENDER_URL: 'http://tryout-extender.guardtime.net:8081/gt-extendingservice',
    LOGIN_ID: 'CHANGE_ME_KSI_GATEWAY_USERNAME',
    LOGIN_KEY: new Uint8Array([0, 0, 0, 0, 0]),
    PUBLICATIONS_FILE_URL: 'https://verify.guardtime.com/ksi-publications.bin'
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CONFIG;
}
EOF
```

Building project:
```shell
npm run build
```

Running tests in node:
```
npm run test
```

Running integration tests in node:
```
npm run integration-test
```

## Documentation

KSI JS SDK documentation is located in `/docs` folder.

## Dependencies

See [package.json](package.json) file.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

See [LICENSE](LICENSE) file.
