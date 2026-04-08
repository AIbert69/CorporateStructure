export async function POST(req) {
    const { system, prompt } = await req.json();

  if (!process.env.AI_GATEWAY_API_KEY) {
        return Response.json(
          { error: "AI_GATEWAY_API_KEY not configured" },
          { status: 500 }
              );
  }

  try {
        const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
                method: "POST",
                headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
                },
                body: JSON.stringify({
                          model: "anthropic/claude-sonnet-4-5",
                          max_tokens: 4000,
                          messages: [
                            { role: "system", content: system },
                            { role: "user", content: prompt }
                                    ],
                }),
        });

      const data = await res.json();

      if (data.error) {
              return Response.json({ error: data.error.message }, { status: 400 });
      }

      const text = data.choices?.[0]?.message?.content || "";

      return Response.json({ text });
  } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
  }
}
