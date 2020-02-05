import React, { useEffect, useRef } from 'react';

function TodoItem( props ) {
  const {
    completed,
    isEditMode,
    text,
    onClickEdit
  } = props;
  const input = useRef();

  useEffect( () => {
    const handleClickEdit = ( e ) => {
      if ( input && input.current ) {
        if ( input.current.contains( e.target ) ) {
          return;
        }

        onClickEdit();
      }
    }

    if ( isEditMode ) {
      input.current.focus();
    }

    document.addEventListener( 'mousedown', handleClickEdit );

    return () => {
      document.removeEventListener( 'mousedown', handleClickEdit );
    };
  }, [ isEditMode, onClickEdit ] );

  if ( isEditMode ) {
    return (
      <li className="editing">
        <input
          ref={input}
          name="value"
          className="edit"
          value={text}
          onChange={e => props.onInputChange(e)}
          onKeyDown={e => props.onKeyDown(e)} />
      </li>
    )
  } else {
    return (
      <li className={completed ? "completed" : null}>
        <div className="view">
          <input
            name="completed"
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={e => props.onInputChange(e)} />
          <label onDoubleClick={props.onDoubleClick}>
            {text}
          </label>
          <button
            className="destroy"
            onClick={props.onDestroyClick} />
        </div>
      </li>
    );
  }
}

export default TodoItem;
