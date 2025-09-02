'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { LogoIcon } from '@/components/logo'
import { GoogleIcon } from '@/components/ui/google-icon'
import { useAuthStore } from '@/stores/auth'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const { signup, signInWithGoogle } = useAuthStore()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const values = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }

    const parse = schema.safeParse(values)
    if (!parse.success) {
      for (const issue of parse.error.issues) {
        toast.error(issue.message)
      }
      return
    }

    setLoading(true)
    try {
      await signup(values.email, values.password)
    } catch (err) {
      toast.error('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit} 
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md"
      >
        <div className="p-8 pb-6">
          <Link href="/" aria-label="go home">
            <LogoIcon />
          </Link>
          <h1 className="text-xl font-semibold mt-4 mb-1">Create an Account</h1>
          <p className="text-sm">Welcome! Sign up to get started.</p>

           {/* Social signups */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={signInWithGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              <span>{loading ? "Signing up..." : "Continue with Google"}</span>
            </Button>
          </div>

          <hr className="my-4 border-dashed" />

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input type="password" name="confirmPassword" required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Continue'}
            </Button>
          </div>
        </div>

        <div className="bg-muted border p-3 rounded">
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </section>
  )
}
