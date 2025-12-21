import { useAppContext } from "@/context/AppContext";

export default function ManageUsers() {

  const { allUser } = useAppContext();

  return (
    <div className="">
      <h2 className="text-center text-3xl mb-6 font-bold">Manage All Users</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-box">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-box-secondary">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Provider
              </th>
            </tr>
          </thead>
          <tbody>
            {allUser.map((user) => (
              <tr key={user._id} className="border-b border-box-secondary hover:bg-box-secondary transition-colors">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  {user.googleId ? "Google" : "Email/Password"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
