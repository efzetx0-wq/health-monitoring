import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileHeart,
  HeartPulse,
  LogOut,
  MessageSquare 
} from "lucide-react";

export default function MedicalSidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  // MENU
  const menuItems = [

    {
      name: "Dashboard",
      path: "/medical-dashboard",
      icon: <LayoutDashboard size={20} />
    },

    {
      name: "Patients",
      path: "/medical-patients",
      icon: <Users size={20} />
    },

    {
      name: "Consultations",
      path: "/medical-chats",
      icon: <MessageSquare size={20} />
    },


    {
      name: "Health Reports",
      path: "/medical-reports",
      icon: <FileHeart size={20} />
    }
  ];

  return (

    <div className="
      w-72
      min-h-screen

      bg-[#020617]
      border-r
      border-gray-800

      text-white
      p-6

      shadow-2xl
    ">

      {/* LOGO */}
      <div className="
        flex
        items-center
        gap-4
        mb-12
      ">

        <div className="
          bg-linear-to-br
          from-cyan-500
          to-blue-600

          p-3
          rounded-2xl

          shadow-lg
        ">

          <HeartPulse
            size={28}
          />

        </div>

        <div>

          <h1 className="
            text-2xl
            font-extrabold
          ">

            Medical Panel

          </h1>

          <p className="
            text-gray-400
            text-sm
          ">

            Healthcare System

          </p>

        </div>

      </div>

      {/* MENU */}
      <nav className="
        space-y-3
      ">

        {menuItems.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`
              flex
              items-center
              gap-4

              px-5
              py-4

              rounded-2xl

              transition-all
              duration-300

              ${
                location.pathname === item.path

                ?

                "bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-lg"

                :

                "hover:bg-[#111827] text-gray-300 hover:text-cyan-400 hover:translate-x-1"
              }
            `}
          >

            {item.icon}

            <span className="
              font-medium
              text-[15px]
            ">

              {item.name}

            </span>

          </Link>

        ))}

      </nav>

      {/* LOGOUT */}
      <div className="
        mt-10
      ">

        <button
          onClick={handleLogout}
          className="
            w-full

            flex
            items-center
            gap-4

            px-5
            py-4

            rounded-2xl

            bg-[#111827]

            text-gray-300

            hover:bg-linear-to-br
            hover:from-cyan-500
            hover:to-blue-600

            hover:text-white

            hover:scale-[1.03]

            active:scale-95

            transition-all
            duration-300

            shadow-lg
          "
        >

          <LogOut size={20} />

          <span className="
            font-medium
            text-[15px]
          ">

            Logout

          </span>

        </button>

      </div>

    </div>
  )
}