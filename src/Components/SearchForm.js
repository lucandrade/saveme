import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from 'react';

export default class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: '',
        };
    }

    onChange(event) {
        const { value } = event.target;
        
        this.setState({
            q: value,
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onChange(this.state.q);
    }

    render() {
        const { q } = this.state;

        return (
            <form className="sm-form sm-form-search" autoComplete="off" onSubmit={this.onSubmit.bind(this)}>
                <div className="sm-form-group">
                    <label htmlFor="search" className="sm-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </label>
                    <input type="text"
                            id="search"
                            className="sm-form-control"
                            value={q}
                            placeholder="Search"
                            onChange={this.onChange.bind(this)} />
                </div>
            </form>
        );
    }
}
