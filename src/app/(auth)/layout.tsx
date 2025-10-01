export const metadata = {
  title: 'Mystery Messages - Authentication',
  description: 'Sign in or sign up to Mystery Messages',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}
