import React from "react";
import CanvasJSReact from "../canvasJS/canvasjs.react";

class Graph extends React.Component<any, any> {
    CanvasJS: any;
    CanvasJSChart: any;
    chart: any;

    constructor(props: any) {
        super(props);
        this.generateDataSeries(props.content)
        this.CanvasJS = CanvasJSReact.CanvasJS;
        this.CanvasJS.addColorSet("colorSet",
            [
                "#009FB7",
                "#0A369D",
                "#59FFA0",
                "#688B58",
                "#FED766",
            ]);
        this.CanvasJSChart = CanvasJSReact.CanvasJSChart;
        this.toggleDataSeries = this.toggleDataSeries.bind(this);
    }

    toggleDataSeries(e: any){
        e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
        this.chart.render();
    }

    generateGraphData () {
        let data = [];
        for (let i = 0; i < this.props.content.length; i++) {
            data.push({
                type: "spline",
                name: this.props.titles[i],
                showInLegend: true,
                dataPoints: this.generateDataSeries(this.props.content[i]),
            })
        }
        return data;
    }

    generateDataSeries(jsonContent: any) {
        const jsonObject = JSON.parse(jsonContent);
        let dataSequence = []
        for(let i in jsonObject['Samples']) {
            let element = jsonObject['Samples'][i]
            let data = { x: element[1], y: element[2], label: element[0]}
            dataSequence.push(data)
        }
        return dataSequence
    }

    render() {
        const options = {
            animationEnabled: true,
            exportEnabled: true,
            zoomEnabled: true,
            height: 600,
            backgroundColor: "#272727",
            colorSet: "colorSet",
            axisX: {
                title: "Rank",
                titleFontColor: "#EFF1F3",
                lineColor: "#EFF1F3",
                labelFontColor: "#EFF1F3",
                tickColor: "#EFF1F3",
            },
            axisY: { // TODO make second axis
                title: "Number of Views (log)",
                titleFontColor: "#EFF1F3",
                lineColor: "#EFF1F3",
                labelFontColor: "#EFF1F3",
                tickColor: "#EFF1F3",
                logarithmic: true
            },
            toolTip: {
                toolTipContent: "{label}, Rank: {x}, Views: {y} "
            },
            legend: {
                cursor: "pointer",
                fontColor: "#EFF1F3",
            },
            data: this.generateGraphData()
        }


        return (
            <div className={"Graph"}>
                <this.CanvasJSChart options = {options} onRef={(ref: any) => this.chart = ref}/>
            </div>
        );
    }

}

export default Graph