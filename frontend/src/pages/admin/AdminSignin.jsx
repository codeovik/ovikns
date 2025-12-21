import { toast } from "sonner"
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";


export default function AdminSignin() {

    const { adminSignin } = useAppContext();

    const [password, setPassword] = useState("");

    const handleSignin = (e) => {
        e.preventDefault();
        adminSignin({ password });
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-72px)]">
            <div className="p-6 bg-box rounded-lg sm:mx-auto sm:w-full sm:max-w-lg">
                <h2 className="mb-4 text-center text-4xl tracking-tight">Admin login</h2>
                <div className="mt-3">
                    {/* form */}
                    <form onSubmit={handleSignin}>
                        <div className="flex items-center justify-between mt-3">
                            <label htmlFor="password" className="block text-sm/6 font-medium">Password</label>
                            <p onClick={ () => toast.info("Feature coming soon!") } className="cursor-pointer text-sm font-semibold text-primary hover:opacity-75 transition-all">Forgot password?</p>
                        </div>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" className="mt-1 block w-full rounded-md border-2 focus:outline-0 focus:border-primary border-box-sec px-3 py-2.5 text-base placeholder:text-gray-500 all sm:text-sm/6" />
                        <button type="submit" className="mt-6 flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm/6 font-semibold text-white hover:opacity-75 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    )
}