export const radarOptions = (categories: Array<Array<string>> | Array<string>, size?: number): ApexCharts.ApexOptions => ({
  chart: {
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
    formatter(val) {
      if (val instanceof Array) return val[0];
      return val ?? "Update your skills";
    },
  },
  plotOptions: {
    radar: {
      size: size ?? 250,
      polygons: {
        strokeColors: "#E9E9E9",
        fill: {
          colors: ["#F8F8F8", "#FFF"],
        },
      },
    },
  },
  colors: ["#F16729"],
  markers: {
    size: 4,
    colors: ["#FFF"],
    strokeColors: "#F16729",
    strokeWidth: 4,
  },
  tooltip: {
    y: {
      formatter: function (val: any) {
        return `${val}%`;
      },
    },
  },
  xaxis: {
    categories,
    labels: {
      style: {
        colors: new Array(categories.length).fill("#29295F"),
        fontSize: "14px",
        fontWeight: 600,
      },
    },
  },
  yaxis: {
    tickAmount: 10,
    max: 100,
    labels: {
      formatter: function (val: any, i: number) {
        if (i % 2 === 0) {
          return Boolean(val) ? `${val}%` : "";
        } else {
          return "";
        }
      },
    },
  },
});

export const radarSeries = (data: any) => [{ name: "Score", data }];
