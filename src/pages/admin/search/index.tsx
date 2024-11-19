import localforage from "localforage";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { AdminAnalytics } from "../../../types/AdminAnalytics";
import cx from "classix";
import { AdminSearchResponse } from "../../../types/AdminSearchResponse";
import ky from "ky";
import { IconAdjustmentsSearch, IconCircleMinus, IconCirclePlus, IconSearch } from "@tabler/icons-react";
import { UserData } from "../../../types/UserData";
import { SearchModal } from "./modal";
import { useDebounce } from "use-debounce";
import { useQuery } from "../../../hooks/useQuery";

const tabList = [
  { label: "Basic Search", icon: <IconSearch /> },
  { label: "Custom Search", icon: <IconAdjustmentsSearch /> },
];

const levelList = [
  { label: "Amateur & above", value: 0 },
  { label: "Novice & above", value: 1 },
  { label: "Intermediate & above", value: 2 },
  { label: "Advanced & above", value: 3 },
  { label: "Expert", value: 4 },
];

const operators = ["AND", "OR"];

const tableHeads = ["Employee", "Designation"];

interface SearchQueryPrimitive {
  categoryName: string;
}

interface SearchQueryDerived {
  subCategoryNames: Array<string>;
  skillNames: Array<string>;
}

interface SearchQuery extends SearchQueryPrimitive, SearchQueryDerived { }

const query = {
  categoryName: "",
  subCategoryNames: [],
  skillNames: [],
};

function AdminSearch() {
  window.HSStaticMethods.autoInit();

  const params = useQuery();

  const [basicSearch, setBasicSearch] = useState(params.get("certificate") || "");

  const [debouncedBasicSearch] = useDebounce(basicSearch, 300);

  const [adminData, setAdminData] = useState<AdminAnalytics | null>();

  const [searchQuery, setSearchQuery] = useState<Array<SearchQuery>>([query]);

  const [searchCriteria, setSearchCriteria] = useState<number | null>(null);

  const [searchResponse, setSearchResponse] = useState<AdminSearchResponse>();

  const [selectedOp, setSelectedOp] = useState(operators[0]);

  const categoryList = useMemo(() => adminData?.category_aggregates.map((category) => category.name), [adminData]);

  const [userData, setUserData] = useState<UserData>();

  const [selectedTab, setSelectedTab] = useState(tabList[0].label);

  const subCategoryList = useCallback(
    (idx: number) => {
      if (!searchQuery?.[idx]?.categoryName) return;
      return adminData?.category_aggregates
        .find((category) => category.name === searchQuery[idx].categoryName)
        ?.sub_category.map((subCategory) => subCategory.name);
    },
    [adminData, JSON.stringify(searchQuery)],
  );

  const skillList = useCallback(
    (idx: number) => {
      if (!searchQuery?.[idx]?.subCategoryNames?.length) return;
      return adminData?.category_aggregates
        .find((category) => category.name === searchQuery[idx].categoryName)
        ?.sub_category.filter((subCategory) => searchQuery[idx].subCategoryNames.includes(subCategory.name))
        .flatMap((subCategory) => subCategory.skills)
        .map((skill) => skill.skill_name);
    },
    [adminData, JSON.stringify(searchQuery)],
  );

  const skillLevelList = useMemo(
    () => (searchQuery.every((query) => query.skillNames.length) ? levelList : null),
    [JSON.stringify(searchQuery)],
  );

  const searchFilterer = (idx: number) => [
    {
      label: "Category",
      options: categoryList,
      state: "categoryName",
      type: "radio",
    },
    {
      label: "Sub-Category",
      options: subCategoryList(idx),
      state: "subCategoryNames",
      type: "checkbox",
    },
    {
      label: "Skill",
      options: skillList(idx),
      state: "skillNames",
      type: "checkbox",
    },
  ];

  const [searchFilters, setSearchFilters] = useState<
    Array<
      Array<{
        label: string;
        options: string[] | undefined;
        state: string;
        type: string;
      }>
    >
  >([]);

  useEffect(() => {
    localforage.getItem("adminAnalytics").then((data) => {
      setAdminData(data as AdminAnalytics);
    });
  }, []);

  useEffect(() => {
    setSearchFilters([searchFilterer(0)]);
  }, [categoryList, adminData]);

  useEffect(() => {
    setSearchFilters((filters) =>
      filters.map((filter, i) => {
        if (!searchQuery[i].categoryName) return filter;

        return filter.map((filty) => {
          if (filty.state === "subCategoryNames") return { ...filty, options: subCategoryList(i) };
          if (filty.state === "skillNames") return { ...filty, options: skillList(i) };
          return filty;
        });
      }),
    );

    setSearchCriteria(null);
    setSearchResponse(undefined);
  }, [JSON.stringify(searchQuery)]);

  useEffect(() => {
    if (searchCriteria === null) {
      setSearchResponse(undefined);
      return;
    }

    ky.post(
      `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_SEARCH_API}`,
      {
        json: {
          searchQry: searchQuery,
          searchQryCriteria: { criteria_name: "gte", criteria_val: searchCriteria },
          searchQryOperator: selectedOp,
        },
      },
    )
      .json()
      .then((data) => setSearchResponse(data as AdminSearchResponse));
  }, [searchCriteria, JSON.stringify(searchQuery)]);

  useEffect(() => {
    if (searchCriteria === null) {
      setSearchResponse(undefined);
      return;
    }

    ky.post(
      `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_SEARCH_API}`,
      {
        json: {
          searchQry: searchQuery,
          searchQryCriteria: { criteria_name: "gte", criteria_val: searchCriteria },
          searchQryOperator: selectedOp,
        },
      },
    )
      .json()
      .then((data) => setSearchResponse(data as AdminSearchResponse));
  }, [selectedOp, JSON.stringify(searchQuery)]);

  useEffect(() => {
    if (debouncedBasicSearch) {
      ky.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_ADMIN_API_ENDPOINT}${import.meta.env.VITE_ADMIN_SIMPLE_SEARCH_API}`,
        {
          json: {
            basicSearch: debouncedBasicSearch.trim().toLowerCase(),
          },
        },
      )
        .json()
        .then((data) => setSearchResponse(data as AdminSearchResponse));
    }
  }, [debouncedBasicSearch]);

  useLayoutEffect(() => {
    document.title = "SkillViz | Admin Search";
  }, []);

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [selectedTab]);

  return (
    <section className="flex flex-grow flex-col gap-8 p-8">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1" aria-label="Tabs">
          {tabList.map((tab) => (
            <button
              type="button"
              className={cx(
                "inline-flex items-center gap-x-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm hover:text-primary focus:text-primary focus:outline-none",
                tab.label === selectedTab
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-gray-500",
              )}
              key={tab.label}
              role="tab"
              onClick={() => setSelectedTab(tab.label)}
            >
              {tab.label}
              {tab.icon}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-3">
        {selectedTab === tabList[0].label ? (
          <div className="mx-4 max-w-full space-y-3">
            <div className="relative">
              <input
                type="text"
                className="block w-full rounded-lg border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary"
                value={basicSearch}
                placeholder="Search"
                onChange={(e) => setBasicSearch(e.currentTarget.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2 peer-disabled:pointer-events-none peer-disabled:opacity-50">
                <IconSearch />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center">
            <div className="flex w-max flex-col gap-6">
              {searchFilters.map((searchFilter, idx) => (
                <div key={idx} className="flex w-max items-center gap-6">
                  {searchFilter.map((filter, i) => (
                    <div key={filter.label} className="flex flex-col">
                      <label htmlFor={filter.label} className="ml-2">
                        {filter.label}
                      </label>
                      <div className="hs-dropdown relative mx-1 mt-1 [--auto-close:inside] sm:mt-1 sm:inline-flex">
                        <button
                          id="hs-dropdown-auto-close-inside"
                          type="button"
                          className="hs-dropdown-toggle inline-flex w-64 items-center gap-x-2 truncate rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                        >
                          <span className="w-64 truncate text-start">
                            {filter.type === "radio"
                              ? searchQuery[idx][filter.state as keyof SearchQueryPrimitive]
                                ? searchQuery[idx][filter.state as keyof SearchQueryPrimitive]
                                : `Select ${filter.label}`
                              : searchQuery[idx][filter.state as keyof SearchQueryDerived].length
                                ? searchQuery[idx][filter.state as keyof SearchQueryDerived].length > 1
                                  ? `${searchQuery[idx][filter.state as keyof SearchQueryDerived].length} selected`
                                  : searchQuery[idx][filter.state as keyof SearchQueryDerived]
                                : `Select ${filter.label}`}
                          </span>
                          <svg
                            className="size-2.5 hs-dropdown-open:rotate-180"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <div
                          className="hs-dropdown-menu duration z-50 mt-2 hidden max-h-56 overflow-auto rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100"
                          aria-labelledby="hs-dropdown-auto-close-inside"
                        >
                          {filter.options?.length
                            ? filter.options?.map((option) => (
                              <div
                                id={option}
                                key={option}
                                className="relative flex cursor-pointer items-start rounded-lg px-3 py-2 hover:bg-gray-100"
                                onClick={(e) => {
                                  const value = e.currentTarget.id;
                                  if (filter.type === "radio") {
                                    setSearchQuery((queries) =>
                                      queries.map((query, index) =>
                                        index === idx
                                          ? { ...query, [filter.state]: value, subCategoryNames: [], skillNames: [] }
                                          : query,
                                      ),
                                    );
                                  } else
                                    setSearchQuery((queries) =>
                                      queries.map((query, index) => {
                                        if (index === idx)
                                          return filter.state === "subCategoryNames"
                                            ? {
                                              ...query,
                                              [filter.state as keyof SearchQueryDerived]: query[
                                                filter.state as keyof SearchQueryDerived
                                              ].includes(value)
                                                ? query[filter.state as keyof SearchQueryDerived].filter(
                                                  (choice) => choice !== value,
                                                )
                                                : [...query[filter.state as keyof SearchQueryDerived], value],
                                              skillNames: [],
                                            }
                                            : {
                                              ...query,
                                              [filter.state as keyof SearchQueryDerived]: query[
                                                filter.state as keyof SearchQueryDerived
                                              ].includes(value)
                                                ? query[filter.state as keyof SearchQueryDerived].filter(
                                                  (choice) => choice !== value,
                                                )
                                                : [...query[filter.state as keyof SearchQueryDerived], value],
                                            };

                                        return query;
                                      }),
                                    );
                                }}
                              >
                                <div className="mt-1 flex h-5 items-center">
                                  <input
                                    id={option}
                                    name={option}
                                    type={filter.type}
                                    checked={
                                      filter.type === "radio"
                                        ? searchQuery[idx][filter.state as keyof SearchQueryPrimitive] === option
                                        : searchQuery[idx][filter.state as keyof SearchQueryDerived].includes(option)
                                    }
                                    className={cx(
                                      "shrink-0 border-gray-200 text-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50",
                                      filter.type === "radio" ? "rounded-full" : "rounded",
                                    )}
                                    value={option}
                                    onChange={(e) => {
                                      const value = e.currentTarget.value;
                                      if (filter.type === "radio") {
                                        setSearchQuery((queries) =>
                                          queries.map((query, index) =>
                                            index === idx ? { ...query, [filter.state]: value } : query,
                                          ),
                                        );
                                      } else
                                        setSearchQuery((queries) =>
                                          queries.map((query, index) =>
                                            index === idx
                                              ? {
                                                ...query,
                                                [filter.state as keyof SearchQueryDerived]: query[
                                                  filter.state as keyof SearchQueryDerived
                                                ].includes(value)
                                                  ? query[filter.state as keyof SearchQueryDerived].filter(
                                                    (choice) => choice !== value,
                                                  )
                                                  : [...query[filter.state as keyof SearchQueryDerived], value],
                                              }
                                              : query,
                                          ),
                                        );
                                    }}
                                  />
                                </div>
                                <label htmlFor={option} className="ms-3.5">
                                  <span className="mt-1 block cursor-pointer text-sm font-semibold text-gray-800">
                                    {option}
                                  </span>
                                </label>
                              </div>
                            ))
                            : Boolean(i) && (
                              <span className="mt-1 block text-sm font-semibold text-gray-800">
                                Please select a {searchFilter[i - 1].label}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchFilters.length > 1 ? (
                    <button
                      type="button"
                      className="mt-8 h-max rounded-full p-2 hover:bg-gray-100"
                      onClick={() => {
                        setSearchQuery((queries) => queries.filter((_, i) => i !== idx));
                        setSearchFilters((filters) => filters.filter((_, i) => i !== idx));
                      }}
                    >
                      <IconCircleMinus color="#29295F" />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {searchFilters.length > 1 ? (
              <>
                <div className="absolute right-[34rem] top-4 h-full w-4 rounded-e-lg border-y-2 border-r-2 border-primary bg-transparent" />
                <div className="flex flex-col">
                  <label htmlFor="Operator" className="ml-2">
                    Operator
                  </label>
                  <div className="hs-dropdown relative z-50 mx-1 mt-1 [--auto-close:inside] sm:mt-1 sm:inline-flex">
                    <button
                      id="hs-dropdown-auto-close-inside"
                      type="button"
                      className="hs-dropdown-toggle inline-flex w-[5.5rem] items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <span className="w-[5.5rem] truncate text-start">{selectedOp}</span>
                      <svg
                        className="size-6 hs-dropdown-open:rotate-180"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <div
                      className="hs-dropdown-menu duration mt-2 hidden max-h-56 overflow-auto rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100"
                      aria-labelledby="hs-dropdown-auto-close-inside"
                    >
                      {operators.map((operator) => (
                        <div
                          id={operator}
                          key={operator}
                          className="relative flex cursor-pointer items-start rounded-lg px-3 py-2 hover:bg-gray-100"
                          onClick={(e) => setSelectedOp(e.currentTarget.id)}
                        >
                          <div className="mt-1 flex h-5 items-center">
                            <input
                              type="radio"
                              className="shrink-0 border-gray-200 text-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                              checked={selectedOp === operator}
                              value={operator}
                              onChange={() => { }}
                            />
                          </div>
                          <label htmlFor={operator} className="ms-3.5">
                            <span className="mt-1 block cursor-pointer text-sm font-semibold text-gray-800">
                              {operator}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            <button
              type="button"
              className="mt-8 h-max rounded-full p-2 hover:bg-gray-100"
              onClick={() => {
                setSearchQuery((queries) => [...queries, query]);
                setSearchFilters((filters) => [...filters, searchFilterer(filters.length)]);
              }}
            >
              <IconCirclePlus color="#29295F" />
            </button>
            <div className="flex flex-col">
              <label htmlFor="SkillLevel" className="ml-2">
                Skill Level
              </label>
              <div className="hs-dropdown relative z-50 mx-1 mt-1 [--auto-close:inside] sm:mt-1 sm:inline-flex">
                <button
                  id="hs-dropdown-auto-close-inside"
                  type="button"
                  className="hs-dropdown-toggle inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:border focus:border-primary disabled:pointer-events-none disabled:opacity-50"
                >
                  {searchCriteria !== null
                    ? skillLevelList?.find((level) => level.value === searchCriteria)?.label
                    : "Select skill level"}
                  <svg
                    className="size-2.5 hs-dropdown-open:rotate-180"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div
                  className="hs-dropdown-menu duration mt-2 hidden max-h-56 overflow-auto rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] hs-dropdown-open:opacity-100"
                  aria-labelledby="hs-dropdown-auto-close-inside"
                >
                  {searchQuery.every((query) => query.skillNames.length) ? (
                    levelList.map((level) => (
                      <div
                        id={level.value.toString()}
                        key={level.label}
                        className="relative flex cursor-pointer items-start rounded-lg px-3 py-2 hover:bg-gray-100"
                        onClick={(e) => setSearchCriteria(Number(e.currentTarget.id))}
                      >
                        <div className="mt-1 flex h-5 items-center">
                          <input
                            type="radio"
                            className="shrink-0 border-gray-200 text-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
                            value={level.value}
                            checked={level.value === searchCriteria}
                            onChange={() => { }}
                          />
                        </div>
                        <label htmlFor={level.label} className="ms-3.5">
                          <span className="mt-1 block cursor-pointer text-sm font-semibold text-gray-800">
                            {level.label}
                          </span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <span className="mt-1 block text-sm font-semibold text-gray-800">
                      {searchQuery.length > 1 ? "Please select a skill for all queries" : "Please select a skill"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={cx(
          "flex h-max flex-col items-center rounded-2xl bg-white px-4 py-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]",
          Boolean(searchResponse?.data?.count && "flex-grow"),
        )}
      >
        {searchResponse?.Status === "OK" ? (
          <h5 className="flex w-full justify-end pb-2 text-sm font-semibold">
            {searchCriteria !== null || debouncedBasicSearch
              ? searchResponse?.data?.count
                ? searchResponse.data?.count > 1
                  ? `${searchResponse.data?.count} matches found`
                  : `${searchResponse.data?.count} match found`
                : "No matches found"
              : null}
          </h5>
        ) : null}
        <div className={cx("w-full overflow-auto", Boolean(searchResponse?.data?.count) && "max-h-[32rem]")}>
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
              {searchCriteria !== null || debouncedBasicSearch
                ? Boolean(searchResponse?.data?.count)
                  ? searchResponse?.data.matches.map((match) => (
                    <tr
                      data-hs-overlay="#hs-vertically-centered-scrollable-modal"
                      key={match.name}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={async () => {
                        if (userData?.skills_master.user?.u_id === match.u_id) return;

                        const response: UserData = await ky(
                          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}/${match.u_id}`,
                        ).json();

                        if (response) setUserData(response);
                      }}
                    >
                      <td className="px-6 py-3 text-start text-sm font-medium capitalize text-gray-600">
                        {match.name}
                      </td>
                      <td className="px-6 py-3 text-start text-sm font-medium capitalize text-gray-600">
                        {match.details.designation.name}
                      </td>
                    </tr>
                  ))
                  : null
                : null}
            </tbody>
          </table>
        </div>
      </div>
      <SearchModal data={userData} />
    </section>
  );
}

export default AdminSearch;
