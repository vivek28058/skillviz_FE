import "preline/preline";
import { useEffect, useLayoutEffect } from "react";
import logo from "@/assets/logo.png";
import { IconLogout2 } from "@tabler/icons-react";
import localforage from "localforage";
import { Link, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import cx from "classix";
import { IStaticMethods } from "preline";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

const navMenuItems = ["home", "employees", "search", "access-management"];

function AdminLayout() {
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  useLayoutEffect(() => {
    document.title = "SkillViz | Admin";
  }, []);

  return (
    <main className="relative flex h-dvh flex-col overflow-auto">
      <section className="flex flex-col gap-4 rounded-md bg-white p-3 shadow-[rgba(50,50,93,0.25)_0px_4px_2px_-2px,_rgba(0,0,0,0.3)_0px_3px_2px_-3px]">
        <header className="flex w-full flex-wrap bg-white text-sm dark:bg-gray-800 sm:flex-nowrap sm:justify-start">
          <nav
            className="mx-auto flex w-full max-w-[85rem] basis-full flex-wrap items-center justify-between px-4"
            aria-label="Global"
          >
            <a className="flex items-center text-xl font-semibold" href="/dashboard" aria-label="Brand">
              <img src={logo} width={75} />
              <div className="flex flex-col">
                SkillViz
                <span className="text-sm text-gray-500">IGS</span>
              </div>
            </a>
            <div className="flex gap-4">
              {navMenuItems.map((item) => (
                <Link
                  to={item}
                  className={cx(
                    "border-b-4 p-3 text-lg font-semibold capitalize text-gray-500",
                    location.pathname.includes(item) ? "border-primary text-primary" : "border-transparent",
                  )}
                  key={item}
                >
                  {item.split("-").join(" ")}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-x-2 sm:order-3">
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  localforage.clear();
                  navigate("/login");
                }}
                className="inline-flex items-center gap-x-2 rounded-md border border-primary bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
                <IconLogout2 />
                Logout
              </button>
            </div>
            <div
              id="navbar-alignment"
              className="hs-collapse hidden grow basis-full overflow-hidden transition-all duration-300 sm:order-2 sm:block sm:grow-0 sm:basis-auto"
            ></div>
          </nav>
        </header>
      </section>
      {location.pathname.includes("/admin/home") && (
        <div className="absolute right-12 top-[7.5rem] inline-flex gap-1 rounded-xl border-2 border-primary bg-primary p-1 text-primary shadow-sm">
          <button
            type="button"
            className={cx(
              "-ms-px inline-flex items-center gap-x-2 rounded-lg p-2 text-sm font-medium focus:z-10 disabled:pointer-events-none disabled:opacity-50",
              !location.pathname.includes("admin") ? "bg-white text-primary" : "bg-primary text-white",
            )}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            User Mode
          </button>
          <button
            type="button"
            className={cx(
              "-ms-px inline-flex items-center gap-x-2 rounded-lg p-2 text-sm font-medium focus:z-10 disabled:pointer-events-none disabled:opacity-50",
              location.pathname.includes("admin") ? "bg-white text-primary" : "bg-primary text-white",
            )}
            onClick={() => navigate("/admin")}
          >
            Admin Mode
          </button>
        </div>
      )}
      <Outlet />
      <ScrollRestoration getKey={(location) => location.pathname} />
    </main>
  );
}

export default AdminLayout;
