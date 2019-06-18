import React, { Component } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { faCopy, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

export default class NoteItem extends Component {
    renderTitle(note) {
        const { title, createdAt = null } = note;

        if (!createdAt) {
            return (
                <div className="sm-note-title">
                    {title}
                </div>
            );
        }

        return (
            <div className="sm-note-title">
                {title} <small>({timeAgo.format(createdAt)})</small>
            </div>
        );
    }

    render() {
        const { note } = this.props;

        return (
            <li className="sm-note">
                <div className="sm-note-content" onClick={this.props.onEdit}>
                    {this.renderTitle(note)}
                    <div className="sm-note-text" dangerouslySetInnerHTML={{__html: note.text}} />
                </div>
                <div className="sm-note-actions">
                    <span className="sm-button sm-icon" onClick={this.props.onRemove}>
                        Remove <FontAwesomeIcon icon={faTrashAlt} />
                    </span>
                    <span className="sm-button sm-icon sm-effect" onClick={this.props.onCopy}>
                        Copy <FontAwesomeIcon icon={faCopy} />
                    </span>
                </div>
            </li>
        );
    }
}
