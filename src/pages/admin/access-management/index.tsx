import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminUser, AdminUsers } from "../../../types/AdminUsers";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconRotate,
  IconSearch,
  IconUser,
  IconUserCog,
} from "@tabler/icons-react";
import cx from "classix";
import ky from "ky";

const tableHeads = ["Name", "Designation", "Email", "Role", "Status", "Reset Password", "Edit"];

const roles = ["Admin", "User"];

const status = ["Active", "Inactive"];

const pageSize = 8;

function AccessManagement() {
  window.HSStaticMethods.autoInit();

  const navigate = useNavigate();

  const users: AdminUsers = JSON.parse(localStorage.getItem("users") ?? "{}");

  const [userList, setUserList] = useState<AdminUsers>(users?.slice(0, pageSize));

  const [search, setSearch] = useState("");

  const searchUserList = useMemo(
    () =>
      users?.filter(
        (user) =>
          user.First_Name?.toLowerCase().includes(search.toLowerCase()) ||
          user.Last_Name?.toLowerCase().includes(search.toLowerCase()) ||
          user.Email?.toLowerCase().includes(search.toLowerCase()) ||
          user.Designation?.toLowerCase().includes(search.toLowerCase()) ||
          user.Role?.toLowerCase().includes(search.toLowerCase()) ||
          (!Boolean(user.is_Active) ? "inactive" === search.toLowerCase() : "active".includes(search.toLowerCase())),
      ),
    [userList, search],
  );

  const pages = Math.ceil((searchUserList?.length ?? 0) / pageSize);

  const [currentPage, setCurrentPage] = useState(1);

  const [editUser, setEditUser] = useState<AdminUser | null>(null);

  const [resetUser, setResetUser] = useState({ email: "", name: "" });

  const [toast, setToast] = useState(false);

  useEffect(() => {
    const start = pageSize * (currentPage - 1);
    setUserList(users?.slice(start, start + pageSize));
  }, [currentPage]);

  useLayoutEffect(() => {
    document.title = "SkillViz | Access Management";
  }, []);

  return (
    <section className="flex flex-col gap-8 p-8">
      <div className="flex min-w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className="flex h-full flex-col overflow-auto">
          <div className="flex-grow rounded-md">
            <div className="flex items-center justify-between gap-12 px-4 pb-3">
              <h3 className="text-lg font-medium">Employee List</h3>
              <div className="flex items-center gap-2">
                <div className="relative min-w-[20rem]">
                  <input
                    type="text"
                    name="tablesearch"
                    id="tablesearch"
                    className="block w-full rounded-lg border-gray-200 px-3 py-2 ps-9 text-sm shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                    <IconSearch style={{ width: 20, height: 20, color: "gray" }} />
                  </div>
                </div>
                <button
                  type="button"
                  className="h-max rounded-full border border-primary px-2 py-1 text-sm hover:bg-gray-100"
                  onClick={() => navigate("/admin/add-user")}
                >
                  Add more
                </button>
              </div>
            </div>
            <table className="relative w-full border">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeads.map((head, i) => (
                    <th
                      key={head}
                      scope="col"
                      className={cx(
                        "sticky top-0 bg-gray-50 px-3 py-3 text-center text-xs font-semibold uppercase text-gray-500",
                        i >= tableHeads.length / 3 && "min-w-[167px]",
                      )}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchUserList?.slice(pageSize * (currentPage - 1), pageSize * currentPage).map((user) => (
                  <tr key={user.Email}>
                    <td className="px-3 py-1 text-center text-sm font-semibold capitalize text-gray-600">
                      {`${user.First_Name ?? "(No First Name)"} ${user.Last_Name ?? ""}`}
                    </td>
                    <td className="px-3 py-1 text-center text-sm font-medium capitalize text-gray-600">
                      {user.Designation}
                    </td>
                    <td className="px-3 py-1 text-center text-sm font-medium text-gray-600">{user.Email}</td>
                    <td className="px-3 py-1 text-center text-sm font-medium capitalize text-gray-600">
                      {editUser?.Email === user.Email ? (
                        <div className="flex justify-center">
                          <select
                            className="block w-max rounded-full border-gray-200 ps-4 py-2 pe-8 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                            defaultValue={user.Role}
                            onChange={(e) => {
                              const Role = e.currentTarget.value;
                              setEditUser((user) => (user ? { ...user, Role } : null));
                            }}
                          >
                            {roles.map((role) => (
                              <option key={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                      ) : user.Role === "Admin" ? (
                        <span className="inline-flex w-24 items-center gap-x-1 rounded-full border border-yellow-600 p-2 text-xs font-medium text-yellow-600">
                          <IconUserCog />
                          {user.Role}
                        </span>
                      ) : (
                        <span className="inline-flex w-24 items-center gap-x-1 rounded-full border border-blue-600 px-3 py-1 text-xs font-medium text-blue-600">
                          <IconUser />
                          {user.Role}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1 text-center text-sm font-medium capitalize text-gray-600">
                      {editUser?.Email === user.Email ? (
                        <div className="flex justify-center">
                          <select
                            className="block w-max rounded-full border-gray-200 px-4 py-2 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                            defaultValue={Boolean(user.is_Active) ? "Active" : "Inactive"}
                            onChange={(e) => {
                              const status = e.currentTarget.value;
                              setEditUser((user) =>
                                user ? { ...user, is_Active: status === "Active" ? 1 : 0 } : null,
                              );
                            }}
                          >
                            {status.map((stat) => (
                              <option key={stat}>{stat}</option>
                            ))}
                          </select>
                        </div>
                      ) : Boolean(user.is_Active) ? (
                        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center text-sm font-medium capitalize text-gray-600">
                      <button
                        id={user.Email}
                        name={`${user.First_Name} ${user.Last_Name}`}
                        type="button"
                        className="rounded-full p-2 hover:bg-gray-100"
                        data-hs-overlay="#hs-vertically-centered-modal"
                        onClick={(e) => setResetUser({ email: e.currentTarget.id, name: e.currentTarget.name })}
                      >
                        <IconRotate />
                      </button>
                    </td>
                    <td className="px-6 py-3 text-center text-sm font-medium capitalize text-gray-600">
                      {editUser?.Email === user.Email ? (
                        <div className="hs-tooltip inline-block">
                          <button
                            type="button"
                            className="hs-tooltip-toggle rounded-full p-2 hover:bg-gray-100"
                            onClick={async () => {
                              if (editUser.Role !== user.Role) {
                                const response: { Status: string } = await ky
                                  .post(
                                    `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}/${import.meta.env.VITE_ADMIN_USER_ROLE}`,
                                    {
                                      json: {
                                        employeeEmail: editUser.Email,
                                        isAdmin: editUser.Role === "Admin" ? 1 : 0,
                                      },
                                    },
                                  )
                                  .json();

                                if (response?.Status === "OK")
                                  setUserList((list) =>
                                    list?.map((user) => (user.Email === editUser.Email ? editUser : user)),
                                  );
                                localStorage.setItem(
                                  "users",
                                  JSON.stringify(
                                    users?.map((user) => (user.Email === editUser.Email ? editUser : user)),
                                  ),
                                );
                              }

                              if (editUser.is_Active !== user.is_Active) {
                                const response: { Status: string } = await ky
                                  .post(
                                    `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}/${import.meta.env.VITE_ADMIN_USER_STATUS}`,
                                    {
                                      json: {
                                        employeeEmail: editUser.Email,
                                        isActive: editUser.is_Active,
                                      },
                                    },
                                  )
                                  .json();

                                if (response?.Status === "OK")
                                  setUserList((list) =>
                                    list?.map((user) => (user.Email === editUser.Email ? editUser : user)),
                                  );
                                localStorage.setItem(
                                  "users",
                                  JSON.stringify(
                                    users?.map((user) => (user.Email === editUser.Email ? editUser : user)),
                                  ),
                                );
                              }

                              setEditUser(null);
                            }}
                          >
                            <IconCheck color="teal" />
                            <span
                              className="hs-tooltip-content invisible absolute z-10 inline-block rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity hs-tooltip-shown:visible hs-tooltip-shown:opacity-100"
                              role="tooltip"
                            >
                              Update
                            </span>
                          </button>
                        </div>
                      ) : (
                        <button
                          id={user.Email}
                          type="button"
                          className="rounded-full p-2 hover:bg-gray-100"
                          onClick={() => setEditUser(user)}
                        >
                          <IconEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav className="flex items-center justify-end gap-x-1 pt-4">
              <button
                type="button"
                className="inline-flex min-w-[40px] items-center justify-center gap-x-2 rounded-full p-2.5 text-sm text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setCurrentPage(1)}
              >
                <span aria-hidden="true">«</span>
                <span className="sr-only">First</span>
              </button>
              <button
                type="button"
                className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setCurrentPage((currentPage) => (currentPage > 1 ? currentPage - 1 : currentPage))}
              >
                <IconChevronLeft style={{ width: 16, height: 16 }} />
                <span aria-hidden="true" className="sr-only">
                  Previous
                </span>
              </button>
              <div className="flex items-center gap-x-1">
                <span className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                  {currentPage}
                </span>
                <span className="flex min-h-[38px] items-center justify-center px-1.5 py-2 text-sm text-gray-500">
                  of
                </span>
                <span className="flex min-h-[38px] items-center justify-center px-1.5 py-2 text-sm text-gray-500">
                  {pages}
                </span>
              </div>
              <button
                type="button"
                className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setCurrentPage((currentPage) => (currentPage < pages ? currentPage + 1 : currentPage))}
              >
                <span aria-hidden="true" className="sr-only">
                  Next
                </span>
                <IconChevronRight style={{ width: 16, height: 16 }} />
              </button>
              <button
                type="button"
                className="inline-flex min-w-[40px] items-center justify-center gap-x-2 rounded-full p-2.5 text-sm text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setCurrentPage(pages)}
              >
                <span className="sr-only">Last</span>
                <span aria-hidden="true">»</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
      <div
        id="hs-vertically-centered-modal"
        className="hs-overlay pointer-events-none fixed start-0 top-0 z-[80] hidden size-full overflow-y-auto overflow-x-hidden"
      >
        <div className="m-3 mt-0 flex min-h-[calc(100%-3.5rem)] items-center opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="pointer-events-auto flex w-full flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-700/70">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-neutral-700">
              <h3 className="font-bold text-gray-800 dark:text-white">Reset Password</h3>
              <button
                type="button"
                className="flex size-7 items-center justify-center rounded-full border border-transparent text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700"
                data-hs-overlay="#hs-vertically-centered-modal"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="size-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <p className="text-gray-800 dark:text-neutral-400">
                Are you sure you want to reset {resetUser.name}'s password?
              </p>
            </div>
            <div className="flex items-center justify-end gap-x-2 border-t px-4 py-3 dark:border-neutral-700">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                data-hs-overlay="#hs-vertically-centered-modal"
              >
                Close
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                data-hs-overlay="#hs-vertically-centered-modal"
                onClick={async () => {
                  const response: { Status: string } = await ky
                    .post(
                      `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}/${import.meta.env.VITE_ADMIN_RESET_USER_PASSWORD}`,
                      {
                        json: {
                          employeeEmail: resetUser.email,
                          newPassword: "igs@2024",
                        },
                      },
                    )
                    .json();

                  if (response?.Status === "OK") {
                    setToast(true);
                    setTimeout(() => setToast(false), 2000);
                  }
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cx(
          "absolute bottom-10 left-1/2 max-w-max -translate-x-1/2 rounded-lg border border-teal-200 bg-teal-100 text-sm text-teal-800 transition-opacity",
          toast ? "opacity-100" : "opacity-0",
        )}
        role="alert"
      >
        <div className="flex gap-4 p-4">
          {resetUser.name}'s password has been successfully reset!
          <div className="ms-auto">
            <button
              type="button"
              className="inline-flex size-5 flex-shrink-0 items-center justify-center rounded-lg text-teal-800 opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none"
              onClick={() => setToast(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                className="size-4 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccessManagement;
