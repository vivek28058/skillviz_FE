import logo from "@/assets/logo.png";
import { IconBulb, IconCertificate, IconLayoutDashboard, IconSchool, IconUserStar } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

const sidebarItems = [
  { route: "/dashboard", title: "Dashboard", icon: <IconLayoutDashboard /> },
  { route: "/my-skills", title: "My Skills", icon: <IconBulb /> },
  { route: "/my-experience", title: "My Experience", icon: <IconUserStar /> },
  { route: "/my-education", title: "My Education", icon: <IconSchool /> },
  { route: "/my-certification", title: "My Certification", icon: <IconCertificate /> },
];

export default function Sidebar() {
  return (
    <>
      <div className="sticky inset-x-0 top-0 z-20 rounded-md border-y bg-white px-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6 md:px-8 lg:hidden">
        <div className="flex items-center py-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            data-hs-overlay="#application-sidebar-brand"
            aria-controls="application-sidebar-brand"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle Navigation</span>
            <svg className="size-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </button>

          <ol className="ms-3 flex items-center whitespace-nowrap" aria-label="Breadcrumb">
            <li
              className="truncate text-sm font-semibold capitalize text-gray-800 dark:text-gray-400"
              aria-current="page"
            >
              {location.pathname.slice(1)}
            </li>
          </ol>
        </div>
      </div>
      <div
        id="application-sidebar-brand"
        className="hs-overlay fixed bottom-0 start-0 top-0 z-[60] hidden w-64 -translate-x-full transform overflow-y-auto border bg-white pb-10 pt-3 transition-all duration-300 hs-overlay-open:translate-x-0 lg:bottom-0 lg:end-auto lg:block lg:translate-x-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar]:w-2"
      >
        <div className="px-6 pb-3">
          <a className="flex items-center text-xl font-semibold" href="/dashboard" aria-label="Brand">
            <img src={logo} width={75} />
            <div className="flex flex-col">
              SkillViz
              <span className="text-sm text-gray-500">IGS</span>
            </div>
          </a>
        </div>
        <hr />
        <nav className="hs-accordion-group flex w-full flex-col flex-wrap p-6" data-hs-accordion-always-open>
          <ul className="space-y-1.5">
            {sidebarItems.map((item) => (
              <li key={item.route}>
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-x-3 rounded-lg bg-primary px-2.5 py-2 text-sm text-white"
                      : "flex items-center gap-x-3 rounded-lg px-2.5 py-2 text-sm"
                  }
                >
                  {item.icon}
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
