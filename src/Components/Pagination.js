import React, { Component } from 'react';

export default class Pagination extends Component {
    onClick(page) {
        this.props.onClick(page);
    }

    render() {
        const { page, pages } = this.props;

        if (pages <= 1) {
            return null;
        }

        const items = [];

        for (let a = 1; a <= pages; a += 1) {
            items.push(
                <span key={a}
                    className="sm-pagination-button"
                    onClick={this.onClick.bind(this, a)}
                    disabled={a === page}>
                    {a}
                </span>
            );
        }

        return (
            <div className="sm-pagination">
                {items}
            </div>
        );
    }
}
