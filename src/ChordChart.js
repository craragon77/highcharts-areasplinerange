import React, {useState} from 'react';
import HighCharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import streamgraph from 'highcharts/modules/streamgraph';
import * as AllTheCharts from 'highcharts/highcharts-more';
import HC_more from 'highcharts/highcharts-more';
import {jStat} from 'jStat';
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
          /*THIS PART IS THE PROBLEM; JSTAT IS UUNDEFINED*/
          //Min, Q1, Median, Q3, Max
          console.log(jStat)
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

    let mango = [];
    let banana = [];

    function filterData(theData){
        theData.forEach((elem) => {
            if(elem.fruit == "mango"){
                mango.push(elem.number)
            } else if (elem.fruit == "banana"){
                banana.push(elem.number)
            }
        })
        return mango
    }
    filterData(mockDataOne);

    let step = 1;
    let precision = .0000000000001;
    let width = 3;
    let theData = processViolin(step, precision, width, mango, banana);

    let xi = theData.xiData;
    let stat = theData.stat;
    let formattedMango = theData.results[0];
    let formattedBanana = theData.results[1];

    const [optionTwo, handleOptionTwo] = useState({
        title: {text: 'Test Violin Chart 2'},
        chart: {
            type: AllTheCharts.areasplinerange,
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
                pointStart: xi[0]
              }
        },
        series: [
            {
                name: 'Mango',
                color: 'orange',
                data: formattedMango,
            }, 
            {
                name: 'Banana',
                color: 'gold',
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