import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./App.css";

const DEFAULT_QUERY = "redux",
  DEFAULT_HPP = "32",
  PATH_BASE = "https://hn.algolia.com/api/v1",
  PATH_SEARCH = "/search",
  PARAM_SEARCH = "query=",
  PARAM_HPP = "hitsPerPage=",
  PARAM_PAGE = "page=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
console.log(url);

// const isSearched = searchTerm => item =>
//   item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  //responsible for setting/updating the state with data fetched from the API on the screen
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }

  //responsible for fetching data from the API
  fetchSearchTopStories(searchTerm, page = 0) {
    // fetch(
    //   `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    // )
    //   .then(response => response.json())
    //   .then(result => this.setSearchTopStories(result))
    //   .catch(error => this.setState({ error }));
    //AXIOS INSTEAD OF FETCH
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
  }

  //this is responsible for setting state when data is loaded from the API
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  //responsible for removing(updating) an article/card from the screen/state, when the dismiss button is clicked
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits } }
    });
  }

  //responsible for setting/updating the state with the value in the input field
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  //** checks if the search term(input value) has already been searched for before double check in the book*/
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  //updates state with input field value when the search button is clicked
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    // console.log(this.state.results);

    if (error) {
      return <p>Something went wrong!</p>;
    }

    return (
      <div className="page">
        <div className="interactions">
          {"Search for news "}

          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          />
        </div>

        {error ? (
          <div className="interactions">
            <p>Something went wrong</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
          More stories
        </Button>
      </div>
    );
  }
}

const Button = ({
  onClick,
  className = "button button--more-stories",
  children
}) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Button.defaultProps = {
  className: ""
};

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit} className="form">
    {children}
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}Search</button>
  </form>
);

const Table = ({ list, onDismiss }) => (
  <div className="card-container">
    {/* {console.log(list)}{" "} */}
    {list.map(item => (
      <div key={item.objectID} className="card">
        <a href={item.url} className="article-title">
          {item.title}
        </a>
        <p>Author: {item.author}</p>
        <p>Comments: {item.num_comments}</p>
        <p>Points: {item.points}</p>
        <button
          onClick={() => onDismiss(item.objectID)}
          type="button"
          className="button button--dismiss"
        >
          Dismiss
        </button>
      </div>
    ))}
  </div>
);
Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired
};

export default App;

export { Button, Search, Table };
