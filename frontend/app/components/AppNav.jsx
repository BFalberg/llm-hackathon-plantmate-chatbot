import { NavLink } from "react-router";
import { People, Profile, Home, Calendar, Bookmark } from "./Icons";

export default function AppNav() {
  const MenuItems = [
    { path: "/", icon: <Home /> },
    {
      path: "/planner",
      icon: <Calendar />,
    },
    {
      path: "/community",
      icon: <People />,
    },
    { path: "/recipes", icon: <Bookmark /> },
    {
      path: "/account",
      icon: <Profile />,
    },
  ];

  return (
    <>
      <nav className="app-nav">
        <ul>
          {MenuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                className={({ isActive, isPending }) =>
                  ["navbar-link", isActive && "active", isPending && "pending"]
                    .filter(Boolean)
                    .join(" ")
                }
                to={item.path}
                viewTransition
              >
                {item.icon}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
