import React from 'react';
import Plot from 'react-plotly.js';

const layout: any = {
    xaxis: {
        type: 'linear',
        autorange: true
    },
    yaxis: {
        type: 'log',
        autorange: true
    }
}

class Chart extends React.Component<any, any> {
    data = null



    generateGraph(): any {
        let data = []
        for (let i = 0; i < this.props.fileContent.length; i++) {
            data.push(this.generateDataSeries(this.props.fileContent))
        }
        console.log(data)
        return data;
    }

    generateDataSeries (jsonContent: any) {
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
            let data
            switch (this.props.importMode) {
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
            }
        }
        return {
            x: x,
            y: y,
            type: "scatter"
        };
    }

    render() {
        return <Plot data={this.generateGraph()} layout={layout}/>
    }

}

export default Chart;