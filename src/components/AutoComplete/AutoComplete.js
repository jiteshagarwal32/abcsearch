import React, { Component, createRef } from "react";
import debounce from "../utils";
import getSuggestions from "./MockApi";

class AutoComplete extends Component {
  inputRef = createRef();

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userInput !== this.state.userInput) {
      this.inputRef.current.value = this.state.userInput;
    }
  }

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
    this.onChange = debounce(this.onChange, 300).bind(this);
    this.wrapperRef = createRef();
    // this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    const { filteredSuggestions,userInput} = this.state;
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: false,
        userInput
      });
    }
  }

  onClick = (index) => {
    const { filteredSuggestions} = this.state;
    const currentUserInput = this.state.userInput;
    let lastSpace = currentUserInput.lastIndexOf(" "); // find the last space on the string
    let preWords = lastSpace > 0 ? currentUserInput.slice(0, lastSpace) + " " : "";
    // gets the substring from the beginning to the last space (before last word that should be autocompleted)

    let newUserInput = preWords + filteredSuggestions[index] + " ";
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

      const currentUserInput = this.state.userInput;
      let lastSpace = currentUserInput.lastIndexOf(" "); // find the last space on the string
      let preWords = lastSpace > 0 ? currentUserInput.slice(0, lastSpace) + " " : "";
      // gets the substring from the beginning to the last space (before last word that should be autocompleted)

      let newUserInput = preWords + filteredSuggestions[activeSuggestion] + " ";
      // then concat the rest of the autocompleted word, (and obviously the last space)

      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: newUserInput
      });
      this.inputRef.current.focus();
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

  onChange = async (e) => {
    const userInput = e.target.value;
    if (userInput === "") return; // if user cleans the input
    let lastWord = userInput.split(" ").slice(-1)[0];

    if (!lastWord || lastWord === "") return; // if last word is void, dont make the fetch
    let filteredSuggestions = (await getSuggestions(lastWord)) || [];

    if (!this.inputRef.current) return;

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput
    });
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              let lastWord = userInput.split(" ").slice(-1)[0];
              let word = lastWord;
              let matchStart = suggestion.indexOf(word);
              let endOfMatch = matchStart + word.length;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={suggestion}
                  onClick={() => onClick(index)}
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
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {suggestionsListComponent}
      </div>
    );
  }
}

export default AutoComplete;
