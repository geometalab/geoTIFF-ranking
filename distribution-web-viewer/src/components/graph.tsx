import React, {useEffect} from "react";
import CanvasJSReact from "../canvasJS/canvasjs.react";

class Graph extends React.Component<any, any> {
    CanvasJS: any;
    CanvasJSChart: any;
    chart: any;

    constructor(props: any) {
        super(props);
        this.CanvasJS = CanvasJSReact.CanvasJS;
        this.CanvasJS.addColorSet("colorSet",
            [
                "#D81B60",
                "#1E88E5",
                "#FFC107",
                "#004D40",
                "#ff6f46",
            ]);
        this.CanvasJSChart = CanvasJSReact.CanvasJSChart;
        this.toggleDataSeries = this.toggleDataSeries.bind(this);
    }

    toggleDataSeries(e: any){
        e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
        this.chart.render();
    }

    onClick (e: any) {
        window.open("https://www.wikidata.org/wiki/" + e.dataPoint.label, "_blank")
    }

    generateGraphData () {
        let data = [];
        for (let i = 0; i < this.props.state.fileContents.length; i++) {
            data.push({
                type: "spline",
                click: this.onClick,
                toolTipContent: "{label}, Rank: {x}, Views: {y}",
                name: this.props.state.fileNames[i],
                dataPoints: this.generateDataSeries(i),
            })
        }
        return data;
    }

    generateDataSeries(i: any) {
        const jsonObject = JSON.parse(this.props.state.fileContents[i]);
        let dataSequence = []
        for(let y in jsonObject[this.props.state.contentKeys]) {
            let element = jsonObject[this.props.state.contentKeys[i]][y]
            let data = { x: element[this.props.state.selectedKeyRank], y: element[this.props.state.selectedKeyViews], label: element[this.props.state.selectedKeyLabel]}
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