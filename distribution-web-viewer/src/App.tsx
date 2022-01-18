import React from 'react';
import "./App.css"
import PreviewWindow from "./components/previewWindow";
import UploadButton from "./components/uploadButton";
import Graph from "./components/graph"


class App extends React.Component<any, any>{

    handleCallback = (childData: any) => {
        this.setState({fileContent: this.state.fileContent.concat(childData)})
    }


  state = {
    fileNames: [],
    fileContent: [],
  }

  render() {
    let mainContent: any;
    if(this.state.fileContent.length === 0) {
        mainContent = <p>No file selected</p>
    } else {
        mainContent = <div>
            <Graph content={this.state.fileContent}/>
            <PreviewWindow content={this.state.fileContent} titles={this.state.fileContent}/>
        </div>
    }

    return (
        <div className={"App"}>
            <UploadButton parentCallback = {this.handleCallback} fileContent={this.state.fileContent} />
            {mainContent}
        </div>

    );
  }
}

export default App;
