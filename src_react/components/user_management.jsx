'use strict'

class User_Management_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //When component mounts, send a GET request to the server to populate
      //these fields 
      phone_number: '',
      _id: '',
      username: '',
      status_message: ''
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    console.log('mounted');
    var req = new XMLHttpRequest();
    req.open("GET", "/user/" + localStorage.getItem('_user_id'));
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        var res = JSON.parse(req.responseText);
        this.setState({
          phone_number: res.phone_number,
          _id: res._id,
          username: res.username
        })
        console.log(this.state);
      }
    }
    req.send();
  }
  handleChange(key) {
    return (e) => {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
      console.log(this.state);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('sending PUT request');
    //Send a POST request to the server
    // The server needs to check that this phone number isn't already used
    var data = {
      phone_number: this.state.phone_number,
      username: this.state.username
    }
    var req = new XMLHttpRequest();
    req.open("PUT", "/user/" + localStorage.getItem('_user_id'));
    req.onreadystatechange = () => {
      var res = JSON.parse(req.responseText);
      console.log(res);
      this.setState({
        status_message: (res.success ? 'Success!' : 'Failure!') + res.message 
      });
    }      
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(data));
  }
  render() {
    if (this.props.active_page != 'User_Management_Page') {
      return(null);
    }
    
    return(
        <div id="body">
        <p> {this.state.status_message} </p>
        <h1>Change user details</h1>
        <p>If you change your phone number, you can edit it here.</p>
        <form>
        <p>Phone: {this.state.phone_number}</p>
        <p>User: {this.state.username}</p>
        
        <label htmlFor="phone_number">Phone number (login with this)</label>
        <input
          type='number' 
          id='phone_number' 
          defaultValue={this.state.phone_number}
          onChange={this.handleChange('phone_number')
          }
          />
        <label htmlFor='user_name'>Name: Others can use this to find you. Choose a
        name that is easily recognisable and not too common.</label>
        <input 
          type='text' 
          id="user_name" 
          defaultValue={this.state.username}
          onChange={this.handleChange('username')}
          />

        <input type='submit' value='Save changes' onClick={this.handleSubmit}/>
        </form>
        </div>
        )
  }
}

// ReactDOM.render( <User_Management_Page/>, document.getElementById('content') );
