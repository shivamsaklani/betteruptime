"use client"
import {Line} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function ResponseChart({labels, responsedata}:{
  labels:string[],
  responsedata: number[],
}){
  const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: 'Uptime',
    },
  },
};

const data = {
  labels,
  datasets: [
    {
      fill: true,
      data: responsedata,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132,0.5)'
    },
  ],
  maintainAspectRatio: false
};

    return( 
        <div className="w-full h-100 mt-10">
  <Line options={options} data={data} />
</div>


    )
}