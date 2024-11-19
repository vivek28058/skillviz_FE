import { IconArrowBack, IconEdit } from "@tabler/icons-react";
import { useQuery } from "../../../hooks/useQuery";
import cx from "classix";
import { unstable_usePrompt, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../../../hooks/useData";
import { useImmer } from "use-immer";
import ky from "ky";
import localforage from "localforage";
import useExitPrompt from "../../../hooks/useExitPrompt";

const tableHeads = ["Skillset", "No", "Beginner", "Intermediate", "Advanced", "Expert"];

function UpdateSkills() {
  const navigate = useNavigate();

  const params = useQuery();

  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const [selectedSkill, setSelectedSkill] = useState<string | null | undefined>(params.get("skill"));

  const { data, setData } = useData();

  const categoriesData = data?.skills_master.categories?.filter((category) => category.name !== "Certification");

  const [categories, setCategories] = useImmer(categoriesData);

  const selectedCategory = useMemo(
    () => categories?.filter((category) => category.name === selectedSkill)[0] ?? categories?.[0],
    [selectedSkill, categories],
  );

  const categoryRef = useRef<HTMLButtonElement | null>(null);

  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const updatedSkills = (subCatIdx: number, concernIdx: number, score: number) => {
    setCategories((draft) => {
      draft?.forEach((category) => {
        if (category.name === selectedCategory?.name) {
          category["sub-category"][subCatIdx].concern[concernIdx].score = score;
          category.my_score = category["sub-category"]
            .flatMap((subCat) => subCat.concern)
            .reduce((acc, current) => acc + current.score, 0);
          return;
        }
        category;
      });
    });
  };

  unstable_usePrompt({
    message: "You have unsaved changes. Are you sure you want to leave?",
    when: ({ currentLocation, nextLocation }) => {
      if (nextLocation.pathname.includes("my-skills")) return false;
      return showExitPrompt && currentLocation.pathname !== nextLocation.pathname;
    },
  });

  useEffect(() => {
    categoryRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => {
      setShowExitPrompt(false);
    };
  }, []);

  useEffect(() => {
    if (!categories) setCategories(categoriesData);
  }, [categoriesData]);

  useEffect(() => {
    setToast(false);

    if (JSON.stringify(categories) === JSON.stringify(categoriesData)) return;

    let timerId: ReturnType<typeof setTimeout>;

    (async () => {
      const response: { Status: string } = await ky
        .post(
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}/${data?.skills_master.user?.u_id}`,
          { json: { skills_master: { ...data?.skills_master, categories } } },
        )
        .json();

      if (response.Status === "OK") {
        localforage.setItem("userData", { skills_master: { ...data?.skills_master, categories } });
        setData({ skills_master: { ...data?.skills_master, categories } });
        setToastMsg("Score has been updated successfully!");
        setToastType("success");
        setToast(true);
        timerId = setTimeout(() => setToast(false), 2000);
      } else {
        setToastMsg("There seems to be an error. Please try again.");
        setToastType("error");
        setToast(true);
        timerId = setTimeout(() => setToast(false), 2000);
      }
    })();

    return () => clearTimeout(timerId);
  }, [categories]);

  return (
    <section className="flex h-[90%] min-w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex items-center gap-2">
        <button className="rounded-full p-2 hover:bg-gray-200" onClick={() => navigate(-1)}>
          <IconArrowBack />
        </button>
        <IconEdit />
        <h2 className="text-xl">Update Your Skills</h2>
      </div>
      <div className="flex h-[92%] flex-col gap-4">
        <div className="flex h-inherit gap-4">
          <div className="relative min-w-max overflow-auto">
            <h3 className="sticky top-0 bg-white p-2 text-center text-lg">Categories</h3>
            <div className="flex min-w-[250px] flex-col overflow-auto rounded-md border">
              {categoriesData?.map((category) => (
                <button
                  key={category.name}
                  ref={category.name === selectedSkill ? categoryRef : null}
                  type="button"
                  className={cx(
                    "inline-flex scroll-mt-12 items-center gap-x-2 rounded-lg border border-transparent px-4 py-3 text-sm font-medium capitalize text-primary hover:bg-orange-100 hover:text-secondary disabled:pointer-events-none disabled:opacity-50",
                    category.name === selectedSkill && "bg-orange-100 text-secondary",
                  )}
                  onClick={() => setSelectedSkill(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full">
            <h3 className="p-2 text-lg">Sub-Categories</h3>
            <div className="h-[92.5%] flex-grow overflow-auto">
              <table className="w-full border">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr className="relative z-10">
                    {tableHeads.map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="sticky top-0 bg-gray-50 px-6 py-3 text-start text-sm font-semibold uppercase text-gray-500 dark:text-gray-400"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="relative divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedCategory?.["sub-category"].map((subcategory, subCatIdx) => (
                    <Fragment key={subCatIdx}>
                      <tr className="sticky top-[45px] z-10 bg-gray-200">
                        <td
                          colSpan={6}
                          className="px-4 py-2 text-start text-sm capitalize text-gray-600 dark:text-gray-500"
                        >
                          {subcategory.name}
                        </td>
                      </tr>
                      {subcategory.concern.map((concern, concernIdx) => (
                        <tr key={concernIdx}>
                          <td className="max-w-52 whitespace-break-spaces px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {concern.name}
                          </td>
                          {tableHeads
                            .filter((head) => head !== "Skillset")
                            .map((th, score) => (
                              <td key={th} className="whitespace-nowrap px-6 py-4 text-center">
                                <input
                                  type="radio"
                                  name={`hs-radio-group-${concern.name}`}
                                  checked={concern.score === score}
                                  className="mt-0.5 shrink-0 cursor-pointer rounded-full border-gray-400 text-primary focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                                  value={score}
                                  id={`${concern.name}-${score}`}
                                  onChange={() => updatedSkills(subCatIdx, concernIdx, score)}
                                />
                              </td>
                            ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cx(
          "absolute bottom-6 left-1/2 max-w-max -translate-x-1/2 rounded-lg border text-sm transition-opacity",
          toast ? "opacity-100" : "opacity-0",
          toastType === "success"
            ? "border-green-200 bg-green-100 text-green-800"
            : "border-red-200 bg-red-100 text-red-800",
        )}
        role="alert"
      >
        <div className="flex gap-4 p-4">
          {toastMsg}
          <div className="ms-auto">
            <button
              type="button"
              className={cx(
                "inline-flex size-5 flex-shrink-0 items-center justify-center rounded-lg opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none",
                toastType === "success" ? "text-green-800" : "text-red-800",
              )}
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

export default UpdateSkills;
