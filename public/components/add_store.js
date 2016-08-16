class Add_Store_Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
    render () {
      if (active_page != 'Add_Store_Page') {
        return (null);
        else {
          return({
            <div className="page">
              <h1>Add Store</h1>
              <Add_Store_Form />
            </div>
          })
        }
      }
    }
  }
}


class Add_Store_Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      status_message: ''
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    console.log(localStorage.getItem('token'));
    console.log(localStorage.getItem('_user_id'));

    var data = {
      name: this.state.name,
      _user_id: localStorage.getItem('_user_id')
    }
    
    var req = new XMLHttpRequest();
    req.open("POST", '/store');
    req.setRequestHeader('Content-type', 'application/json');
    console.log(JSON.stringify(data));
    req.send(JSON.stringify(data));
    
    req.onreadystatechange = () => {

      if (req.readyState == 4) {
        var res = JSON.parse(req.responseText); 
        console.log(res);
        
        this.state = {
          status_message: res.message
        }
      }
    }
  }
  render() {
    

    return(
        <div id="body">
        <div id="message"><p>{this.status_message}</p></div>
        <form>
        <label for='store_name'>Store name</label>
        <input type='text' onChange = {this.handleChange('name')} id='name'/>


        <input type='submit' value = 'Create store' onClick={this.handleSubmit} />
        </form>
        </div>
        )
  }
}

//ReactDOM.render( <Add_Store_Form/>, document.getElementById('content') );
