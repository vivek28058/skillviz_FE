import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../../hooks/useData";
import { IconArrowBack, IconBulb } from "@tabler/icons-react";
import ReactApexChart from "react-apexcharts";
import { barOptions, userBarSeries } from "../../../components/Charts/Bar";

function SkillsDistribution() {
  const { data } = useData();

  const { id } = useParams();

  const navigate = useNavigate();

  const categories = data?.skills_master.categories;

  const selectedCategory = categories?.find((category) => category.name === id);

  return (
    <section className="relative flex flex-wrap justify-center rounded-2xl bg-white p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <button className="absolute left-4 top-4 rounded-full p-2 hover:bg-gray-200" onClick={() => navigate(-1)}>
        <IconArrowBack />
      </button>
      <div className="flex w-full flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <IconBulb />
          <h2 className="text-xl capitalize">{selectedCategory?.name} Distribution</h2>
        </div>
        <div className="flex w-full flex-col gap-12 p-4">
          {selectedCategory?.["sub-category"].map((subCategory) => (
            <div
              key={subCategory.name}
              className="flex flex-col gap-8 rounded-[2rem] p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              <h3 className="text-center text-lg capitalize">{subCategory.name} Scores</h3>
              <ReactApexChart
                options={barOptions(4, 1, "", "", 450, ["No", "Beginner", "Intermediate", "Advanced", "Expert"])}
                series={userBarSeries(subCategory)}
                type="bar"
                width="100%"
                height={subCategory.concern.length > 5 ? subCategory.concern.length * 35 : 200}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsDistribution;
