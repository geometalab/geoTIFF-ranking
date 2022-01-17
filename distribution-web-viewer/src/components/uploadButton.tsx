import React from "react";

class UploadButton extends React.Component<any, any>{
    constructor(props: any) {
        super(props)
        this.loadFile = this.loadFile.bind(this);
    }

    passToParent = (value: string | ArrayBuffer | null) => {
        this.props.parentCallback(value);
    }

    loadFile(event: any) {
        let file = event.target.files[0];
        console.log(file);

        if (file) {
            let data = new FormData();
            data.append('file', file);
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = () => {
                if(fileReader.readyState === 2) {
                    console.log(fileReader.result)
                    this.passToParent(fileReader.result)
                } else {
                    console.error("Error while loading the file.")
                }
            }

        }
    }

    render() {
        return <div className="App">
            <header className="App-header">
                <h1>Distribution Viewer</h1>
                <form>
                    <input type="file"
                           name="myFile"
                           onChange={this.loadFile}
                    />
                </form>
            </header>
        </div>
    }


}

export default UploadButton