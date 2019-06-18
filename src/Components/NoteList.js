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
