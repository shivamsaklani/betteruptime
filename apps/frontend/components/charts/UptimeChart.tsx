"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement,Tooltip,Legend);
export default function UptimeChart({uptimedata}:{
  uptimedata:number[]
}) {
  console.log(uptimedata);
    const options = {
        responsive:true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: false,
      text: 'Uptime',
    },
  },
};
 const data = {
    labels:["Up","Down","Degraded"],
    datasets:[
        {
        data: uptimedata,
      backgroundColor: [
        'rgba(38, 219, 35, 1)',
        'rgba(255, 7, 102, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderColor: [
        'rgba(38, 219, 35, 1)',
        'rgba(255, 7, 102, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 5,
        }
    ]
    
 }

    return(
        <Doughnut options={options}  data={data}/>
    )
}