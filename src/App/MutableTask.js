const React = require("react");

class MutableTask extends React.Component {
  constructor(props){
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  handleComplete(){
    this.props.onTaskCompleted(this.props.task._id);
  }

  handleDelete(){
    this.props.onTaskDeleted(this.props.task._id);
  }

  render(){
    return (
      <div className="todo">
        <input
          type="checkbox"
          className="todo-checkbox"
          onChange={this.handleComplete}
          checked={this.props.task.complete}/>
        <p className="todo-text">{this.props.task.description}</p>
        <input className="hidden" />
        <button className="delete-task-btn" onClick={this.handleDelete}> Delete </button>
      </div>
    );
  }
}

export default MutableTask;
