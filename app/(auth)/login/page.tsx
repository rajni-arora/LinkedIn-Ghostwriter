import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-white text-base font-normal opacity-90">Make the most of your professional life</p>
      </div>

      <div className="w-full max-w-md bg-[#E8E8E8] rounded-[7px] shadow-xl p-8">
        <LoginForm />
      </div>
    </>
  )
}
