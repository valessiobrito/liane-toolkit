import SimpleSchema from "simpl-schema";
import MarkdownIt from "markdown-it";
import { Promise } from "meteor/promise";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { Messages } from "/imports/api/messages/messages.js";
import { MessagesHelpers } from "/imports/api/messages/server/messagesHelpers.js";
import { sendMail } from "/imports/emails/server/mailer";
import { NotificationsHelpers } from "/imports/api/notifications/server/notificationsHelpers";

const markdown = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export const createMessage = new ValidatedMethod({
  name: "messages.new",
  validate: new SimpleSchema({
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    filters: {
      type: MessagesHelpers.filtersSchema,
    },
  }).validator(),
  run({ title, content, filters }) {
    logger.debug("messages.new called", { title });
    const cursor = MessagesHelpers.getFilterQueryCursor({ filters });
    if (!cursor)
      throw new Meteor.Error(400, "No users match the selected filters");
    if (!content) throw new Meteor.Error(400, "Content is required");
    content = markdown.render(content);
    let insertDoc = {
      title,
      content,
      type: filters.target,
      recipientCount: cursor.count(),
      recipientQuery: filters,
    };
    const messageId = Messages.insert(insertDoc);
    const emails = MessagesHelpers.createEmail({
      messageId,
      title,
      content,
      filters,
    });

    console.log(emails);

    cursor.forEach((user) => {
      const email = emails[user.userLanguage || "en"];
      email.body = email.body.replace("%NAME%", user.name);
      NotificationsHelpers.add({
        userId: user._id,
        text: title,
        dataRef: messageId,
        path: `/messages/${messageId}`,
        skipEmailNotify: true,
      });
      sendMail({
        subject: email.subject,
        body: email.body,
        data: { user },
      });
    });

    return messageId;
  },
});

export const countAudience = new ValidatedMethod({
  name: "messages.countAudience",
  validate: MessagesHelpers.filtersSchema.validator(),
  run(data) {
    const cursor = MessagesHelpers.getFilterQueryCursor({ filters: data });
    if (!cursor) return 0;
    return cursor.count();
  },
});