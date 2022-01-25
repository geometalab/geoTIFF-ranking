import React from "react";
import 'react-dropdown/style.css';
import Dropdown from 'react-dropdown';

class KeyDropdown extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    passToParent = (e: any) => {
        this.props.parentCallback(e.value);
    }

    render() {
        let availableKeys = ["Array", "QRank", "OSM"]
        let selectedKey = 0
        return <div className={"Dropdown"}>
            <Dropdown options={availableKeys} onChange={this.passToParent} value={availableKeys[selectedKey]} placeholder="Select an option" />
        </div>
    }
}

export default KeyDropdown