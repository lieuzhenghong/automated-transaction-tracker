'use strict'

class Login_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      phone_number: '',
      status_message: ''
    }
    // Functions must be manually bound with ES6 classes
    // If don't bind, then "this" at time of function invocation is the JSX
    // input element. Right?
    // Just guessing -- need to ask Mark
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(key) {
    // This is a higher-order function (a function that returns a function)
    // It has to return a function because it needs to take in the event as a
    // parameter 
    return (e) => {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
      console.log(this.state);
    }
  }
  handleSubmit(key) {
    return (event) => {
      event.preventDefault();
      console.log('called');

      var data = {
        phone_number: this.state.phone_number.trim(),
        password: this.state.password.trim(),
        username: this.state.username.trim()
      }

      var req = new XMLHttpRequest();
      req.open("POST", '/auth' + key);
      req.setRequestHeader('Content-type', 'application/json');
      //console.log(JSON.stringify(data));
      req.send(JSON.stringify(data));
      
      req.onreadystatechange = () => {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText); 
          console.log(res);

          if (key === '/sign_up') {
            this.setState( 
              {status_message: (res.success ? 'Success! ': 'Failure! ') + res.message} 
            );
          }
          else if (key === '/authenticate') {
            console.log(res.token);
            this.setState({
              status_message: (res.success ? 'Success! ': 'Failure! ') + 
                res.message + 'Your token: ' + res.token + 'Your id: ' + 
                res._user_id
            })

            if (res.success) {
              //Save JWT in localStorage
              localStorage.clear();
              localStorage.setItem('token', res.token);
              localStorage.setItem('_user_id', res._user_id);
              console.log(localStorage.getItem('token'));
              console.log(localStorage.getItem('_user_id'));
              window.location = "/index.html";
            }
          }
        }
      }
    }
  }
  render() {
    return (
        <div id = "body">
          <h1> Automated transaction tracker </h1>
          <h1> Login or sign up </h1>
          <div id = "message"><p>{this.state.status_message}</p></div>
          <label htmlFor="phone_number">Phone number. Must be unique.</label>
          <input
            required
            type = 'text'
            value = {this.state.phone_number}
            id = "phone_number" 
            onChange= { this.handleChange('phone_number') }
          />
          <label htmlFor="username">Username. For others to find you.</label>
          <input  
            type = 'text'
            value = {this.state.username}
            id = "username" 
            onChange= { this.handleChange('username') }
          />
          <label htmlFor="password">Password (optional--but good to have!)</label>
          <input 
            type = 'password' 
            value = {this.state.password}
            id = "password" 
            onChange= { this.handleChange('password') }
          />
          <input 
            type='submit'
            value='Sign up'
            onClick = {this.handleSubmit('/sign_up')}
          />
          <input 
            type ='submit' 
            value='Login'
            onClick = {this.handleSubmit('/authenticate')}
          />
        </div>
        )
  }
}

ReactDOM.render( <Login_Page/>, document.getElementById('content') );
