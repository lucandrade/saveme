import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from 'react';
import NoteItem from './NoteItem';

export default class NoteList extends Component {
    onRemove(index) {
        this.props.onRemove(index);
    }

    onCopy(index) {
        this.props.onCopy(index);
    }

    onEdit(index) {
        this.props.onEdit(index);
    }

    renderNote(note) {
        return (
            <NoteItem key={note.index}
                note={note}
                onEdit={this.onEdit.bind(this, note.index)}
                onRemove={this.onRemove.bind(this, note.index)}
                onCopy={this.onCopy.bind(this, note.index)} />
        );
    }

    renderSearch() {
        const { q, total } = this.props;

        if (!q) {
            return null;
        }

        return (
            <div className="sm-search-title">
                <span>{total} notes found with "{q}"</span>
                <span className="sm-button sm-icon" onClick={this.props.onClear}>
                    Clear <FontAwesomeIcon icon={faEraser} />
                </span>
            </div>
        );
    }

    render() {
        return (
            <div className="sm-notes">
                {this.renderSearch()}
                <ul>
                    {this.props.notes.map(this.renderNote.bind(this))}
                </ul>
            </div>
        );
    }
}
