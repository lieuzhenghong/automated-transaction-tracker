'use strict'

class Store_Management_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //When component mounts, send a GET request to the server to populate
      //these fields 
      _id: '',
      name: '',
      owner: [],
      contributors_ids: [],
      contributors: [],
      output_content: [],
      status_message: ''
    }
    this.onRender = this.onRender.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  onRender() {
    var req = new XMLHttpRequest();
    req.open("GET", "/user/" + localStorage.getItem('_user_id') + "/store/" + 
      this.props.active_store._id + "/manage");
    req = set_HTTP_header(req);
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        var res = JSON.parse(req.responseText);
        console.log(res);
        // First item is the store object, 
        // second the owner object,
        // third item the array of contributors
        this.setState({
          _id: res[0]._id,
          name: res[0].name,
          contributors_ids: res[0].contributors,
          owner: res[1],
          contributors: res[2]
        })
        console.log(this.state);
      }
    }
    req.send();
  }
  handleClick(e) {
    console.log('clicked');
    let clicked = e.target.parentNode.id;
    //console.log(this.state.output_content[clicked]);
    this.state.contributors.push(this.state.output_content[clicked]);
    this.state.contributors_ids.push(this.state.output_content[clicked]._id);
    this.setState({
      contributors_id: this.state.contributors_id,
      contributors: this.state.contributors
    })
    console.log(this.state.contributors);
  }
  handleChange(key) {
    return (e) => {
      if (key === 'contributors') {
        // I have to debounce this
        if (e.target.value != '') { //Make sure I don't send a useless blank request
          var req = new XMLHttpRequest();
          req.open("GET", "/user/" + e.target.value);
          req = set_HTTP_header(req);
          req.onreadystatechange = () => {
            if (req.readyState == 4) {
              var res = JSON.parse(req.responseText);
              this.setState({
                output_content: res
              });
            }
          }
          req.send();
        }
        else {
          this.setState({
            output_content: []
          });
        }
      } 
      else {
        var state = {};
        state[key] = e.target.value;
        this.setState(state);
        //console.log(this.state);
      }
    }
  }
  handleSubmit(e) {
    //Send a PUT request to the server
    // PUT /:_store_id/manage
    e.preventDefault();
    console.log('sending PUT request');
    //Send a POST request to the server
    // The server needs to check that this phone number isn't already used
    var data = {
      _user_id: this.state._user_id,
      name: this.state.name,
      contributors: this.state.contributors
    }
    var req = new XMLHttpRequest();
    req.open("PUT",  "/user/" + localStorage.getItem('_user_id') + "/store/" + 
      this.props._id + "/manage");
    req = set_HTTP_header(req);
 
    req.onreadystatechange = () => {

      if (req.readyState == 4) {
        var res = JSON.parse(req.responseText);
        console.log(res);this.setState({
          status_message: (res.success ? 'Success!' : 'Failure!') + res.message 
        });
      }
    }      
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(data));
  }
  render() {
    var rows = [];
    let c = this.state.output_content;
    
    for (let i = 0; i < c.length; i++) {
      rows.push(
          <tr
          id={i}
          onClick={this.handleClick}>
          <td>{c[i].username}</td>
          <td>{c[i].phone_number}</td>
          </tr>)
    }

    var contributors = [];
    let d = this.state.contributors;

    for (let i = 0; i < d.length; i++) {
      contributors.push(
          <li id={i}>
            {d[i].username}
            </li>
      );
    }

    if (this.props.active_page != 'Store_Management_Page') {
      return (null);
    }

    else {
      this.onRender();
      return(
        <div id="body">
        <h1>Change store details</h1>
        <form>
        <p>{this.state.status_message}</p>
        <p>Store name: {this.state.name}</p>
        <p>Owner: {this.state.owner.username}</p>
        <div>
          Contributors:
          <ul>
          {contributors}
          </ul>
        </div>
        
        <label htmlFor="name">Store name</label>

        <input
          type='text' 
          id='name' 
          defaultValue={this.state.name}
          onChange={this.handleChange('name')}
          />

        <div id = 'search'>
        <label htmlFor ='search_contributors'>Contributors</label>

        <ul>
        {contributors}
        </ul>

        <input
          id = 'search_contributors'
          type='search' 
          onChange={this.handleChange('contributors')} 
        />
        
        <table id = "output_content">
        <thead>
        <tr> <td>Display name</td><td>Phone number</td></tr>
        </thead>
        <tbody>
        {rows}
        </tbody>
        </table>
        </div>
          
        <input type='submit' value='Save changes' onClick={this.handleSubmit}/>
        </form>
        </div>
        )
    
    }
  }
}

