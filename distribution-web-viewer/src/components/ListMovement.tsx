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
            title: "Rank difference from " + this.props.titles[0] + " to " + this.props.titles[0],
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
                    offsetArray.push({
                        offset: i-j,
                        text: this.generateLabelText(i,j),
                    })
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
                    x: this.getCleanArray(arrays[i], "offset"),
                    text: this.getCleanArray(arrays[i], "text"),
                    name: position + "-" + (position + arrays[i].length),
                    type: "box",
                    boxpoints: "all"
                }
            )
            position += arrays[i].length
        }
        return traces
    }

    getCleanArray(array: any[], key: string) {
        // Takes an array of objects, outputs an array only containing one key
        let outputArray = []
        for(let i in array) {
               outputArray.push(array[i][key])
        }
        return outputArray
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

    generateLabelText(i: number, j: number) {
        // Should output the following string:
        //  (qrank id or qtag)<br>
        //  (file 1 import mode) Rank: (rank)<br>
        //  (file 2 import mode) Rank: (rank)<br>
        let text = ""
        let counterPart = ""
        if(this.props.importMode[0] === "QRank") {
            text = this.json1[this.arrayKey1][i]['properties']['wikidata']
            counterPart = this.json1[this.arrayKey1][i]['properties']['@id']
        } else if(this.props.importMode[0] === "OSM") {
            text = this.json2[this.arrayKey2][j]['properties']['@id']
            counterPart = this.json1[this.arrayKey1][i]['properties']['wikidata']
        }
        if(text === "") {
            text = "Import mode " + this.props.importMode[0]
        } else {
            text += "<br>" + this.props.importMode[0] + " Rank: " + (i + 1) +
                    "<br>" + this.props.importMode[1] + " Rank: " + (j + 1) +
                    "<br>" + "Counterpart: " + counterPart
        }
        return text
    }

    onClickHandler = (e: any) => {
        let text: string = e.points[0].text
        let subtext = text.substring(0, text.indexOf("<"))
        this.launchLink(subtext)
        if(text.includes("Counterpart: ")) {
            this.launchLink(text.substring(text.indexOf("Counterpart: ") + 13))
        }
    }

    launchLink (label: string) {
        if(label.startsWith("Q")) {
            window.open("https://www.wikidata.org/wiki/" + label, "_blank")
        } else if (label.startsWith("way/") || label.startsWith("node/") || label.startsWith("relation/")) {
            window.open("https://www.openstreetmap.org/" + label, "_blank")
        }
    }

    render() {
        // @ts-ignore
        return <Plot data={this.generateGraph()} layout={this.layout} onClick={this.onClickHandler}/>
    }
}

export default ListMovement