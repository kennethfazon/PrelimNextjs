import Chart from "chart.js/auto";
import { useState, useEffect, useRef } from "react";

export default function LineChart() {
  const chartRef = useRef(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalTodos, setTotalTodos] = useState(0);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(json => {
        setTotalTodos(json.length);
      });

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => {
        setTotalUsers(json.length);
      });

    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => {
        setTotalPosts(json.length);
      });

    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(response => response.json())
      .then(json => {
        setTotalComments(json.length);
      });
  }, []);

  useEffect(() => {
    const labels = ['Users', 'Posts', 'Comments', 'Todos'];
    const data = [totalUsers, totalPosts, totalComments, totalTodos];

    const datasets = [
      {
        label: 'Count',
        fill: false,
        backgroundColor: "#fff",
        borderColor: "#fff",
        data: data,
      },
    ];

    const config = {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Sales Charts",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                color: "rgba(255,255,255,.7)",
              },
              display: true,
              title: {
                display: false,
                text: "Month",
                color: "white",
              },
              grid: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                color: "rgba(255,255,255,.7)",
              },
              display: true,
              title: {
                display: false,
                text: "Value",
                color: "white",
              },
              grid: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };


    const ctx = chartRef.current.getContext("2d");

    if (window.myLine) {
      window.myLine.destroy();
    }

    window.myLine = new Chart(ctx, config);
  }, [totalUsers, totalPosts, totalComments, totalTodos]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                Overview
              </h6>
              <h2 className="text-white text-xl font-semibold">Counts</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="line-chart" ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </>
  );
}