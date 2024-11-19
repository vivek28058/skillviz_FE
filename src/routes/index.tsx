import { RouteObject, redirect } from "react-router-dom";
import App from "../App";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import MySkills from "../pages/myskills";
import UpdateSkills from "../pages/myskills/update";
import localforage from "localforage";
import MyExperience from "../pages/myexperience";
import UpdateExperience from "../pages/myexperience/update";
import MyEducation from "../pages/myeducation";
import MyCertification from "../pages/mycertification";
import UpdateEducation from "../pages/myeducation/update";
import UpdateCertification from "../pages/mycertification/update";
import { NotFound } from "../pages/not-found";
import ky from "ky";
import AdminDasboard from "../pages/admin/dashboard";
import { UserData } from "../types/UserData";
import SkillsDistribution from "../pages/dashboard/skills-distribution";
import ResetPassword from "../pages/reset-password";
import AdminSkillsDistribution from "../pages/admin/dashboard/skills-distribution";
import AdminLayout from "../pages/admin/layout";
import AccessManagement from "../pages/admin/access-management";
import AddUser from "../pages/admin/add-user";
import AdminSearch from "../pages/admin/search";

export const routes: Array<RouteObject> = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: async () => {
          const adminAnalytics = await localforage.getItem("adminAnalytics");
          if (adminAnalytics) return redirect("/admin/home");

          const userData = await localforage.getItem("userData");
          if (userData) return redirect("/dashboard");

          const dId = localStorage.getItem("dId");
          const uName = localStorage.getItem("uName");

          if (dId && uName) {
            const response: UserData = await ky(
              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}/${uName}`,
            ).json();
            const hierarchyResponse = await ky(
              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}${import.meta.env.VITE_USERS_HIERARCHY_API}`,
            ).json();

            if (hierarchyResponse) localStorage.setItem("hierarchy", JSON.stringify(hierarchyResponse));

            if (response) {
              await localforage.setItem("userData", response);
            }
          }
          return redirect("/login");
        },
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: async () => {
          const dId = localStorage.getItem("dId");
          const uName = localStorage.getItem("uName");

          if (dId && uName) {
            const response: UserData = await ky(
              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}/${uName}`,
            ).json();

            if (response) {
              await localforage.setItem("userData", response);
            }
          }

          return null;
        },
      },
      {
        path: "skills-distribution/:id",
        element: <SkillsDistribution />,
      },
      {
        path: "my-skills",
        element: <MySkills />,
      },
      {
        path: "my-skills/update",
        element: <UpdateSkills />,
      },
      {
        path: "my-experience",
        element: <MyExperience />,
      },
      {
        path: "my-experience/update/:type",
        element: <UpdateExperience />,
      },
      {
        path: "my-education",
        element: <MyEducation />,
      },
      {
        path: "my-education/update/:type",
        element: <UpdateEducation />,
      },
      {
        path: "my-certification",
        element: <MyCertification />,
      },
      {
        path: "my-certification/update/:type",
        element: <UpdateCertification />,
      },
    ],
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        loader: async () => redirect("home"),
      },
      {
        path: "home",
        element: <AdminDasboard />,
        loader: async () => {
          const analyticsResponse = await ky(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_ANALYTICS_API}`,
          ).json();

          const adminHierarchyResponse = await ky(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_HIERARCHY_API}`,
          ).json();

          const adminHierarchyCountResponse = await ky(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_HIERARCHY_API}`,
          ).json();

          const hierarchyResponse = await ky(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}${import.meta.env.VITE_USERS_HIERARCHY_API}`,
          ).json();

          const adminHierarchyCount = await ky(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_HIERARCHY_COUNT_API}`,
          ).json();

          if (adminHierarchyCount) localStorage.setItem("hierarchyCount", JSON.stringify(adminHierarchyCount));

          if (hierarchyResponse) localStorage.setItem("hierarchy", JSON.stringify(hierarchyResponse));

          if (adminHierarchyResponse) localStorage.setItem("adminHierarchy", JSON.stringify(adminHierarchyResponse));

          if (adminHierarchyCountResponse)
            localStorage.setItem("adminHierarchyCount", JSON.stringify(adminHierarchyResponse));

          if (analyticsResponse) await localforage.setItem("adminAnalytics", analyticsResponse);

          return null;
        },
      },
      {
        path: "skills-distribution/:id",
        element: <AdminSkillsDistribution />,
      },
      {
        path: "employees",
        loader: () => redirect("/admin/home"),
      },
      {
        path: "search",
        element: <AdminSearch />,
      },
      {
        path: "access-management",
        element: <AccessManagement />,
        loader: async () => {
          const getUsersResponse = await ky(
            `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_USERS_API}`,
          ).json();

          if (getUsersResponse) localStorage.setItem("users", JSON.stringify(getUsersResponse));

          return null;
        },
      },
      {
        path: "add-user",
        element: <AddUser />,
      },
    ],
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
];
