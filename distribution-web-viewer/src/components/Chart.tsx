import React from 'react';
import Plot from 'react-plotly.js';

class Chart extends React.Component<any, any> {
    data = null

    layout: any = {
        xaxis: {
            type: 'linear',
            autorange: true
        },
        yaxis: {
            type: 'log',
            autorange: true
        },
        width: 1200,
        height: 700,
        paper_bgcolor: '#EFF1F3',
        plot_bgcolor: '#EFF1F3',
    }

    generateGraph(): any {
        let data = []
        for (let i = 0; i < this.props.fileContent.length; i++) {
            data.push(this.generateDataSeries(this.props.fileContent[i], this.props.importMode[i]))
        }
        console.log(data)
        return data;
    }

    generateDataSeries (jsonContent: any, importMode: string) {
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
        for(let i in jsonObject[arrayKey]) {
            let element = jsonObject[arrayKey][i]
            switch (importMode) {
                case 'Array':
                    x.push(element[1])
                    y.push(element[2])
                    // data = { x: element[1], y: element[2], label: element[0]}
                    break
                case 'QRank':
                    x.push(element['properties']['qrank_rank'])
                    y.push(element['properties']['qrank'])
                    // data = { x: element['properties']['qrank_rank'], y: Number.parseInt(element['properties']['qrank']), label: element['properties']['wikidata']}
                    break
                case 'OSM':
                    x.push(element['properties']['osm_views_rank'])
                    y.push(element['properties']['tile_count'])
                    // data = { x: element['properties']['osm_views_rank'], y: Number.parseInt(element['properties']['tile_count']), label: element['properties']['@id']}
                    break
                default:
                    console.error("Fallthrough in switch.")
            }
        }
        return {
            x: x,
            y: y,
            type: "scatter"
        };
    }

    render() {
        return <Plot data={this.generateGraph()} layout={this.layout}/>
    }

}

export default Chart;