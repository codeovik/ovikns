import { FiLogOut, FiTrash2 } from "react-icons/fi";
import ThemeToggle from "../components/ThemeToggle";
import { useAppContext } from "../context/AppContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const Settings = () => {
    const { signout, deleteAccount } = useAppContext();;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-10">
                {/* --- Appearance Section --- */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Appearance
                    </h2>
                    <div className="bg-box rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-700 dark:text-gray-300">
                                Switch between light and dark mode.
                            </p>
                            <ThemeToggle />
                        </div>
                    </div>
                </section>

                {/* --- Account Section --- */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Account
                    </h2>
                    <div className="bg-box rounded-lg shadow-sm p-6">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <FiLogOut />  Sign Out
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action will sign you out of your account. You will need to sign in again to access your dashboard.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={signout}>Sign Out</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </section>

                {/* --- Danger Zone --- */}
                <section className="border-t-4 border-red-500 rounded-lg bg-red-50 dark:bg-gray-800/20 p-6 shadow-md">
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-500">Danger Zone</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">These actions are permanent and cannot be undone.</p>
                    {/* <Button onClick={handleDeleteAccount} variant="destructive">
                        <FiTrash2 /> Destructive
                    </Button> */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <FiTrash2 /> Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteAccount}>Sign Out</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </section>
            </div>
        </div>
    );
};

export default Settings;