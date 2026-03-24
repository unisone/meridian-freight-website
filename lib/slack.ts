/**
 * Send a message to Slack via Bot API. Best-effort — fails silently.
 */
export async function notifySlack(text: string): Promise<{ ok: boolean }> {
  const token = process.env.SLACK_BOT_TOKEN?.trim();
  const channel = (process.env.SLACK_FORM_INTAKE_CHANNEL_ID ?? process.env.SLACK_CHANNEL_ID)?.trim();
  if (!token || !channel) return { ok: false };

  try {
    const resp = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel, text }),
    });

    const data = await resp.json();
    if (!resp.ok || !data.ok) {
      console.error("Slack notify failed:", data.error || resp.status);
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("Slack notify exception:", e);
    return { ok: false };
  }
}
