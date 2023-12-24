#!/bin/sh

set -x
cd $(dirname $(readlink -e $0 || realpath $0))

tee ~/.npmrc <<EOF
registry=$NPM_REGISTRY_URL
_auth=$NPM_AUTH_KEY
email=$NPM_EMAIL
always-auth=true
EOF

npm i
