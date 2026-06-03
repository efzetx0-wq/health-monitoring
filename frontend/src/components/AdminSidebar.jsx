import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ShieldPlus,
  LogOut
} from "lucide-react";

export default function AdminSidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  const menus = [

    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <LayoutDashboard size={22} />
    },

    {
      name: "Manage Users",
      path: "/admin-users",
      icon: <Users size={22} />
    },

    {
      name: "Medical Staff",
      path: "/admin-medical",
      icon: <ShieldPlus size={22} />
    }
  ];

  return (

    <div className="
      w-72
      min-h-screen
      bg-[#0f172a]
      text-white
      border-r
      border-gray-800
      shadow-2xl
      flex
      flex-col
      justify-between
      p-6
    ">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="
          mb-12
        ">

          <div className="
            bg-linear-to-br
            from-cyan-500
            to-blue-600
            p-4
            rounded-3xl
            shadow-lg
            mb-4
            w-fit
          ">

            <ShieldPlus
              size={32}
            />

          </div>

          <h1 className="
            text-3xl
            font-extrabold
            tracking-wide
          ">

            Admin Panel

          </h1>

          <p className="
            text-gray-400
            mt-2
          ">

            Health Monitoring System

          </p>

        </div>

        {/* MENU */}
        <nav className="
          flex
          flex-col
          gap-4
        ">

          {menus.map((menu, index) => (

            <Link
              key={index}
              to={menu.path}
              className={`
                group
                flex
                items-center
                gap-4
                p-4
                rounded-2xl
                transition-all
                duration-300
                hover:scale-105
                hover:bg-linear-to-br
                hover:from-cyan-500
                hover:to-blue-600
                hover:shadow-xl

                ${
                  location.pathname === menu.path
                    ? "bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg"
                    : "bg-[#111827]"
                }
              `}
            >

              {/* ICON */}
              <div className="
                group-hover:rotate-6
                transition
              ">

                {menu.icon}

              </div>

              {/* TEXT */}
              <span className="
                font-medium
                text-lg
              ">

                {menu.name}

              </span>

            </Link>

          ))}

        </nav>

      </div>

      {/* BOTTOM */}
      <div>

        {/* SYSTEM STATUS */}
        <div className="
          bg-[#111827]
          border
          border-gray-800
          p-5
          rounded-3xl
          mb-5
        ">

          <p className="
            text-gray-400
            text-sm
            mb-2
          ">

            System Status

          </p>

          <div className="
            flex
            items-center
            gap-2
          ">

            <div className="
              w-3
              h-3
              rounded-full
              bg-cyan-400
              animate-pulse
            "></div>

            <span className="
              text-cyan-400
              font-medium
            ">

              Online

            </span>

          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            group
            w-full
            flex
            items-center
            justify-center
            gap-3

            bg-[#111827]

            hover:bg-linear-to-br
            hover:from-cyan-500
            hover:to-blue-600

            p-4
            rounded-2xl

            font-semibold

            transition-all
            duration-300

            hover:scale-105
            hover:shadow-xl
          "
        >

          <LogOut
            size={22}
            className="
              group-hover:rotate-12
              transition
            "
          />

          Logout

        </button>

      </div>

    </div>
  )
}