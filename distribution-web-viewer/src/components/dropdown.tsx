import React from "react";
import 'react-dropdown/style.css';
import Dropdown from 'react-dropdown';

class KeyDropdown extends React.Component<any, any> {

    onSelect(e: any) {
        console.log(e)
    }
    render() {
        if(this.state.availableKeys.length === 0) {
            return null;
        } else {
            return <div>
                <Dropdown options={this.state.availableKeys} onChange={this.onSelect} value={this.state.selectedKey} placeholder="Select an option" />;
            </div>
        }

    }
}

export default KeyDropdown