import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowBack } from "@tabler/icons-react";
import { HierarchyMap } from "../../../types/HierarchyMap";
import ky from "ky";
import cx from "classix";

type UserDetailsInput = {
  First_Name: string;
  Last_Name: string;
  Email: string;
  Designation: string;
};

type UserDetailsSelect = {
  Role: string;
  Hierarchy_Map: number | null;
  Hierarchy_Name: string;
};

function AddUser() {
  const navigate = useNavigate();

  const roleOptions = [
    { key: "admin", value: "Admin" },
    { key: "user", value: "User" },
  ];

  const hierarchyMap: HierarchyMap = JSON.parse(localStorage.getItem("adminHierarchy") ?? "{}");

  const userForm = [
    { label: "First Name", f_type: "input", type: "text", state: "First_Name" },
    { label: "Last Name", f_type: "input", type: "text", state: "Last_Name" },
    { label: "Email", f_type: "input", type: "email", state: "Email" },
    { label: "Designation", f_type: "input", type: "text", state: "Designation" },
    { label: "Role", f_type: "select", options: roleOptions, state: "Role" },
    { label: "Hierarchy", f_type: "select", options: hierarchyMap, state: "Hierarchy_Name" },
  ];

  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState<UserDetailsInput & UserDetailsSelect>({
    First_Name: "",
    Last_Name: "",
    Email: "",
    Designation: "",
    Role: roleOptions[0].value,
    Hierarchy_Map: Number(hierarchyMap[0]?.key ?? 0),
    Hierarchy_Name: hierarchyMap[0]?.value,
  });

  useEffect(() => {
    setUserDetails((details) => ({
      ...details,
      Hierarchy_Map: hierarchyMap?.length
        ? Number(hierarchyMap.find((hierarchy) => hierarchy.value === details.Hierarchy_Name)?.key)
        : null,
    }));
  }, [userDetails.Hierarchy_Name]);

  useLayoutEffect(() => {
    document.title = "SkillViz | Add User";
  }, []);

  return (
    <section className="flex flex-col gap-8 p-6">
      <div className="relative flex w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <button className="absolute left-4 top-4 rounded-full p-2 hover:bg-gray-200" onClick={() => navigate(-1)}>
          <IconArrowBack />
        </button>
        <div className="mx-20 my-4">
          <span className="text-xl font-semibold">Add a user</span>
          <div className="flex flex-wrap gap-4 p-8">
            {userForm.map((field) => (
              <div key={field.label}>
                <label htmlFor={field.label} className="text-md block font-semibold dark:text-white">
                  {field.label}
                </label>
                {field.f_type === "select" ? (
                  <select
                    id={field.state}
                    className="block w-96 rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                    onChange={(e) => {
                      const id = e.currentTarget.id;
                      const value = e.currentTarget.value;
                      setUserDetails((details) => ({ ...details, [id]: value }));
                    }}
                  >
                    {field.options?.length &&
                      field.options?.map((option) => <option key={option.key}>{option.value}</option>)}
                  </select>
                ) : (
                  <input
                    id={field.state}
                    type={field.type}
                    className="block w-96 rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                    value={userDetails[field.state as keyof UserDetailsInput]}
                    onChange={(e) => {
                      const id = e.currentTarget.id;
                      const value = e.currentTarget.value;
                      setUserDetails((details) => ({ ...details, [id]: value }));
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            className="float-right rounded-xl border border-primary px-4 py-2 hover:bg-primary hover:text-white"
            onClick={async () => {
              setLoading(true);
              const response: { Status: string } = await ky
                .post(
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_ADD_USER}`,
                  { json: userDetails },
                )
                .json();

              if (response?.Status === "OK") {
                setLoading(false);
                navigate(-1);
              }
            }}
          >
            <span
              className={cx(
                "inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-white",
                !loading && "hidden",
              )}
              role="status"
              aria-label="loading"
            />
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddUser;
