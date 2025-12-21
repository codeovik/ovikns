import { useAppContext } from "@/context/AppContext";

const Dashboard = () => {
  const { user, signout, deleteAccount } = useAppContext();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Congratulations!</h1>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Hello, <span className="font-bold">{user?.name}</span>
        </p>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
          Your email is: <span className="font-bold">{user?.email}</span>
        </p>
        <button
          onClick={signout}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign out
        </button>
        <button
          onClick={deleteAccount}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
