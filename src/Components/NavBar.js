import Dropdown from 'rc-dropdown';
import 'rc-dropdown/assets/index.css';
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
                    <i className="fas fa-bars" />
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
