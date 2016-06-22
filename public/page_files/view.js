'use strict';
var active_page = 'Home_Page';
// import reactCSS, {hover} from 'reactCSS';

/* ----------------------
 *
 * Dispatcher/ Reactor pattern model
 *
 * http://stackoverflow.com/questions/15308371/custom-events-model-
 * without-using-dom-events-in-javascript
 *
 * How it works:
 * ------------------
 * Register events. An event is basically a repository of callback functions.
 * Call the event to call the callback functions. 
 * How to call the event? Use Dispatcher.dispatchEvent(event_name)
 * 
 * A Dispatcher is a list of Events. So calling Dispatcher.dispatchEvent
 * basically finds the event in the Dispatcher and calls it
 *
 * Dispatcher.dispatchEvent --> calls the Event ---> calls the callback
 * function(s) of the Event. 
 *
 * How do we set the callback functions of the Event? Use addEventListener.
 * addEventListener is really a misnomer, it should be called addCallBack.
 * ----------------------- */

var dispatcher = new Dispatcher();

function Event(name) {
  this.name = name;
  this.callbacks = [];
};

Event.prototype.registerCallback = function(callback){
  this.callbacks.push(callback);
};

function Dispatcher() {
  this.events = {}
};

Dispatcher.prototype.registerEvent = function(event_name) {
  var event = new Event(event_name);
  this.events[event_name] = event;
  // console.log(this.events);
}

Dispatcher.prototype.dispatchEvent = function(event_name, event_arguments){
  this.events[event_name].callbacks.forEach(function(callback) {
    callback(event_arguments);
    // console.log('dispatched');
    // console.log(callback, event_arguments);
  });
};

Dispatcher.prototype.addEventListener = function(event_name, callback) {
  this.events[event_name].registerCallback(callback);
  // console.log(callback);
};

/* -------------
 * Dispatcher events
 * ----------------*/

dispatcher.registerEvent('send_transaction_details');
//Send Transaction Details has a listener attached to it 
//that takes in a JSON object as a parameter. This JSON object is the 
//transaction. Then the Detail View Table will update. 
dispatcher.registerEvent('update_transaction')

/* ----------------------------
 *
 * Various navigation buttons
 *
 * -------------------------- */

var Add_Transaction_Button = React.createClass({
  handleClick: function() {
    active_page = 'Add_Transaction_Form_Page';
    console.log('clicked');
    realPage.setState({active_page: active_page});
  },
  render: function() {
    return(
      <button className="add_transaction_button"
      onClick={ this.handleClick }>
      Add new loan
      </button>
      )
  }
});

var Show_Transactions_Button = React.createClass({
  handleClick: function() {
    active_page = 'Transactions_View_Page';
    realPage.setState({active_page: active_page});
  },
  render: function() {
  return (
    <button className="show_transactions_button" onClick =
    {this.handleClick}>
    Show loans
    </button>
    )
  }
});

var Return_Items_Button = React.createClass({
  handleClick() {
    console.log('clicked!');
  },
  render: function () {
    return (
      <button onClick={this.handleClick}>Return</button>
  )
 } 
});

var Renew_Transaction_Button = React.createClass({
  handleClick() {
    dispatcher.dispatchEvent('update_transaction', 'renew');
  },

  render: function () {
  return (<button onClick={this.handleClick}>Renew</button>)
 } 
})

var Back_to_Home_Button = React.createClass({
  handleClick: function(){
    active_page = 'Home_Page';
    realPage.setState({active_page: active_page});
  },
  render: function() {
    return (
      <button className="back_to_home_button" onClick =
      {this.handleClick} >
      Back
      </button>
    )
  }
});

/* ---------------------
 *
 * Home Page
 *
 * --------------------- */


var Home_Page = React.createClass({
  render: function () {
    if (active_page != 'Home_Page') {
      // console.log('not rendering Homepage');
      return(null);
    }
    else {
    return (
      <div class="page">
      <h1>Loan Tracker</h1>
      <Add_Transaction_Button />
      <Show_Transactions_Button />
      </div>
    )

    }
  }
})

/* -----------------
 *
 * Transactions Table
 *
 * --------------------- */ 

var Transactions_View_Page = React.createClass({
  render: () => {
    if (active_page != "Transactions_View_Page") {
      return(null);
    }
    else {
      // When this page loads
      return  (
        <div class="page">
        <h1> Loans overview </h1>
        <Transactions_Table />
        <Back_to_Home_Button />
        </div>
      )
    }
  }
})

var Transactions_Table = React.createClass({
  getInitialState: function () {
    return({
      transactions: []
    })
  },
  componentDidMount: function() {
    var get = new XMLHttpRequest();
    get.open("GET", "/trans");
    get.onreadystatechange = () => {
      if (get.readyState == 4) {
        this.setState({
          transactions: JSON.parse(get.responseText)
        })
      }
    }
    get.send();
  },
  render: function() {

    var rows = [];
    for (var i = 0; i < this.state.transactions.length; i++) {
      //console.log(this.state.transactions[i]);
      rows.push(<Transactions_Table_Row key={i} values={this.state.transactions[i]}/>)
    }
 
    
    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Expiry date</th>
            <th>Name</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
        {rows}
        </tbody>
      </table>
    )
  }
});


var Transactions_Table_Row = React.createClass({
  handleClick: function() {
    active_page = 'Transaction_View_Detail_Page';

    dispatcher.dispatchEvent('send_transaction_details', this.props.values);
    realPage.setState({
      active_page: active_page
    });
  },
  render: function() {
    function parse_date(date){
      // console.log (typeof date);
      return(date.substring(0,10));
    };
    return(
      <tr onClick= {this.handleClick}>
        <td>{parse_date(this.props.values.date)}</td>
        <td>{parse_date(this.props.values.expiry_date)}</td>
        <td>{this.props.values.name}</td>
        <td>{this.props.values.phone_number}</td>
      </tr>
    )
  }
})

/* -------------------
 *
 * Transaction View Detail page
 *
 * ----------------------- */

var Transaction_View_Detail_Page = React.createClass({
  render: function (){
  if (active_page != 'Transaction_View_Detail_Page') {
    return(null);
  }
  else {
    console.log('props');
    console.log(this);
    console.log(this.props);
  return(
    <div class ="page">
      <h1>Loans view (detail)</h1>
      <Transaction_Detail_Table transaction={this.props.transaction}/>
      <Show_Transactions_Button/>
      <Return_Items_Button />
      <Renew_Transaction_Button />
    </div>
    )
  } 
   
  }
});


var Transaction_Detail_Table = React.createClass({
  render: function() {
    let transaction = this.props.transaction;
      var all_items = [];
      for (var item in transaction.items) {
        all_items.push(
        <tr>
          <th>Item Name</th>
          <td>{transaction.items[item].item_name}</td>
          <th>Amount</th>
          <td>{transaction.items[item].item_amount}</td>
        </tr>
        )
      }
  return (
    <table>
      <tbody>
        <tr>
          <th>Date</th>
          <td>{transaction.date.substring(0,10)}</td>
        </tr>
        <tr>
          <th>Expiry Date</th>
          <td>{transaction.expiry_date.substring(0,10)}</td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{transaction.name}</td>
        </tr>

        {all_items}
      </tbody>
    </table>
  )
  }
})

/* --------------------------------- 
 *
 * Add Transaction Form Page 
 * 
 * --------------------------------- */ 


var Add_Item_Button = React.createClass({
  handleClick: function(){
    this.props.Click();
  },
  render: function() {
    return (
      <button className="add_item_button" onClick =
      {this.handleClick} >
      Add new item
      </button>
    )
  }
});

var Add_Transaction_Form_Page = React.createClass({
  getInitialState: function() {
  return  ({
    item_count: 1,
    items: [{item_name: '', item_amount: ''}],
    name: '',
    phone_number: ''
    })
  },
  handleClick: function() {
    console.log("clicked");
    this.state.items.push({item_name: '', item_amount: ''});
    this.setState({
      item_count: this.state.item_count + 1,
      items: this.state.items
    });
    return this.state.item_count;
  },
  handleSubmit: function(event) {    
    var data =  {
      name: this.state.name,
      phone_number: this.state.phone_number,
      items: this.state.items
    };
    
    console.log(data);
    console.log(this.state.name);
    console.log(JSON.stringify(data));

    
    var request = new XMLHttpRequest();
    request.open("POST", "/trans");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(data));

    event.preventDefault();
  },
  handleChange: function(key, item_name, item_amount){
    // console.log(key, item_name, item_amount);
    this.state.items[key].item_name = item_name;
    this.state.items[key].item_amount = item_amount;
    // console.log(item_name, item_amount);
    this.setState({
      items: this.state.items
    });
  },
  handleNameChange: function(event) {
    console.log(event.target.value);
    this.state.name = event.target.value;
    this.setState({
      name: this.state.name
    });
    //console.log(this.state.name);
  },
  handlePhoneNoChange: function(event) {
    this.state.phone_number = event.target.value;
    this.setState({
      phone_number: this.state.phone_number
    });
  },
  
  render: function(){
    if (active_page != 'Add_Transaction_Form_Page') {
      return(null);
    }
    var items = [];
    for (let i = 0; i < this.state.item_count; i++) {
      items.push(<Item react_key={i} key={i} values={this.state.items[i]}
      onChange={this.handleChange} />)
    };
    // console.log(this.state.items);
    // console.log(this.state.name);
    return(
      <div class ="page">
      <form>
      <h1>Add new loan</h1>
        Name: <input type='text' value={this.state.name} onChange={this.handleNameChange}></input><br/>
        Phone number: <input type ='text' value={this.state.phone_number} onChange={this.handlePhoneNoChange}></input><br/>
        <Add_Item_Button Click={this.handleClick}/>
        <table>
          <thead>
            <tr>
            <th>Item name</th>
            <th>Item amount</th>
            </tr>
          </thead>
          <tbody>
          {items}
          </tbody>
        </table>
        <input type='submit' value='Add loan' onClick={this.handleSubmit}></input>
        <Back_to_Home_Button />
      </form>
      </div>
    )
  }
})

var Item = React.createClass({  
  handleChange: function() {
    //Calls the function onChange in Add_Transaction_Form to mutate the state in the parent. 
    this.props.onChange(this.props.react_key, this.refs.item_name.value,
    this.refs.item_amount.value);
  },
  
  render: function(){
    //console.log(this.props.values);
    return(
      <tr height="20px">
      <td><input type = 'text'
          value={this.props.values.item_name} ref="item_name"
                                              onChange={this.handleChange}></input></td>
      <td><input type = 'text' value={this.props.values.item_amount}
                                              ref="item_amount"
                                              onChange={this.handleChange}></input></td>
      </tr>
    )
  }
})

/* ------------------------
 * 
 * Page wrapper 
 *
 * ------------------------- */


var Page = React.createClass({
  getInitialState: function (){
    return({
      active_page: active_page,
      transaction_shown: {}
    })
  },
  componentDidMount: function() {
    dispatcher.addEventListener('send_transaction_details',
      (transaction) => {
          this.state.transaction_shown = transaction;
          this.setState({
            transaction_shown: this.state.transaction_shown
          });
          console.log('called');
          console.log(this);
          console.log(this.state.transaction_shown);
          //console.log(dispatcher.state.transaction_shown);
    });
    dispatcher.addEventListener('update_transaction', (action) => {
      var update = new XMLHttpRequest();
      // console.log(this.state.transaction_shown._id);
      let id = this.state.transaction_shown._id;
      // console.log(id);
      let url = '/trans/' + id + '/' + action;
      console.log(url);
      // /trans/_id/renew
      update.open('PUT', url);
      update.onreadystatechange = () => {
        if (update.readyState == 4){
          dispatcher.dispatchEvent('send_transaction_details', 
          JSON.parse(update.responseText))
          // Why do I even need to dispatch this event to be honest
          // I can mutate the state straight away from here. Ah well
          // I think it's cleaner to do this. DRY after all...
        };
      }
      update.send();
     });
  },
  render: function() {
    //console.log(this.state.active_page);
    return (
      <div id ="body">
      <Home_Page />
      <Add_Transaction_Form_Page/>
      <Transactions_View_Page/>
      <Transaction_View_Detail_Page transaction={this.state.transaction_shown}/>
      </div>
    )
  }
})

var realPage = ReactDOM.render(<Page />, document.getElementById('content'));

//ReactDOM.render(realPage);

//ReactDOM.render(<Page />, document.getElementById('content'));

