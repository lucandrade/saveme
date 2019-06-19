import casual from 'casual-browserify';
import React, { Component } from 'react';
import NavBar from './Components/NavBar';
import NoteForm from './Components/NoteForm';
import NoteList from './Components/NoteList';
import Pagination from './Components/Pagination';
import SearchForm from './Components/SearchForm';
import Storage from './Storage';

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
            q: '',
            tempQ: '',
        };
    }

    componentDidMount() {
        this.loadNotes();
    }

    filterNotes(notes) {
        const { q } = this.state;

        if (!q) {
            return notes;
        }

        return notes.filter(n => n.text.toLowerCase().includes(q.toLowerCase()));
    }

    fillNotes(notes) {
        return notes.map((n, i) => {
            n.index = i;

            if (n.hasOwnProperty('createdAt')) {
                if (typeof n.createdAt === 'string') {
                    n.createdAt = new Date(n.createdAt);
                }
            }

            return n;
        });
    }

    sortNotes(notes) {
        return notes.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) {
                return 1;
            }

            return b.createdAt - a.createdAt;
        });
    }

    transformNotes(notes) {
        let finalNotes = notes.slice(0);
        finalNotes = this.filterNotes(finalNotes);
        finalNotes = this.fillNotes(finalNotes);
        return this.sortNotes(finalNotes);
    }

    getNumberOfPages(notes) {
        if (notes.length < 1) {
            return 0;
        }

        return Math.ceil(notes.length / ITEMS_PER_PAGE);
    }

    getNotesForCurrentPage(page, notes) {
        const formattedNotes = this.transformNotes(notes);
        const copy = formattedNotes.slice(0);
        const start = (page - 1) * ITEMS_PER_PAGE;
        const pageNotes = copy.splice(start, ITEMS_PER_PAGE);

        return { formattedNotes, pageNotes };
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

        const { pageNotes } = this.getNotesForCurrentPage(page, notes);

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

    onChangeQuery(q) {
        this.setState({
            tempQ: q,
        });
    }

    onSearch() {
        this.setState({
            q: this.state.tempQ,
            page: 1,
        });
    }

    onClearSearch() {
        this.setState({
            q: '',
            tempQ: '',
            page: 1,
        });
    }

    createRandomNote(index) {
        let title = casual.title;
        const text = casual.text + "\r\n" + casual.text;

        return {
            title,
            text,
            index,
            createdAt: new Date(),
        };
    }

    async onCreateRandomNotes() {
        const notes = this.state.notes.slice(0);
        
        for (let a = 0; a < 10; a += 1) {
            notes.push(this.createRandomNote(notes.length));
        }

        await Storage.save(notes);

        this.setState({ notes });
    }

    renderDevTool() {
        if (process.env.NODE_ENV === 'production') {
            return null;
        }

        return (
            <div className="sm-dev-tools">
                <button type="button"
                    className="sm-button sm-primary"
                    onClick={this.onCreateRandomNotes.bind(this)}>
                    Create Random Notes
                </button>
            </div>
        );
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

        const { editing, notes, note, page, q, tempQ } = this.state;
        let listing = null;
        let search = null;
        const { formattedNotes, pageNotes } = this.getNotesForCurrentPage(page, notes);

        if (!editing) {
            listing = (
                <NoteList notes={pageNotes}
                    total={formattedNotes.length}
                    q={q}
                    onClear={this.onClearSearch.bind(this)}
                    onEdit={this.onEdit.bind(this)}
                    onRemove={this.onRemove.bind(this)}
                    onCopy={this.onCopy.bind(this)} />
            );
            search = (
                <SearchForm q={tempQ}
                    onChange={this.onChangeQuery.bind(this)}
                    onSearch={this.onSearch.bind(this)} />
            );
        }

        return (
            <div className="sm-app sm-loaded">
                <NavBar onClear={this.onClearNotes.bind(this)} />
                {this.renderDevTool()}
                {search}
                <NoteForm editing={editing}
                    note={note}
                    onChange={this.onChange.bind(this)}
                    onNew={this.onNew.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                    onSave={this.onSave.bind(this)} />
                {listing}
                <Pagination page={page}
                    pages={this.getNumberOfPages(formattedNotes)}
                    onClick={this.onChangePage.bind(this)} />
            </div>
        );
    }
}
