import React from "react";

class UploadButton extends React.Component<any, any>{
    constructor(props: any) {
        super(props)
        this.loadFile = this.loadFile.bind(this);
    }

    passToParent = (value: string | ArrayBuffer | null, name: string) => {
        this.props.parentCallback(value, name);
    }

    resetForm () {
        window.location.reload();
    }

    loadFile(event: any) {
        let file = event.target.files[0];
        if (file) {
            let data = new FormData();
            data.append('file', file);
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = () => {
                if(fileReader.readyState === 2) {
                    this.passToParent(fileReader.result, file.name)
                } else {
                    console.error("Error while loading the file.")
                }
            }

        }
    }

    render() {
        let button;
        if(this.props.fileContent !== "") {
            button = <button type={"reset"}
                             onClick={this.resetForm}
                             className={"button"}
            >Reset</button>
        }
        return <div className="App">
            <header className="App-header">
                <h1>Distribution Viewer</h1>
                <form>
                    <label className="button">
                        <input type="file"
                               name="myFile"
                               onChange={this.loadFile}
                               className={"button"}
                        />
                        Upload a file
                    </label>
                    {button}
                </form>
            </header>
        </div>
    }


}

export default UploadButton