export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-bg min-h-screen flex flex-col items-center justify-start pt-16 px-4 pb-10">
      {/* LinkedIn logo SVG */}
      <div className="mb-4">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="52" rx="6" fill="white"/>
          <path d="M14 21H19V38H14V21Z" fill="#0077B5"/>
          <circle cx="16.5" cy="16.5" r="3" fill="#0077B5"/>
          <path d="M23 21H27.8V23.2C28.8 21.6 30.8 20.5 33.2 20.5C38.2 20.5 39.5 23.8 39.5 28.2V38H34.5V29.2C34.5 27.2 34.5 24.7 31.7 24.7C28.9 24.7 28.5 26.9 28.5 29.1V38H23V21Z" fill="#0077B5"/>
        </svg>
      </div>

      {children}
    </div>
  )
}
