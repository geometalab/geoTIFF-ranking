import React from "react";
import CanvasJSReact from "../canvasJS/canvasjs.react";

class Graph extends React.Component<any, any> {
    CanvasJS: any;
    CanvasJSChart: any;

    constructor(props: any) {
        super(props);
        this.generateDataSeries(props.content)
        this.CanvasJS = CanvasJSReact.CanvasJS;
        this.CanvasJSChart = CanvasJSReact.CanvasJSChart;
    }

    generateGraphData () {
        let data = [];
        for (let i = 0; i < this.props.content.length; i++) {
            data.push({
                type: "spline",
                name: this.props.titles[i],
                showInLegend: true,
                dataPoints: this.generateDataSeries(this.props.content[i])
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
            theme: "dark2",
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: "TODO"
            },
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
            },
            data: this.generateGraphData()
        }


        return (
            <div className={"Graph"}>
                <this.CanvasJSChart options = {options}/>
            </div>
        );
    }

}

export default Graph