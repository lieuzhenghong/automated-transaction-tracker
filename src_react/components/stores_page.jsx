/* --------------------
 * 
 * Stores table and page
 * 
 * -------------------- */

var Stores_Page = React.createClass({
  render: function () {
    if (this.props.active_page != 'Stores_Page') {
      return(null);
    }
    else {
    return (
      <div className="page">
      <Stores_Table />
      <Add_Store_Button onClick = {this.handleClick}/>

      </div>
    )

    }
  }
})

var Add_Store_Button = React.createClass({
  handleClick: function() {
    let active_page = 'Add_Store_Page';
    homePage.setState({active_page: active_page});
  },
  render: function() {
    return(
        <button className="add_store_button" 
        onClick = {this.handleClick} >
        Add new store
        </button>
        )
  }
})


var Stores_Table = React.createClass({
  getInitialState: function() {
    return ({
      stores: [],
      users: []
    });
  },
  componentDidMount: function() {
    console.log(localStorage.getItem('_user_id'));
    var _user_id = localStorage.getItem('_user_id');
    var request_url = '/' + _user_id + '/store';

    var get = new XMLHttpRequest();
    get.open("GET", request_url);
    get.onreadystatechange = () => {
      if (get.readyState == 4) {
        console.log('OK');
        var res = JSON.parse(get.responseText);
        console.log(res);

        this.setState({
          stores: res.stores,
          users: res.users
        })

      }
    }
    get.send();
  },
  render: function() {
    var rows = [];
    for (var i = 0; i < this.state.stores.length; i++) {
      //console.log(this.state.transactions[i]); 
      var user = this.state.users[i];
      if (user === undefined) { user = null; }

        rows.push(

          <Stores_Table_Row 
            key={i} 
            store={this.state.stores[i]} 
            user={user}
            />
      )
    }
    return(
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
           {rows}
          </tbody>
        </table>
        )
  }
})

var Stores_Table_Row = React.createClass({
  getTransactions: function () {
    var req = new XMLHttpRequest();
    req.open("GET", ("/" + localStorage.getItem('_user_id') + "/store/" + 
            this.props.store._id + "/trans"));
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        var res = JSON.parse(req.responseText);
        // I have to pass this "res" to the realpage or trans view page
        let active_page = 'Transactions_View_Page';
        res.active_store = this.props.store;
        dispatcher.dispatchEvent('send_store_transactions', (res));
        console.log(res);
        homePage.setState({active_page: active_page});
      }
    }
    req.send();
  },
  manageStore: function() {
    let active_page = "Store_Management_Page";
    let active_store = this.props.store;
    homePage.setState({active_page: active_page, active_store: active_store});
  },
  render: function() {
    return (
        <tr>
        <td onClick = {this.getTransactions}>{ this.props.store.name }</td>
        <td onClick = {this.getTransactions}>{ this.props.user.username }</td>
        <td><button onClick = {this.manageStore}>Edit</button></td>
        </tr>
        )
  }
})

