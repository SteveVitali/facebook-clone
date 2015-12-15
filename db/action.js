var _ = require('lodash');

module.exports = function(vogels, Joi, CRUD) {
  // This is a generic bucket for all of a user's
  // status updates, new friendships, profile updates, etc.
  // I'm thinking that maybe we'll have to have a MapReduce job that
  // crunches this data into a NewsFeed. Otherwise we'll have to query
  // on it for all friends of a user every time we load news feed.
  var Action = vogels.define('Action', {
    hashKey: '_id',
    rangeKey: 'datetime',
    schema: {
      _id: vogels.types.uuid(),
      actorId: Joi.string(), // Id of user who created the action
      recipientId: Joi.string(), // Id of the 'recipient' of the action
      datetime: Joi.date(),
      actionType: Joi.string(), // e.g. 'Status' or 'Friendship'
      actionId: Joi.string() // e.g. a Status._id if actionType is 'Status'
    },
    indexes: [
      { hashKey: 'actorId',
        rangeKey: 'datetime',
        name: 'ActorIdIndex',
        type: 'global'
      },
      { hashKey: 'recipientId',
        rangeKey: 'datetime',
        name: 'RecipientIdIndex',
        type: 'global'
      }
    ]
  });

  Action.config({ tableName: 'actions' });

  CRUD = CRUD(Action);

  return {
    model: Action,
    tableName: 'actions',

    create: function(friendship, params, callback) {
      CRUD.create(friendship, params, callback);
    },

    // Additional Action functions here
    getUserNewsFeed: function(userId, callback) {
      Action
      .query(userId)
      .usingIndex('RecipientIdIndex')
      .exec(function(err, result) {
        if (err) return callback(err);
        callback(err, _.pluck(result.Items, 'attrs'));
      });
    }
  };
};
