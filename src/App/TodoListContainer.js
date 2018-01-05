import React from 'react';
import MutableFieldButton from './MutableFieldButton';
import MutableTaskList from './MutableTaskList';
import Authenticator from './Authenticator';

class TodoListContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tasksLoaded: false,
      taskData : {},
      error: null,
      isUserAuthenticated: false
    };
    this.handleTaskDeletion = this.handleTaskDeletion.bind(this);
    this.handleTaskAddition = this.handleTaskAddition.bind(this);
    this.handleToDoCompletion = this.handleToDoCompletion.bind(this);
    this.handleTaskEdit = this.handleTaskEdit.bind(this);
    this.handleAuthenticationAttempt = this.handleAuthenticationAttempt.bind(this);
    this.handleSignUpAttempt = this.handleSignUpAttempt.bind(this);
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
        this.setState({
          taskData: taskjson
        });
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
        });
      });
  }

  handleTaskDeletion(taskId){
    fetch(`http://localhost:3000/tasks/delete/${taskId}`, {
      method: "get"
    })
      .then(response => {
        return response.json();
      })
      .then((taskjson) => {
        this.setState({
          taskData: taskjson
        });
      })
      .catch(e => {
        throw e;
      });
  }

  handleTaskEdit(id, editedText){
    fetch(`http://localhost:3000/tasks/edit/${id}`, {
      method: "put",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        description: editedText
      })
    })
      .then(response => {
        return response.json();
      })
      .then((taskjson) => {
        this.setState({
          taskData: taskjson
        });
      });
  }

  handleAuthenticationAttempt(username, password){
    const payload = {
      username,
      password
    };
    fetch(`http://localhost:3000/sign-in`, {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(
        payload
      )
    })
      .then(response => {
        return response.json();
      })
      .then((user) => {
        fetch(`http://localhost:3000/${user.userId}/tasks`, {
          method: "get"
        })
          .then(response => {
            return response.json();
          })
          .then((taskjson) => {
            this.setState({
              taskData: taskjson
            });
          });
      });
  }
  handleSignUpAttempt(username, password){
    const payload = {
      username,
      password
    };
    fetch(`http://localhost:3000/sign-up`, {
      method: "post",
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(
        payload
      )
    })
      .then((taskjson) => {

        this.setState({
          taskData: taskjson
        });
      });
  }
  componentDidMount() {
    if (this.state.isUserAuthenticated){

    } else {
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
            });
          },
          (error) =>{
            this.setState({
              tasksLoaded: true,
              error
            });
          });
    }

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
          <Authenticator
            onAuthenticationAttempted={this.handleAuthenticationAttempt}
            onSignupAttempted={this.handleSignUpAttempt} />
          <MutableFieldButton
            onTaskSubmit={this.handleTaskAddition} />
          <MutableTaskList
            tasks={taskData}
            onTaskCompleted={this.handleToDoCompletion}
            onTaskDeleted={this.handleTaskDeletion}
            onTaskEdited={this.handleTaskEdit} />
        </div>
      );
    }
  }
}

export default TodoListContainer;
