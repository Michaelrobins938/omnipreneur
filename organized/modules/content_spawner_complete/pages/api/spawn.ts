
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { description, goal, platform } = req.body;

  const prompt = `You are a viral content strategist. Based on the product/niche description, content goal, and platform, generate 100 content ideas in a structured matrix with:
- Headline
- Hook
- CTA
- Best Platform

Product/Niche: ${description}
Content Goal: ${goal}
Platform: ${platform}

Return as clean plain text using this format:

1. Headline: ...
   Hook: ...
   CTA: ...
   Platform: ...

Repeat for 100 entries.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const result = await response.json();
    const content = result.choices[0].message.content;

    const matrix = content.split(/\n\d+\./).slice(1).map(entry => {
      const headline = entry.match(/Headline:\s*(.*)/)?.[1] || '';
      const hook = entry.match(/Hook:\s*(.*)/)?.[1] || '';
      const cta = entry.match(/CTA:\s*(.*)/)?.[1] || '';
      const platform = entry.match(/Platform:\s*(.*)/)?.[1] || '';
      return { headline, hook, cta, platform };
    });

    return res.status(200).json({ posts: matrix });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch from Claude' });
  }
}
