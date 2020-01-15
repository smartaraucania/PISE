/**
 * Emergency Type REST Controller
 */

var mongoose = require("mongoose"),
  EmergencyType = mongoose.model("EmergencyType"),
  EventType = mongoose.model("EventType"),
  Emergency = mongoose.model("Emergency"),
  EmergencyEvent = mongoose.model("EmergencyEvent"),
  validations = require("../../util/validations"),
  AppUser = mongoose.model("AppUser"),
  errors = require("../../util/errors");

/**
 * Get emergencies created by same current logged user actor type.
 * If isGoverment get all emergencies
 */
exports.getAllEmergenciesByUserLogged = function(req, res) {
  if (req.user.isGovernment) {
    Emergency.paginate(
      {
        $or: [
          {
            finalized: false
          },
          {
            finalized: req.query.finalized == 1 ? true : false
          }
        ]
      },
      {
        sort: {
          date: -1
        },
        populate: [
          {
            path:
              "events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id",
            populate: {
              path: "eventType_id by_actorType_id to_actorType_id",
              populate: "events"
            },
            populate: {
              path: "eventType_id by_actorType_id to_actorType_id",
              populate: "lastEvent"
            }
          }
        ],
        page: req.query.nPage != "" ? req.query.nPage : "1",
        limit: 10
      },
      function(err, emergencies) {
        if (err) return errors.bdError(res, err);
        if (emergencies.lenght == 0)
          return errors.arrayNotFoundError(res, "Emergencias");
        return res.status(200).send({
          response: emergencies.docs,
          total: emergencies.totalDocs,
          page: emergencies.page,
          limit: emergencies.limit,
          pages: emergencies.totalPages,
          hasPrevPage: emergencies.hasPrevPage,
          hasNextPage: emergencies.hasNextPage
        });
      }
    );
  } else {
    var finalized = req.query.finalized != "null" ? req.query.finalized : null;
    if (finalized) {
      finalized = req.query.finalized == 1 ? true : false;
      Emergency.paginate(
        {
          $and: [
            {
              $or: [
                {
                  actorType_id: req.user.actorType_id
                },
                {
                  othersActorsTypesRequest_id: req.user.actorType_id
                }
              ]
            },
            {
              finalized: finalized
            }
          ]
        },
        {
          sort: {
            date: -1
          },
          populate: [
            {
              path:
                "events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id",
              populate: {
                path: "eventType_id by_actorType_id to_actorType_id",
                populate: "events"
              },
              populate: {
                path: "eventType_id by_actorType_id to_actorType_id",
                populate: "lastEvent"
              }
            }
          ],
          page: req.query.nPage != "" ? req.query.nPage : "1",
          limit: 10
        },
        function(err, emergencies) {
          if (err) return errors.bdError(res, err);
          if (emergencies.lenght == 0)
            return errors.arrayNotFoundError(res, "Emergencias");
          return res.status(200).send({
            response: emergencies.docs,
            total: emergencies.totalDocs,
            page: emergencies.page,
            limit: emergencies.limit,
            pages: emergencies.totalPages,
            hasPrevPage: emergencies.hasPrevPage,
            hasNextPage: emergencies.hasNextPage
          });
        }
      );
    } else {
      Emergency.paginate(
        {
          $or: [
            {
              actorType_id: req.user.actorType_id
            },
            {
              othersActorsTypesRequest_id: req.user.actorType_id
            }
          ]
        },
        {
          sort: {
            date: -1
          },
          populate: [
            {
              path:
                "events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id",
              populate: {
                path: "eventType_id by_actorType_id to_actorType_id",
                populate: "events"
              },
              populate: {
                path: "eventType_id by_actorType_id to_actorType_id",
                populate: "lastEvent"
              }
            }
          ],
          page: req.query.nPage != "" ? req.query.nPage : "1",
          limit: 10
        },
        function(err, emergencies) {
          if (err) return errors.bdError(res, err);
          if (emergencies.lenght == 0)
            return errors.arrayNotFoundError(res, "Emergencias");
          return res.status(200).send({
            response: emergencies.docs,
            total: emergencies.totalDocs,
            page: emergencies.page,
            limit: emergencies.limit,
            pages: emergencies.totalPages,
            hasPrevPage: emergencies.hasPrevPage,
            hasNextPage: emergencies.hasNextPage
          });
        }
      );
    }
  }
};

/**
 * Get emergencies by Actor Type (ONLY Government)
 */
exports.getAllEmergenciesByActorType = function(req, res) {
  Emergency.paginate(
    {
      $and: [
        {
          actorType_id: req.query.actortype
        },
        {
          $and: [
            {
              finalized: false
            },
            {
              finalized: req.query.finalized == 1 ? true : false
            }
          ]
        }
      ]
    },
    {
      sort: {
        date: -1
      },
      populate: [
        {
          path:
            "events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id",
          populate: {
            path: "eventType_id by_actorType_id to_actorType_id",
            populate: "events"
          },
          populate: {
            path: "eventType_id by_actorType_id to_actorType_id",
            populate: "lastEvent"
          }
        }
      ],
      page: req.query.nPage != "" ? req.query.nPage : "1",
      limit: 10
    },
    function(err, emergencies) {
      if (err) return errors.bdError(res, err);
      if (emergencies.lenght == 0)
        return errors.arrayNotFoundError(res, "Emergencias");
      return res.status(200).send({
        response: emergencies.docs,
        total: emergencies.totalDocs,
        page: emergencies.page,
        limit: emergencies.limit,
        pages: emergencies.totalPages,
        hasPrevPage: emergencies.hasPrevPage,
        hasNextPage: emergencies.hasNextPage
      });
    }
  );
};

/**
 * Obtener emergencia por id
 */
exports.getEmergency = function(req, res) {
  Emergency.findById(req.params.emergencyId)
    .lean()
    .populate({
      path:
        "requestAppUsers_id confirmAppUsers_id events lastEvent actorType_id emergencyType_id initialReport.lastAppUser_id initialReport.lastWebUser_id",
      populate: {
        path: "eventType_id by_actorType_id to_actorType_id",
        populate: "events"
      },
      populate: {
        path: "eventType_id by_actorType_id to_actorType_id",
        populate: "lastEvent"
      }
    })
    .exec(function(err, emergency) {
      if (err) return errors.bdError(res, err);
      if (!emergency) return errors.objectNotFoundError(res, "Emergencia");
      EmergencyEvent.paginate(
        {
          _id: emergency.events
        },
        {
          sort: {
            date: -1
          },
          populate: {
            path: "eventType_id by_actorType_id to_actorType_id",
            populate: "events"
          },
          page: req.query.eventspage != "" ? req.query.eventspage : "1",
          limit: 6
        },
        function(err, events) {
          emergency.events = events.docs;
          emergency.eventsTotal = events.totalDocs;
          emergency.eventsPage = events.page;
          emergency.eventsLimit = events.limit;
          emergency.eventsPages = events.totalPages;
          emergency.eventsHasPrevPage = events.hasPrevPage;
          emergency.eventsHasNextPage = events.hasNextPage;

          return res.status(200).send({
            response: emergency
          });
        }
      );
    });
};

exports.getCantActiveEmergencies = function(req, res) {
  if (req.user.isGovernment) {
    Emergency.find({
      finalized: false
    }).exec(function(err, emergencies) {
      if (err) return errors.bdError(res, err);
      if (emergencies.lenght == 0)
        return errors.arrayNotFoundError(res, "Emergencias");

      return res.status(201).send({
        activeEmergencies: emergencies.length
      });
    });
  } else {
    Emergency.find({
      $and: [
        {
          $or: [
            {
              actorType_id: req.user.actorType_id
            },
            {
              othersActorsTypesRequest_id: req.user.actorType_id
            }
          ]
        },
        {
          finalized: false
        }
      ]
    }).exec(function(err, emergencies) {
      if (err) return errors.bdError(res, err);
      if (emergencies.lenght == 0)
        return errors.arrayNotFoundError(res, "Emergencias");

      return res.status(201).send({
        activeEmergencies: emergencies.length
      });
    });
  }
};

exports.getCantEmergenciesInCurrentMonth = function(req, res) {
  var currentDate = new Date();
  var currentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
    23,
    59,
    59,
    0
  );
  if (req.user.isGovernment) {
    Emergency.find({
      date: {
        $gt: currentMonth
      }
    }).exec(function(err, emergencies) {
      if (err) return errors.bdError(res, err);
      if (emergencies.lenght == 0)
        return errors.arrayNotFoundError(res, "Emergencias");

      return res.status(201).send({
        totalMonthEmergencies: emergencies.length
      });
    });
  } else {
    Emergency.find({
      $and: [
        {
          $or: [
            {
              actorType_id: req.user.actorType_id
            },
            {
              othersActorsTypesRequest_id: req.user.actorType_id
            }
          ]
        },
        {
          date: {
            $gt: currentMonth
          }
        }
      ]
    }).exec(function(err, emergencies) {
      if (err) return errors.bdError(res, err);
      if (emergencies.lenght == 0)
        return errors.arrayNotFoundError(res, "Emergencias");

      return res.status(201).send({
        totalMonthEmergencies: emergencies.length
      });
    });
  }
};

exports.addEmergency = function(req, res) {
  //Check Body
  let bodyErrors = validations.checkBodyAddEmergency(req);
  if (bodyErrors.length > 0)
    return res.status(400).send({
      errors: bodyErrors
    });

  EmergencyType.findById(req.body.emergencyType_id).exec(function(
    err,
    emergencyType
  ) {
    if (err) return errors.bdError(res, err);
    if (!emergencyType)
      return errors.objectNotFoundError(res, "Tipo de Emergencia");

    var emergency = new Emergency({
      emergencyType_id: emergencyType._id,
      actorType_id: req.user.actorType_id,
      details: req.body.details,
      address: req.body.address,
      location: req.body.location,
      date: req.body.date
    });

    emergency.save(function(err, savedEmergency) {
      if (err) {
        return errors.bdSave(res, err);
      }

      global.io.emit("newEmergency", savedEmergency);
      return res.status(201).send(savedEmergency);
    });
  });
};

exports.editEmergency = function(req, res) {
  //Check Body
  let bodyErrors = validations.checkBodyAddEmergency(req);
  if (bodyErrors.length > 0)
    return res.status(400).send({
      errors: bodyErrors
    });

  Emergency.findById(req.params.emergencyId).exec(function(er, emergency) {
    if (err) return errors.bdError(res, err);
    if (!emergency) return errors.objectNotFoundError(res, "Emergencia");

    EventType.findOne({
      name: "Edición"
    }).exec(function(err, eventType) {
      if (err) return errors.bdError(res, err);

      emergency.details = req.body.details;
      emergency.address = req.body.address;
      emergency.location = req.body.location;
      emergency.date = req.body.date;
      emergency.initialReport = req.body.initialReport;

      emergency.save(function(err, savedEmergency) {
        if (err) {
          return errors.bdSave(res, err);
        }
        global.io.emit("replaceEmergency", emergency);
        return res.status(200).send(savedEmergency);
      });
    });
  });
};

exports.editInitialReport = function(req, res) {
  Emergency.findById(req.params.emergencyId).exec(function(er, emergency) {
    if (err) return errors.bdError(res, err);
    if (!emergency) return errors.objectNotFoundError(res, "Emergencia");

    EventType.findOne({
      name: "reporte inicial actualizado"
    }).exec(function(err, eventType) {
      if (err) return errors.bdError(res, err);
      if (req.file) {
        uploadFile
          .upload(req, res)
          .then(function(url) {
            var emergencyEvent = new EmergencyEvent({
              emergency_id: emergency._id,
              eventType_id: eventType._id,
              by_actorType_id: req.user.actorType_id,
              user: req.user.name + " " + req.user.lastName
            });

            emergencyEvent.save(function(err, savedEmergencyEvent) {
              if (err) {
                return errors.bdSave(res, err);
              }
              emergency.events.push(savedEmergencyEvent._id);
              emergency.initialReport.text = req.body.text;
              emergency.initialReport.photosURL.push(url);
              emergency.initialReport.lastAppUser_id = req.user._id;
              emergency.initialReport.date = new Date();
              emergency.lastEvent = savedEmergencyEvent._id;
              emergency.save(function(err, savedEmergencyEvent) {
                if (err) {
                  return errors.bdSave(res, err);
                }
                return res.status(200).send(savedEmergencyEvent);
              });
            });
          })
          .catch(function(err) {
            return res.status(500).send({
              errors: [
                {
                  error: "Error al subir la foto"
                }
              ]
            });
          });
      } else {
        var emergencyEvent = new EmergencyEvent({
          emergency_id: emergency._id,
          eventType_id: eventType._id,
          by_actorType_id: req.user.actorType_id,
          user: req.user.name + " " + req.user.lastName
        });

        emergencyEvent.save(function(err, savedEmergencyEvent) {
          if (err) {
            return errors.bdSave(res, err);
          }
          emergency.events.push(savedEmergencyEvent._id);
          emergency.initialReport.text = req.body.text;
          emergency.initialReport.photosURL = req.body.photo;
          emergency.initialReport.lastAppUser_id = req.user._id;
          emergency.initialReport.date = new Date();
          emergency.lastEvent = savedEmergencyEvent._id;
          emergency.save(function(err, savedEmergencyEvent) {
            if (err) {
              return errors.bdSave(res, err);
            }
            return res.status(200).send(savedEmergencyEvent);
          });
        });
      }
    });
  });
};
