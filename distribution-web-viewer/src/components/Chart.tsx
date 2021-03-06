import React from 'react';
import Plot from 'react-plotly.js';

class Chart extends React.Component<any, any> {
    data = null

    layout: any = {
        xaxis: {
            title: 'Rank',
            type: 'linear',
            autorange: true,
            automargin: true,
            rangemode: "tozero",
        },
        yaxis: {
            title: 'Views (log)',
            type: 'log',
            autorange: true,
            automargin: true,
        },
        showlegend: true,
        legend: {
            x: 1,
            xanchor: 'right',
            y: 1
        },
        width: 1200,
        height: 700,
        paper_bgcolor: '#EFF1F3',
        plot_bgcolor: '#EFF1F3',
        title: "Views vs Rank distribution",
    }

    generateGraph(): any {
        let data = []
        for (let i = 0; i < this.props.fileContent.length; i++) {
            data.push(this.generateDataSeries(this.props.fileContent[i], this.props.titles[i], this.props.importMode[i]))
        }
        return data;
    }

    generateDataSeries (jsonContent: any, fileName: string, importMode: string) {
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

        let x = []
        let y = []
        let text = []
        for(let i in jsonObject[arrayKey]) {
            let element = jsonObject[arrayKey][i]
            switch (importMode) {
                case 'Array':
                    x.push(element[1])
                    y.push(element[2])
                    if(Array.isArray(element[0])) {
                        let temp = ""
                        let y: any
                        for(y in element[0]) {
                            temp += element[0][y]
                            if (y + 1 < element[0].length) {
                                temp += "/"
                            }
                        }
                        text.push(temp)
                    } else {
                        text.push(element[0])
                    }
                    break
                case 'QRank':
                    x.push(element['properties']['qrank_rank'])
                    y.push(element['properties']['qrank'])
                    text.push(element['properties']['wikidata'])
                    break
                case 'OSM':
                    x.push(element['properties']['osm_views_rank'])
                    y.push(element['properties']['tile_count'])
                    text.push(element['properties']['@id'])
                    break
                case 'Rank':
                    x.push(element['properties']['rank_rank'])
                    y.push(element['properties']['rank'])
                    text.push(element['properties']['@id'])
                    break
                default:
                    console.error("Fallthrough in switch.")
            }
        }
        return {
            x: x,
            y: y,
            text: text,
            type: "scatter",
            name: fileName
        };
    }

    onClickHandler = (e: any) => {
        let text: string = e.points[0].text
        let link = ""
        if(text.startsWith("Q")) {
            link = "https://www.wikidata.org/wiki/"
        } else if (text.startsWith("way/") || text.startsWith("node/") || text.startsWith("relation/")) {
            link = "https://www.openstreetmap.org/"
        } else if (RegExp("[+-]?([0-9]*[.])?[0-9]+\\/[+-]?([0-9]*[.])?[0-9]+").test(text)) {
            link = "https://www.openstreetmap.org/#map=16/"
        }
        if(link !== "") {
            window.open(link + text, "_blank")
        }
    }

    render() {
        return <Plot data={this.generateGraph()} layout={this.layout} onClick={this.onClickHandler}/>
    }

}

export default Chart;