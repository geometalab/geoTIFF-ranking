import React from "react";
import Plot from "react-plotly.js";

class ListMovement extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.generateGraph()
    }

    json1:any = {}
    json2: any = {}
    arrayKey1 = ""
    arrayKey2 = ""

    layout: any = {
        width: 1200,
        height: 700,
        paper_bgcolor: '#EFF1F3',
        plot_bgcolor: '#EFF1F3',
        title: "Deviations between the two Sets",
        xaxis: {
            title: "Rank difference from " + this.props.titles[0] + " to " + this.props.titles[0]
        },
        yaxis: {
            title: "Rank in " + this.props.titles[0],
            autorange: "reversed"
        },

    }

    generateGraph () {
        let array = this.generateArray()
        let arrays = this.splitArray(array)
        return this.generateTraces(arrays)
    }

    generateArray(): any {
        if(this.props.fileContent.length !== 2) {
            console.error("More or less than two files loaded.")
        }
        this.json1 = JSON.parse(this.props.fileContent[0]);
        this.json2 = JSON.parse(this.props.fileContent[1]);

        this.arrayKey1 = this.getArrayKey(this.json1)
        this.arrayKey2 = this.getArrayKey(this.json2)

        if(this.json1[this.arrayKey1].length !== this.json2[this.arrayKey2].length) {
            console.error("Two lists are not the same length.")
        }

        // Loop through json1, for each element loop through json2 until element found, calculate offset and push to array
        let offsetArray = []
        for(let i = 0; i < this.json1[this.arrayKey1].length; i++) {
            let id = this.json1[this.arrayKey1][i]['properties']['@id']
            let found = false
            let j = 0
            while(!found) {
                if(this.json2[this.arrayKey2][j]['properties']['@id'] === id) {
                    offsetArray.push(i-j)
                    found = true
                }
                j++
            }
        }
        return offsetArray
    }

    generateTraces(arrays: any) {
        let traces = []
        let position = 1;
        for(let i in arrays) {
            traces.push(
                {
                    x: arrays[i],
                    name: position + "-" + (position + arrays[i].length),
                    type: "box",
                    boxpoints: "all"
                }
            )
            position += arrays[i].length
        }
        return traces
    }

    getArrayKey(jsonObject: any) {
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
        return arrayKey
    }

    splitArray(inputArray: any) {
        let outputArray = []
        let numberOfSections = 5
        let chunk = Math.round(inputArray.length / numberOfSections)
        let i = 0
        while (i < inputArray.length) {
            outputArray.push(inputArray.slice(i, i + chunk))
            i = i + chunk + 1;
        }
        return outputArray
    }

    render() {
        // @ts-ignore
        return <Plot data={this.generateGraph()} layout={this.layout}/>
    }
}

export default ListMovement