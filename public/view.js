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
dispatcher.registerEvent('send_store_transactions');


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

var Add_Store_Button = React.createClass({
  onClick: function() {
    
  }
  render: function() {
    return(
        <button className="add_store_button" 
        onClick = {this.handleClick} >
        Add new store
        </button>
        )
  }
})

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
    dispatcher.dispatchEvent('update_transaction', 'return');
  },
  render: function () {
    return (
      <button onClick={this.handleClick}>Return items</button>
  )
 } 
});

var Renew_Transaction_Button = React.createClass({
  handleClick() {
    dispatcher.dispatchEvent('update_transaction', 'renew');
  },

  render: function () {
  return (<button onClick={this.handleClick}>Renew loan</button>)
 } 
})

var Back_to_Home_Button = React.createClass({
  handleClick: function(event){
    active_page = 'Home_Page';
    realPage.setState({active_page: active_page});
    event.preventDefault();
  },
  render: function() {
    return (
      <button className="home_button" onClick =
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
      <Stores_Table request="/store" />
      <Add_Store_Button/>
      </div>
    )

    }
  }
})


/* --------------------
 * 
 * Stores table and page
 * 
 * -------------------- */


var Stores_Table = React.createClass({
  getInitialState: function() {
    return ({
      stores: []
    });
  },
  componentDidMount: function() {
    var get = new XMLHttpRequest();
    get.open("GET", this.props.request);
    get.onreadystatechange = () => {
      if (get.readyState == 4) {
        this.setState({
          stores: JSON.parse(get.responseText)
        })
      }
    }
    get.send();
  },
  render: function() {
    var rows = [];
    for (var i = 0; i < this.state.stores.length; i++) {
      //console.log(this.state.transactions[i]);
      rows.push(<Stores_Table_Row key={i} values={this.state.stores[i]}/>)
    }
    return(
        <table>
          <thead>
            <tr>
              <th> Store </th>
              <th> Store ID </th>
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
  handleClick: function () {
    var req = new XMLHttpRequest();
    req.open("GET", ("/store/" + this.props.values._id + "/trans"));
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        var res = JSON.parse(req.responseText);
        // I have to pass this "res" to the realpage or trans view page
        active_page = 'Transactions_View_Page';
        dispatcher.dispatchEvent('send_store_transactions', res);
        realPage.setState({active_page: active_page});
      }
    }
    req.send();
  },
  render: function() {
    return (
        <tr onClick = {this.handleClick}>
        <td>{ this .props.values.name }</td>
        <td>{ this.props.values._id }</td>
        </tr>
        )
  }
})

/* -----------------
 *
 * Transactions Table
 *
 * --------------------- */ 

var Transactions_View_Page = React.createClass({
  render: function () {
    if (active_page != "Transactions_View_Page") {
      return(null);
    }
    else {
      // console.log(this.props);
      // console.log(this.props.transactions);
      // When this page loads
      return  (
        <div class="page">
        <h1> Loans overview </h1>
        <Transaction_Table transactions = {this.props.transactions} />
        <Add_Item_Button />
        <Back_to_Home_Button />
        </div>
      )
    }
  }
})

var Transaction_Table = React.createClass({
  render: function() {
    // console.log(this.props.transactions);
    var rows = [];
    for (var i = 0; i < this.props.transactions.length; i++) {
      //console.log(this.state.transactions[i]);
      rows.push(<Table_Row key={i} values={this.props.transactions[i]}/>)
    }
 
    
    return (
      <table>
      <Transaction_Table_Header_Row />
        <tbody>
        {rows}
        </tbody>
      </table>
    )
  }
});

var Transaction_Table_Header_Row = React.createClass({
  render: function(){
    return (
      <thead>
        <tr>
        <th>Date</th>
        <th>Expiry Date</th>
        <th>Name</th>
        <th>Phone Number</th>
        </tr>
      </thead>
    )
  }
})


var Table_Row = React.createClass({
  handleClick: function() {
    active_page = 'Transaction_View_Detail_Page';

    dispatcher.dispatchEvent('send_transaction_details', this.props.values);
    realPage.setState({
      active_page: active_page
    });
  },
  render: function() {
    
    function days_till_expiry(date) {
      var e_d = Date.parse(date);
      // console.log(e_d);
      // console.log(Date.now());
      // console.log(e_d - Date.now());
      // console.log(Math.ceil((e_d - Date.now())/(1000*60*60*24)))
      return(Math.ceil((e_d - Date.now())/(1000*60*60*24)));
    }
    
    function parse_date(date){
      return(date.substring(0,10));
    };
   var status = days_till_expiry(this.props.values.expiry_date);
   var tr_style = {
    
   }
   if (this.props.values.returned === true) {
     tr_style = {
       textDecoration: 'line-through',
       color: 'hsl(30, 4%, 76%)'
     }
   }
   else if (status <= 0) {
     tr_style = {
       backgroundColor: 'hsl(0, 97%, 68%)'
     }
   }
    else if (status <= 3) {
      tr_style = {
       backgroundColor: 'hsl(30, 78%, 63%)'  
      }
     }
    return(
      <tr style={tr_style} onClick= {this.handleClick}>
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
    // console.log('props');
    // console.log(this);
    // console.log(this.props);
  return(
    <div class ="page">
      <h1>Loans view (detail)</h1>
      <Transaction_Detail_Table transaction={this.props.transaction}/>
      <Return_Items_Button />
      <Renew_Transaction_Button />
      <Back_to_Home_Button />
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
          <td>{transaction.items[item].name}</td>
          <th>No.</th>
          <td>{transaction.items[item].amount}</td>
        </tr>
        )
      }
  return (
    <table id="transaction_detail_table">
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
          <th>Returned</th>
          <td>{transaction.returned.toString()}</td>
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
  handleClick: function(event){
    this.props.Click();
    event.preventDefault();
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

var Remove_Item_Button = React.createClass({
  handleClick: function(event){
    this.props.Click();
    event.preventDefault();
  },
  render: function() {
    return (
      <button className="remove_item_button" onClick =
      {this.handleClick} >
      Remove item
      </button>
    )
  }
});


var Add_Transaction_Form_Page = React.createClass({
  getInitialState: function() {
  return  ({
    item_count: 1,
    items: [{name: '', amount: ''}],
    name: '',
    phone_number: '',
    expiry_date_number: 1,
    expiry_date_selector: 'month'
    })
  },
  handleAddClick: function() {
    console.log("clicked");
    this.state.items.push({item_name: '', item_amount: ''});
    this.setState({
      item_count: this.state.item_count + 1,
      items: this.state.items
    });
    return this.state.item_count;
  },  
  handleRemoveClick: function() {
    console.log("clicked");
    this.state.items.splice(-1, 1);
    console.log(this.state.items);
    if (this.state.item_count == 0) {
      this.state.item_count = 0;
    }
    else {
      this.state.item_count --;
    }
    console.assert(this.state.item_count >= 0);
    this.setState({
      item_count: this.state.item_count,
      items: this.state.items
    });
    return this.state.item_count;
  },

  handleSubmit: function(event) {    
    var data =  {
      name: this.state.name,
      //Strip phone number inputs.
      phone_number: this.state.phone_number.replace(/ /g, ''),
      items: this.state.items,
      expiry_date_number: this.state.expiry_date_number,
      expiry_date_selector: this.state.expiry_date_selector
    };
    
    console.log(data);
    console.log(this.state.name);
    console.log(JSON.stringify(data));

    
    var request = new XMLHttpRequest();
    request.open("POST", "/trans");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(data));
    
    //Clear everything...
    
    this.setState({
      item_count: 1,
      items: [{name: '', amount: ''}],
      name: '',
      phone_number: '',
      expiry_date_number: 1,

    });

    event.preventDefault();
  },
  handleChange: function(key, name, amount){
    // console.log(key, item_name, item_amount);
    this.state.items[key].name = name;
    this.state.items[key].amount = amount;
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
  handleExpiryDateNumberChange: function(event) {
    this.state.expiry_date_number = event.target.value;
    console.log(this.state.expiry_date_number);
    this.setState({
      expiry_date_number: this.state.expiry_date_number
    });
  },
  handleExpiryDurationChange: function(event) {
    this.state.expiry_date_selector = event.target.value;
    this.setState({
      expiry_date_selector: this.state.expiry_date_selector
    });
    console.log(this.state.expiry_date_selector);
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
        <label for="name">Name</label>
        <input 
          type='text' 
          name="name"
          placeholder='Name' 
          value={this.state.name} 
          onChange={this.handleNameChange} 
          required>
        </input>
        <label for="phone_number">Phone number</label>
        <input 
          type ='tel' 
          name="phone_number" 
          placeholder='Phone number' 
          value={this.state.phone_number} 
          onChange={this.handlePhoneNoChange}
          required>
        </input>
        <label for="expiry_duration_number">Expiry date</label>
        <input
          //className = 'half-width'
          id = 'half-width'
          type = 'number'
          name = 'expiry_duration_number'
          placeholder = '1'
          value = {this.state.expiry_date_number}
          onChange={this.handleExpiryDateNumberChange}
          min = "1"
          required
        >
        </input>
        <select 
          onChange={this.handleExpiryDurationChange}
          defaultValue="month" 
          name="expiry_duration_selector"
        >
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
        </select>
        <Add_Item_Button Click={this.handleAddClick}/>
        <Remove_Item_Button Click={this.handleRemoveClick}/>
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
    this.props.onChange(this.props.react_key, this.refs.name.value,
    this.refs.amount.value);
  },
  
  render: function(){
    //console.log(this.props.values);
    return(
      <tr height="20px">
      <td>
        <input 
          required
          type = 'text' 
          placeholder="Item name"
          value={this.props.values.name} 
          ref="name"
          onChange={this.handleChange}
        >
        </input>
      </td>
      <td>
      <input 
        type = 'number' 
        min= "1"
        placeholder = "Amount"
        value={this.props.values.amount}
        ref="amount"
        onChange={this.handleChange}
        required>
      </input>
      </td>
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
      store_transactions: {}, // Transactions of the active store.
      transaction_shown: {}
    })
  },
  componentDidMount: function() {

    dispatcher.addEventListener('send_store_transactions', (store_trans) => {
      this.state.store_transactions = store_trans;
      // console.log(this.state.store_transactions);
      this.setState({
        store_transactions: this.state.store_transactions
      });
    });
    
    dispatcher.addEventListener('send_transaction_details',
      (transaction) => {
          this.state.transaction_shown = transaction;
          this.setState({
            transaction_shown: this.state.transaction_shown
          });
          // console.log('called');
          // console.log(this);
          // console.log(this.state.transaction_shown);
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
      <Transactions_View_Page transactions={this.state.store_transactions} />
      <Transaction_View_Detail_Page transaction={this.state.transaction_shown} />
      </div>
    )
  }
})

var realPage = ReactDOM.render(<Page />, document.getElementById('content'));

//ReactDOM.render(realPage);

//ReactDOM.render(<Page />, document.getElementById('content'));

