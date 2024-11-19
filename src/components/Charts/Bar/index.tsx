import { SubCategory } from "../../../types/Categories";

export const adminBarSeries = (data: Array<{ x: string; y: number }>) => [
  {
    name: "Scored Employees",
    data,
  },
];

export const userBarSeries = (subCategory: SubCategory) => [
  {
    name: "Score",
    data: subCategory
      ? subCategory.concern.map((concern) => ({
        x: concern.name ?? "",
        y: concern.score ?? "",
      }))
      : [null],
  },
];

export const stackedOptions = (categories: any, text: string, horizontal: boolean = true): ApexCharts.ApexOptions => ({
  chart: {
    stacked: true,
    stackType: "100%",
  },
  plotOptions: {
    bar: {
      barHeight: 14,
      borderRadius: 4,
      borderRadiusApplication: "end",
      horizontal,
    },
  },
  colors: ["#FF6A80", "#FEC047", "#AD9EE3", "#97D2FF", "#00E396"],
  dataLabels: {
    enabled: horizontal,
    formatter(val) {
      return Boolean(val) ? Number(val).toFixed(2) + "%" : "";
    },
    style: {
      colors: ["#29295F"],
    },
  },
  title: {
    text,
    style: { fontSize: "16px" },
    offsetX: 40,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " employee(s)";
      },
    },
  },
  xaxis: {
    categories,
    labels: {
      hideOverlappingLabels: true,
      style: {
        fontWeight: 600,
      },
      rotate: -75,
    },
  },
  yaxis: {
    labels: {
      maxWidth: 200,
      style: {
        fontSize: "14px",
        fontWeight: 600,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: horizontal ? "right" : "bottom",
  },
});

export const barOptions = (
  tickAmount?: number,
  stepSize?: number,
  text?: string,
  dataLabel?: string,
  maxWidth?: number,
  xAxisLabels?: Array<string>,
): ApexCharts.ApexOptions => ({
  plotOptions: {
    bar: {
      barHeight: 14,
      borderRadius: 4,
      borderRadiusApplication: "end",
      horizontal: true,
    },
  },
  colors: ["#00E396"],
  dataLabels: {
    enabled: true,
    style: { colors: ["#29295F"] },
    offsetX: dataLabel ? dataLabel.length * 3.5 : 0,
    formatter(val: string | number) {
      return dataLabel ? val + dataLabel : val;
    },
  },
  title: {
    text,
    style: { fontSize: "16px" },
    offsetX: 40,
  },
  xaxis: {
    tickAmount,
    stepSize,
    labels: {
      formatter: function (val: any) {
        return xAxisLabels ? xAxisLabels[val] : val;
      },
    },
  },
  yaxis: {
    labels: {
      maxWidth,
      style: {
        fontSize: "14px",
        fontWeight: 600,
      },
    },
  },
});
