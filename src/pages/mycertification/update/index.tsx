import { IconEdit } from "@tabler/icons-react";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../hooks/useData";
import ky from "ky";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useQuery } from "../../../hooks/useQuery";
import { Certification } from "../../../types/Certificate";
import { useImmer } from "use-immer";

const certificateForm = [
  { label: "Certification", type: "select" },
  { label: "Date of Completion", type: "datepicker" },
  { label: "Acquired", type: "switch" },
];

function UpdateCertification() {
  const navigate = useNavigate();

  const params = useQuery();

  const certificateIdx = params.get("certificate");

  const { type } = useParams();

  const { data, setData } = useData();

  const certifications = data?.skills_master.certifications;

  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [certification, setCertification] = useImmer<Certification>(certifications);

  const [acquired, setAcquired] = useState<boolean>(false);

  const [doc, setDOC] = useState<DateValueType>({ startDate: null, endDate: null });

  const updateDate = (value: { startDate: string | null | Date; endDate: string | null | Date } | null) => {
    if (value) {
      setDOC({ startDate: value?.startDate, endDate: value?.endDate });
    }
  };

  useEffect(() => {
    setCertification(certifications);
  }, [certifications]);

  useEffect(() => {
    if (certificateIdx && data?.skills_master.certifications?.[+certificateIdx]) {
      setSelectedCertificate(data?.skills_master.certifications[+certificateIdx].c_name);
      setAcquired(data.skills_master.certifications[+certificateIdx].acquired ?? false);
    }

    const updatedCertificate = certification?.find((_, idx) => idx === Number(certificateIdx));
    if (updatedCertificate?.acquired) setDOC({ startDate: updatedCertificate.doc, endDate: updatedCertificate.doc });
  }, [certifications]);

  useEffect(() => {
    setCertification((draft) =>
      draft?.forEach((certificate) => {
        if (certificate.c_name === selectedCertificate) {
          certificate.acquired = acquired;
          if (!acquired) certificate.doc = "-";
        }
        return certificate;
      }),
    );
  }, [acquired]);

  useEffect(() => {
    if (doc?.startDate)
      setCertification((draft) =>
        draft?.forEach((certificate) => {
          if (certificate.c_name === selectedCertificate) {
            certificate.doc = doc.startDate as string;
          }
          return certificate;
        }),
      );
  }, [doc?.startDate]);

  return (
    <section className="flex min-w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex items-center gap-2">
        <IconEdit />
        <h2 className="text-xl capitalize">{type} Your Certificate</h2>
      </div>
      <div className="flex flex-col gap-8 px-16 py-8">
        <div className="flex flex-col gap-4">
          {certificateForm.map((field) => (
            <div key={field.label}>
              <label htmlFor={field.label} className="block text-base font-semibold dark:text-white">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={field.label}
                  className="block w-1/3 rounded-lg border-gray-200 px-4 py-3 pe-9 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                  value={selectedCertificate}
                  onChange={(e) => {
                    const updatedCertificate = certification?.find(
                      (certificate) => certificate.c_name === e.target.value,
                    );
                    if (updatedCertificate?.acquired)
                      setDOC({ startDate: updatedCertificate.doc, endDate: updatedCertificate.doc });
                    else setDOC({ startDate: null, endDate: null });
                    setSelectedCertificate(e.target.value);
                    setCertification((draft) =>
                      draft?.forEach((certificate) => {
                        if (certificate.c_name === e.target.value) {
                          certificate.acquired = false;
                        }
                        return certificate;
                      }),
                    );
                  }}
                >
                  {data?.skills_master.certifications?.map((certificate) => (
                    <option key={certificate.c_name}>{certificate.c_name}</option>
                  ))}
                </select>
              ) : field.type === "datepicker" ? (
                <div className="w-max">
                  <Datepicker
                    asSingle={true}
                    startFrom={doc?.startDate ? new Date(doc.startDate) : null}
                    maxDate={new Date()}
                    value={doc}
                    displayFormat={"MMM DD, YYYY"}
                    onChange={updateDate}
                    useRange={false}
                  />
                </div>
              ) : (
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="hs-large-switch-soft-with-icons"
                    className="peer relative h-9 w-[4.25rem] shrink-0 cursor-pointer rounded-full border border-gray-200 bg-gray-100 p-px text-transparent transition-colors duration-200 ease-in-out before:inline-block before:h-8 before:w-8 before:translate-x-0 before:transform before:rounded-full before:bg-white before:ring-0 before:transition before:duration-200 before:ease-in-out checked:border-green-200 checked:bg-none checked:text-green-100 checked:before:translate-x-full checked:before:bg-green-600 focus:ring-green-600 focus:checked:border-green-200 disabled:pointer-events-none disabled:opacity-50"
                    checked={acquired}
                    onChange={(e) => setAcquired(e.target.checked)}
                  />
                  <label htmlFor="hs-large-switch-soft-with-icons" className="sr-only">
                    {field.label}
                  </label>
                  <span className="pointer-events-none absolute start-1 top-1.5 flex size-8 items-center justify-center text-gray-500 transition-colors duration-200 ease-in-out peer-checked:text-blue-600">
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
                  </span>
                  <span className="pointer-events-none absolute end-1 top-1.5 flex size-8 items-center justify-center transition-colors duration-200 ease-in-out peer-checked:text-white">
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
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="flex items-center justify-center rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={() => navigate("/my-certification")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-7 py-2 text-sm text-white hover:brightness-125"
            onClick={async () => {
              const json = {
                skills_master: {
                  ...data?.skills_master,
                },
              };

              json.skills_master.certifications = certification;

              console.debug("my-certification", certification);

              const response: { Status: string } = await ky
                .post(
                  `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_API_ENDPOINT}${import.meta.env.VITE_USERS_CERTIFICATES_API}/${data?.skills_master.user?.u_id}`,
                  { json },
                )
                .json();

              if (response.Status === "OK") {
                localforage.setItem("userData", json);
                setData({ skills_master: json.skills_master });
                navigate("/my-certification");
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
}

export default UpdateCertification;
