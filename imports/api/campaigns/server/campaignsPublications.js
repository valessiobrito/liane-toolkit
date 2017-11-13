import { Campaigns } from "/imports/api/campaigns/campaigns.js";
import { FacebookAccounts } from "/imports/api/facebook/accounts/accounts.js";
import _ from "underscore";

Meteor.publish("campaigns.byUser", function() {
  const currentUser = this.userId;
  if (currentUser) {
    return Campaigns.find({
      users: { $elemMatch: { userId: currentUser } }
    });
  } else {
    return this.ready();
  }
});

Meteor.publishComposite("campaigns.detail", function({ campaignId }) {
  const currentUser = this.userId;
  logger.debug("campaigns.detail pub", { campaignId });
  if (currentUser) {
    return {
      find: function() {
        return Campaigns.find(
          {
            _id: campaignId,
            users: { $elemMatch: { userId: currentUser } }
          },
          {
            fields: {
              users: 1,
              accounts: 1,
              name: 1,
              description: 1,
              contextId: 1
            }
          }
        );
      },
      children: [
        {
          find: function(campaign) {
            return FacebookAccounts.find({
              facebookId: { $in: _.pluck(campaign.accounts, "facebookId") }
            });
          }
        }
      ]
    };
  } else {
    return this.ready();
  }
});
