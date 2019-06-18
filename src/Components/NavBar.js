import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from 'react';

export default class NavBar extends Component {
    renderMenuItems() {
        return (
            <ul>
                <li onClick={this.props.onClear}>
                    Clear Notes
                </li>
            </ul>
        );
    }

    renderMenu() {
        return (
            <Dropdown trigger={['click']}
                overlayClassName="sm-dropdown"
                overlay={this.renderMenuItems()}>
                <div className="sm-dropdown-button">
                    <FontAwesomeIcon icon={faBars} />
                </div>
            </Dropdown>
        );
    }
    
    render() {
        return (
            <nav className="sm-nav">
                <div className="sm-title">
                    <h1>Save Me</h1>
                </div>
                <div className="sm-actions">
                    {this.renderMenu()}
                </div>
            </nav>
        );
    }
}
