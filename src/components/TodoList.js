import React from 'react';

function TodoList( props ) {
  // console.log(props.todos)
  return (
    <ul className="todo-list">
      {props.todos}
    </ul>
  )
}

export default TodoList;
