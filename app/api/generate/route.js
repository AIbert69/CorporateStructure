export async function POST(req) {
  const { system, prompt } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    if (data.error) {
      return Response.json({ error: data.error.message }, { status: 400 });
    }

    const text = data.content
      ?.map((b) => (b.type === "text" ? b.text : ""))
      .join("\n") || "";

    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
