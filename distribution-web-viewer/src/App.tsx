import React, {useState} from 'react';
import "./App.css"
import "./components/uploadButton";
import PreviewWindow from "./components/previewWindow";
import UploadButton from "./components/uploadButton";

class App extends React.Component<any, any>{

  state = {
    fileContent: "",
  }

  handleCallback = (childData: any) =>{
    this.setState({fileContent: childData})
  }

  render() {
    return (
        <div className={"App"}>
            <UploadButton parentCallback = {this.handleCallback} />
            <PreviewWindow content={this.state.fileContent} />
        </div>

    );
  }
}

export default App;
