import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  console.log('Auth callback triggered');
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('Auth params:', { code: code?.slice(0, 5) + '...', next });

  // Get the protocol and host from the request
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const host = request.headers.get('host') || 'aiwebsitebuilder.tech'

  console.log('Environment:', { protocol, host });

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Construct the full URL for redirection
      const redirectUrl = `${protocol}://${host}${next}`
      console.log('Successful auth, redirecting to:', redirectUrl)
      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('Auth error:', error)
    }
  }

  console.log('Auth failed, redirecting to login')
  // Return the user to an error page with instructions
  return NextResponse.redirect(`${protocol}://${host}/login?message=Could not authenticate user`)
}