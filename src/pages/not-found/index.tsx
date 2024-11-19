import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { IconRouteX } from "@tabler/icons-react";

export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main className="flex h-dvh flex-col gap-8 overflow-auto bg-gray-100 p-8 text-3xl font-bold">
      <section className="flex flex-col">
        <a className="flex items-center text-xl font-semibold" href="/dashboard" aria-label="Brand">
          <img src={logo} width={75} />
          <div className="flex flex-col">
            SkillViz
            <span className="text-sm text-gray-500">IGS</span>
          </div>
        </a>
        <div className="flex flex-col items-center gap-4">
          <IconRouteX style={{ width: 64, height: 64 }} />
          <h1>Page Not Found</h1>
          <h3 className="text-base">Oops! We couldn't find the page you're looking for.</h3>
          <h3 className="text-base">Please check the address and try again.</h3>
          <button
            type="button"
            onClick={() => (location.pathname.includes("admin") ? navigate("/admin/home") : navigate("/dashboard"))}
            className="flex w-max items-center gap-x-2 rounded-md border border-primary bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Back to Home
          </button>
        </div>
      </section>
    </main>
  );
}
