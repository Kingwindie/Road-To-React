import React, { Component } from "react";
import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }
  onDismiss(id) {
    const updatedHits = this.state.result.hits.filter(
      item => item.objectID !== id
    );
    this.setState({ result: { ...this.state.result, hits: updatedHits } });
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  onSearchSubmit() {
    const { searchTerm } = this.state;
  }

  render() {
    const { searchTerm, result } = this.state;
    console.log(result);

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} onChange={this.onSearchChange} />
        </div>
        {"Search for news "}

        {result ? (
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        ) : null
        // :`Hang on the page is loading`
        }
      </div>
    );
  }
}

const Button = ({ onclick, className = "", children }) => (
  <button onclick={onclick} className={className} type="button">
    {children}
  </button>
);

const Search = ({ value, onChange, children }) => (
  <form>
    {children}
    <input type="text" value={value} onChange={onChange} />
  </form>
);

const Table = ({ list, pattern, onDismiss }) => (
  <div>
    {list.filter(isSearched(pattern)).map(item => (
      <div key={item.objectID}>
        <p>
          <a href={item.url}> {item.title}</a>
        </p>
        <p>{item.author}</p>
        <p>{item.num_comments}</p>
        <p>{item.points}</p>
        <button onClick={() => onDismiss(item.objectID)} type="button">
          Dismiss
        </button>
      </div>
    ))}
  </div>
);

export default App;
