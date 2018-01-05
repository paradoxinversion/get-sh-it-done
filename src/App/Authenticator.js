import React from 'react';

class Authenticator extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSigningUp: true,
      isAuthenticated: false,
      username: '',
      password: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.submitAuthenticationAttempt = this.submitAuthenticationAttempt.bind(this);
    this.submitSignUpAttempt = this.submitSignUpAttempt.bind(this);
    this.handleUsernameInput = this.handleUsernameInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.toggleAuthenticationType = this.toggleAuthenticationType.bind(this);
  }

  handleUsernameInput(event){
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordInput(event){
    this.setState({
      password: event.target.value
    });
  }

  handleClick(event){
    event.preventDefault();
  }

  toggleAuthenticationType(){
    this.setState({
      isSigningUp: !this.state.isSigningUp
    });
  }

  submitAuthenticationAttempt(event){
    event.preventDefault();
    this.props.onAuthenticationAttempted(this.state.username, this.state.password);
  }
  submitSignUpAttempt(event){
    event.preventDefault();
    this.props.onSignupAttempted(this.state.username, this.state.password);
  }
  render(){
    if (this.state.isAuthenticated){
      return (
        <p> You are authenticated. </p>
      );
    }else {
      if (this.state.isSigningUp){
        return (
          <div>
            <p> Sign Up </p>
            <form
              onSubmit={this.submitSignUpAttempt}>
              <input
                name="username"
                type="text"
                placeholder="Username"
                onChange={this.handleUsernameInput} />

              <input
                name="password"
                type="text"
                placeholder="Password"
                onChange={this.handlePasswordInput} />
              <button type="submit" > Submit</button>
            </form>
            <a onClick={this.toggleAuthenticationType} href="#"> <p>Sign In Instead</p> </a>
          </div>
        );
      } else {
        return (
          <div>
            <p> Sign In </p>
            <form
              onSubmit={this.submitAuthenticationAttempt}>
              <input
                name="username"
                type="text"
                placeholder="Username"
                onChange={this.handleUsernameInput} />

              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={this.handlePasswordInput} />
              <button type="submit" > Submit</button>
            </form>
            <a href="#"> <p>Sign Up Instead</p> </a>
          </div>
        );
      }
    }
  }
}

export default Authenticator;
