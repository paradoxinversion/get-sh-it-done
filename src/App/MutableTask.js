const React = require("react");

class MutableTask extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editModeEnabled: false,
      editedTaskText: props.task.description
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.handleTextClicked = this.handleTextClicked.bind(this);
    this.handleTaskEdit = this.handleTaskEdit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  toggleEditMode(){
    this.setState({
      editModeEnabled: !this.state.editModeEnabled
    });
  }

  handleComplete(){
    this.props.onTaskCompleted(this.props.task._id);
  }

  handleDelete(){
    this.props.onTaskDeleted(this.props.task._id);
  }

  handleTextClicked(){
    this.toggleEditMode();
  }

  handleTaskEdit(event){
    if (event.keyCode === 13){
      this.props.onTaskEdited(this.props.task._id, event.target.value);
      this.toggleEditMode();
    } else if (event.keyCode === 27){
      this.toggleEditMode();
    }
  }

  handleTextChange(event){
    this.setState({
      editedTaskText: event.target.value
    });
  }

  render(){
    if (this.state.editModeEnabled){
      // Edit
      return (
        <div className="todo">
          <input
            className="task-edit"
            type="text"
            value={this.state.editedTaskText}
            onKeyDown={this.handleTaskEdit}
            onChange={this.handleTextChange}/>
        </div>
      );
    } else {
      // Display
      return (
        <div className="todo">
          <input
            type="checkbox"
            className="todo-checkbox"
            onChange={this.handleComplete}
            checked={this.props.task.complete}/>
          <p
            className="todo-text"
            onDoubleClick={this.handleTextClicked} >{this.props.task.description}</p>
          <input className="hidden" />
          <button className="delete-task-btn" onClick={this.handleDelete}> Delete </button>
        </div>
      );
    }
  }
}

export default MutableTask;
