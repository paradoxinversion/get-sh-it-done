import React from 'react';
import ReactDOM from 'react-dom';
class MutableFieldButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isButtonPressed: false,
      value: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
    this.setState({value: event.target.value})
  }
  toggleFieldButton(){
    this.setState(previousState => ({
      isButtonPressed: !previousState.isButtonPressed
    }));
  }
  handleClick(event){
    event.preventDefault();
    this.toggleFieldButton();
  }
  submit(event){
    this.props.onTaskSubmit(event, this.state.value);
    this.toggleFieldButton();
  }

  render(){
    if (this.state.isButtonPressed){
      return (
        <form
          onSubmit={this.submit}>
          <input
            name="task"
            type="text"
            className="todo-input"
            value={this.state.value}
            onChange={this.handleChange} />
        </form>
      );


    }else {
      return (
        <button onClick={this.handleClick} className="todo-input-button">
          do some shit [react version]
        </button>
      );
    }
  }
}

export default MutableFieldButton;
