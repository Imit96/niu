import { getAdminUsers, updateUserRole } from "../../actions/admin";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { users, totalPages } = await getAdminUsers(page);

  const roleColors: Record<string, string> = {
    CUSTOMER: "bg-stone text-earth",
    SALON: "bg-bronze/10 text-bronze",
    ADMIN: "bg-earth/10 text-earth",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Users
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Manage registered user accounts and roles.
        </p>
      </div>

      <div className="bg-cream border border-earth/10 overflow-x-auto">
        {users.length === 0 ? (
          <div className="p-12 text-center text-earth/50 text-sm">
            No users registered yet.
          </div>
        ) : (
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-earth/10 bg-stone/30">
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Orders
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Salon Profile
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Joined
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-earth/5 hover:bg-stone/20 transition-colors"
                >
                  <td className="py-3 px-4 text-earth font-medium">
                    <Link href={`/admin/users/${user.id}`} className="hover:text-bronze hover:underline underline-offset-4 font-semibold transition-colors">
                      {user.name || "—"}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-earth/70 text-xs">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${
                        roleColors[user.role] || "bg-gray-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-earth/70">
                    {user._count.orders}
                  </td>
                  <td className="py-3 px-4 text-earth/60 text-xs">
                    {user.salonProfile ? (
                      <span>
                        {user.salonProfile.businessName}{" "}
                        {user.salonProfile.isApproved ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-yellow-600">Pending</span>
                        )}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-4 text-earth/60 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex items-center gap-4">
                    <Link href={`/admin/users/${user.id}`} className="text-xs uppercase font-semibold tracking-widest text-stone-500 hover:text-bronze transition-colors">
                       View Profile
                    </Link>
                    <form
                      action={async (formData: FormData) => {
                        "use server";
                        const role = formData.get("role") as string;
                        await updateUserRole(
                          user.id,
                          role as "CUSTOMER" | "SALON" | "ADMIN"
                        );
                        revalidatePath("/admin/users");
                      }}
                    >
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="text-xs border border-earth/20 rounded-sm px-2 py-1 bg-stone text-earth focus:border-bronze focus:outline-none"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="SALON">Salon</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button
                        type="submit"
                        className="ml-2 text-xs text-bronze hover:text-earth font-semibold uppercase tracking-wider"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {page > 1 && (
            <Link
              href={`/admin/users?page=${page - 1}`}
              className="text-xs uppercase tracking-widest text-earth/60 hover:text-earth border border-earth/20 px-3 py-1"
            >
              Previous
            </Link>
          )}
          <span className="text-xs text-earth/50">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/users?page=${page + 1}`}
              className="text-xs uppercase tracking-widest text-earth/60 hover:text-earth border border-earth/20 px-3 py-1"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
