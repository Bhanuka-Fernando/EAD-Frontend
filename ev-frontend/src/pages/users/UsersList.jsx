import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import usersApi from "../../api/usersApi";

function Th({ children, className = "" }) {
  return (
    <th className={`text-left font-medium px-4 py-3 border-b ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function Chip({ children, color = "gray" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full text-xs px-2 py-1 border ${
        map[color] || map.gray
      }`}
    >
      {children}
    </span>
  );
}

export default function UsersList() {
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); // All | Backoffice | Operator
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch users once
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await usersApi.list({ pageSize: 1000 }); // fetch all
      const items = Array.isArray(data) ? data : data.items ?? [];
      setRows(items);
      setTotal(items.length);
    } catch (e) {
      toast.error(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Search + Filter logic (frontend only)
  const filteredRows = useMemo(() => {
    const searchTerm = q.trim().toLowerCase();

    return rows.filter((u) => {
      const role = u.role || (Array.isArray(u.roles) ? u.roles[0] : "");
      const name = u.fullName || u.name || "";
      const email = u.email || "";

      const matchesSearch =
        !searchTerm ||
        name.toLowerCase().includes(searchTerm) ||
        email.toLowerCase().includes(searchTerm) ||
        role.toLowerCase().includes(searchTerm);

      const matchesRole =
        roleFilter === "All" ||
        role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [rows, q, roleFilter]);

  // ✅ Paginated results
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="text-xs text-gray-500">
              Backoffice & Station Operator accounts for the web portal.
            </p>
          </div>
          <Link
            to="/register"
            className="rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 text-sm"
          >
            + Create user
          </Link>
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 mb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name / email / role"
                className="w-72 rounded-lg border px-3 py-2"
              />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border px-3 py-2"
              >
                <option>All</option>
                <option>Backoffice</option>
                <option>Operator</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {loading
                ? "Loading…"
                : `${filteredRows.length} of ${total} users shown`}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Created</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && pagedRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No matching users
                  </td>
                </tr>
              )}
              {!loading &&
                pagedRows.map((u) => {
                  const role =
                    u.role || (Array.isArray(u.roles) ? u.roles[0] : "—");
                  const created =
                    u.createdAtUtc || u.createdAt || u.createdOn;
                  return (
                    <tr key={u.id || u.email}>
                      <Td className="font-medium">{u.fullName || u.name || "—"}</Td>
                      <Td>{u.email || "—"}</Td>
                      <Td>
                        <Chip color={role === "Backoffice" ? "blue" : "green"}>
                          {role}
                        </Chip>
                      </Td>
                      <Td>
                        {created
                          ? new Date(created).toLocaleDateString()
                          : "—"}
                      </Td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-gray-500">
            Page {page} of {Math.ceil(filteredRows.length / pageSize) || 1}
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
              disabled={page >= Math.ceil(filteredRows.length / pageSize)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
