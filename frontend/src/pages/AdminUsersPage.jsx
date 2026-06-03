import {
  useEffect,
  useState
} from "react";

import api from "../api/axios";

import AdminLayout
from "../layouts/AdminLayout";

import {
  Search
} from "lucide-react";

export default function AdminUsersPage() {

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    try {

      const response =
        await api.get(
          "/admin/users"
        );

      setUsers(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  // DELETE USER
  const handleDelete =
    async (id) => {

    if (
      !window.confirm(
        "Delete this user?"
      )
    ) {
      return;
    }

    try {

      await api.delete(
        `/admin/users/${id}`
      );

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };

  // CHANGE ROLE
  const handleRoleChange =
    async (id, role) => {

    try {

      await api.put(
        `/admin/users/${id}/role`,
        { role }
      );

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };

  // SEARCH FILTER
  const filteredUsers =
    users.filter((user) =>

      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      user.email
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <AdminLayout>

      <div className="
        min-h-screen
        bg-[#0f172a]
        text-white
        p-6
      ">

        {/* HEADER */}
        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
          mb-8
        ">

          <div>

            <h1 className="
              text-4xl
              font-extrabold
              mb-2
            ">

              User Management

            </h1>

            <p className="
              text-gray-400
            ">

              Manage all system users

            </p>

          </div>

          {/* SEARCH */}
          <div className="
            relative
            w-full
            md:w-96
          ">

            <Search
              size={20}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                w-full
                bg-[#111827]
                border
                border-gray-700
                rounded-2xl
                pl-12
                pr-4
                py-3
                outline-none

                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/30

                transition-all
              "
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="
          bg-[#111827]
          border
          border-gray-800
          rounded-3xl
          shadow-xl
          overflow-hidden
        ">

          <div className="overflow-x-auto">

            <table className="
              w-full
              border-collapse
            ">

              <thead>

                <tr className="
                  bg-[#1e293b]
                  text-gray-300
                ">

                  <th className="
                    p-4
                    text-left
                  ">

                    Name

                  </th>

                  <th className="
                    p-4
                    text-left
                  ">

                    Email

                  </th>

                  <th className="
                    p-4
                    text-left
                  ">

                    Role

                  </th>

                  <th className="
                    p-4
                    text-left
                  ">

                    Action

                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="
                      border-b
                      border-gray-800

                      hover:bg-[#1e293b]
                      transition
                    "
                  >

                    {/* NAME */}
                    <td className="
                      p-4
                      font-medium
                    ">

                      {user.name}

                    </td>

                    {/* EMAIL */}
                    <td className="
                      p-4
                      text-gray-400
                    ">

                      {user.email}

                    </td>

                    {/* ROLE */}
                    <td className="
                      p-4
                    ">

                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value
                          )
                        }
                        className="
                          bg-[#0f172a]
                          border
                          border-gray-700
                          rounded-xl
                          p-2
                          outline-none

                          focus:border-cyan-500
                        "
                      >

                        <option value="admin">

                          Admin

                        </option>

                        <option value="user">

                          User

                        </option>

                        <option value="medical">

                          Medical

                        </option>

                        <option value="guest">

                          Guest

                        </option>

                      </select>

                    </td>

                    {/* DELETE */}
                    <td className="
                      p-4
                    ">

                      <button
                        onClick={() =>
                          handleDelete(
                            user.id
                          )
                        }
                        className="
                          bg-cyan-500/20
                          text-cyan-400

                          hover:bg-cyan-500
                          hover:text-white

                          px-5
                          py-2

                          rounded-xl

                          transition-all
                          duration-300
                        "
                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}