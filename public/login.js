'use strict'

class Login_Page extends React.Component {
  render() {
    return (
        <div id = "body">
          <label for="username">Username</label>
          <input type = 'text' id = "username" />
          <label for="password">Password</label>
          <input type = 'password' id = "password" />
          <input type ='submit' value='Login'/>
        </div>
        )
  }
}

ReactDOM.render( <Login_Page/>, document.getElementById('content') );
