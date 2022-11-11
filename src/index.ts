import dotenv from "dotenv";
import { login, Status } from "masto";
import strinptags from "striptags";
import { put } from "./db";
dotenv.config();

const main = async () => {
    const masto = await login({
        url: process.env.HOST + "",
        accessToken: process.env.TOKEN,
    });

    const myAccount = await masto.accounts.verifyCredentials();
    console.log(`I'am @${myAccount.acct}`);
    console.log(`${myAccount.url}`);

    console.log("Monitoring stream...");
    const stream = await masto.stream.streamUser();

    stream.on("update", async (status) => {
        console.log(`Received status: ${status.account.acct}`);
        if (!statusByAki(status)) {
            return;
        }

        const stripedContent: string = strinptags(status.content);
        await put({
            ...status,
            stripedContent,
        });
        return;
    });
};
main();

function statusByAki(status: Status): boolean {
    return status.account.acct === process.env.VICTIM_ACCT;
}
