import { Categories } from "../../../types/Categories";

export const adminColumnSeries = (
  data: Array<{ name: string; actual_score: number; total_score: number }> | undefined,
) => {
  return [
    {
      name: "Actual",
      data: data
        ? data?.map((value) => ({
          x: value.name.split(" ") ?? "",
          y: value.actual_score ?? "",
          goals: [
            {
              name: "Expected",
              value: value.total_score ?? "",
              strokeHeight: 5,
              strokeColor: "#775DD0",
            },
          ],
        }))
        : [null],
    },
  ];
};

export const userColumnSeries = (categories: Categories) => {
  return [
    {
      name: "My Score",
      data: categories
        ? categories?.map((category) => ({
          x: category.name.split(" ") ?? "",
          y: category.my_score ?? "",
          goals: [
            {
              name: "Total Score",
              value: category.total_score ?? "",
              strokeHeight: 5,
              strokeColor: "#775DD0",
            },
          ],
        }))
        : [null],
    },
  ];
};

export const columnOptions = (customLegendItems: string[], callback?: Function): ApexCharts.ApexOptions => ({
  chart: {
    events: {
      xAxisLabelClick(e) {
        if (callback) callback(e?.target?.parentElement?.lastChild?.innerHTML);
      },
      dataPointMouseEnter: function (event) {
        event.target.style.cursor = "pointer";
      },
      dataPointSelection(_, __, options) {
        if (callback) callback(options?.w?.config?.series[0]?.data[options?.dataPointIndex].x.join(" "));
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "70%",
      borderRadius: 6,
      borderRadiusApplication: "end",
    },
  },
  colors: ["#00E396"],
  dataLabels: {
    enabled: true,
    style: { colors: ["#29295F"] },
  },
  xaxis: {
    labels: {
      trim: true,
      style: {
        fontWeight: 600,
      },
    },
  },
  legend: {
    show: true,
    showForSingleSeries: true,
    customLegendItems,
    markers: {
      fillColors: ["#00E396", "#775DD0"],
    },
  },
});
