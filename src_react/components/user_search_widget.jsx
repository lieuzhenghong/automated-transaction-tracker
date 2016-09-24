/*global React*/
/*global set_HTTP_header:true*/
/*eslint no-undef: "error"*/
/*eslint no-console: "off"*/
/*eslint-env node*/

class User_Search_Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users : [],
      selected_users: [],
      selected_users_id: []        
    };
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {

  }
  handleClick(e) {
    console.log('clicked');
    let clicked = e.target.parentNode.id;
    //console.log(this.state.output_content[clicked]);
    if (this.state.selected_users_id.indexOf(this.state.users[clicked]._id) != -1 || 
        this.props.owner.indexOf(this.state.users[clicked]._id) != -1 ) {
      console.log('contributor already exists');
    }
    else {
      this.state.selected_users.push(this.state.users[clicked]);
      this.state.selected_users_id.push(this.state.users[clicked]._id);
      this.setState({
        selected_users_id: this.state.selected_users_id,
        selected_users: this.state.selected_users
      });
    }
    this.props.passUsers(this.state.selected_users, this.state.selected_users_id);
  }
  handleChange(key) {
    return (e) => {
      function get_users(req) {
        var res = JSON.parse(req.responseText);
        console.log(res);
        this.setState({
          users: res
        });
      }
      if (key === 'users') { // I have to debounce this
        if (e.target.value != '') { //Make sure I don't send a useless blank request
          console.log(e.target.value);
          make_request (
            'GET', 
            `/user/${e.target.value}`,
            get_users.bind(this)
        );
        }
        else {
          this.setState({
            users: []
          });
        }
      }
    };
  }
  render() {
    var rows = [];
    let c = this.state.users;

    if (c === undefined) {
      console.log(`this.state.users is ${this.state.users}`);
      return(null);
    }
    else {
      for (let i = 0; i < c.length; i++) {
        rows.push(
              <tr
              id={i}
              key={i}
              onClick={this.handleClick}>
              <td>{c[i].username}</td>
              <td>{c[i].phone_number}</td>
              </tr>);
      }
      return (
          <div id = 'search'>
          <label htmlFor ='search_users'>Users</label>



          <table id = "output_content">
          <thead>
          <tr><td>Display name</td><td>Phone number</td></tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
          </table>
          <input
              id = 'search_users'
              type='search' 
              onChange={this.handleChange('users')} 
          />
          </div>
      );
    }
  }
}
