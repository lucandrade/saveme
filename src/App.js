import React, { Component } from 'react';
import Storage from './Storage';
import NavBar from './Components/NavBar';
import NoteList from './Components/NoteList';
import NoteForm from './Components/NoteForm';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            notes: [],
            note: {
                index: null,
            },
            editing: false,
        };
    }

    componentDidMount() {
        this.loadNotes();
    }

    async loadNotes() {
        this.setState({ loading: true });
        const notes = await Storage.load();
        this.setState({ notes, loading: false });
    }

    onChange(field, value) {
        const note = Object.assign({}, this.state.note);
        note[field] = value;
        this.setState({ note });
    }

    async onSave() {
        const { title = '', text = '', index = null } = this.state.note;

        if (!title || !text) {
            return;
        }

        const notes = this.state.notes.slice(0);

        if (index === null) {
            notes.push({
                title,
                text
            });
        } else {
            notes[index] = {
                title,
                text
            };
        }

        await Storage.save(notes);

        this.setState({ notes, note: { index: null }, editing: false });
    }

    onNew() {
        this.setState({ editing: true });
    }

    onCancel() {
        this.setState({
            editing: false,
            note: { index: null }
        });
    }

    onEdit(index) {
        const { notes } = this.state;
        const note = notes[index];
        this.setState({
            note: {
                index,
                title: note.title,
                text: note.text,
            },
            editing: true,
        });
    }

    async onRemove(index) {
        const notes = this.state.notes.slice(0);
        notes.splice(index, 1);

        await Storage.save(notes);

        this.setState({ notes });
    }

    onCopy(index) {
        const { notes } = this.state;
        const { text } = notes[index];
        const textField = document.createElement('textarea');
        textField.innerHTML = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    }

    async onClearNotes() {
        if (this.state.notes.length < 1) {
            return;
        }
        
        await Storage.clear();
        this.setState({
            notes: [],
            editing: false,
            note: {
                index: null,
            },
        });
    }

    renderLoading() {
        return (
            <div className="sm-loading">
                Loading
            </div>
        );
    }

    render() {
        const { loading } = this.state;

        if (loading) {
            return this.renderLoading();
        }

        return (
            <div className="sm-app">
                <NavBar onClear={this.onClearNotes.bind(this)} />
                <NoteForm editing={this.state.editing}
                    note={this.state.note}
                    onChange={this.onChange.bind(this)}
                    onNew={this.onNew.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                    onSave={this.onSave.bind(this)} />
                <NoteList notes={this.state.notes}
                    onEdit={this.onEdit.bind(this)}
                    onRemove={this.onRemove.bind(this)}
                    onCopy={this.onCopy.bind(this)} />
            </div>
        );
    }
}
