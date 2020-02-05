export const keyCode = {
  ENTER_KEY: 13,
  ESC_KEY: 27
};


/* Helper functions */
export const getStore = i => {
  const g = window.localStorage.getItem( i );
  return typeof JSON.parse( g ) === 'object' ? JSON.parse( g ) : g;
}

export const setStore = ( k, v ) => {
  switch ( typeof v ) {
    case 'object':
      return setlocalStorage( k, JSON.stringify( v ) );
      // eslint-disable-next-line no-unreachable
      break;

    case 'string':
      return setlocalStorage( k, v );
      // eslint-disable-next-line no-unreachable
      break;

    default:
      return setlocalStorage( k, v.toString() );
      // eslint-disable-next-line no-unreachable
      break;
  };
}

export const assignTodoValue = (curr, i, val, newVal) =>
  curr.id === i.id ? { ...curr, [val]: newVal } : curr;

export function selectFilter(f) {
  [...document.querySelectorAll('.filters a')].map(filter =>
    (filter.hash === f) ? filter.classList.add('selected') :
      filter.classList.remove('selected')
  )
}

export function updateTodoList(newTodos) {
  this.setState({ todos: newTodos },
    setStore( 'todos-react', newTodos )
  );
}

const setlocalStorage = ( k, v ) => window.localStorage.setItem( k, v );
