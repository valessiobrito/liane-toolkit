import SimpleSchema from "simpl-schema";
import { Promise } from "meteor/promise";
import { Geolocations } from "/imports/api/geolocations/geolocations.js";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { GeolocationsHelpers } from "./geolocationsHelpers.js";

const schemaConfig = {
  name: {
    type: String
  },
  facebook: {
    type: Object,
    blackbox: true
  },
  osm: {
    type: Object,
    blackbox: true,
    optional: true
  }
};

const validateCreate = new SimpleSchema(schemaConfig).validator();
const validateUpdate = new SimpleSchema(
  Object.assign({ _id: { type: String } }, schemaConfig)
).validator();

export const createGeolocation = new ValidatedMethod({
  name: "geolocations.create",
  validate: validateCreate,
  run({ name, facebook, osm }) {
    logger.debug("geolocations.create called", { name });

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error(401, "You need to login");
    }

    if (!Roles.userIsInRole(userId, ["admin"])) {
      throw new Meteor.Error(403, "Access denied");
    }

    if (osm && osm.osm_id) {
      osm = GeolocationsHelpers.getOSM(osm);
    } else {
      osm = undefined;
    }

    const insertDoc = GeolocationsHelpers.parse({
      _id,
      name,
      facebook,
      osm
    });

    return Geolocations.insert(insertDoc);
  }
});

export const removeGeolocation = new ValidatedMethod({
  name: "geolocations.remove",
  validate: new SimpleSchema({
    geolocationId: {
      type: String
    }
  }).validator(),
  run({ geolocationId }) {
    logger.debug("geolocations.remove called", { geolocationId });

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error(401, "You need to login");
    }

    if (!Roles.userIsInRole(userId, ["admin"])) {
      throw new Meteor.Error(403, "Access denied");
    }

    return Geolocations.remove(geolocationId);
  }
});

export const updateGeolocation = new ValidatedMethod({
  name: "geolocations.update",
  validate: validateUpdate,
  run({ _id, name, facebook, osm }) {
    logger.debug("geolocations.update called", { name });

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error(401, "You need to login");
    }

    if (!Roles.userIsInRole(userId, ["admin"])) {
      throw new Meteor.Error(403, "Access denied");
    }

    if (osm && osm.osm_id) {
      osm = GeolocationsHelpers.getOSM(osm);
    } else {
      osm = undefined;
    }

    const insertDoc = GeolocationsHelpers.parse({
      _id,
      name,
      facebook,
      osm
    });

    Geolocations.upsert({ _id }, { $set: insertDoc });
    return;
  }
});

export const searchAdGeolocations = new ValidatedMethod({
  name: "geolocations.searchAdGeolocations",
  validate: new SimpleSchema({
    q: {
      type: String
    }
  }).validator(),
  run({ q }) {
    logger.debug("geolocations.searchAdGeolocations called", { q });

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error(401, "You need to login");
    }

    if (!Roles.userIsInRole(userId, ["admin"])) {
      throw new Meteor.Error(403, "Access denied");
    }

    const user = Meteor.users.findOne(userId);

    return GeolocationsHelpers.facebookSearch({
      type: "adgeolocation",
      accessToken: user.services.facebook.accessToken,
      q
    });
  }
});

export const searchNominatim = new ValidatedMethod({
  name: "geolocations.searchNominatim",
  validate: new SimpleSchema({
    q: {
      type: String
    }
  }).validator(),
  run({ q }) {
    logger.debug("geolocations.searchNominatim called", { q });

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error(401, "You need to login");
    }

    if (!Roles.userIsInRole(userId, ["admin"])) {
      throw new Meteor.Error(403, "Access denied");
    }

    return GeolocationsHelpers.nominatimSearch({ q });
  }
});
