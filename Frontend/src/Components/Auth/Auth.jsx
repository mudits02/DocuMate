// import { useState } from "react";

const Auth = () => {

  // const [emailId, setEmailId] = useState("");
  // const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  }

  return (
    <div className="min-h-screen bg-[#0d1321] font-['Inter'] text-[#dde2f6] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'radial-gradient(#242a39 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#00dfc1]/5 blur-[120px] rounded-full" />
      <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#287af3]/5 blur-[120px] rounded-full" />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-[440px] px-6">

        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-['Space_Grotesk'] font-bold text-3xl tracking-tight">Documate</span>
          </div>
          <p className="font-['Space_Grotesk'] text-xl font-medium text-[#c6c6cc]">Welcome back, Architect.</p>
        </div>

        {/* Card */}
        <div className="bg-[#151b2a] p-8 rounded-xl ring-1 ring-[#45464c]/15 shadow-2xl">
          <form className="space-y-5">

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#c6c6cc]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-[#080e1c] border-none pl-10 pr-4 py-3 rounded-md text-[#dde2f6] placeholder:text-[#909096] focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-[#c6c6cc]">Password</label>
                <a href="#" className="text-xs text-[#00dfc1] font-medium">Forgot Password?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#080e1c] border-none pl-10 pr-4 py-3 rounded-md text-[#dde2f6] placeholder:text-[#909096] focus:outline-none"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#06d6ba] hover:bg-[#237f71] text-[#00382f] font-['Space_Grotesk'] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#00dfc1]/10 cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#45464c]/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#151b2a] px-4 text-[10px] text-[#909096] uppercase tracking-[0.2em] font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleGoogleLogin} type="button" className="cursor-pointer flex items-center justify-center gap-1.5 py-2 px-3 bg-[#080e1c] border border-[#45464c]/10 rounded-md hover:bg-[#242a39] transition-colors text-xs font-medium">
              Google
            </button>
            <button type="button" className="cursor-pointer flex items-center justify-center gap-1.5 py-2 px-3 bg-[#080e1c] border border-[#45464c]/10 rounded-md hover:bg-[#242a39] transition-colors text-xs font-medium">
              GitHub
            </button>
            <button type="button" className="cursor-pointer flex items-center justify-center gap-1.5 py-2 px-3 bg-[#080e1c] border border-[#45464c]/10 rounded-md hover:bg-[#242a39] transition-colors text-xs font-medium">
              GitLab
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-[#c6c6cc] text-sm">
          Don't have an account?
          <a href="#" className="text-[#00dfc1] font-semibold ml-2">Sign Up</a>
        </p>
      </main>

      {/* Bottom Metadata */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-start pointer-events-none select-none">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-['Space_Grotesk'] text-[#909096] uppercase tracking-widest">System Status</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00dfc1] animate-pulse" />
            <span className="text-[10px] font-mono text-[#dde2f6]/40">NODE_AUTH_OK</span>
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-1 text-right">
          <span className="text-[10px] font-['Space_Grotesk'] text-[#909096] uppercase tracking-widest">Version</span>
          <span className="text-[10px] font-mono text-[#dde2f6]/40">DOCUMATE_V0.0.1_BETA</span>
        </div>
      </div>
    </div>
  )
}

export default Auth;