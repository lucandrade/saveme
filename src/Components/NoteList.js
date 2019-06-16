import React, { Component } from 'react';

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

    renderNote(note, index) {
        return (
            <li key={index} className="sm-note">
                <div className="sm-note-content" onClick={this.onEdit.bind(this, index)}>
                    <div className="sm-note-title">
                        {note.title}
                    </div>
                    <div className="sm-note-text" dangerouslySetInnerHTML={{__html: note.text}} />
                </div>
                <div className="sm-note-actions">
                    <span className="sm-button sm-icon" onClick={this.onRemove.bind(this, index)}>
                        Remove <i className="fas fa-trash-alt" />
                    </span>
                    <span className="sm-button sm-icon sm-effect" onClick={this.onCopy.bind(this, index)}>
                        Copy <i className="fas fa-copy" />
                    </span>
                </div>
            </li>
        );
    }

    render() {
        return (
            <div className="sm-notes">
                <ul>
                    {this.props.notes.map(this.renderNote.bind(this))}
                </ul>
            </div>
        );
    }
}
