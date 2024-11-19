export const pieOptions = (labels: string[] | undefined): ApexCharts.ApexOptions => ({
  labels,
  dataLabels: {
    enabled: true,
  },
  noData: {
    text: "Update your skills",
  },
  colors: [
    "#FF9D88",
    "#4DB380",
    "#E64D66",
    "#459CC4",
    "#F48441",
    "#72C5BF",
    "#CC5B8F",
    "#4D80CC",
    "#F16729",
    "#9C63B2",
    "#84D161",
    "#7962C8",
    "#DD93E2",
    "#95CACF",
    "#6666FF",
  ],
  markers: {
    size: 4,
    colors: ["#FFF"],
    strokeColors: "#F16729",
    strokeWidth: 20,
  },
});
