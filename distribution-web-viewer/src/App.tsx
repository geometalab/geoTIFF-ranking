import React from 'react';
import "./App.css"
import PreviewWindow from "./components/previewWindow";
import UploadButton from "./components/uploadButton";
import Graph from "./components/graph"
import KeyDropdown from "./components/dropdown";


class App extends React.Component<any, any>{

    handleCallback = (childData: any, childName: any) => {
        this.setState({
            fileNames: this.state.fileNames.concat(childName),
            fileContents: this.state.fileContents.concat(childData)
        })
    }


  state = {
        fileNames: [],
        fileContents: [],
        contentKeys: [] as any,
        availableKeys: [],
        selectedKeyRank: 0,
        selectedKeyViews: 0,
        selectedKeyLabel: 0,
  }

    getCustomArrayKey = (jsonObject: any) => {
        let arrayKey;
        arrayKey = prompt("Could not find array of objects in json. Please enter the key which contains the array to analyze.") ?? "";
        if(!(arrayKey in jsonObject)) {
            console.error("Could not find any matching keys")
        }
        return arrayKey;
    }

    getArrayKey(jsonObject : any) {
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

        this.setState({contentKeys: this.state.contentKeys.concat(arrayKey),})
    }

  getAvailableKeys () {
    for(let i in this.state.fileContents) {
        const jsonObject = JSON.parse(this.state.fileContents[i]);
        this.getArrayKey(jsonObject)

        console.log(jsonObject[this.state.contentKeys[i]])
        for(let y in jsonObject[this.state.contentKeys[i]]) {
        }
    }
  }

  render() {
    this.getAvailableKeys()
    let graph: any;
    if(this.state.fileContents.length === 0) {
        graph = <p>No file selected</p>
    } else {
        graph = <div>
            <Graph state={this.state}/>

        </div>
    }

    return (
        <div className={"App"}>
            <UploadButton parentCallback = {this.handleCallback} state={this.state} />
            {graph}
        </div>

    );
  }
}

export default App;
