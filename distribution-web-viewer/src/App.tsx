import React from 'react';
import "./App.css"
import PreviewWindow from "./components/previewWindow";
import UploadButton from "./components/uploadButton";
import Graph from "./components/graph"
import KeyDropdown from "./components/dropdown";
import Dropdown from "./components/dropdown";
import Chart from "./components/Chart";


class App extends React.Component<any, any>{

    handleFileCallback = (childData: any, childName: any) => {
        this.setState({
            fileNames: this.state.fileNames.concat(childName),
            fileContents: this.state.fileContents.concat(childData)
        })
    }

    handleImportCallback = (importMode: any) => {
        this.setState({
            importMode: importMode
        })
    }


  state = {
        fileNames: [],
        fileContents: [],
        selectedKey: 0,
        importMode: "Array",
  }

  render() {
    let graph: any;
    if(this.state.fileContents.length === 0) {
        graph = <p>No file selected</p>
    } else {
        graph = <div className={"Graph"}>
            <Chart fileContent={this.state.fileContents} titles={this.state.fileNames} importMode={this.state.importMode}/>
        </div>
    }

    return (
        <div className={"App"}>
            <UploadButton parentCallback = {this.handleFileCallback} content={this.state.fileContents} titles={this.state.fileNames} />
            <Dropdown parentCallback = {this.handleImportCallback} />
            {graph}
        </div>

    );
  }
}

export default App;
