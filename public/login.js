class Login_Page extends React.Component {
  render() {
    return (
        <div id ="body">
        <h1>Login Page</h1>
        <Login_Form />
        </div>
        )
  }
}

class Login_Form extends React.Component {
  render() {
    return (
        <form>
          <label for="user_name">Username:</label>
          <input type="text" id="user_name" name="user_name"/>
          <label for="password">Password:</label>
          <input type="password" id="password"/>
          <input type="submit" value="Log in"/>
        </form>
        )
  }
}

ReactDOM.render(<Login_Page />, document.getElementById('content'));
