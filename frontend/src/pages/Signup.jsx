import { Link } from "react-router-dom"
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import GoogleSignIn from "@/components/GoogleSignin";

export default function Signup() {

  const { signup } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    signup({ name, email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-72px)]">
      <div className="p-6 bg-box rounded-lg sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="mb-4 text-center text-4xl tracking-tight">Create your account</h2>
        <div className="mt-3">
          {/* form */}
          <form onSubmit={handleSignup}>
            <label htmlFor="name" className="block text-sm/6 font-medium">Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" required autoComplete="name" className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6" />
            <label htmlFor="email" className="mt-3 block text-sm/6 font-medium">Email address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6" />
            <div className="flex items-center justify-between mt-3">
              <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
            </div>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6" />
            <button type="submit" className="mt-6 flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm/6 font-semibold text-white hover:opacity-75 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">Create Account</button>
          </form>
          <p className="text-center mt-3 text-sm">Aready have an account? <Link to="/signin" className="font-semibold leading-6 text-primary transition-all relative after:absolute after:w-full after:h-px after:bg-primary w-max after:left-0 after:bottom-0 after:origin-bottom-right after:scale-x-0 after:transition hover:after:origin-bottom-left hover:after:scale-x-100">Sign in</Link></p>
          <p className="text-center mt-6 mb-1">or,</p>
          {/* google */}
          <GoogleSignIn />
        </div>
      </div>
    </div>
  )
}