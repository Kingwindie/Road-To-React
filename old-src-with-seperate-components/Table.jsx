import React, { Component } from "react";

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;

    return (
      <div>
        {list.filter(isSearched(pattern)).map(item => (
          <div key={item.objectID}>
            <p>
              <a href={item.url}> {item.title}</a>
            </p>
            <p>{item.author}</p>
            <p>{item.num_comments}</p>
            <p>{item.points}</p>
            <button onClick={() => this.onDismiss(item.objectID)} type="button">
              Dismiss
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default Table;
