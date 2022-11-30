import dotenv from "dotenv";
import { login, Status } from "masto";
import { config } from "./config.js";
import { put } from "./db.js";
import { sendWebhook } from "./discord.js";
dotenv.config();

const main = async () => {
    const masto = await login({
        url: config.mastodon.host,
        accessToken: config.mastodon.token,
    });

    const myAccount = await masto.accounts.verifyCredentials();
    console.log(`I'am @${myAccount.acct}`);
    console.log(`${myAccount.url}`);
    if (config.discord.useDiscordNotification) {
        sendWebhook(`I'am @${myAccount.acct}, Monitoring is now active.`);
    }

    console.log("Monitoring stream...");
    const stream = await masto.stream.streamUser();

    stream.on("update", async (status) => {
        console.log(`Received status: ${status.account.acct}`);
        if (!statusByAki(status) && config.debug.estrus === false) {
            return;
        }

        await put(status);
        if (config.discord.useDiscordNotification) {
            sendWebhook(status);
        }
        return;
    });
};
main().catch((error) => {
    console.error(error);
    process.exit(1);
});

function statusByAki(status: Status): boolean {
    return status.account.acct === config.mastodon.victimAcct;
}
