const React = require("react");

class MutableTask extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      description: props.task.description,
      id: props.task._id,
      isChecked: props.task.complete
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }
  toggleCheckbox(){
    this.setState({
      isChecked: !this.state.isChecked
    })
  }

  handleComplete(){
    this.props.onTaskCompleted(this.props.task._id)
    this.toggleCheckbox();
  }

  handleDelete(event){
    this.props.onTaskDeleted(this.props.task._id)
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
