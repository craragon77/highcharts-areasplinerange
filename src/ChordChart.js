import React, {useState, useEffect} from 'react';
import HighCharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import areasplinerange from 'highcharts/highstock';
//import * as areasplinerange from 'highcharts';


export default function ChartTemplate(props){
    const [options, handleOptions] = useState({
        title: {text: 'Test Violin Chart 2'},
        chart: {
            type: 'areasplinerange',
            inverted: true,
            animation: true
        },
        xAxis: {
            reversed: false,
            labels: {format: "{value}"}
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            gridLineWidth: 0,
        },
        plotOptions: {
            series: {
                marker: {
                  enabled: false
                },
                states: {
                  hover: {
                    enabled: false
                  }
                },
              }
        },
        series: [
            {
                name: "Test1",
                data: [[1, 1], [2, 2], [3, 3], [4,4], [5,5], [6,6], [5, 1], [1, 4], [6, 3], [1, 9], [2, 9], [4, 7], [7, 1]],
            },
            {
                name: "Test2",
                data: [[4,4], [5,5], [6,6], [1,1], [2,2], [3,3], [7,1], [2,4], [5,8], [6,1], [8,9], [10,3], [1, 1], [3, 6], [2, 7], [7, 3]],
            }
        ]
    });

    return(
        <HighchartsReact
            highcharts={HighCharts}
            constructorType={'chart'}
            options={options}
        />
    )
};

    

    