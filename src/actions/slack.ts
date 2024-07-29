export const sendSlackMessage = async (text: string) => {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    const response = await fetch(webhookUrl as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to send Slack registration message");
    }
}