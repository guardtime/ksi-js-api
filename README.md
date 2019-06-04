# KSI JavaScript SDK

## Installation
```html
<script src="dist/main.js"></script>
```
Using npm:
```shell
npm install "git+ssh://git@github.com:guardtime/ksi-js-api.git"
```

## Development
Install system dependencies:

1. [Node](https://nodejs.org/en/download/current/) for development.
2. [Yarn](https://yarnpkg.com/en/docs/install) for package management.

Setup project:
```shell
git clone git@github.com:guardtime/ksi-js-api.git
cd ksi-js-api
yarn install
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
yarn build
```

Open development server:
```shell
yarn browser:dev
```

Running tests in node:
```
yarn test
```

Running integration tests in node:
```
yarn integration-test
```

## Example usage
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
