class Add_Store_Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store_name: '',
      _user_id: '',
    }
  }
  handleSubmit() {
    // Grab the current user from the JSON token?
  }
  render() {
    

    return(
        <div id="body">
        <form>
        <label for='store_name'>Store name</label>
        <input type='text' id='store_name'/>


        <input type='submit' value = 'Create store' onClick={this.handleSubmit} />
        </form>
        </div>
        )
  }
}

ReactDOM.render( <Add_Store_Form/>, document.getElementById('content') );
//module.exports = Add_Store_Form;
