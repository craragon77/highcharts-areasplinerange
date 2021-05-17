import React, {useState} from 'react';
import HighCharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import streamgraph from 'highcharts/modules/streamgraph';
import * as AllTheCharts from 'highcharts/highcharts-more';
import HC_more from 'highcharts/highcharts-more';
import { jStat } from 'jstat';
HC_more(HighCharts);

streamgraph(HighCharts);

export default function ViolinGraphTemplate(){
    //we want to work with option 2
    //function curticy of mekhatria; github repo found here: https://github.com/mekhatria/violin-plot/blob/master/violin-plot.js
    function processViolin(step, precision, densityWidth, ...args) {
      let xiData = [];
      //process the xi
      function prcessXi(args) {
        let tempXdata = [];
        let tileSteps = 6; //Nbr of point at the top and end of the violin
        let min = Infinity,
          max = -Infinity;
    
        //process the range of the data set
        args.forEach((e) => {
          min = Math.min(min, Math.min(...e));
          max = Math.max(max, Math.max(...e));
        });
    
        for (let i = min - tileSteps * step; i < max + tileSteps * step; i++) {
          tempXdata.push(i);
        }
        return tempXdata;
      }
      xiData = prcessXi(args);
    
      //the KDE gaussian function
      function kdeProcess(xi, u) {
        return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(Math.pow(xi - u, 2) / -2);
      }
      let gap = -1;
      //Create the upper and lower line of the violin
      function violinProcess(dataSource) {
        let data = [];
        let N = dataSource.length;
    
        gap++;
        for (let i = 0; i < xiData.length; i++) {
          let temp = 0;
          for (let j = 0; j < dataSource.length; j++) {
            temp = temp + kdeProcess(xiData[i], dataSource[j]);
          }
          data.push([xiData[i], (1 / N) * temp]);
        }
    
        return data.map((violinPoint, i) => {
          if (violinPoint[1] > precision) {
            return [xiData[i], -(violinPoint[1]*densityWidth) + gap, (violinPoint[1]*densityWidth) + gap];
          } else {
            return [xiData[i], null, null];
          }
        });
      }
    
      let results = [];
      let stat = [];
      let index = 0;
    
      args.forEach((e) => {
        results.push([]);
        stat.push([]);
        results[index] = violinProcess(e).slice();
        //Min, Q1, Median, Q3, Max
        stat[index].push(
          Math.min(...e),
          jStat.quartiles(e)[0],
          jStat.quartiles(e)[1],
          jStat.quartiles(e)[2],
          Math.max(...e)
        );
        index++;
      });
      return { xiData, results, stat };
    }
    
      

    const mockDataOne = [
        {
            "number": 1,
            "fruit": "mango"
        }, 
        {
            "number": 2,
            "fruit": "mango"
        },
        {
            "number": 3,
            "fruit": "mango"
        },
        {
            "number": 4,
            "fruit": "mango"
        },
        {
            "number": 5,
            "fruit": "mango"
        },
        {
            "number": 6,
            "fruit": "mango"
        },
        {
            "number": 7,
            "fruit": "banana"
        },
        {
            "number": 1,
            "fruit": "banana"
        },
        {
            "number": 4,
            "fruit": "banana"
        },
        {
            "number": 2,
            "fruit": "banana"
        },
        {
            "number": 1,
            "fruit": "banana"
        },
        {
            "number": 7,
            "fruit": "banana"
        },
    ]

    const mockData2 = [{"resource_component":"Compaction","pct_avgannchange":-100}, {"resource_component":"Compaction","pct_avgannchange":-99.62962962962963}, {"resource_component":"Compaction","pct_avgannchange":-99.27140255009107}, {"resource_component":"Compaction","pct_avgannchange":-99.09297052154194}, {"resource_component":"Compaction","pct_avgannchange":-99.06542056074767}, {"resource_component":"Compaction","pct_avgannchange":-98.19427148194272}, {"resource_component":"Compaction","pct_avgannchange":-97.75641025641025}, {"resource_component":"Compaction","pct_avgannchange":-97.72486772486772}, {"resource_component":"Compaction","pct_avgannchange":-97.62820512820512}, {"resource_component":"Compaction","pct_avgannchange":-97.26156751652503}, {"resource_component":"Compaction","pct_avgannchange":-96.88667496886674}, {"resource_component":"Compaction","pct_avgannchange":-96.59400544959128}, {"resource_component":"Compaction","pct_avgannchange":-96.44670050761421}, {"resource_component":"Compaction","pct_avgannchange":-96.01820250284415}, {"resource_component":"Compaction","pct_avgannchange":-95.79067121729238}, {"resource_component":"Compaction","pct_avgannchange":-95.55822328931572}, {"resource_component":"Compaction","pct_avgannchange":-95.27856468366383}, {"resource_component":"Compaction","pct_avgannchange":-94.25901201602136}, {"resource_component":"Compaction","pct_avgannchange":-94.16180150125103}, {"resource_component":"Compaction","pct_avgannchange":-94.07484407484408}, {"resource_component":"Compaction","pct_avgannchange":-93.97163120567376}, {"resource_component":"Compaction","pct_avgannchange":-93.44262295081967}, {"resource_component":"Compaction","pct_avgannchange":-93.34532374100719}, {"resource_component":"Compaction","pct_avgannchange":-93.32061068702289}, {"resource_component":"Compaction","pct_avgannchange":-93.13253012048193}, {"resource_component":"Compaction","pct_avgannchange":-90.22869022869024}, {"resource_component":"Compaction","pct_avgannchange":-90.05449591280654}, {"resource_component":"Compaction","pct_avgannchange":-88.67469879518072}]

    let mango = [];
    let banana = [];
    let compaction = [];
    function filterData(theData){
        theData.forEach((elem) => {
            if(elem.fruit == "mango"){
                mango.push(elem.number)
            } else if (elem.fruit == "banana"){
                banana.push(elem.number)
            } else if (elem.resource_component == "Compaction"){
              compaction.push(elem.resource_component)
            }
        })
        return mango, banana
    }
    filterData(mockDataOne);

    let step = 1;
    let precision = .0000000000001;
    let width = 1;
    let theData = processViolin(step, precision, width, mango, banana);

    let xi = theData.xiData;
    let stat = theData.stat;
    let formattedMango = theData.results[0];
    let formattedBanana = theData.results[1];

    const [optionTwo, handleOptionTwo] = useState({
        title: {text: 'Test Violin Chart 2'},
        chart: {
            type: 'areasplinerange',
            inverted: true,
            animation: true
        },
        xAxis: {
            reversed: false,
            labels: {format: "{value}"},
        },
        yAxis: {
            // min: 0,
            categories: ["Compaction"],
            startOnTick: false,
            endOnTick: false,
            gridLineWidth: 0,
            max: theData.results.length -1
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
            events: {
              legendItemClick: function (e) {
                e.preventDefault();
              }
            },
            pointStart: xi[0]
          }
        },
        tooltip: {
          useHTML: true,
          valueDecimals: 3,
          formatter: function () {
            return (
              "<b>" +
              this.series.name +
              "</b><table><tr><td>Max:</td><td>" +
              stat[this.series.index][4] +
              " kg</td></tr><tr><td>Q 3:</td><td>" +
              stat[this.series.index][3] +
              " kg </td></tr><tr><td>Median:</td><td>" +
              stat[this.series.index][2] +
              " kg</td></tr><tr><td>Q 1:</td><td>" +
              stat[this.series.index][1] +
              " kg</td></tr><tr><td>Min:</td><td>" +
              stat[this.series.index][0] +
              " kg</td></tr></table>"
            );
          }
        },
        series: [
            {
                name: 'item1',
                color: 'orange',
                data: formattedMango,
            }, 
            {
                name: 'item2',
                color: 'green',
                data: formattedBanana
            }
        ]
    })

    

      
    return(
        <>
            <HighchartsReact
                highcharts={HighCharts}
                constructorType={'chart'}
                options={optionTwo}
            />
        </>
    )
}