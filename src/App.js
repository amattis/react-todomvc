import React from 'react';
import Header from './components/Header';
import TodoItem from './components/TodoItem';
import TodoList from './components/TodoList';
import { Router } from 'director/build/director';
import {
  assignTodoValue,
  getStore,
  keyCode,
  selectFilter,
  setStore,
  updateTodoList
} from './utils';
import './App.css';


class App extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      todos: getStore( 'todos-react' ) || [],
      lastId: getStore( 'lastId' ),
      activeCount: 0,
      editing: null,
      tempVal: null
    }
  }

  componentDidMount() {
    const todos = this.state.todos;
    const router = Router({
      '/': () => this.index(),
      '/active': () => this.showActive(),
      '/completed': () => this.showCompleted()
    });
    let allComplete = true;
    if ( todos && this.input ) {
      let activeCount = 0;
      todos.forEach( todo => {
        if ( !todo.completed ) {
          allComplete = false;
          activeCount++;
        }
      });
      this.input.checked = allComplete;
      this.setState({ activeCount: activeCount });
    }
    router.init('/');
  }

  clearCompleted() {
    const newTodos = [];
    let route = window.location.hash;
    getStore( 'todos-react' ).forEach( todo => {
      if ( !todo.completed ) newTodos.push( todo );
    });
    this.setState({ todos: newTodos }, () => {
      setStore('todos-react', newTodos);
      if ( route === '#/active' ) { this.showActive(); }
      else if ( route === '#/completed' ) { this.showCompleted(); }
      else { this.index(); }
    });
  }

  handleAddTodo( value ) {
    const todos = getStore( 'todos-react' ) || [];
    const lastId = this.state.lastId ? parseInt( this.state.lastId ) + 1 : 1;
    const route = window.location.hash;
    const newTodo = [{
      'title': value,
      'id': `todo-id-${lastId}`,
      'completed': false
    }];
    this.setState((state) => ({
      todos: route === '#/completed' ? state.todos : state.todos.concat(newTodo),
      lastId: lastId,
      activeCount: state.activeCount + 1
    }), () => {
      setStore( 'todos-react', todos.concat(newTodo) );
      setStore( 'lastId', lastId );
    });
  }

  handleClickEdit = ( i ) => {
    const todos = this.state.todos;
    const newTodos = [];
    todos.forEach( todo => {
      if ( todo.id === i.id ) {
        if ( todo.title.trim() === '' ) {
          this.setState((state) => ({ activeCount: state.activeCount - 1 }));
        } else {
          newTodos.push({ ...todo, title: todo.title.trim() });
        }
      } else {
        newTodos.push( todo );
      }
    } );

    updateTodoList.call( this, newTodos );
    this.setState({ editing: null, tempVal: null });
  }

  handleDestroyClick( i ) {
    const { todos, activeCount } = this.state;
    const newTodos = todos.filter( todo => todo.id !== i.id );

    updateTodoList.call( this, newTodos );
    this.setState({ activeCount: activeCount > 0 ? activeCount - 1 : 0 });
  }

  handleDoubleClick( i ) {
    this.setState({ editing: i.id, tempVal: i.title });
  }

  handleEscape( i ) {
    const {todos, editing, tempVal} = this.state;
    const newTodos = todos.map( todo =>
      todo.id === editing ? { ...todo, title: tempVal } : todo
    );

    updateTodoList.call( this, newTodos );
    this.setState({ editing: null, tempVal: null });
  }

  handleInputChange( e, i ) {
    const todos = getStore( 'todos-react' );
    let route = window.location.hash;
    let newTodos;

    if ( e.target.type === 'checkbox' ) {
      let allComplete = true;
      let activeCount = this.state.activeCount;
      newTodos = todos.map( (todo, index) => {
        if ( todo.id === i.id ) {
          if ( todo.completed ) {
            allComplete = false;
            activeCount++;
          } else {
            activeCount--;
          }
          return { ...todo, completed: !todo.completed }
        } else {
          if ( !todo.completed ) allComplete = false;
          return todo;
        }
      } );
      this.input.checked = allComplete;
      this.setState({ activeCount: activeCount }, () => {
        setStore('todos-react', newTodos);
        if ( route === '#/active' ) { this.showActive(); }
        else if ( route === '#/completed' ) { this.showCompleted(); }
        else { this.index(); }
      });
    } else {
      newTodos = todos.map( todo =>
        assignTodoValue( todo, i, 'title', e.target.value )
      );
      updateTodoList.call( this, newTodos );
    }
  }

  handleKeyDown( e, i ) {
    const key = e.which || e.keyCode;

    // eslint-disable-next-line default-case
    switch ( key ) {
      case keyCode.ENTER_KEY:
        this.handleClickEdit( i );
        break;
      case keyCode.ESC_KEY:
        this.handleEscape( i );
        break;
    }
  }

  markAllComplete() {
    const route = window.location.hash;
    const todos = getStore( 'todos-react' );
    const newTodos = todos.map( todo =>
      ({...todo, completed: this.input.checked})
    );
    let show;

    if ( ( newTodos[0].completed && route === '#/active' ) ||
      ( !newTodos[0].completed && route === '#/completed' ) ) {
        show = [];
    } else {
      show = newTodos;
    }

    this.setState({
      activeCount: newTodos[ 0 ].completed ? 0 : newTodos.length,
      todos: show
    }, setStore( 'todos-react', newTodos ));
  }

  index() {
    const todos = getStore( 'todos-react' );
    if (todos) {
      this.setState({ todos: todos });
    }
    this.allComplete(todos);
    selectFilter('#/');
    if (this.input) this.input.checked = this.input && this.allComplete(todos);
  }

  showActive() {
    const todos = getStore( 'todos-react' );
    if (todos) {
      const newTodos = todos.filter( todo => !todo.completed);
      this.setState({ todos: newTodos });
    }
    this.allComplete(todos);
    selectFilter('#/active');
    if (this.input) this.input.checked = this.input && this.allComplete(todos);
  }

  showCompleted() {
    const todos = getStore( 'todos-react' );
    selectFilter('#/completed');
    if (todos) {
      const newTodos = todos.filter( todo => todo.completed);
      this.setState({ todos: newTodos });
    }
    if (this.input) this.input.checked = this.input && this.allComplete(todos);
  }

  allComplete( todos ) {
    for (let i = 0; i < todos.length; i++) {
      if (!todos[i].completed) return false;
    }
    return true;
  }

  renderTodo( i ) {
    return (
      <TodoItem
        text={i.title}
        completed={i.completed}
        isEditMode={i.id === this.state.editing}
        onInputChange={e => this.handleInputChange(e, i)}
        onDoubleClick={() => this.handleDoubleClick(i)}
        onClickEdit={() => this.handleClickEdit(i)}
        onKeyDown={e => this.handleKeyDown(e, i)}
        onDestroyClick={() => this.handleDestroyClick(i)}
        key={i.id} />
    )
  }

  render() {
    const { activeCount, todos } = this.state;

    return (
      <>
        <section className="todoapp">
        <Header onAddTodo={val => this.handleAddTodo(val)} />
        {(todos && todos.length > 0) && (
        <>
          <section className="main">
            <input
              ref={input => this.input = input}
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              onClick={() => this.markAllComplete()} />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <TodoList todos={todos.map( todo => this.renderTodo( todo ) )} />
          </section>
          <footer className="footer">
            <span className="todo-count">
              <strong>{activeCount}</strong> item{activeCount !== 1 ? 's' : null} left
            </span>
            <ul className="filters">
              <li>
                <a className="selected" href="#/">All</a>
              </li>
              <li>
                <a href="#/active">Active</a>
              </li>
              <li>
                <a href="#/completed">Completed</a>
              </li>
            </ul>
            { window.localStorage.getItem( 'todos-react' ) &&
              (getStore( 'todos-react' ).length > activeCount) &&
            <button
              className="clear-completed"
              onClick={() => this.clearCompleted()}
            >
              Clear completed
            </button>
            }
          </footer>
        </>
        )}
        </section>
        <footer className="info">
          <p>Double-click to edit a todo</p>

          <p>Created by <a href="https://dynamicslice.com">André Mattis</a></p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
      </>
    );
  }
}

export default App;
