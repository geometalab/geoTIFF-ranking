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
        availableKeys: [],
        selectedKey: 0
  }

  render() {
    let graph: any;
    if(this.state.fileContents.length === 0) {
        graph = <p>No file selected</p>
    } else {
        graph = <div>
            <Graph content={this.state.fileContents} titles={this.state.fileNames}/>

        </div>
    }

    return (
        <div className={"App"}>
            <UploadButton parentCallback = {this.handleCallback} content={this.state.fileContents} titles={this.state.fileNames} />
            {graph}
        </div>

    );
  }
}

export default App;
