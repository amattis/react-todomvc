import React from 'react';
import { keyCode } from '../utils';

class Header extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      value: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleInputChange( e ) {
    this.setState({ value: e.target.value })
  }

  handleKeyDown( e ) {
    const key = e.which || e.keyCode;
    const val = e.target.value.trim();

    if ( key === keyCode.ENTER_KEY & val !== '' ) {
      this.props.onAddTodo(val);
      this.setState({ value: '' });
    }
  }

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          value={this.state.value}
          autoFocus />
      </header>
    );
  }
}

export default Header;
