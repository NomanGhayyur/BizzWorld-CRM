import {useState} from 'react';
import styles from './barchart.module.css'
import {  Bar } from 'react-chartjs-2';
import {Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler} from 'chart.js';
import Card from '../shared/Card';


function Barchart() {

  return (
    <div className='container pb-3'>
        <Bar
        data={{
          labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: '',
              boxWidth: 0,
              data: [12, 19, 3, 5, 2, 3,12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
              barThickness:20
            },
            // {
            //   label: 'Quantity',
            //   data: [47, 52, 67, 58, 9, 50],
            //   backgroundColor: 'orange',
            //   borderColor: 'red',
            // },
          ],
        }}
        height={400}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            y:{

            },
            x:{

            }
          },

          plugins:{
            legend: {
              labels: {
                fontSize: 25,
                boxWidth:0
              },
            },
          }



        }}
      />


    </div>
  );
}

export default Barchart;