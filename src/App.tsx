import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { IconChevronRight, IconLogout2 } from "@tabler/icons-react";
import localforage from "localforage";
import { UserData } from "./types/UserData";
import cx from "classix";
import { LoginUserData } from "./types/Login";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export type AppData = {
  data: UserData | null | undefined;
  setData: Dispatch<SetStateAction<UserData | null | undefined>>;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const paths = location.pathname.slice(1).split("/");

  const [data, setData] = useState<UserData | null>();

  const [user, setUser] = useState<LoginUserData | null>(null);

  useEffect(() => {
    localforage.getItem("userData").then((data) => setData(data as UserData));

    localforage.getItem("user").then((data) => setUser(data as LoginUserData));

    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <main className="relative flex h-dvh flex-col gap-8 overflow-auto bg-gray-100 p-8 text-3xl font-bold lg:ml-64">
      <Sidebar />
      <section className="flex justify-between">
        <ol className="flex items-center whitespace-nowrap" aria-label="Breadcrumb">
          {paths.map((path, i) => (
            <li key={path} className="inline-flex items-center">
              {++i !== paths.length ? (
                <>
                  <a
                    className="flex items-center text-xl capitalize hover:text-primary focus:text-primary focus:outline-none dark:focus:text-primary"
                    href={`/${paths.slice(0, -1).join("/")}`}
                  >
                    {path.replaceAll("-", " ")}
                  </a>

                  <IconChevronRight />
                </>
              ) : (
                <span className="flex items-center text-xl capitalize">
                  {decodeURIComponent(path.replaceAll("-", " "))}
                </span>
              )}
            </li>
          ))}
        </ol>
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
      </section>
      {user?.Role === "Admin" && (
        <div className="absolute right-44 top-7 inline-flex gap-1 rounded-xl border-2 border-primary bg-primary p-1 text-primary shadow-sm">
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
      <Outlet context={{ data, setData } satisfies AppData} />
      <ScrollRestoration getKey={(location) => location.pathname} />
    </main>
  );
}

export default App;
