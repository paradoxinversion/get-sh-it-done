import React from 'react';
import MutableFieldButton from './MutableFieldButton';
import MutableTaskList from './MutableTaskList';
class TodoListContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tasksLoaded: false,
      taskData : {},
      error: null
    }
    this.handleTaskDeletion = this.handleTaskDeletion.bind(this);
    this.handleTaskAddition = this.handleTaskAddition.bind(this);
    this.handleToDoCompletion = this.handleToDoCompletion.bind(this);
  }

  handleTaskAddition(event, description){
    event.preventDefault();
    fetch("http://localhost:3000/tasks/add", {
      method: "POST",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        description
      })
    })
      .then(response => {
        return response.json();
      })
      .then((taskjson) => {
        // The container should be updated here
        this.setState({
          taskData: taskjson
        })
      });
  }
  handleToDoCompletion(taskId){
    fetch(`http://localhost:3000/tasks/complete/${taskId}`, {
      method: "get"
    })
      .then(response => {
        return response.json();
      })
      .then(taskjson => {
        this.setState({
          taskData: taskjson
        })
      })
  }
  
  handleTaskDeletion(taskId){
    fetch(`http://localhost:3000/tasks/delete/${taskId}`, {
      method: "get"
    })
      .then(response => {
        return response.json();
      })
      .then((taskjson) => {
        // updateContainer(taskjson);
        this.setState({
          taskData: taskjson
        })
      })
      .catch(e => {
        throw e;
      });
  }

  componentDidMount() {
    fetch("http://localhost:3000/tasks", {
      method: "GET",
    })
      .then(response => {
        return response.json();
      })
      .then(
        (taskjson) => {
          this.setState({
            tasksLoaded: true,
            taskData: taskjson
          })
        },
        (error) =>{
          this.setState({
            tasksLoaded: true,
            error
          })
        });
  }

  render(){
    const {error, tasksLoaded, taskData} = this.state;
    if (error){
      return <div>Error: {error.message}</div>;
    } else if (!tasksLoaded){
      return <div>Hold the fuck on</div>;
    } else{
      return(
        <div className="todo-container">
          <MutableFieldButton
            onTaskSubmit={this.handleTaskAddition}/>
          <MutableTaskList
            tasks={taskData}
            onTaskCompleted={this.handleToDoCompletion}
            onTaskDeleted={this.handleTaskDeletion}/>
        </div>
      );
    }
  }
}
export default TodoListContainer;
