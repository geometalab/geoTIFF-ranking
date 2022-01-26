import React from 'react';
import "./App.css"
import UploadButton from "./components/uploadButton";
import Dropdown from "./components/dropdown";
import Chart from "./components/Chart";
import update from 'react-addons-update';


class App extends React.Component<any, any>{

    handleFileCallback = (childData: any, childName: any) => {
        this.setState({
            fileNames: this.state.fileNames.concat(childName),
            fileContents: this.state.fileContents.concat(childData)
        })
    }

    handleImportCallback = (importMode: any) => {
        this.setState(update(this.state, {
            importMode: {
                [this.state.fileContents.length]: {
                    $set: importMode
                }
            }
        }))
    }


  state = {
        fileNames: [],
        fileContents: [],
        selectedKey: 0,
        importMode: ["Array"],
  }

  render() {
    if(this.state.fileContents !== null) {
        if(
            this.state.fileContents.length !== this.state.fileNames.length || (
                this.state.fileContents.length !== this.state.importMode.length &&
                this.state.fileContents.length !== this.state.importMode.length -1
            )
        ) {
            console.error("Not all state items are the same length: ")
            console.error(this.state.fileContents)
            console.error(this.state.fileNames)
            console.error(this.state.importMode)
        }
    }


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
