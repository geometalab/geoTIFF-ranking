import React from 'react';
import "./App.css"
import UploadButton from "./components/uploadButton";
import Dropdown from "./components/dropdown";
import Chart from "./components/Chart";
import ListMovement from "./components/ListMovement";


class App extends React.Component<any, any>{

    handleFileCallback = (childData: any, childName: any) => {
        let importMode: any = this.state.currentImportMode
        this.setState({
            fileNames: this.state.fileNames.concat(childName),
            fileContents: this.state.fileContents.concat(childData),
            importModes: this.state.importModes.concat(importMode),
        })
    }

    handleImportCallback = (importMode: any) => {
        this.setState({
            currentImportMode: importMode
        })
    }


  state = {
        fileNames: [],
        fileContents: [],
        selectedKey: 0,
        importModes: [],
        currentImportMode: "Array"
  }

  render() {
    if(this.state.fileContents !== null) {
        if(
            this.state.fileContents.length !== this.state.fileNames.length || (
                this.state.fileContents.length !== this.state.importModes.length &&
                this.state.fileContents.length !== this.state.importModes.length -1
            )
        ) {
            console.error("Not all state items are the same length: ")
            console.error(this.state.fileContents)
            console.error(this.state.fileNames)
            console.error(this.state.importModes)
        }
    }


    let graph: any;
    if(this.state.fileContents?.length === 0) {
        graph = <p>No file selected</p>
    } else { // @ts-ignore
        if (this.state.fileContents?.length === 2 && !this.state.importModes.includes("Array")) {
                graph = <div>
                    <div className={"Graph"}>
                        <Chart fileContent={this.state.fileContents} titles={this.state.fileNames} importMode={this.state.importModes}/>
                    </div>
                    <div className={"Listmovement"}>
                        <ListMovement fileContent={this.state.fileContents} titles={this.state.fileNames} importMode={this.state.importModes}/>
                    </div>

                </div>
            } else {
                graph = <div className={"Graph"}>
                    <Chart fileContent={this.state.fileContents} titles={this.state.fileNames} importMode={this.state.importModes}/>
                </div>
            }
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
