import React, {useEffect} from "react";
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
        for (let i = 0; i < this.props.content.length; i++) {
            data.push({
                type: "spline",
                click: this.onClick,
                toolTipContent: "Rank: {x}, Views: {y}, " +
                    "<a rel='noreferrer' href='https://www.wikidata.org/wiki/{label}'>{label}</a>",
                name: this.props.titles[i],
                dataPoints: this.generateDataSeries(this.props.content[i]),
            })
        }
        return data;
    }

    getCustomArrayKey = (jsonObject: any) => {
        let arrayKey;
        arrayKey = prompt("Could not find array of objects in json. Please enter the key which contains the array to analyze.") ?? "";
        console.log(arrayKey)
        if(!(arrayKey in jsonObject)) {
            console.error("Could not find any matching keys")
        }
        return arrayKey;
    }

    generateDataSeries(jsonContent: any) {
        const jsonObject = JSON.parse(jsonContent);

        let arrayKey = ""
        let possibleKeys = [
            "samples",
            "Samples",
            "features",
            "Features"
        ]
        for (let i in possibleKeys) {
            if (possibleKeys[i] in jsonObject) {
                arrayKey = possibleKeys[i];
            }
        }

        if(arrayKey === "") {
            arrayKey = this.getCustomArrayKey(jsonObject)
        }

        let dataSequence = []
        for(let i in jsonObject[arrayKey]) {
            let element = jsonObject[arrayKey][i]
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