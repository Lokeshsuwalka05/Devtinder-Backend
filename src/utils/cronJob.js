const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { ConnectionRequest } = require("../models/connectionRequest");
const { run } = require("./sendEmail");
// i want to send the email to those people who got requests on last day.
cron.schedule("0 23 * * *", async () => {
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);
  const pendingRequests = await ConnectionRequest.find({
    status: "interested",
    createdAt: {
      $gte: yesterdayStart,
      $lt: yesterdayEnd,
    },
  }).populate("fromUserId toUserId");
  const listOfEmails = [
    ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
  ];
  for (let email of listOfEmails) {
    try {
      await run(
        `New connection requests is pending for ${email}`,
        "Accept or Reject it"
      );
    } catch (err) {
      console.log(err);
    }
  }
});
