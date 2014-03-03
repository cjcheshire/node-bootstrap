# node-bootstrap


## Getting started

First install [brew](http://brew.sh/)

```
brew install node
git clone git@github.com:cjcheshire/node-bootstrap.git
cd node-bootstrap
npm install
gem install compass
```

## Running the prototype

###Simply type
```
grunt server
```

## Deploy to heroku (using the fancy package method)

This method is cool as you can push the current state of the project without having to commit it.  Useful for when testing a new config.

### Download the heroku toolbelt
```
https://toolbelt.heroku.com/
```

### Run this: ([repo](https://github.com/ddollar/heroku-push)):
```
heroku plugins:install https://github.com/ddollar/heroku-push
```
### Then deploy with:

```
grunt deploy
```

## TODO: Fix
```
npm install -g grunt-cli
```