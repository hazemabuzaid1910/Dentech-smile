"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const options: ChartOptions<"bar"> = {
  responsive: true,
    maintainAspectRatio: false,

  plugins: {
    legend: { position: "top" as const },
    title: {
      display: true,
      text: "doctors Number ",
    },
  },
  elements: {
    bar: {
      borderRadius: 50,
    },
  },
 scales: {
  x: {
     border: {
        display: false
      },
      
    grid: {

         display: false, 
        
    },
    ticks: {
      display: true, 
      padding: 15,
      
    },
  },
  y: {
     border: {
        display: false 
      },
    grid: {
    color: "#afafaf1f",          // لون الخطوط

      display: true,
    },
    ticks: {
      display: true,
      padding: 10,
    },
  },
},

};


const labels = ["January", "February", "March", "April", "May", "June"];


const data: ChartData<"bar"> = {
  labels,
  datasets: [
    {
      label: "male",
      data: [30, 40, 20, 50, 80, 70,60],
      backgroundColor: "#35B7E8",
      borderColor:"#35B7E8",
      borderWidth: 1,
      barThickness: 10,
      categoryPercentage: 0.6, // المسافة بين الأعمدة
      barPercentage: 0.8, // عرض الشريط نسبة إلى الفئة


    },
     {
      label: "female",
      data: [30, 45, 28, 50, 60, 70],
      backgroundColor: "#8DE5DB",
      borderColor: "#8DE5DB",
      borderWidth: 1,
      barThickness: 10,
      categoryPercentage: 0.6, // المسافة بين الأعمدة
      barPercentage: 0.8,

    },
  ],
};

export default function MyChart() {
  return (
  <div className="w-full h-full">
  <Bar options={options} data={data} />
  </div>)
}
