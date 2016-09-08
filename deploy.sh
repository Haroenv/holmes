#!/bin/bash

# only when not on a pull request we deploy
if [[ $TRAVIS_PULL_REQUEST == 'false' ]]; then
  npm run doc
  git config user.name "Haroen Viaene [bot]"
  git config user.email "hello@haroen.me"
  git commit -am "Built documentation [ci skip]"
  npm run test
  git commit -am "Build coverage [ci skip]"
  git push https://${GH_OAUTH_TOKEN}@github.com/Haroenv/holmes HEAD:gh-pages > /dev/null 2>&1
fi
