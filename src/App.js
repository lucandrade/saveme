import React, { Component } from 'react';
import Storage from './Storage';
import NavBar from './Components/NavBar';
import NoteList from './Components/NoteList';
import NoteForm from './Components/NoteForm';
import Pagination from './Components/Pagination';

const ITEMS_PER_PAGE = 5;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            page: 1,
            allNotes: [],
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

    transformNotes(notes) {
        const copy = notes.slice(0).map((n, i) => {
            n.index = i;

            if (n.hasOwnProperty('createdAt')) {
                if (typeof n.createdAt === 'string') {
                    n.createdAt = new Date(n.createdAt);
                }
            }

            return n;
        });

        return copy.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) {
                return 1;
            }

            return b.createdAt - a.createdAt;
        });
    }

    getNumberOfPages(notes) {
        if (notes.length < 1) {
            return 0;
        }

        return Math.ceil(notes.length / ITEMS_PER_PAGE);
    }

    getNotesForCurrentPage(page, notes) {
        const copy = this.transformNotes(notes);
        const start = (page - 1) * ITEMS_PER_PAGE;
        const pageNotes = copy.splice(start, ITEMS_PER_PAGE);

        return pageNotes;
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
        const now = new Date();

        if (index === null) {
            notes.push({
                title,
                text,
                createdAt: now,
            });
        } else {
            notes[index] = {
                title,
                text,
                updatedAt: now,
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
        const { page } = this.state;
        const notes = this.state.notes.slice(0);
        notes.splice(index, 1);

        await Storage.save(notes);

        const pageNotes = this.getNotesForCurrentPage(page, notes);

        if (pageNotes.length < 1 && page > 0) {
            this.setState({ notes, page: page - 1 });
            return;
        }

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

    onChangePage(page) {
        this.setState({
            page,
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

        const { editing, notes, note, page } = this.state;
        let listing = null;

        if (!editing) {
            listing = (
                <NoteList notes={this.getNotesForCurrentPage(page, notes)}
                    onEdit={this.onEdit.bind(this)}
                    onRemove={this.onRemove.bind(this)}
                    onCopy={this.onCopy.bind(this)} />
            );
        }

        return (
            <div className="sm-app sm-loaded">
                <NavBar onClear={this.onClearNotes.bind(this)} />
                <NoteForm editing={editing}
                    note={note}
                    onChange={this.onChange.bind(this)}
                    onNew={this.onNew.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                    onSave={this.onSave.bind(this)} />
                {listing}
                <Pagination page={page}
                    pages={this.getNumberOfPages(notes)}
                    onClick={this.onChangePage.bind(this)} />
            </div>
        );
    }
}
