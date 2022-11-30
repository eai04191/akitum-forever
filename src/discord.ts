import { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v10";
import { Status } from "masto";
import { config } from "./config.js";
import { toMarkdown } from "./util.js";

export function sendWebhook(status: Status | string) {
    if (typeof status === "string") {
        return post({
            content: status,
        });
    }

    const original = status;
    if (status.reblog) {
        status = status.reblog;
    }

    const body: RESTPostAPIWebhookWithTokenJSONBody = {
        embeds: [
            {
                url: status.uri,
                description: toMarkdown(status.content),
                timestamp: status.createdAt,
                footer: {
                    text: status.account.acct,
                    icon_url: status.account.avatar,
                },
            },
        ],
    };

    if (original.reblog) {
        const e = body.embeds![0];
        e.author = {
            name: `🔄 ${original.account.acct}`,
            icon_url: original.account.avatar,
        };
    }

    status.mediaAttachments.forEach((media) => {
        if (!media.url) return;

        body.embeds?.push({
            url: (status as Status).uri,
            image: {
                url: media.url,
            },
        });
    });

    post(body);
}

async function post(body: RESTPostAPIWebhookWithTokenJSONBody) {
    const url = config.discord.webhookUrl;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return response.ok;
}
