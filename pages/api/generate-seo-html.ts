import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Invalid prompt' });

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '너는 SEO 마케터이자 프론트 전문가야. 사용자 요청에 대해 HTML, CSS, BLOG 콘텐츠를 각각 생성하고 [HTML]...[/HTML] 형식으로 구분해서 출력해줘.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const output = chat.choices[0]?.message?.content || '';
    const html = output.match(/\[HTML\]([\s\S]*?)\[\/HTML\]/)?.[1]?.trim() || '';
    const css = output.match(/\[CSS\]([\s\S]*?)\[\/CSS\]/)?.[1]?.trim() || '';
    const blog = output.match(/\[BLOG\]([\s\S]*?)\[\/BLOG\]/)?.[1]?.trim() || '';

    res.status(200).json({ html, css, blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'API 호출 실패' });
  }
}