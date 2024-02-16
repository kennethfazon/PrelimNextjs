'use client'
import Chart from "chart.js/auto";
import { useState, useEffect, useRef } from "react";

export default function BarChart() {
  const chartRef = useRef(null);
  const [allTodos, setAllTodos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(json => {
        setAllTodos(json);
      });
  }, []);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => {
        setAllUsers(json);
      });
  }, []);

  useEffect(() => {
    // Calculate total TODOS for each user
    const todosByUser = allTodos.reduce((todos, todo) => {
      const userId = todo.userId;
      todos[userId] = (todos[userId] || 0) + 1;
      return todos;
    }, {});

    // Prepare data for the chart
    const labels = Object.keys(todosByUser).map(userId => {
      const user = allUsers.find(user => user.id === parseInt(userId));
      return user ? user.name : `User ${userId}`;
    });

    const data = Object.values(todosByUser);

    let config = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total TODOS",
            fill: false,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: data,
            barThickness: 15,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Total TODOS by User",
        },
      },
    };

    let ctx = chartRef.current.getContext("2d");

  
    if (window.myBar) {
      window.myBar.destroy();
    }

    window.myBar = new Chart(ctx, config);
  }, [allTodos, allUsers]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                Performance
              </h6>
              <h2 className="text-blueGray-700 text-xl font-semibold">
                Total TODOS by User
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="bar-chart" ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </>
  );
}