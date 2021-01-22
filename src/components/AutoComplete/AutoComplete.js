import React, { Component, createRef } from "react";
import debounce from "../utils";
import getSuggestions from "./MockApi";

class AutoComplete extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: ""
    };
    
    this.getSuggestionsFromApi = debounce(this.getSuggestionsFromApi, 600).bind(this);
    this.wrapperRef = createRef();
    this.inputRef = createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
      });
    }
  }

  getSuggestionsFromApi = async (text) => {
    try {
      const filteredSuggestions = await getSuggestions(text);
      this.setState({
        filteredSuggestions,
        showSuggestions: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  onClick = (index) => {
    const { filteredSuggestions} = this.state;
    const currentUserInput = this.state.userInput;
    const lastSpace = currentUserInput.lastIndexOf(" "); // find the last space on the string
    const preWords = lastSpace > 0 ? currentUserInput.slice(0, lastSpace) + " " : "";
    // gets the substring from the beginning to the last space (before last word that should be autocompleted)

    const newUserInput = preWords + filteredSuggestions[index] + " ";
    // then concat the rest of the autocompleted word, (and obviously the last space)
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: newUserInput
    });
    this.inputRef.current.focus();
  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      if (!this.state.showSuggestions) return; // if suggestions are not shown, why to do all next?

      this.onClick(activeSuggestion);
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0)
        this.setState({ activeSuggestion: filteredSuggestions.length - 1 });
      else this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion === filteredSuggestions.length - 1)
        this.setState({ activeSuggestion: 0 });
      else this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  onChange = (e) => {
    const userInput = e.target.value;
    const lastWord = userInput.split(" ").slice(-1)[0];

    if (lastWord && lastWord !== "") {  // if last word is void, dont make the fetch
      this.getSuggestionsFromApi(lastWord);
    }

    this.setState({
      activeSuggestion: 0,
      userInput,
      showSuggestions: false,
    });
  };

  render() {
    const {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions,
      userInput
    } = this.state;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              const word = userInput.split(" ").slice(-1)[0];
              const matchStart = suggestion.indexOf(word);
              const endOfMatch = matchStart + word.length;
              return (
                <li
                  className={ index === activeSuggestion ? "suggestion-active" : "" }
                  key={suggestion}
                  onClick={() => this.onClick(index)}
                >
                  {suggestion.slice(0, matchStart)}
                  <span style={{ color: "green" }}>
                    {suggestion.slice(matchStart, endOfMatch)}
                  </span>
                  {suggestion.slice(endOfMatch, suggestion.length)}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions, you&apos;re on your own!</em>
          </div>
        );
      }
    }

    return (
      <div ref={this.wrapperRef}>
        <input
          ref={this.inputRef}
          placeholder="Search important stuff"
          type="search"
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
      </div>
    );
  }
}

export default AutoComplete;
