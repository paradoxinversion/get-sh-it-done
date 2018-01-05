import React from 'react';
import MutableTask from './MutableTask';

function MutableTaskList(props) {
  console.log(props);
  const listItems = props.tasks.map((task) => {
    return <li key={task._id} >
      <MutableTask
        task={task}
        onTaskDeleted={props.onTaskDeleted}
        onTaskCompleted={props.onTaskCompleted}
        onTaskEdited={props.onTaskEdited}/>
    </li>;
  });

  return (
    <ul>{listItems}</ul>
  );
}

export default MutableTaskList;
