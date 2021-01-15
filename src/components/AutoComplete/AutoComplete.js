import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import Debounce from'../Debounce'

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)

  };

  static defaultProps = {
    suggestions: []
  };
 
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
    this.onChange = Debounce(this.onChange,1000).bind(this);
  }

  onChange = (e) => {
    const { suggestions } = this.props;
    const userInput = e.target.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion &&
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput
    });
  };

  onClick = (index) => {
    const { filteredSuggestions } = this.state;
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: filteredSuggestions[index]+ " "
    });
    this.inputRef.current.focus() // this line changed

  };

  onKeyDown = (e) => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
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
              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }
              return (
                <li className={className} key={suggestion} onClick={() => onClick(index)}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>You are going the wrong way baby!!</em>
          </div>
        );
      }
    }

    return (
      <>
        <input
          ref={this.inputRef}
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}        
        />
        {suggestionsListComponent}
      </>
    );
  }
}

export default Autocomplete;
