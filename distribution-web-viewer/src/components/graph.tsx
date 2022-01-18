import React from "react";
import CanvasJSReact from "../canvasJS/canvasjs.react";

class Graph extends React.Component<any, any> {
    CanvasJS: any;
    CanvasJSChart: any;
    chart: any;
    jsonString = this.props.content;
    dataSequences: any = [];

    constructor(props: any) {
        super(props);
        this.generateDataSeries(this.jsonString)
        this.CanvasJS = CanvasJSReact.CanvasJS;
        this.CanvasJSChart = CanvasJSReact.CanvasJSChart;
        this.toggleDataSeries = this.toggleDataSeries.bind(this);
    }

    toggleDataSeries(e: any){
        e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
        this.chart.render();
    }

    generateDataSeries(jsonContent: any) {
        const jsonObject = JSON.parse(jsonContent);
        let dataSequence = []
        for(let i in jsonObject['Samples']) {
            let element = jsonObject['Samples'][i]
            let data = { x: element[1], y: element[2], label: element[0]}
            dataSequence.push(data)
        }
        this.dataSequences.push(dataSequence)



    }

    render() {
        const options = {
            theme: "dark2",
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "TODO"
            },
            subtitles: [{
                text: "Click Legend to Hide or Unhide Data Series"
            }],
            axisX: {
                title: "Rank"
            },
            axisY: { // TODO make second axis
                title: "Number of Views",
                titleFontColor: "#6D78AD",
                lineColor: "#6D78AD",
                labelFontColor: "#6D78AD",
                tickColor: "#6D78AD",
                logarithmic: true
            },
            toolTip: {
                toolTipContent: "{label}, Rank: {x}, Views: {y} "
            },
            legend: {
                cursor: "pointer",
                itemclick: this.toggleDataSeries
            },
            data: [
                {
                    type: "spline",
                    name: "Units Sold", // TODO display file name
                    showInLegend: true,
                    dataPoints: this.dataSequences[0]
                },
            ]
        }


        return (
            <div className={"Graph"}>
                <this.CanvasJSChart options = {options}

                />
                {}
            </div>
        );
    }

}

export default Graph