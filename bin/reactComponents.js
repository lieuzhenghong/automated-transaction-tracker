'use strict';

function set_HTTP_header(request) {
  var token = localStorage.getItem('token');

  if (token) {
    request.setRequestHeader('x-access-token', token);
    return request;
  } else {
    return "Error: token could not be found. Check localStorage";
  }
}
"use strict";

var Back_to_Home_Button = React.createClass({
  displayName: "Back_to_Home_Button",

  handleClick: function handleClick(event) {
    var active_page = 'Home_Page';
    homePage.setState({ active_page: active_page });
    event.preventDefault();
  },
  render: function render() {
    return React.createElement(
      "button",
      { className: "home_button", onClick: this.handleClick },
      "Back"
    );
  }
});
'use strict';

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

Event.prototype.registerCallback = function (callback) {
  this.callbacks.push(callback);
};

function Dispatcher() {
  this.events = {};
};

Dispatcher.prototype.registerEvent = function (event_name) {
  var event = new Event(event_name);
  this.events[event_name] = event;
  // console.log(this.events);
};

Dispatcher.prototype.dispatchEvent = function (event_name, event_arguments) {
  this.events[event_name].callbacks.forEach(function (callback) {
    callback(event_arguments);
    // console.log('dispatched');
    // console.log(callback, event_arguments);
  });
};

Dispatcher.prototype.addEventListener = function (event_name, callback) {
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
dispatcher.registerEvent('update_transaction');
dispatcher.registerEvent('send_store_transactions');
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Add_Store_Page = function (_React$Component) {
  _inherits(Add_Store_Page, _React$Component);

  function Add_Store_Page(props) {
    _classCallCheck(this, Add_Store_Page);

    var _this = _possibleConstructorReturn(this, (Add_Store_Page.__proto__ || Object.getPrototypeOf(Add_Store_Page)).call(this, props));

    _this.state = {
      //When component mounts, send a GET request to the server to populate
      //these fields 
      _id: '',
      name: '',
      owner: [],
      contributors_ids: [],
      contributors: [],
      output_content: [],
      status_message: ''
    };
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(Add_Store_Page, [{
    key: 'handleClick',
    value: function handleClick(e) {
      console.log('clicked');
      var clicked = e.target.parentNode.id;
      //console.log(this.state.output_content[clicked]);
      this.state.contributors.push(this.state.output_content[clicked]);
      this.state.contributors_ids.push(this.state.output_content[clicked]._id);
      this.setState({
        contributors_id: this.state.contributors_id,
        contributors: this.state.contributors
      });
      console.log(this.state.contributors);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(key) {
      var _this2 = this;

      return function (e) {
        if (key === 'contributors') {
          // I have to debounce this
          if (e.target.value != '') {
            //Make sure I don't send a useless blank request
            var req = new XMLHttpRequest();
            req.open("GET", "/user/" + e.target.value);
            req = set_HTTP_header(req);
            req.onreadystatechange = function () {
              if (req.readyState == 4) {
                var res = JSON.parse(req.responseText);
                _this2.setState({
                  output_content: res
                });
              }
            };
            req.send();
          } else {
            _this2.setState({
              output_content: []
            });
          }
        } else {
          var state = {};
          state[key] = e.target.value;
          _this2.setState(state);
          //console.log(this.state);
        }
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this3 = this;

      e.preventDefault();
      console.log('sending POST request');
      var data = {
        _user_id: localStorage.getItem('_user_id'),
        name: this.state.name,
        contributors: this.state.contributors
      };
      var req = new XMLHttpRequest();
      req.open("POST", "/" + localStorage.getItem('_user_id') + '/store');
      req = set_HTTP_header(req);
      req.onreadystatechange = function () {

        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);
          console.log(res);_this3.setState({
            status_message: (res.success ? 'Success! ' : 'Failure! ') + res.message
          });
        }
      };
      req.setRequestHeader('Content-type', 'application/json');
      req.send(JSON.stringify(data));
    }
  }, {
    key: 'render',
    value: function render() {
      var rows = [];
      var c = this.state.output_content;

      for (var i = 0; i < c.length; i++) {
        rows.push(React.createElement(
          'tr',
          {
            id: i,
            onClick: this.handleClick },
          React.createElement(
            'td',
            null,
            c[i].username
          ),
          React.createElement(
            'td',
            null,
            c[i].phone_number
          )
        ));
      }

      var contributors = [];
      var d = this.state.contributors;

      for (var _i = 0; _i < d.length; _i++) {
        contributors.push(React.createElement(
          'li',
          { id: _i },
          d[_i].username
        ));
      }

      if (this.props.active_page != 'Add_Store_Page') {
        return null;
      } else {
        return React.createElement(
          'div',
          { id: 'body' },
          React.createElement(
            'h1',
            null,
            'Add store'
          ),
          React.createElement(
            'form',
            null,
            React.createElement(
              'p',
              null,
              this.state.status_message
            ),
            React.createElement(
              'p',
              null,
              'Store name: ',
              this.state.name
            ),
            React.createElement(
              'p',
              null,
              'Owner: ',
              this.state.owner.username
            ),
            React.createElement(
              'div',
              null,
              'Contributors:',
              React.createElement(
                'ul',
                null,
                contributors
              )
            ),
            React.createElement(
              'label',
              { htmlFor: 'name' },
              'Store name'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'name',
              defaultValue: this.state.name,
              onChange: this.handleChange('name')
            }),
            React.createElement(
              'div',
              { id: 'search' },
              React.createElement(
                'label',
                { htmlFor: 'search_contributors' },
                'Contributors'
              ),
              React.createElement(
                'ul',
                null,
                contributors
              ),
              React.createElement('input', {
                id: 'search_contributors',
                type: 'search',
                onChange: this.handleChange('contributors')
              }),
              React.createElement(
                'table',
                { id: 'output_content' },
                React.createElement(
                  'thead',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      'Display name'
                    ),
                    React.createElement(
                      'td',
                      null,
                      'Phone number'
                    )
                  )
                ),
                React.createElement(
                  'tbody',
                  null,
                  rows
                )
              )
            ),
            React.createElement('input', { type: 'submit', value: 'Save changes', onClick: this.handleSubmit })
          )
        );
      }
    }
  }]);

  return Add_Store_Page;
}(React.Component);
"use strict";

/* --------------------------------- 
 *
 * Add Transaction Form Page 
 * 
 * --------------------------------- */

var Add_Item_Button = React.createClass({
  displayName: "Add_Item_Button",

  handleClick: function handleClick(event) {
    this.props.Click();
    event.preventDefault();
  },
  render: function render() {
    return React.createElement(
      "button",
      { className: "add_item_button", onClick: this.handleClick },
      "Add new item"
    );
  }
});

var Remove_Item_Button = React.createClass({
  displayName: "Remove_Item_Button",

  handleClick: function handleClick(event) {
    this.props.Click();
    event.preventDefault();
  },
  render: function render() {
    return React.createElement(
      "button",
      { className: "remove_item_button", onClick: this.handleClick },
      "Remove item"
    );
  }
});

var Add_Transaction_Page = React.createClass({
  displayName: "Add_Transaction_Page",

  getInitialState: function getInitialState() {
    return {
      item_count: 1,
      items: [{ name: '', amount: '' }],
      name: '',
      phone_number: '',
      expiry_date_number: 1,
      expiry_date_selector: 'month'
    };
  },
  handleAddClick: function handleAddClick() {
    console.log("clicked");
    this.state.items.push({ item_name: '', item_amount: '' });
    this.setState({
      item_count: this.state.item_count + 1,
      items: this.state.items
    });
    return this.state.item_count;
  },
  handleRemoveClick: function handleRemoveClick() {
    console.log("clicked");
    this.state.items.splice(-1, 1);
    console.log(this.state.items);
    if (this.state.item_count == 0) {
      this.state.item_count = 0;
    } else {
      this.state.item_count--;
    }
    console.assert(this.state.item_count >= 0);
    this.setState({
      item_count: this.state.item_count,
      items: this.state.items
    });
    return this.state.item_count;
  },

  handleSubmit: function handleSubmit(event) {
    var data = {
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
    request.open("POST", "/" + localStorage.getItem('_user_id') + "/store/" + this.props.active_store._id + "/trans");
    request.setRequestHeader('Content-type', 'application/json');
    request = set_HTTP_header(request);

    request.send(JSON.stringify(data));

    //Clear everything...

    this.setState({
      item_count: 1,
      items: [{ name: '', amount: '' }],
      name: '',
      phone_number: '',
      expiry_date_number: 1

    });

    event.preventDefault();
  },
  handleChange: function handleChange(key, name, amount) {
    // console.log(key, item_name, item_amount);
    this.state.items[key].name = name;
    this.state.items[key].amount = amount;
    // console.log(item_name, item_amount);
    this.setState({
      items: this.state.items
    });
  },
  handleNameChange: function handleNameChange(event) {
    console.log(event.target.value);
    this.state.name = event.target.value;
    this.setState({
      name: this.state.name
    });
    //console.log(this.state.name);
  },
  handlePhoneNoChange: function handlePhoneNoChange(event) {
    this.state.phone_number = event.target.value;
    this.setState({
      phone_number: this.state.phone_number
    });
  },
  handleExpiryDateNumberChange: function handleExpiryDateNumberChange(event) {
    this.state.expiry_date_number = event.target.value;
    console.log(this.state.expiry_date_number);
    this.setState({
      expiry_date_number: this.state.expiry_date_number
    });
  },
  handleExpiryDurationChange: function handleExpiryDurationChange(event) {
    this.state.expiry_date_selector = event.target.value;
    this.setState({
      expiry_date_selector: this.state.expiry_date_selector
    });
    console.log(this.state.expiry_date_selector);
  },

  render: function render() {
    if (this.props.active_page != 'Add_Transaction_Page') {
      return null;
    }
    console.log('Add_Trans_Page');
    var items = [];
    for (var i = 0; i < this.state.item_count; i++) {
      items.push(React.createElement(Item, { react_key: i, key: i, values: this.state.items[i],
        onChange: this.handleChange }));
    };
    return React.createElement(
      "div",
      { "class": "page" },
      React.createElement(
        "form",
        null,
        React.createElement(
          "h1",
          null,
          "Add new loan"
        ),
        React.createElement(
          "label",
          { htmlFor: "name" },
          "Name"
        ),
        React.createElement("input", {
          type: "text",
          name: "name",
          placeholder: "Name",
          value: this.state.name,
          onChange: this.handleNameChange,
          required: true }),
        React.createElement(
          "label",
          { htmlFor: "phone_number" },
          "Phone number"
        ),
        React.createElement("input", {
          type: "tel",
          name: "phone_number",
          placeholder: "Phone number",
          value: this.state.phone_number,
          onChange: this.handlePhoneNoChange,
          required: true }),
        React.createElement(
          "label",
          { htmlFor: "expiry_duration_number" },
          "Expiry date"
        ),
        React.createElement("input", {
          //className = 'half-width'
          id: "half-width",
          type: "number",
          name: "expiry_duration_number",
          placeholder: "1",
          value: this.state.expiry_date_number,
          onChange: this.handleExpiryDateNumberChange,
          min: "1",
          required: true
        }),
        React.createElement(
          "select",
          {
            onChange: this.handleExpiryDurationChange,
            defaultValue: "month",
            name: "expiry_duration_selector"
          },
          React.createElement(
            "option",
            { value: "day" },
            "day"
          ),
          React.createElement(
            "option",
            { value: "week" },
            "week"
          ),
          React.createElement(
            "option",
            { value: "month" },
            "month"
          )
        ),
        React.createElement(Add_Item_Button, { Click: this.handleAddClick }),
        React.createElement(Remove_Item_Button, { Click: this.handleRemoveClick }),
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                null,
                "Item name"
              ),
              React.createElement(
                "th",
                null,
                "Item amount"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            items
          )
        ),
        React.createElement("input", { type: "submit", value: "Add loan", onClick: this.handleSubmit }),
        React.createElement(Back_to_Home_Button, null)
      )
    );
  }
});

var Item = React.createClass({
  displayName: "Item",

  handleChange: function handleChange() {
    //Calls the function onChange in Add_Transaction_Form to mutate the state in the parent. 
    this.props.onChange(this.props.react_key, this.refs.name.value, this.refs.amount.value);
  },

  render: function render() {
    //console.log(this.props.values);
    return React.createElement(
      "tr",
      { height: "20px" },
      React.createElement(
        "td",
        null,
        React.createElement("input", {
          required: true,
          type: "text",
          placeholder: "Item name",
          value: this.props.values.name,
          ref: "name",
          onChange: this.handleChange
        })
      ),
      React.createElement(
        "td",
        null,
        React.createElement("input", {
          type: "number",
          min: "1",
          placeholder: "Amount",
          value: this.props.values.amount,
          ref: "amount",
          onChange: this.handleChange,
          required: true })
      )
    );
  }
});
'use strict';

/* -------------------
 *
 * Transaction View Detail page
 *
 * ----------------------- */

var Transaction_View_Detail_Page = React.createClass({
  displayName: 'Transaction_View_Detail_Page',

  render: function render() {
    if (this.props.active_page != 'Transaction_View_Detail_Page') {
      return null;
    } else {
      //console.log(this.props);
      return React.createElement(
        'div',
        { 'class': 'page' },
        React.createElement(
          'h1',
          null,
          'Loans view (detail)'
        ),
        React.createElement(Transaction_Detail_Table, { transaction: this.props.transaction }),
        React.createElement(Return_Items_Button, null),
        React.createElement(Renew_Transaction_Button, null),
        React.createElement(Back_to_Home_Button, null)
      );
    }
  }
});

var Return_Items_Button = React.createClass({
  displayName: 'Return_Items_Button',
  handleClick: function handleClick() {
    dispatcher.dispatchEvent('update_transaction', 'return');
  },

  render: function render() {
    return React.createElement(
      'button',
      { onClick: this.handleClick },
      'Return items'
    );
  }
});

var Renew_Transaction_Button = React.createClass({
  displayName: 'Renew_Transaction_Button',
  handleClick: function handleClick() {
    dispatcher.dispatchEvent('update_transaction', 'renew');
  },


  render: function render() {
    return React.createElement(
      'button',
      { onClick: this.handleClick },
      'Renew loan'
    );
  }
});

var Transaction_Detail_Table = React.createClass({
  displayName: 'Transaction_Detail_Table',

  render: function render() {
    var transaction = this.props.transaction;
    var all_items = [];
    for (var item in transaction.items) {
      all_items.push(React.createElement(
        'tr',
        null,
        React.createElement(
          'th',
          null,
          'Item Name'
        ),
        React.createElement(
          'td',
          null,
          transaction.items[item].name
        ),
        React.createElement(
          'th',
          null,
          'No.'
        ),
        React.createElement(
          'td',
          null,
          transaction.items[item].amount
        )
      ));
    }
    return React.createElement(
      'table',
      { id: 'transaction_detail_table' },
      React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Date'
          ),
          React.createElement(
            'td',
            null,
            transaction.date.substring(0, 10)
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Expiry Date'
          ),
          React.createElement(
            'td',
            null,
            transaction.expiry_date.substring(0, 10)
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Returned'
          ),
          React.createElement(
            'td',
            null,
            transaction.returned.toString()
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Name'
          ),
          React.createElement(
            'td',
            null,
            transaction.name
          )
        ),
        all_items
      )
    );
  }
});
"use strict";

/* -----------------
 *
 * Transactions View Page
 *
 * --------------------- */

var Transactions_View_Page = React.createClass({
  displayName: "Transactions_View_Page",

  render: function render() {
    if (this.props.active_page != "Transactions_View_Page") {
      return null;
    } else {
      // When this page loads
      return React.createElement(
        "div",
        { className: "page" },
        React.createElement(
          "h1",
          null,
          " Loans overview for ",
          this.props.active_store.name
        ),
        React.createElement(Transaction_Table, { transactions: this.props.transactions }),
        React.createElement(Add_Transaction_Button, null),
        React.createElement(Back_to_Home_Button, null)
      );
    }
  }
});

var Add_Transaction_Button = React.createClass({
  displayName: "Add_Transaction_Button",

  handleClick: function handleClick() {
    var active_page = 'Add_Transaction_Page';
    console.log('clicked');
    homePage.setState({ active_page: active_page });
  },
  render: function render() {
    return React.createElement(
      "button",
      { className: "add_transaction_button",
        onClick: this.handleClick },
      "Add new loan"
    );
  }
});

var Transaction_Table = React.createClass({
  displayName: "Transaction_Table",

  render: function render() {
    // console.log(this.props.transactions);
    var rows = [];
    for (var i = 0; i < this.props.transactions.length; i++) {
      //console.log(this.state.transactions[i]);
      rows.push(React.createElement(Table_Row, { key: i, values: this.props.transactions[i] }));
    }

    return React.createElement(
      "table",
      null,
      React.createElement(Transaction_Table_Header_Row, null),
      React.createElement(
        "tbody",
        null,
        rows
      )
    );
  }
});

var Transaction_Table_Header_Row = React.createClass({
  displayName: "Transaction_Table_Header_Row",

  render: function render() {
    return React.createElement(
      "thead",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement(
          "th",
          null,
          "Date"
        ),
        React.createElement(
          "th",
          null,
          "Expiry Date"
        ),
        React.createElement(
          "th",
          null,
          "Name"
        ),
        React.createElement(
          "th",
          null,
          "Phone Number"
        )
      )
    );
  }
});

var Table_Row = React.createClass({
  displayName: "Table_Row",

  handleClick: function handleClick() {
    var active_page = 'Transaction_View_Detail_Page';

    dispatcher.dispatchEvent('send_transaction_details', this.props.values);
    homePage.setState({
      active_page: active_page
    });
  },
  render: function render() {

    function days_till_expiry(date) {
      var e_d = Date.parse(date);
      // console.log(e_d);
      // console.log(Date.now());
      // console.log(e_d - Date.now());
      // console.log(Math.ceil((e_d - Date.now())/(1000*60*60*24)))
      return Math.ceil((e_d - Date.now()) / (1000 * 60 * 60 * 24));
    }

    function parse_date(date) {
      return date.substring(0, 10);
    };
    var status = days_till_expiry(this.props.values.expiry_date);
    var tr_style = {};
    if (this.props.values.returned === true) {
      tr_style = {
        textDecoration: 'line-through',
        color: 'hsl(30, 4%, 76%)'
      };
    } else if (status <= 0) {
      tr_style = {
        backgroundColor: 'hsl(0, 97%, 68%)'
      };
    } else if (status <= 3) {
      tr_style = {
        backgroundColor: 'hsl(30, 78%, 63%)'
      };
    }
    return React.createElement(
      "tr",
      { style: tr_style, onClick: this.handleClick },
      React.createElement(
        "td",
        null,
        parse_date(this.props.values.date)
      ),
      React.createElement(
        "td",
        null,
        parse_date(this.props.values.expiry_date)
      ),
      React.createElement(
        "td",
        null,
        this.props.values.name
      ),
      React.createElement(
        "td",
        null,
        this.props.values.phone_number
      )
    );
  }
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Store_Management_Page = function (_React$Component) {
  _inherits(Store_Management_Page, _React$Component);

  function Store_Management_Page(props) {
    _classCallCheck(this, Store_Management_Page);

    var _this = _possibleConstructorReturn(this, (Store_Management_Page.__proto__ || Object.getPrototypeOf(Store_Management_Page)).call(this, props));

    _this.state = {
      //When component mounts, send a GET request to the server to populate
      //these fields 
      _id: '',
      name: '',
      owner: [],
      contributors_ids: [],
      contributors: [],
      output_content: [],
      status_message: ''
    };
    _this.onRender = _this.onRender.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(Store_Management_Page, [{
    key: 'onRender',
    value: function onRender() {
      var _this2 = this;

      var req = new XMLHttpRequest();
      req.open("GET", "/user/" + localStorage.getItem('_user_id') + "/store/" + this.props.active_store._id + "/manage");
      req = set_HTTP_header(req);
      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);
          console.log(res);
          // First item is the store object, 
          // second the owner object,
          // third item the array of contributors
          _this2.setState({
            _id: res[0]._id,
            name: res[0].name,
            contributors_ids: res[0].contributors,
            owner: res[1],
            contributors: res[2]
          });
          console.log(_this2.state);
        }
      };
      req.send();
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      console.log('clicked');
      var clicked = e.target.parentNode.id;
      //console.log(this.state.output_content[clicked]);
      this.state.contributors.push(this.state.output_content[clicked]);
      this.state.contributors_ids.push(this.state.output_content[clicked]._id);
      this.setState({
        contributors_id: this.state.contributors_id,
        contributors: this.state.contributors
      });
      console.log(this.state.contributors);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(key) {
      var _this3 = this;

      return function (e) {
        if (key === 'contributors') {
          // I have to debounce this
          if (e.target.value != '') {
            //Make sure I don't send a useless blank request
            var req = new XMLHttpRequest();
            req.open("GET", "/user/" + e.target.value);
            req = set_HTTP_header(req);
            req.onreadystatechange = function () {
              if (req.readyState == 4) {
                var res = JSON.parse(req.responseText);
                _this3.setState({
                  output_content: res
                });
              }
            };
            req.send();
          } else {
            _this3.setState({
              output_content: []
            });
          }
        } else {
          var state = {};
          state[key] = e.target.value;
          _this3.setState(state);
          //console.log(this.state);
        }
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this4 = this;

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
      };
      var req = new XMLHttpRequest();
      req.open("PUT", "/user/" + localStorage.getItem('_user_id') + "/store/" + this.props._id + "/manage");
      req = set_HTTP_header(req);

      req.onreadystatechange = function () {

        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);
          console.log(res);_this4.setState({
            status_message: (res.success ? 'Success!' : 'Failure!') + res.message
          });
        }
      };
      req.setRequestHeader('Content-type', 'application/json');
      req.send(JSON.stringify(data));
    }
  }, {
    key: 'render',
    value: function render() {
      var rows = [];
      var c = this.state.output_content;

      for (var i = 0; i < c.length; i++) {
        rows.push(React.createElement(
          'tr',
          {
            id: i,
            onClick: this.handleClick },
          React.createElement(
            'td',
            null,
            c[i].username
          ),
          React.createElement(
            'td',
            null,
            c[i].phone_number
          )
        ));
      }

      var contributors = [];
      var d = this.state.contributors;

      for (var _i = 0; _i < d.length; _i++) {
        contributors.push(React.createElement(
          'li',
          { id: _i },
          d[_i].username
        ));
      }

      if (this.props.active_page != 'Store_Management_Page') {
        return null;
      } else {
        this.onRender();
        return React.createElement(
          'div',
          { id: 'body' },
          React.createElement(
            'h1',
            null,
            'Change store details'
          ),
          React.createElement(
            'form',
            null,
            React.createElement(
              'p',
              null,
              this.state.status_message
            ),
            React.createElement(
              'p',
              null,
              'Store name: ',
              this.state.name
            ),
            React.createElement(
              'p',
              null,
              'Owner: ',
              this.state.owner.username
            ),
            React.createElement(
              'div',
              null,
              'Contributors:',
              React.createElement(
                'ul',
                null,
                contributors
              )
            ),
            React.createElement(
              'label',
              { htmlFor: 'name' },
              'Store name'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'name',
              defaultValue: this.state.name,
              onChange: this.handleChange('name')
            }),
            React.createElement(
              'div',
              { id: 'search' },
              React.createElement(
                'label',
                { htmlFor: 'search_contributors' },
                'Contributors'
              ),
              React.createElement(
                'ul',
                null,
                contributors
              ),
              React.createElement('input', {
                id: 'search_contributors',
                type: 'search',
                onChange: this.handleChange('contributors')
              }),
              React.createElement(
                'table',
                { id: 'output_content' },
                React.createElement(
                  'thead',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    ' ',
                    React.createElement(
                      'td',
                      null,
                      'Display name'
                    ),
                    React.createElement(
                      'td',
                      null,
                      'Phone number'
                    )
                  )
                ),
                React.createElement(
                  'tbody',
                  null,
                  rows
                )
              )
            ),
            React.createElement('input', { type: 'submit', value: 'Save changes', onClick: this.handleSubmit })
          )
        );
      }
    }
  }]);

  return Store_Management_Page;
}(React.Component);
'use strict';

/* --------------------
 * 
 * Stores table and page
 * 
 * -------------------- */

var Stores_Page = React.createClass({
  displayName: 'Stores_Page',

  render: function render() {
    if (this.props.active_page != 'Stores_Page') {
      return null;
    } else {
      return React.createElement(
        'div',
        { className: 'page' },
        React.createElement(Stores_Table, null),
        React.createElement(Add_Store_Button, { onClick: this.handleClick })
      );
    }
  }
});

var Add_Store_Button = React.createClass({
  displayName: 'Add_Store_Button',

  handleClick: function handleClick() {
    var active_page = 'Add_Store_Page';
    homePage.setState({ active_page: active_page });
  },
  render: function render() {
    return React.createElement(
      'button',
      { className: 'add_store_button',
        onClick: this.handleClick },
      'Add new store'
    );
  }
});

var Stores_Table = React.createClass({
  displayName: 'Stores_Table',

  getInitialState: function getInitialState() {
    return {
      stores: [],
      users: []
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    console.log(localStorage.getItem('_user_id'));
    var _user_id = localStorage.getItem('_user_id');
    var request_url = '/user/' + _user_id + '/store';

    var get = new XMLHttpRequest();
    get.open("GET", request_url);
    get = set_HTTP_header(get);
    get.onreadystatechange = function () {
      if (get.readyState == 4) {
        console.log('OK');
        var res = JSON.parse(get.responseText);
        console.log(res);

        _this.setState({
          stores: res.stores,
          users: res.users
        });
      }
    };
    get.send();
  },
  render: function render() {
    var rows = [];
    for (var i = 0; i < this.state.stores.length; i++) {
      //console.log(this.state.transactions[i]); 
      var user = this.state.users[i];
      if (user === undefined) {
        user = null;
      }

      rows.push(React.createElement(Stores_Table_Row, {
        key: i,
        store: this.state.stores[i],
        user: user
      }));
    }
    return React.createElement(
      'table',
      null,
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'th',
            null,
            'Store'
          ),
          React.createElement(
            'th',
            null,
            'Owner'
          )
        )
      ),
      React.createElement(
        'tbody',
        null,
        rows
      )
    );
  }
});

var Stores_Table_Row = React.createClass({
  displayName: 'Stores_Table_Row',

  getTransactions: function getTransactions() {
    var _this2 = this;

    var req = new XMLHttpRequest();
    var URL = "/user/" + localStorage.getItem('_user_id') + "/store/" + this.props.store._id + "/trans";
    console.log(URL);
    req.open("GET", URL);
    req = set_HTTP_header(req);
    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        var res = JSON.parse(req.responseText);
        // I have to pass this "res" to the realpage or trans view page
        var active_page = 'Transactions_View_Page';
        res.active_store = _this2.props.store;
        dispatcher.dispatchEvent('send_store_transactions', res);
        console.log(res);
        homePage.setState({ active_page: active_page });
      }
    };
    req.send();
  },
  manageStore: function manageStore() {
    var active_page = "Store_Management_Page";
    var active_store = this.props.store;
    homePage.setState({ active_page: active_page, active_store: active_store });
  },
  render: function render() {
    return React.createElement(
      'tr',
      null,
      React.createElement(
        'td',
        { onClick: this.getTransactions },
        this.props.store.name
      ),
      React.createElement(
        'td',
        { onClick: this.getTransactions },
        this.props.user.username
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'button',
          { onClick: this.manageStore },
          'Edit'
        )
      )
    );
  }
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var User_Management_Page = function (_React$Component) {
  _inherits(User_Management_Page, _React$Component);

  function User_Management_Page(props) {
    _classCallCheck(this, User_Management_Page);

    var _this = _possibleConstructorReturn(this, (User_Management_Page.__proto__ || Object.getPrototypeOf(User_Management_Page)).call(this, props));

    _this.state = {
      //When component mounts, send a GET request to the server to populate
      //these fields 
      phone_number: '',
      _id: '',
      username: '',
      status_message: ''
    };
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(User_Management_Page, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      console.log('mounted');
      var req = new XMLHttpRequest();
      req.open("GET", "/user/" + localStorage.getItem('_user_id'));
      req = set_HTTP_header(req);
      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);
          // console.log(res);
          // console.log(Object.keys(res[0]));
          // console.log(res[0]['username']);
          _this2.setState({
            phone_number: res[0].phone_number,
            _id: res[0]._id,
            username: res[0].username
          });
          console.log(_this2.state);
        }
      };
      req.send();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(key) {
      var _this3 = this;

      return function (e) {
        var state = {};
        state[key] = e.target.value;
        _this3.setState(state);
        console.log(_this3.state);
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this4 = this;

      e.preventDefault();
      console.log('sending PUT request');
      //Send a POST request to the server
      // The server needs to check that this phone number isn't already used
      var data = {
        phone_number: this.state.phone_number,
        username: this.state.username
      };
      var req = new XMLHttpRequest();
      req.open("PUT", "/user/" + localStorage.getItem('_user_id'));
      req = set_HTTP_header(req);
      req.onreadystatechange = function () {
        var res = JSON.parse(req.responseText);
        console.log(res);
        _this4.setState({
          status_message: (res.success ? 'Success!' : 'Failure!') + res.message
        });
        _this4.props.onUpdate(res.user);
      };
      req.setRequestHeader('Content-type', 'application/json');
      req.send(JSON.stringify(data));
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.props.active_page != 'User_Management_Page') {
        return null;
      }
      console.log(this.state);
      return React.createElement(
        'div',
        { id: 'body' },
        React.createElement(
          'p',
          null,
          ' ',
          this.state.status_message,
          ' '
        ),
        React.createElement(
          'h1',
          null,
          'Change user details'
        ),
        React.createElement(
          'p',
          null,
          'If you change your phone number, you can edit it here.'
        ),
        React.createElement(
          'form',
          null,
          React.createElement(
            'p',
            null,
            'Phone: ',
            this.state.phone_number,
            ' '
          ),
          React.createElement(
            'p',
            null,
            'User: ',
            this.state.username,
            ' '
          ),
          React.createElement(
            'label',
            { htmlFor: 'phone_number' },
            'Phone number (login with this)'
          ),
          React.createElement('input', {
            required: 'required',
            type: 'number',
            id: 'phone_number',
            defaultValue: this.state.phone_number,
            onChange: this.handleChange('phone_number')
          }),
          React.createElement(
            'label',
            { htmlFor: 'user_name' },
            'Name: Choose a name that is unique so people can find you.'
          ),
          React.createElement('input', {
            required: 'required',
            type: 'text',
            id: 'user_name',
            defaultValue: this.state.username,
            onChange: this.handleChange('username')
          }),
          React.createElement('input', { type: 'submit', value: 'Save changes', onClick: this.handleSubmit })
        )
      );
    }
  }]);

  return User_Management_Page;
}(React.Component);

// ReactDOM.render( <User_Management_Page/>, document.getElementById('content') );
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home_Page = function (_React$Component) {
  _inherits(Home_Page, _React$Component);

  function Home_Page(props) {
    _classCallCheck(this, Home_Page);

    var _this = _possibleConstructorReturn(this, (Home_Page.__proto__ || Object.getPrototypeOf(Home_Page)).call(this, props));

    _this.state = {
      user: {},
      active_page: 'Home Page',
      active_store: {},
      store_transactions: {},
      transaction_shown: {},
      status_message: ''
    };
    _this.goTo = _this.goTo.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.updateUser = _this.updateUser.bind(_this);
    return _this;
  }

  _createClass(Home_Page, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      console.log(localStorage.getItem('_user_id'));
      var _user_id = localStorage.getItem('_user_id');
      var token = localStorage.getItem('token');

      var req = new XMLHttpRequest();
      var url = '/user/' + _user_id;

      console.log(url);

      req.open('GET', url);

      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);

          if (res.success == false) {
            console.log(res.message);
            _this2.setState({
              status_message: res.message
            });
            console.log(_this2.state.status_message);
          } else {
            var user = JSON.parse(req.responseText);
            _this2.state.user = user[0];
            _this2.setState({
              user: _this2.state.user
            });
            console.log(_this2.state.user);
          }
        }
      };
      req = set_HTTP_header(req);
      req.send();

      dispatcher.addEventListener('send_store_transactions', function (store_trans) {
        console.log(store_trans);
        //First, take out the "active store"
        var active_store = store_trans.active_store;
        delete store_trans.active_store;
        _this2.state.store_transactions = store_trans;
        _this2.state.active_store = active_store;
        // console.log(this.state.store_transactions);
        _this2.setState({
          active_store: _this2.state.active_store,
          store_transactions: _this2.state.store_transactions
        });
      });

      dispatcher.addEventListener('send_transaction_details', function (transaction) {
        _this2.state.transaction_shown = transaction;
        _this2.setState({
          transaction_shown: _this2.state.transaction_shown
        });
        // console.log('called');
        // console.log(this);
        // console.log(this.state.transaction_shown);
        //console.log(dispatcher.state.transaction_shown);
      });

      dispatcher.addEventListener('update_transaction', function (action) {
        var _user_id = localStorage.getItem('_user_id');
        var update = new XMLHttpRequest();
        // console.log(this.state.transaction_shown._id);
        var id = _this2.state.transaction_shown._id;
        // console.log(id);
        var url = '/user/' + _user_id + '/store/' + _this2.state.active_store._id + '/trans/' + id + '/' + action;
        console.log(url);
        // /trans/_id/renew
        update.open('PUT', url);

        update.onreadystatechange = function () {
          if (update.readyState == 4) {
            dispatcher.dispatchEvent('send_transaction_details', JSON.parse(update.responseText));
            // Why do I even need to dispatch this event to be honest
            // I can mutate the state straight away from here. Ah well
            // I think it's cleaner to do this. DRY after all...
          };
        };
        set_HTTP_header(update).send();
      });
    }
  }, {
    key: 'goTo',
    value: function goTo(page) {
      var _this3 = this;

      return function (e) {
        var active_page = page;
        console.log(active_page);
        _this3.setState({
          active_page: active_page
        });
      };
    }
  }, {
    key: 'updateUser',
    value: function updateUser(user) {
      this.state.user = user;
      this.setState({
        user: user
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.status_message !== '') {
        var createMessage = function createMessage(message) {
          return { __html: message };
        };

        var message = this.state.status_message;

        return React.createElement('div', { dangerouslySetInnerHTML: createMessage(message) });
      }

      return React.createElement(
        'div',
        null,
        React.createElement(
          'header',
          null,
          this.state.user.username,
          ' ',
          React.createElement(
            'button',
            null,
            'Logout'
          )
        ),
        React.createElement(
          'h1',
          null,
          this.state.active_page
        ),
        React.createElement(
          'button',
          { onClick: this.goTo('User_Management_Page') },
          'Edit user'
        ),
        React.createElement(
          'button',
          { onClick: this.goTo('Stores_Page') },
          'View stores'
        ),
        React.createElement(Stores_Page, { active_page: this.state.active_page }),
        React.createElement(Add_Store_Page, {
          active_page: this.state.active_page
        }),
        React.createElement(Store_Management_Page, {
          active_page: this.state.active_page,
          active_store: this.state.active_store
        }),
        React.createElement(Transactions_View_Page, {
          active_store: this.state.active_store,
          active_page: this.state.active_page,
          transactions: this.state.store_transactions
        }),
        React.createElement(Add_Transaction_Page, {
          active_page: this.state.active_page,
          active_store: this.state.active_store
        }),
        React.createElement(Transaction_View_Detail_Page, {
          active_page: this.state.active_page,
          transaction: this.state.transaction_shown
        }),
        React.createElement(User_Management_Page, {
          active_page: this.state.active_page,
          onUpdate: this.updateUser
        })
      );
    }
  }]);

  return Home_Page;
}(React.Component);

var homePage = ReactDOM.render(React.createElement(Home_Page, null), document.getElementById('content'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwiYWRkX3N0b3JlLmpzeCIsImFkZF90cmFuc2FjdGlvbi5qc3giLCJ0cmFuc2FjdGlvbl92aWV3X2RldGFpbC5qc3giLCJ0cmFuc2FjdGlvbnNfdmlldy5qc3giLCJzdG9yZV9tYW5hZ2VtZW50LmpzeCIsInN0b3Jlc19wYWdlLmpzeCIsInVzZXJfbWFuYWdlbWVudC5qc3giLCJtYWluLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVMsZUFBVCxDQUF5QixPQUF6QixFQUFrQztBQUNoQyxNQUFNLFFBQVEsYUFBYSxPQUFiLENBQXFCLE9BQXJCLENBQWQ7O0FBRUEsTUFBSSxLQUFKLEVBQVc7QUFDVCxZQUFRLGdCQUFSLENBQXlCLGdCQUF6QixFQUEyQyxLQUEzQztBQUNBLFdBQU8sT0FBUDtBQUNELEdBSEQsTUFJSztBQUNILFdBQU8scURBQVA7QUFDRDtBQUNGOzs7QUNWRCxJQUFJLHNCQUFzQixNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUMsZUFBYSxxQkFBUyxLQUFULEVBQWU7QUFDMUIsUUFBSSxjQUFjLFdBQWxCO0FBQ0EsYUFBUyxRQUFULENBQWtCLEVBQUMsYUFBYSxXQUFkLEVBQWxCO0FBQ0EsVUFBTSxjQUFOO0FBQ0QsR0FMeUM7QUFNMUMsVUFBUSxrQkFBVztBQUNqQixXQUNFO0FBQUE7QUFBQSxRQUFRLFdBQVUsYUFBbEIsRUFBZ0MsU0FDL0IsS0FBSyxXQUROO0FBQUE7QUFBQSxLQURGO0FBTUQ7QUFieUMsQ0FBbEIsQ0FBMUI7QUNBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsSUFBSSxhQUFhLElBQUksVUFBSixFQUFqQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCO0FBQ25CLE9BQUssSUFBTCxHQUFZLElBQVo7QUFDQSxPQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7QUFFRCxNQUFNLFNBQU4sQ0FB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K0IsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQS9CLENBQWYiLCJmaWxlIjoicmVhY3RDb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpIHtcbiAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcblxuICBpZiAodG9rZW4pIHtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ3gtYWNjZXNzLXRva2VuJywgdG9rZW4pO1xuICAgIHJldHVybihyZXF1ZXN0KTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4oXCJFcnJvcjogdG9rZW4gY291bGQgbm90IGJlIGZvdW5kLiBDaGVjayBsb2NhbFN0b3JhZ2VcIik7XG4gIH1cbn1cbiIsInZhciBCYWNrX3RvX0hvbWVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdIb21lX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImhvbWVfYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgQmFja1xuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIERpc3BhdGNoZXIvIFJlYWN0b3IgcGF0dGVybiBtb2RlbFxuICpcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTUzMDgzNzEvY3VzdG9tLWV2ZW50cy1tb2RlbC1cbiAqIHdpdGhvdXQtdXNpbmctZG9tLWV2ZW50cy1pbi1qYXZhc2NyaXB0XG4gKlxuICogSG93IGl0IHdvcmtzOlxuICogLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSZWdpc3RlciBldmVudHMuIEFuIGV2ZW50IGlzIGJhc2ljYWxseSBhIHJlcG9zaXRvcnkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICogQ2FsbCB0aGUgZXZlbnQgdG8gY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zLiBcbiAqIEhvdyB0byBjYWxsIHRoZSBldmVudD8gVXNlIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudF9uYW1lKVxuICogXG4gKiBBIERpc3BhdGNoZXIgaXMgYSBsaXN0IG9mIEV2ZW50cy4gU28gY2FsbGluZyBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnRcbiAqIGJhc2ljYWxseSBmaW5kcyB0aGUgZXZlbnQgaW4gdGhlIERpc3BhdGNoZXIgYW5kIGNhbGxzIGl0XG4gKlxuICogRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50IC0tPiBjYWxscyB0aGUgRXZlbnQgLS0tPiBjYWxscyB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHMpIG9mIHRoZSBFdmVudC4gXG4gKlxuICogSG93IGRvIHdlIHNldCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zIG9mIHRoZSBFdmVudD8gVXNlIGFkZEV2ZW50TGlzdGVuZXIuXG4gKiBhZGRFdmVudExpc3RlbmVyIGlzIHJlYWxseSBhIG1pc25vbWVyLCBpdCBzaG91bGQgYmUgY2FsbGVkIGFkZENhbGxCYWNrLlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIGRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5mdW5jdGlvbiBFdmVudChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuY2FsbGJhY2tzID0gW107XG59O1xuXG5FdmVudC5wcm90b3R5cGUucmVnaXN0ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG59O1xuXG5mdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICB0aGlzLmV2ZW50cyA9IHt9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSkge1xuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnRfbmFtZSk7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdID0gZXZlbnQ7XG4gIC8vIGNvbnNvbGUubG9nKHRoaXMuZXZlbnRzKTtcbn1cblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGV2ZW50X2FyZ3VtZW50cyl7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2soZXZlbnRfYXJndW1lbnRzKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZGlzcGF0Y2hlZCcpO1xuICAgIC8vIGNvbnNvbGUubG9nKGNhbGxiYWNrLCBldmVudF9hcmd1bWVudHMpO1xuICB9KTtcbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudF9uYW1lLCBjYWxsYmFjaykge1xuICB0aGlzLmV2ZW50c1tldmVudF9uYW1lXS5yZWdpc3RlckNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgLy8gY29uc29sZS5sb2coY2FsbGJhY2spO1xufTtcblxuLyogLS0tLS0tLS0tLS0tLVxuICogRGlzcGF0Y2hlciBldmVudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0qL1xuXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycpO1xuLy9TZW5kIFRyYW5zYWN0aW9uIERldGFpbHMgaGFzIGEgbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQgXG4vL3RoYXQgdGFrZXMgaW4gYSBKU09OIG9iamVjdCBhcyBhIHBhcmFtZXRlci4gVGhpcyBKU09OIG9iamVjdCBpcyB0aGUgXG4vL3RyYW5zYWN0aW9uLiBUaGVuIHRoZSBEZXRhaWwgVmlldyBUYWJsZSB3aWxsIHVwZGF0ZS4gXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicpXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJyk7XG5cblxuXG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgQWRkX1N0b3JlX1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgLy9XaGVuIGNvbXBvbmVudCBtb3VudHMsIHNlbmQgYSBHRVQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIHBvcHVsYXRlXG4gICAgICAvL3RoZXNlIGZpZWxkcyBcbiAgICAgIF9pZDogJycsXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIG93bmVyOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yc19pZHM6IFtdLFxuICAgICAgY29udHJpYnV0b3JzOiBbXSxcbiAgICAgIG91dHB1dF9jb250ZW50OiBbXSxcbiAgICAgIHN0YXR1c19tZXNzYWdlOiAnJ1xuICAgIH1cbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gIH1cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgbGV0IGNsaWNrZWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmlkO1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnMucHVzaCh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc19pZHMucHVzaCh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdLl9pZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250cmlidXRvcnNfaWQ6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH0pXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGlmIChrZXkgPT09ICdjb250cmlidXRvcnMnKSB7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBkZWJvdW5jZSB0aGlzXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPSAnJykgeyAvL01ha2Ugc3VyZSBJIGRvbid0IHNlbmQgYSB1c2VsZXNzIGJsYW5rIHJlcXVlc3RcbiAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgXCIvdXNlci9cIiArIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiByZXNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUE9TVCByZXF1ZXN0Jyk7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBfdXNlcl9pZDogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyksXG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWUsXG4gICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgfVxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIlBPU1RcIiwgIFwiL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyAnL3N0b3JlJyk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblxuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7dGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzISAnIDogJ0ZhaWx1cmUhICcpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPilcbiAgICB9XG5cbiAgICB2YXIgY29udHJpYnV0b3JzID0gW107XG4gICAgbGV0IGQgPSB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29udHJpYnV0b3JzLnB1c2goXG4gICAgICAgICAgPGxpIGlkPXtpfT5cbiAgICAgICAgICAgIHtkW2ldLnVzZXJuYW1lfVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ0FkZF9TdG9yZV9QYWdlJykge1xuICAgICAgcmV0dXJuIChudWxsKTtcbiAgICB9XG5cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybihcbiAgICAgICAgPGRpdiBpZD1cImJvZHlcIj5cbiAgICAgICAgPGgxPkFkZCBzdG9yZTwvaDE+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZX08L3A+XG4gICAgICAgIDxwPlN0b3JlIG5hbWU6IHt0aGlzLnN0YXRlLm5hbWV9PC9wPlxuICAgICAgICA8cD5Pd25lcjoge3RoaXMuc3RhdGUub3duZXIudXNlcm5hbWV9PC9wPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIENvbnRyaWJ1dG9yczpcbiAgICAgICAgICA8dWw+XG4gICAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPlN0b3JlIG5hbWU8L2xhYmVsPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIGlkPSduYW1lJyBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUubmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ25hbWUnKX1cbiAgICAgICAgICAvPlxuXG4gICAgICAgIDxkaXYgaWQgPSAnc2VhcmNoJz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3IgPSdzZWFyY2hfY29udHJpYnV0b3JzJz5Db250cmlidXRvcnM8L2xhYmVsPlxuXG4gICAgICAgIDx1bD5cbiAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgPC91bD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZCA9ICdzZWFyY2hfY29udHJpYnV0b3JzJ1xuICAgICAgICAgIHR5cGU9J3NlYXJjaCcgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdjb250cmlidXRvcnMnKX0gXG4gICAgICAgIC8+XG4gICAgICAgIFxuICAgICAgICA8dGFibGUgaWQgPSBcIm91dHB1dF9jb250ZW50XCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPjx0ZD5EaXNwbGF5IG5hbWU8L3RkPjx0ZD5QaG9uZSBudW1iZXI8L3RkPjwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgXG4gICAgfVxuICB9XG59XG5cblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuICpcbiAqIEFkZCBUcmFuc2FjdGlvbiBGb3JtIFBhZ2UgXG4gKiBcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqLyBcblxudmFyIEFkZF9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhZGRfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBBZGQgbmV3IGl0ZW1cbiAgICAgIDwvYnV0dG9uPlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBSZW1vdmVfSXRlbV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCl7XG4gICAgdGhpcy5wcm9wcy5DbGljaygpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicmVtb3ZlX2l0ZW1fYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgUmVtb3ZlIGl0ZW1cbiAgICAgIDwvYnV0dG9uPlxuICAgIClcbiAgfVxufSk7XG5cblxudmFyIEFkZF9UcmFuc2FjdGlvbl9QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gICh7XG4gICAgaXRlbV9jb3VudDogMSxcbiAgICBpdGVtczogW3tuYW1lOiAnJywgYW1vdW50OiAnJ31dLFxuICAgIG5hbWU6ICcnLFxuICAgIHBob25lX251bWJlcjogJycsXG4gICAgZXhwaXJ5X2RhdGVfbnVtYmVyOiAxLFxuICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiAnbW9udGgnXG4gICAgfSlcbiAgfSxcbiAgaGFuZGxlQWRkQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZFwiKTtcbiAgICB0aGlzLnN0YXRlLml0ZW1zLnB1c2goe2l0ZW1fbmFtZTogJycsIGl0ZW1fYW1vdW50OiAnJ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogdGhpcy5zdGF0ZS5pdGVtX2NvdW50ICsgMSxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSwgIFxuICBoYW5kbGVSZW1vdmVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMuc3BsaWNlKC0xLCAxKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLml0ZW1zKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5pdGVtX2NvdW50ID09IDApIHtcbiAgICAgIHRoaXMuc3RhdGUuaXRlbV9jb3VudCA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50IC0tO1xuICAgIH1cbiAgICBjb25zb2xlLmFzc2VydCh0aGlzLnN0YXRlLml0ZW1fY291bnQgPj0gMCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQsXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnN0YXRlLml0ZW1fY291bnQ7XG4gIH0sXG5cbiAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbihldmVudCkgeyAgICBcbiAgICB2YXIgZGF0YSA9ICB7XG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWUsXG4gICAgICAvL1N0cmlwIHBob25lIG51bWJlciBpbnB1dHMuXG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyLnJlcGxhY2UoLyAvZywgJycpLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXMsXG4gICAgICBleHBpcnlfZGF0ZV9udW1iZXI6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyLFxuICAgICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfc2VsZWN0b3JcbiAgICB9O1xuICAgIFxuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubmFtZSk7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXG4gICAgXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oXCJQT1NUXCIsIFwiL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIHRoaXMucHJvcHMuYWN0aXZlX3N0b3JlLl9pZCArIFwiL3RyYW5zXCIpO1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXF1ZXN0ID0gc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuIFxuIFxuICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgXG4gICAgLy9DbGVhciBldmVyeXRoaW5nLi4uXG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiAxLFxuICAgICAgaXRlbXM6IFt7bmFtZTogJycsIGFtb3VudDogJyd9XSxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogMSxcblxuICAgIH0pO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihrZXksIG5hbWUsIGFtb3VudCl7XG4gICAgLy8gY29uc29sZS5sb2coa2V5LCBpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnN0YXRlLml0ZW1zW2tleV0ubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLmFtb3VudCA9IGFtb3VudDtcbiAgICAvLyBjb25zb2xlLmxvZyhpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZU5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB0aGlzLnN0YXRlLm5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWVcbiAgICB9KTtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUubmFtZSk7XG4gIH0sXG4gIGhhbmRsZVBob25lTm9DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfbnVtYmVyOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfc2VsZWN0b3JcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdBZGRfVHJhbnNfUGFnZScpO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5pdGVtX2NvdW50OyBpKyspIHtcbiAgICAgIGl0ZW1zLnB1c2goPEl0ZW0gcmVhY3Rfa2V5PXtpfSBrZXk9e2l9IHZhbHVlcz17dGhpcy5zdGF0ZS5pdGVtc1tpXX1cbiAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz4pXG4gICAgfTtcbiAgICByZXR1cm4oXG4gICAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxmb3JtPlxuICAgICAgPGgxPkFkZCBuZXcgbG9hbjwvaDE+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgbmFtZT1cIm5hbWVcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdOYW1lJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5uYW1lfSBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVOYW1lQ2hhbmdlfSBcbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXI8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZSA9J3RlbCcgXG4gICAgICAgICAgbmFtZT1cInBob25lX251bWJlclwiIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdQaG9uZSBudW1iZXInIFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnBob25lX251bWJlcn0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUGhvbmVOb0NoYW5nZX1cbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJleHBpcnlfZHVyYXRpb25fbnVtYmVyXCI+RXhwaXJ5IGRhdGU8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICAvL2NsYXNzTmFtZSA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIGlkID0gJ2hhbGYtd2lkdGgnXG4gICAgICAgICAgdHlwZSA9ICdudW1iZXInXG4gICAgICAgICAgbmFtZSA9ICdleHBpcnlfZHVyYXRpb25fbnVtYmVyJ1xuICAgICAgICAgIHBsYWNlaG9sZGVyID0gJzEnXG4gICAgICAgICAgdmFsdWUgPSB7dGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RGF0ZU51bWJlckNoYW5nZX1cbiAgICAgICAgICBtaW4gPSBcIjFcIlxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgID5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPHNlbGVjdCBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9XCJtb250aFwiIFxuICAgICAgICAgIG5hbWU9XCJleHBpcnlfZHVyYXRpb25fc2VsZWN0b3JcIlxuICAgICAgICA+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRheVwiPmRheTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3ZWVrXCI+d2Vlazwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtb250aFwiPm1vbnRoPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8QWRkX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZUFkZENsaWNrfS8+XG4gICAgICAgIDxSZW1vdmVfSXRlbV9CdXR0b24gQ2xpY2s9e3RoaXMuaGFuZGxlUmVtb3ZlQ2xpY2t9Lz5cbiAgICAgICAgPHRhYmxlPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5JdGVtIG5hbWU8L3RoPlxuICAgICAgICAgICAgPHRoPkl0ZW0gYW1vdW50PC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdBZGQgbG9hbicgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9PjwvaW5wdXQ+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbnZhciBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3MoeyAgXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgLy9DYWxscyB0aGUgZnVuY3Rpb24gb25DaGFuZ2UgaW4gQWRkX1RyYW5zYWN0aW9uX0Zvcm0gdG8gbXV0YXRlIHRoZSBzdGF0ZSBpbiB0aGUgcGFyZW50LiBcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMucHJvcHMucmVhY3Rfa2V5LCB0aGlzLnJlZnMubmFtZS52YWx1ZSxcbiAgICB0aGlzLnJlZnMuYW1vdW50LnZhbHVlKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMudmFsdWVzKTtcbiAgICByZXR1cm4oXG4gICAgICA8dHIgaGVpZ2h0PVwiMjBweFwiPlxuICAgICAgPHRkPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICB0eXBlID0gJ3RleHQnIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSXRlbSBuYW1lXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMubmFtZX0gXG4gICAgICAgICAgcmVmPVwibmFtZVwiXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICA8L3RkPlxuICAgICAgPHRkPlxuICAgICAgPGlucHV0IFxuICAgICAgICB0eXBlID0gJ251bWJlcicgXG4gICAgICAgIG1pbj0gXCIxXCJcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBcIkFtb3VudFwiXG4gICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlcy5hbW91bnR9XG4gICAgICAgIHJlZj1cImFtb3VudFwiXG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgcmVxdWlyZWQ+XG4gICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogVHJhbnNhY3Rpb24gVmlldyBEZXRhaWwgcGFnZVxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpe1xuICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZScpIHtcbiAgICByZXR1cm4obnVsbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcbiAgcmV0dXJuKFxuICAgIDxkaXYgY2xhc3MgPVwicGFnZVwiPlxuICAgICAgPGgxPkxvYW5zIHZpZXcgKGRldGFpbCk8L2gxPlxuICAgICAgPFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSB0cmFuc2FjdGlvbj17dGhpcy5wcm9wcy50cmFuc2FjdGlvbn0vPlxuICAgICAgPFJldHVybl9JdGVtc19CdXR0b24gLz5cbiAgICAgIDxSZW5ld19UcmFuc2FjdGlvbl9CdXR0b24gLz5cbiAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9IFxuICAgXG4gIH1cbn0pO1xuXG52YXIgUmV0dXJuX0l0ZW1zX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmV0dXJuJyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJldHVybiBpdGVtczwvYnV0dG9uPlxuICApXG4gfSBcbn0pO1xuXG52YXIgUmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljaygpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicsICdyZW5ldycpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+UmVuZXcgbG9hbjwvYnV0dG9uPilcbiB9IFxufSlcblxuXG52YXIgVHJhbnNhY3Rpb25fRGV0YWlsX1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCB0cmFuc2FjdGlvbiA9IHRoaXMucHJvcHMudHJhbnNhY3Rpb247XG4gICAgICB2YXIgYWxsX2l0ZW1zID0gW107XG4gICAgICBmb3IgKHZhciBpdGVtIGluIHRyYW5zYWN0aW9uLml0ZW1zKSB7XG4gICAgICAgIGFsbF9pdGVtcy5wdXNoKFxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkl0ZW0gTmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5uYW1lfTwvdGQ+XG4gICAgICAgICAgPHRoPk5vLjwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5hbW91bnR9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICAgICAgfVxuICByZXR1cm4gKFxuICAgIDx0YWJsZSBpZD1cInRyYW5zYWN0aW9uX2RldGFpbF90YWJsZVwiPlxuICAgICAgPHRib2R5PlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5leHBpcnlfZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5SZXR1cm5lZDwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5yZXR1cm5lZC50b1N0cmluZygpfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5uYW1lfTwvdGQ+XG4gICAgICAgIDwvdHI+XG5cbiAgICAgICAge2FsbF9pdGVtc31cbiAgICAgIDwvdGJvZHk+XG4gICAgPC90YWJsZT5cbiAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9ucyBWaWV3IFBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8gXG5cbnZhciBUcmFuc2FjdGlvbnNfVmlld19QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSBcIlRyYW5zYWN0aW9uc19WaWV3X1BhZ2VcIikge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFdoZW4gdGhpcyBwYWdlIGxvYWRzXG4gICAgICByZXR1cm4gIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlXCI+XG4gICAgICAgIDxoMT4gTG9hbnMgb3ZlcnZpZXcgZm9yIHt0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5uYW1lfTwvaDE+XG4gICAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZSB0cmFuc2FjdGlvbnMgPSB7dGhpcy5wcm9wcy50cmFuc2FjdGlvbnN9IC8+XG4gICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufSlcblxudmFyIEFkZF9UcmFuc2FjdGlvbl9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnO1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3RyYW5zYWN0aW9uX2J1dHRvblwiXG4gICAgICBvbkNsaWNrPXsgdGhpcy5oYW5kbGVDbGljayB9PlxuICAgICAgQWRkIG5ldyBsb2FuXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnByb3BzLnRyYW5zYWN0aW9ucyk7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcHMudHJhbnNhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTtcbiAgICAgIHJvd3MucHVzaCg8VGFibGVfUm93IGtleT17aX0gdmFsdWVzPXt0aGlzLnByb3BzLnRyYW5zYWN0aW9uc1tpXX0vPilcbiAgICB9XG4gXG4gICAgXG4gICAgcmV0dXJuIChcbiAgICAgIDx0YWJsZT5cbiAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93IC8+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPlxuICAgICAgICA8dGg+RGF0ZTwvdGg+XG4gICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgPHRoPlBob25lIE51bWJlcjwvdGg+XG4gICAgICAgIDwvdHI+XG4gICAgICA8L3RoZWFkPlxuICAgIClcbiAgfVxufSlcblxuXG52YXIgVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnO1xuXG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCB0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gZGF5c190aWxsX2V4cGlyeShkYXRlKSB7XG4gICAgICB2YXIgZV9kID0gRGF0ZS5wYXJzZShkYXRlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCAtIERhdGUubm93KCkpO1xuICAgICAgLy8gY29uc29sZS5sb2coTWF0aC5jZWlsKChlX2QgLSBEYXRlLm5vdygpKS8oMTAwMCo2MCo2MCoyNCkpKVxuICAgICAgcmV0dXJuKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHBhcnNlX2RhdGUoZGF0ZSl7XG4gICAgICByZXR1cm4oZGF0ZS5zdWJzdHJpbmcoMCwxMCkpO1xuICAgIH07XG4gICB2YXIgc3RhdHVzID0gZGF5c190aWxsX2V4cGlyeSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSk7XG4gICB2YXIgdHJfc3R5bGUgPSB7XG4gICAgXG4gICB9XG4gICBpZiAodGhpcy5wcm9wcy52YWx1ZXMucmV0dXJuZWQgPT09IHRydWUpIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgdGV4dERlY29yYXRpb246ICdsaW5lLXRocm91Z2gnLFxuICAgICAgIGNvbG9yOiAnaHNsKDMwLCA0JSwgNzYlKSdcbiAgICAgfVxuICAgfVxuICAgZWxzZSBpZiAoc3RhdHVzIDw9IDApIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDAsIDk3JSwgNjglKSdcbiAgICAgfVxuICAgfVxuICAgIGVsc2UgaWYgKHN0YXR1cyA8PSAzKSB7XG4gICAgICB0cl9zdHlsZSA9IHtcbiAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdoc2woMzAsIDc4JSwgNjMlKScgIFxuICAgICAgfVxuICAgICB9XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIHN0eWxlPXt0cl9zdHlsZX0gb25DbGljaz0ge3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8dGQ+e3BhcnNlX2RhdGUodGhpcy5wcm9wcy52YWx1ZXMuZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmV4cGlyeV9kYXRlKX08L3RkPlxuICAgICAgICA8dGQ+e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIFN0b3JlX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgX2lkOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgb3duZXI6IFtdLFxuICAgICAgY29udHJpYnV0b3JzX2lkczogW10sXG4gICAgICBjb250cmlidXRvcnM6IFtdLFxuICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMub25SZW5kZXIgPSB0aGlzLm9uUmVuZGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIG9uUmVuZGVyKCkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIFxuICAgICAgdGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkICsgXCIvbWFuYWdlXCIpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgLy8gRmlyc3QgaXRlbSBpcyB0aGUgc3RvcmUgb2JqZWN0LCBcbiAgICAgICAgLy8gc2Vjb25kIHRoZSBvd25lciBvYmplY3QsXG4gICAgICAgIC8vIHRoaXJkIGl0ZW0gdGhlIGFycmF5IG9mIGNvbnRyaWJ1dG9yc1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBfaWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgbmFtZTogcmVzWzBdLm5hbWUsXG4gICAgICAgICAgY29udHJpYnV0b3JzX2lkczogcmVzWzBdLmNvbnRyaWJ1dG9ycyxcbiAgICAgICAgICBvd25lcjogcmVzWzFdLFxuICAgICAgICAgIGNvbnRyaWJ1dG9yczogcmVzWzJdXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGxldCBjbGlja2VkID0gZS50YXJnZXQucGFyZW50Tm9kZS5pZDtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29udHJpYnV0b3JzX2lkOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc19pZCxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuY29udHJpYnV0b3JzKTtcbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnY29udHJpYnV0b3JzJykge1xuICAgICAgICAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIFwiL3VzZXIvXCIgKyBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBvdXRwdXRfY29udGVudDogcmVzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXEuc2VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIHN0YXRlID0ge307XG4gICAgICAgIHN0YXRlW2tleV0gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgLy9TZW5kIGEgUFVUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFBVVCAvOl9zdG9yZV9pZC9tYW5hZ2VcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICAvL1NlbmQgYSBQT1NUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFRoZSBzZXJ2ZXIgbmVlZHMgdG8gY2hlY2sgdGhhdCB0aGlzIHBob25lIG51bWJlciBpc24ndCBhbHJlYWR5IHVzZWRcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiB0aGlzLnN0YXRlLl91c2VyX2lkLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH1cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJQVVRcIiwgIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArIFwiL3N0b3JlL1wiICsgXG4gICAgICB0aGlzLnByb3BzLl9pZCArIFwiL21hbmFnZVwiKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiBcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTt0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhJyA6ICdGYWlsdXJlIScpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPilcbiAgICB9XG5cbiAgICB2YXIgY29udHJpYnV0b3JzID0gW107XG4gICAgbGV0IGQgPSB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29udHJpYnV0b3JzLnB1c2goXG4gICAgICAgICAgPGxpIGlkPXtpfT5cbiAgICAgICAgICAgIHtkW2ldLnVzZXJuYW1lfVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3JlX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICAgIHJldHVybiAobnVsbCk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICB0aGlzLm9uUmVuZGVyKCk7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxoMT5DaGFuZ2Ugc3RvcmUgZGV0YWlsczwvaDE+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZX08L3A+XG4gICAgICAgIDxwPlN0b3JlIG5hbWU6IHt0aGlzLnN0YXRlLm5hbWV9PC9wPlxuICAgICAgICA8cD5Pd25lcjoge3RoaXMuc3RhdGUub3duZXIudXNlcm5hbWV9PC9wPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIENvbnRyaWJ1dG9yczpcbiAgICAgICAgICA8dWw+XG4gICAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPlN0b3JlIG5hbWU8L2xhYmVsPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIGlkPSduYW1lJyBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUubmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ25hbWUnKX1cbiAgICAgICAgICAvPlxuXG4gICAgICAgIDxkaXYgaWQgPSAnc2VhcmNoJz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3IgPSdzZWFyY2hfY29udHJpYnV0b3JzJz5Db250cmlidXRvcnM8L2xhYmVsPlxuXG4gICAgICAgIDx1bD5cbiAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgPC91bD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZCA9ICdzZWFyY2hfY29udHJpYnV0b3JzJ1xuICAgICAgICAgIHR5cGU9J3NlYXJjaCcgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdjb250cmlidXRvcnMnKX0gXG4gICAgICAgIC8+XG4gICAgICAgIFxuICAgICAgICA8dGFibGUgaWQgPSBcIm91dHB1dF9jb250ZW50XCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPiA8dGQ+RGlzcGxheSBuYW1lPC90ZD48dGQ+UGhvbmUgbnVtYmVyPC90ZD48L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIFxuICAgIH1cbiAgfVxufVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogXG4gKiBTdG9yZXMgdGFibGUgYW5kIHBhZ2VcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIFN0b3Jlc19QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnU3RvcmVzX1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2VcIj5cbiAgICAgIDxTdG9yZXNfVGFibGUgLz5cbiAgICAgIDxBZGRfU3RvcmVfQnV0dG9uIG9uQ2xpY2sgPSB7dGhpcy5oYW5kbGVDbGlja30vPlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG5cbiAgICB9XG4gIH1cbn0pXG5cbnZhciBBZGRfU3RvcmVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9TdG9yZV9QYWdlJztcbiAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9zdG9yZV9idXR0b25cIiBcbiAgICAgICAgb25DbGljayA9IHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICAgIEFkZCBuZXcgc3RvcmVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIClcbiAgfVxufSlcblxuXG52YXIgU3RvcmVzX1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoe1xuICAgICAgc3RvcmVzOiBbXSxcbiAgICAgIHVzZXJzOiBbXVxuICAgIH0pO1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2cobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHZhciBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgIHZhciByZXF1ZXN0X3VybCA9ICcvdXNlci8nICsgX3VzZXJfaWQgKyAnL3N0b3JlJztcblxuICAgIHZhciBnZXQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBnZXQub3BlbihcIkdFVFwiLCByZXF1ZXN0X3VybCk7XG4gICAgZ2V0ID0gc2V0X0hUVFBfaGVhZGVyKGdldCk7XG4gICAgZ2V0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChnZXQucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPSycpO1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShnZXQucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdG9yZXM6IHJlcy5zdG9yZXMsXG4gICAgICAgICAgdXNlcnM6IHJlcy51c2Vyc1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgfVxuICAgIGdldC5zZW5kKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUuc3RvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTsgXG4gICAgICB2YXIgdXNlciA9IHRoaXMuc3RhdGUudXNlcnNbaV07XG4gICAgICBpZiAodXNlciA9PT0gdW5kZWZpbmVkKSB7IHVzZXIgPSBudWxsOyB9XG5cbiAgICAgICAgcm93cy5wdXNoKFxuXG4gICAgICAgICAgPFN0b3Jlc19UYWJsZV9Sb3cgXG4gICAgICAgICAgICBrZXk9e2l9IFxuICAgICAgICAgICAgc3RvcmU9e3RoaXMuc3RhdGUuc3RvcmVzW2ldfSBcbiAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4oXG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIDx0aD5TdG9yZTwvdGg+XG4gICAgICAgICAgICAgIDx0aD5Pd25lcjwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICB7cm93c31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICApXG4gIH1cbn0pXG5cbnZhciBTdG9yZXNfVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRUcmFuc2FjdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIFVSTCA9IChcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIFxuICAgICAgICB0aGlzLnByb3BzLnN0b3JlLl9pZCArIFwiL3RyYW5zXCIpO1xuICAgIGNvbnNvbGUubG9nKFVSTCk7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgVVJMKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBwYXNzIHRoaXMgXCJyZXNcIiB0byB0aGUgcmVhbHBhZ2Ugb3IgdHJhbnMgdmlldyBwYWdlXG4gICAgICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbnNfVmlld19QYWdlJztcbiAgICAgICAgcmVzLmFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnLCAocmVzKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfSxcbiAgbWFuYWdlU3RvcmU6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9IFwiU3RvcmVfTWFuYWdlbWVudF9QYWdlXCI7XG4gICAgbGV0IGFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZSwgYWN0aXZlX3N0b3JlOiBhY3RpdmVfc3RvcmV9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8dHI+XG4gICAgICAgIDx0ZCBvbkNsaWNrID0ge3RoaXMuZ2V0VHJhbnNhY3Rpb25zfT57IHRoaXMucHJvcHMuc3RvcmUubmFtZSB9PC90ZD5cbiAgICAgICAgPHRkIG9uQ2xpY2sgPSB7dGhpcy5nZXRUcmFuc2FjdGlvbnN9PnsgdGhpcy5wcm9wcy51c2VyLnVzZXJuYW1lIH08L3RkPlxuICAgICAgICA8dGQ+PGJ1dHRvbiBvbkNsaWNrID0ge3RoaXMubWFuYWdlU3RvcmV9PkVkaXQ8L2J1dHRvbj48L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICApXG4gIH1cbn0pXG5cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBVc2VyX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIF9pZDogJycsXG4gICAgICB1c2VybmFtZTogJycsXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9XG4gICAgdGhpcy5jb21wb25lbnREaWRNb3VudCA9IHRoaXMuY29tcG9uZW50RGlkTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKCdtb3VudGVkJyk7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhyZXNbMF0pKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzWzBdWyd1c2VybmFtZSddKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGhvbmVfbnVtYmVyOiByZXNbMF0ucGhvbmVfbnVtYmVyLFxuICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICB1c2VybmFtZTogcmVzWzBdLnVzZXJuYW1lXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICB9XG4gIH1cbiAgXG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBVVCByZXF1ZXN0Jyk7XG4gICAgLy9TZW5kIGEgUE9TVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAvLyBUaGUgc2VydmVyIG5lZWRzIHRvIGNoZWNrIHRoYXQgdGhpcyBwaG9uZSBudW1iZXIgaXNuJ3QgYWxyZWFkeSB1c2VkXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyLFxuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWVcbiAgICB9XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiUFVUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhJyA6ICdGYWlsdXJlIScpICsgcmVzLm1lc3NhZ2UgXG4gICAgICB9KTtcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGUocmVzLnVzZXIpO1xuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdVc2VyX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8cD4ge3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9IDwvcD5cbiAgICAgICAgPGgxPkNoYW5nZSB1c2VyIGRldGFpbHM8L2gxPlxuICAgICAgICA8cD5JZiB5b3UgY2hhbmdlIHlvdXIgcGhvbmUgbnVtYmVyLCB5b3UgY2FuIGVkaXQgaXQgaGVyZS48L3A+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD5QaG9uZToge3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfSA8L3A+XG4gICAgICAgIDxwPlVzZXI6IHt0aGlzLnN0YXRlLnVzZXJuYW1lfSA8L3A+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInBob25lX251bWJlclwiPlBob25lIG51bWJlciAobG9naW4gd2l0aCB0aGlzKTwvbGFiZWw+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSdudW1iZXInIFxuICAgICAgICAgIGlkPSdwaG9uZV9udW1iZXInIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdwaG9uZV9udW1iZXInKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj0ndXNlcl9uYW1lJz5OYW1lOiBDaG9vc2UgYVxuICAgICAgICBuYW1lIHRoYXQgaXMgdW5pcXVlIHNvIHBlb3BsZSBjYW4gZmluZCB5b3UuPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD1cInVzZXJfbmFtZVwiIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ3VzZXJuYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gIH1cbn1cblxuLy8gUmVhY3RET00ucmVuZGVyKCA8VXNlcl9NYW5hZ2VtZW50X1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSApO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIEhvbWVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VyOiB7fSxcbiAgICAgIGFjdGl2ZV9wYWdlOiAnSG9tZSBQYWdlJyxcbiAgICAgIGFjdGl2ZV9zdG9yZToge30sXG4gICAgICBzdG9yZV90cmFuc2FjdGlvbnM6IHt9LFxuICAgICAgdHJhbnNhY3Rpb25fc2hvd246IHt9LFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnLFxuICAgIH07XG4gICAgdGhpcy5nb1RvID0gdGhpcy5nb1RvLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb21wb25lbnREaWRNb3VudCA9IHRoaXMuY29tcG9uZW50RGlkTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnVwZGF0ZVVzZXIgPSB0aGlzLnVwZGF0ZVVzZXIuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJylcblxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBsZXQgdXJsID0gJy91c2VyLycgKyBfdXNlcl9pZDtcblxuICAgIGNvbnNvbGUubG9nKHVybCk7XG5cbiAgICByZXEub3BlbignR0VUJywgdXJsKTtcblxuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICBpZiAocmVzLnN1Y2Nlc3MgPT0gZmFsc2UgKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLm1lc3NhZ2UpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IHJlcy5tZXNzYWdlXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgdXNlciA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnVzZXIgPSB1c2VyWzBdO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHVzZXI6IHRoaXMuc3RhdGUudXNlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnVzZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5zZW5kKCk7XG5cbiAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJywgKHN0b3JlX3RyYW5zKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHN0b3JlX3RyYW5zKTtcbiAgICAgICAgLy9GaXJzdCwgdGFrZSBvdXQgdGhlIFwiYWN0aXZlIHN0b3JlXCJcbiAgICAgICAgdmFyIGFjdGl2ZV9zdG9yZSA9IHN0b3JlX3RyYW5zLmFjdGl2ZV9zdG9yZTtcbiAgICAgICAgZGVsZXRlIHN0b3JlX3RyYW5zLmFjdGl2ZV9zdG9yZTtcbiAgICAgICAgdGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnMgPSBzdG9yZV90cmFucztcbiAgICAgICAgdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUgPSBhY3RpdmVfc3RvcmU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgYWN0aXZlX3N0b3JlOiB0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZSxcbiAgICAgICAgICBzdG9yZV90cmFuc2FjdGlvbnM6IHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcignc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJyxcbiAgICAgICAgKHRyYW5zYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duID0gdHJhbnNhY3Rpb247XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgdHJhbnNhY3Rpb25fc2hvd246IHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxlZCcpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGlzcGF0Y2hlci5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bik7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAoYWN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG4gICAgICAgIHZhciB1cGRhdGUgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bi5faWQpO1xuICAgICAgICBsZXQgaWQgPSB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duLl9pZDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaWQpO1xuICAgICAgICBsZXQgdXJsID0gJy91c2VyLycrIF91c2VyX2lkICsgJy9zdG9yZS8nICsgdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUuX2lkICsgJy90cmFucy8nICsgaWQgKyAnLycgKyBhY3Rpb247XG4gICAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIC8vIC90cmFucy9faWQvcmVuZXdcbiAgICAgICAgdXBkYXRlLm9wZW4oJ1BVVCcsIHVybCk7XG5cbiAgICAgICAgdXBkYXRlLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICBpZiAodXBkYXRlLnJlYWR5U3RhdGUgPT0gNCl7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycsIFxuICAgICAgICAgICAgSlNPTi5wYXJzZSh1cGRhdGUucmVzcG9uc2VUZXh0KSlcbiAgICAgICAgICAgIC8vIFdoeSBkbyBJIGV2ZW4gbmVlZCB0byBkaXNwYXRjaCB0aGlzIGV2ZW50IHRvIGJlIGhvbmVzdFxuICAgICAgICAgICAgLy8gSSBjYW4gbXV0YXRlIHRoZSBzdGF0ZSBzdHJhaWdodCBhd2F5IGZyb20gaGVyZS4gQWggd2VsbFxuICAgICAgICAgICAgLy8gSSB0aGluayBpdCdzIGNsZWFuZXIgdG8gZG8gdGhpcy4gRFJZIGFmdGVyIGFsbC4uLlxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgc2V0X0hUVFBfaGVhZGVyKHVwZGF0ZSkuc2VuZCgpO1xuICAgICAgIH0pO1xuICB9XG5cbiAgZ29UbyhwYWdlKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICAgbGV0IGFjdGl2ZV9wYWdlID0gcGFnZTtcbiAgICAgIGNvbnNvbGUubG9nKGFjdGl2ZV9wYWdlKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBhY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2VcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIFxuICB1cGRhdGVVc2VyKHVzZXIpIHtcbiAgICB0aGlzLnN0YXRlLnVzZXIgPSB1c2VyO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXNlcjogdXNlclxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UgIT09ICcnKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2U7XG4gICAgICBmdW5jdGlvbiBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpIHtyZXR1cm4ge19faHRtbDogbWVzc2FnZX19XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpfSAvPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybihcbiAgICAgICAgPGRpdj5cbiAgICAgICAgPGhlYWRlcj57dGhpcy5zdGF0ZS51c2VyLnVzZXJuYW1lfSA8YnV0dG9uPkxvZ291dDwvYnV0dG9uPjwvaGVhZGVyPlxuICAgICAgICA8aDE+e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9PC9oMT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmdvVG8oJ1VzZXJfTWFuYWdlbWVudF9QYWdlJyl9PkVkaXQgdXNlcjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuZ29UbygnU3RvcmVzX1BhZ2UnKX0+VmlldyBzdG9yZXM8L2J1dHRvbj5cblxuICAgICAgICA8U3RvcmVzX1BhZ2UgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX0vPlxuICAgICAgICAgIDxBZGRfU3RvcmVfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U3RvcmVfTWFuYWdlbWVudF9QYWdlIFxuICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgIGFjdGl2ZV9zdG9yZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUcmFuc2FjdGlvbnNfVmlld19QYWdlIFxuICAgICAgICAgICAgYWN0aXZlX3N0b3JlPXt0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZX1cbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlPXt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zPXt0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9uc31cbiAgICAgICAgICAvPlxuICAgICAgICAgICAgPEFkZF9UcmFuc2FjdGlvbl9QYWdlXG4gICAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICAgIGFjdGl2ZV9zdG9yZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZVxuICAgICAgICAgICAgICBhY3RpdmVfcGFnZT17dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgICAgdHJhbnNhY3Rpb24gPXt0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3dufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgPFVzZXJfTWFuYWdlbWVudF9QYWdlIFxuICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgb25VcGRhdGUgPSB7dGhpcy51cGRhdGVVc2VyfVxuICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICB9XG59XG5cbnZhciBob21lUGFnZSA9IFJlYWN0RE9NLnJlbmRlciggPEhvbWVfUGFnZS8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
