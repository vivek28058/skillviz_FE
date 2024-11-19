import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { IconKey, IconUser } from "@tabler/icons-react";
import ky from "ky";
import cx from "classix";

const resetFields = [
  {
    label: "Email",
    type: "email",
    id: "email-input",
    name: "email",
    icon: (
      <IconUser className="pointer-events-none absolute inset-y-4 start-3 flex items-center peer-disabled:pointer-events-none peer-disabled:opacity-50" />
    ),
    validation: "Please enter a valid email address",
  },
  {
    label: "Password",
    type: "password",
    id: "password-input",
    name: "password",
    icon: (
      <IconKey className="pointer-events-none absolute inset-y-4 start-3 flex items-center peer-disabled:pointer-events-none peer-disabled:opacity-50" />
    ),
    validation: "Please enter a valid password",
  },
  {
    label: "Retype Password",
    type: "password",
    id: "re-password-input",
    name: "repassword",
    icon: (
      <IconKey className="pointer-events-none absolute inset-y-4 start-3 flex items-center peer-disabled:pointer-events-none peer-disabled:opacity-50" />
    ),
    validation: "Please enter a valid password",
  },
];

type FormType = {
  email: string;
  password: string;
  repassword: string;
};

function ResetPassword() {
  const navigate = useNavigate();

  const [resetForm, setResetForm] = useState<FormType>({
    email: "",
    password: "",
    repassword: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useLayoutEffect(() => {
    document.title = "SkillViz | Reset Password";
  }, []);

  return (
    <section className="flex min-h-dvh min-w-full flex-col items-center justify-center gap-4 rounded-2xl p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-20 pt-12">
        <img src={logo} width={100} />
        <h1 className="text-3xl font-semibold">IGS SkillViz</h1>
        <h1 className="p-2 text-2xl font-semibold">Set Password</h1>
        <div className="flex items-center gap-2">
          <hr className="my-8 h-0.5 w-24 border-t-0 bg-gray-300 dark:bg-white/10" />
          <span>IGS Microsoft Email</span>
          <hr className="my-8 h-0.5 w-24 border-t-0 bg-gray-300 dark:bg-white/10" />
        </div>
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col space-y-3">
            {resetFields.map((field) => (
              <div className="relative" key={field.id}>
                {field.icon}
                <input
                  type={field.type}
                  id={field.id}
                  className="peer block w-full rounded-lg border-gray-200 p-4 pl-10 text-sm placeholder:text-transparent autofill:pb-2 autofill:pt-6 focus:border-blue-500 focus:pb-2 focus:pt-6 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 [&:not(:placeholder-shown)]:pb-2 [&:not(:placeholder-shown)]:pt-6"
                  placeholder=""
                  value={resetForm[field.name as keyof FormType]}
                  onChange={(e) => [
                    setResetForm((prev) => ({ ...prev, [field.name]: e.target.value })),
                    setError(false),
                  ]}
                />
                <label
                  htmlFor={field.id}
                  className="pointer-events-none absolute start-6 top-0 h-full origin-[0_0] truncate border border-transparent p-4 text-sm transition duration-100 ease-in-out peer-focus:-translate-y-1.5 peer-focus:translate-x-0.5 peer-focus:scale-90 peer-focus:text-gray-500 peer-disabled:pointer-events-none peer-disabled:opacity-50 peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:translate-x-0.5 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:text-gray-500"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600" id="hs-validation-name-error-helper">
              Passwords do not match
            </p>
          )}
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-2 py-3 text-white hover:brightness-125"
            onClick={async () => {
              if (success) navigate("/login");

              if (resetForm.password !== resetForm.repassword) setError(true);
              else {
                const setPasswordResponse: { Status: string } = await ky
                  .post(
                    `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}${import.meta.env.VITE_USERS_SET_PASSWORD}`,
                    { json: { employeeEmail: resetForm.email, newPassword: resetForm.password } },
                  )
                  .json();

                if (setPasswordResponse.Status === "OK") {
                  setSuccess(true);
                }
              }
            }}
          >
            {success ? "Back to Login" : "Set Password"}
          </button>
        </div>
      </div>
      <div className={cx("space-y-5 opacity-0 transition-opacity ease-in-out", success && "opacity-100")}>
        <div className="rounded-lg border-t-2 border-teal-500 bg-teal-100 p-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="inline-flex size-8 items-center justify-center rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800">
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
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </span>
            </div>
            <div className="ms-3">
              <h3 className="font-semibold text-gray-800">Password Successfully set.</h3>
              <p className="text-sm text-gray-700">You have successfully updated your password.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
