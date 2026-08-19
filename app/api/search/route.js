export async function POST(req) {
  try {
    const { query } = await req.json();

    const systemPrompt = `Given a search query, return exactly 5 relevant search suggestions as a comma-separated list. Return only the suggestions, no other text.`;
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: query,
            },
          ],

          temperature: 0,
        }),
      },
    );

    const data = await openRouterResponse.json();

    if (!openRouterResponse.ok) {
      console.error("OpenRouter API error:", data);

      return Response.json(
        {
          error: data?.error?.message || "OpenRouter request failed",
        },
        {
          status: openRouterResponse.status,
        },
      );
    }

    const reply = (data.choices?.[0]?.message?.content)
      .split(",")
      .map((s) => s.trim());

    if (!reply || reply.length === 0) {
      console.error("Unexpected OpenRouter response:", data);

      return Response.json(
        {
          error: "No response was returned by the model",
        },
        {
          status: 500,
        },
      );
    }
    return Response.json({ suggestions: reply });
  } catch (error) {
    console.error("API route error:", error);

    return Response.json(
      {
        error: error.message || "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
