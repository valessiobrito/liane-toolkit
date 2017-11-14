import { Promise } from "meteor/promise";
import { Facebook, FacebookApiException } from "fb";
import { Likes } from "/imports/api/facebook/likes/likes.js";
import { HTTP } from "meteor/http";

const options = {
  client_id: Meteor.settings.facebook.clientId,
  client_secret: Meteor.settings.facebook.clientSecret
};
_fb = new Facebook(options);

_fetchFacebookPageData = ({ url }) => {
  check(url, String);

  response = HTTP.get(url);
  return response;
};

const LikesHelpers = {
  getEntryLikes({ facebookAccountId, entryId, accessToken }) {
    check(facebookAccountId, String);
    check(entryId, String);
    check(accessToken, String);

    logger.debug("LikesHelpers.getEntryLikes called", {
      entryId
    });

    _fb.setAccessToken(accessToken);
    const response = Promise.await(
      _fb.api(`${entryId}/likes`, {
        limit: 2000
      })
    );

    logger.debug("LikesHelpers.getEntryLikes response", { response });

    const _insertBulk = ({ data }) => {
      const bulk = Likes.rawCollection().initializeUnorderedBulkOp();

      for (const like of data) {
        like.facebookAccountId = facebookAccountId;
        like.personId = like.id;
        like.entryId = entryId;
        delete like.id;
        bulk.insert(like);
      }

      bulk.execute(function(e, result) {
        // do something with result
        console.info("result", result.nInserted);
      });
    };

    if (response.data.length) {
      _insertBulk({ data: response.data });
      let next = response.paging.next;
      while (next !== undefined) {
        let nextPage = _fetchFacebookPageData({ url: next });
        next = nextPage.data.paging ? nextPage.data.paging.next : undefined;
        if (nextPage.statusCode == 200 && nextPage.data.data.length) {
          _insertBulk({ data: nextPage.data.data });
        }
      }
    }

    return;
  }
};

exports.LikesHelpers = LikesHelpers;
