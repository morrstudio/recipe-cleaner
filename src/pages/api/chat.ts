import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('API route hit', req.body)

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set')
    return res.status(500).json({ message: 'Server configuration error' })
  }

  try {
    const { message, recipeId } = req.body

    if (!message || !recipeId) {
      return res.status(400).json({ message: 'Missing message or recipeId' })
    }

    console.log('Sending request to OpenAI...')
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a helpful assistant discussing a recipe with ID: ${recipeId}.` },
        { role: "user", content: message }
      ],
      max_tokens: 150,
    })

    const aiResponse = completion.choices[0].message?.content?.trim() ?? ''
    console.log('Received response from OpenAI:', aiResponse)
    res.status(200).json({ message: aiResponse })
  } catch (error: unknown) {
    console.error('Detailed error:', error)
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error processing request', error: error.message })
    } else {
      res.status(500).json({ message: 'Error processing request', error: 'Unknown error' })
    }
  }
}