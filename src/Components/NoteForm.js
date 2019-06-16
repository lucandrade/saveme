import React, { Component } from 'react';

export default class NoteForm extends Component {
    onSave(event) {
        event.preventDefault();
        this.props.onSave();
    }

    onChange(event) {
        const field = event.target.id;
        const value = event.target.value;

        this.props.onChange(field, value);
    }

    renderNewButton() {
        return (
            <div className="sm-form">
                <button type="button" className="sm-button sm-primary" onClick={this.props.onNew}>
                    <i className="fas fa-plus" /> New Note
                </button>
            </div>
        );
    }

    render() {
        const { title = '', text = '' } = this.props.note;

        if (!this.props.editing) {
            return this.renderNewButton();
        }

        return (
            <form className="sm-form" onSubmit={this.onSave.bind(this)}>
                <div className="sm-form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text"
                        id="title"
                        className="sm-form-control"
                        value={title}
                        onChange={this.onChange.bind(this)} />
                </div>
                <div className="sm-form-group">
                    <label htmlFor="text">Text</label>
                    <textarea id="text"
                        className="sm-form-control"
                        value={text}
                        onChange={this.onChange.bind(this)} />
                </div>
                <button type="submit" className="sm-button sm-primary">
                    Save
                </button>
                <button type="button" className="sm-button" onClick={this.props.onCancel}>
                    Cancel
                </button>
            </form>
        );
    }
}
