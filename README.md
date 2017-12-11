# Liane

## An Electoral Toolkit for Activist Campaigns

Liane uses Meteor framework, Reactjs library and Facebook API to provide different tools to candidates.

> This project is under development.

---

**Table of Contents**

* [Getting Started](#getting-started)
  * [Dependencies](#dependencies)
* [Routes Definition](#routes-definition)
* [Application Structure](#application-structure)
* [On startup](#on-startup)
* [Cron Jobs](#cron-jobs)
* [Internationalization](#internationalization)
* [Tests](#tests)

## Getting Started

### Dependencies

 - [Meteor](https://guide.meteor.com)
 - [Redis](https://redis.io/)

Install **Meteor** full-stack framework.
~~~shell
curl https://install.meteor.com/ | sh
~~~

Clone this repository.
~~~shell
git clone https://github.com/lianetoolkit/liane-toolkit
~~~

Create a file at `.deploy/local/` and name it `settings.json`. You can find an example at `.deploy/settings.example.json`

Add your Facebook API and change any other necessary settings.

Make sure your **Redis** server is running.

Then you can run your project.

~~~js
npm start
~~~

## Routes Definition

This project uses **[FlowRouter](https://github.com/kadirahq/flow-router)** for routes definition. You can find and modify routes at `/imports/startup/client/routes.js`

## Application Structure

This projects follows Meteor guide recommendations for application struture.

~~~
imports/
  startup/
    client/
      index.js                 # import client startup through a single index entry point
      routes.js                # set up all routes in the app
    server/
      fixtures.js              # fill the DB with example data on startup
      index.js                 # import server startup through a single index entry point
  api/
    campaigns/                     # a unit of domain logic
      server/
        campaignsHelpers.js
        campaignsPublications.js        # all campaigns-related publications
        campaignsMethods.js  # tests for the list publications
      campaigns.js                 # definition of the Lists collection
  ui/
    components/                # all reusable components in the application
    containers/                 # can be split by domain if there are many
    layouts/                   # wrapper components for behaviour and visuals
    pages/                     # entry points for rendering used by the router
client/
  main.js                      # client entry point, imports all client code
server/
  main.js
~~~

## On startup

At `/imports/startup/server/fixtures.js` by default on start up the system adds some examples of Contexts, Geolocations and Categories. You can also customize as you like.

## Cron jobs

This project uses **[Job Collection](https://github.com/vsivsi/meteor-job-collection/)** as job manager. It allows to add schedule jobs for repeating tasks along the campaign.

## Internationalization

This project uses **[universe:i18n](https://github.com/vazco/meteor-universe-i18n)** for internationalization. You can find and edit translations at `/i18n/en.i18n.json`

## Tests

This projects uses **[Mocha](https://github.com/mochajs/mocha)** framework, **Faker** and **Meteor [Factory](https://github.com/versolearning/meteor-factory/)**.

You can find tests inside server folders `../server/campaigns.tests.js` and fake models `../server/campaigns.fake.js`.
To run tests you use:

~~~shell
npm run test
~~~

It will run at http://localhost:3100
