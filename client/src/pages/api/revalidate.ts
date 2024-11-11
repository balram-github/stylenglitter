import type { NextApiRequest, NextApiResponse } from 'next'

type RevalidateResponse = {
  revalidated: boolean
  message?: string
  error?: string
}

type ValidPathType = 'categories' | 'product-themes' | 'home-page'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      revalidated: false,
      error: 'Method not allowed. Please use POST'
    })
  }

  const secret = process.env.REVALIDATE_SECRET_TOKEN

  // Validate the secret token
  if (req.headers['x-revalidate-token'] !== secret) {
    return res.status(401).json({
      revalidated: false,
      error: 'Invalid token'
    })
  }

  try {
    // Get the type and slug from the request body
    const { type, slug } = req.body

    // Validate the type
    if (!type || !isValidPathType(type)) {
      return res.status(400).json({
        revalidated: false,
        error: 'Invalid type. Must be one of: categories, product-themes, home-page'
      })
    }

    // Special handling for home page
    if (type === 'home-page') {
      await res.revalidate('/')
      return res.json({
        revalidated: true,
        message: 'Home page revalidated successfully'
      })
    }

    // For other pages, validate the slug
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        revalidated: false,
        error: 'Invalid or missing slug'
      })
    }

    // Construct the path to revalidate
    const path = `/${type}/${slug}`

    // Revalidate the path
    await res.revalidate(path)

    return res.json({
      revalidated: true,
      message: `Path ${path} revalidated successfully`
    })
  } catch (err) {
    // If there was an error, return it
    return res.status(500).json({
      revalidated: false,
      error: 'Error revalidating page: ' + (err instanceof Error ? err.message : 'Unknown error')
    })
  }
}

function isValidPathType(type: string): type is ValidPathType {
  return ['categories', 'product-themes', 'home-page'].includes(type)
} 