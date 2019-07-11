[![Build Status](https://travis-ci.org/BantuLab/SILCServer.svg?branch=master)](https://travis-ci.org/BantuLab/SILCServer)
<!-- 
[![Stories in Ready](https://github.com/BantuLab/SILCServer/projects/1/SILCServer.png?label=ready&title=Ready)](https://github.com/BantuLab/SILCServer/projects/1) -->

# SILC Server
SILCServer is backend service providing APIs and Endpoints for SILC Client Applications. SILC stands for Savings and Internal Lending Communities

# Table of content
* [Setup](#Setup)
* [Configure](#configure-the-application)
* Run
  * [Application](#running-the-application)
  * [Unit tests](#running-tests)
* [Troubleshooting](#troubleshooting)
* [Rest API](#rest-api)
* Versioning
  * We follow the [Semver or Semantic Versioning Specs](https://semver.org/) for API versioning.

# Setup
In order to setup this application,on your development machine, you need first to ensure that you have:
* ```NPM``` installed
* Node.JS version 10.2.1 or higher installed
* Git (a distributed version control system) installed
* MongoDB installed and replicaSet setup as described [here](https://docs.mongodb.com/manual/tutorial/deploy-replica-set-for-testing/)
* You can also use `run-rs` to quickly setup a mongodb replica set on your development machine as described [here](http://thecodebarbarian.com/introducing-run-rs-zero-config-mongodb-runner.html) and on its [npm page](https://www.npmjs.com/package/run-rs).

To get a copy of the application , run the following command:
```
git clone https://github.com/bantulogic/SILCServer.git
```

Inside the folder SILCServer, run the following command which will get all dependencies for the application to be installed:
```
npm install
```

At this point we have all the dependencies installed and we are ready to start

# Configure the application

Please create a .env file (if you don't have one already) and copy the contents from .env.sample. This is needed before running your application.

... We will need to fill this up with mongo db connection info

If you are unsure what this means just run the following command to make a copy of the .env: `cp .env.test .env`


# Running the application

After the configuration is completed, we can start the application using the following command:

```
npm start
```

# Running tests

To run all the Chai/Mocha tests(Unit Tests for TDD) run the following command:

```
npm test
```

To run all the Cucumber tests(Feature Tests for BDD) run the following command:

```
npm run cucumber
```


# Troubleshooting

## Mocha not installed error

If you get this error try cleaning the cache using the following command:

```
npm cache clean
```

## ES6 Support

If you are experiencing errors like:

```
Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
```

Make sure that the version of Node is >= 10.2.1
Run the command below to check the version of Node installed:
```
node -v
```

# Adding REST routes

Top-level routing is now handled in the `toDo` file. For domain-level sub-routes please use an appropriate routing file in the domain folder.

Please see `toDo` and `toDO` for examples of how it is done.

# Rest API

Please see [API Documentation](./api.md) for details

