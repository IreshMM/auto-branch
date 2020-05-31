import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { processRepo } from "./process";

export async function onPush(context: Context<Webhooks.WebhookPayloadPush>) {
  console.log("onPushExecution");
  if (context.payload.ref === "refs/heads/master") {
    processRepo(context.github, {
      name: context.payload.repository.name,
      owner: context.payload.repository.owner.login,
    }).then((success) => {
      if (success) {
        console.log('Successfully created branches and protections');
      }
    });
  }
}
