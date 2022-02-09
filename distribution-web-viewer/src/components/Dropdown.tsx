import React from "react";
import 'react-dropdown/style.css';
import Dropdown from 'react-dropdown';

class KeyDropdown extends React.Component<any, any> {

    passToParent = (e: any) => {
        this.props.parentCallback(e.value);
    }

    render() {
        let selectedKey = 0
        return <div className={"Dropdown"}>
            <Dropdown options={this.props.keys} onChange={this.passToParent} value={this.props.keys[selectedKey]} placeholder="Select an option" />
        </div>
    }
}

export default KeyDropdown