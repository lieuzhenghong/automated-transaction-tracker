'use strict';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function set_HTTP_header(request) {
  var token = localStorage.getItem('token');

  if (token) {
    request.setRequestHeader('x-access-token', token);
    return request;
  } else {
    return 'Error: token could not be found. Check localStorage';
  }
}

/*
// 1
req.open('PUT', `/user/${localStorage.getItem('_user_id')}/store/` +
this.props.active_store._id + '/manage'); 

// 2 (2 things)
request.setRequestHeader('Content-type', 'application/json');
set_HTTP_header(request);

// 3
req.send(JSON.stringify(data));
*/

function make_request(action, uri, when_response, data) {
  var req = new XMLHttpRequest();
  req.open(action, uri);
  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      when_response(req);
    }
  };
  set_request_headers(req, data);
}

function set_request_headers(request, data) {
  request.setRequestHeader('Content-type', 'application/json');
  set_HTTP_header(request);
  send_data(request, data);
}

function send_data(request, data) {
  request.send(JSON.stringify(data));
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
/*global React*/
/*global set_HTTP_header:true*/
/*eslint no-undef: "error"*/
/*eslint no-console: "off"*/
/*eslint-env node*/
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
      if (this.state.contributors_ids.indexOf(this.state.output_content[clicked]._id) != -1) {
        console.log('contributor already exists');
      } else {
        this.state.contributors.push(this.state.output_content[clicked]);
        this.state.contributors_ids.push(this.state.output_content[clicked]._id);
        this.setState({
          contributors_id: this.state.contributors_id,
          contributors: this.state.contributors
        });
        console.log(this.state.contributors);
      }
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
            req.open('GET', '/user/' + e.target.value);
            req.onreadystatechange = function () {
              if (req.readyState == 4) {
                var res = JSON.parse(req.responseText);
                console.log(res);
                _this2.setState({
                  output_content: res
                });
              }
            };
            set_HTTP_header(req).send();
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
      req.open('POST', '/user/' + localStorage.getItem('_user_id') + '/store');

      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);
          console.log(res);_this3.setState({
            status_message: (res.success ? 'Success! ' : 'Failure! ') + res.message
          });
        }
      };

      req.setRequestHeader('Content-type', 'application/json');
      req = set_HTTP_header(req);
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
    request.open("POST", "/user/" + localStorage.getItem('_user_id') + "/store/" + this.props.active_store._id + "/trans");
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
/*global React*/
/*global set_HTTP_header:true*/
/*eslint no-undef: "error"*/
/*eslint no-console: "off"*/
/*eslint-env node*/

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
    _this.componentWillReceiveProps = _this.componentWillReceiveProps.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(Store_Management_Page, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextprops) {
      var _this2 = this;

      console.log('prop changed: ' + nextprops.active_page);
      if (nextprops.active_page != 'Store_Management_Page') {} else {
        console.log('componentWillReceiveProps called');
        var req = new XMLHttpRequest();
        req.open('GET', '/user/' + localStorage.getItem('_user_id') + '\n      /store/' + nextprops.active_store._id + '/manage');
        console.log(set_HTTP_header(req));
        console.log(req);
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
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      console.log('clicked');
      var clicked = e.target.parentNode.id;
      //console.log(this.state.output_content[clicked]);
      if (this.state.contributors_ids.indexOf(this.state.output_content[clicked]._id) != -1) {
        console.log('contributor already exists');
      } else {
        this.state.contributors.push(this.state.output_content[clicked]);
        this.state.contributors_ids.push(this.state.output_content[clicked]._id);
        this.setState({
          contributors_id: this.state.contributors_id,
          contributors: this.state.contributors
        });
        console.log(this.state.contributors);
      }
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
            console.log(e.target.value);
            var req = new XMLHttpRequest();
            req.open('GET', '/user/' + e.target.value);
            req.onreadystatechange = function () {
              if (req.readyState == 4) {
                var res = JSON.parse(req.responseText);
                _this3.setState({
                  output_content: res
                });
              }
            };
            set_HTTP_header(req).send();
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
      e.preventDefault();
      console.log('sending PUT request');
      var data = {
        _user_id: localStorage.getItem('_user_id'),
        name: this.state.name,
        contributors: this.state.contributors
      };
      make_request('PUT', '/user/' + localStorage.getItem('_user_id') + '/store/' + this.props.active_store._id + '/manage', show_message.bind(this), data);

      function show_message(request) {
        var res = JSON.parse(request.responseText);
        console.log(res);
        this.setState({
          status_message: (res.success ? 'Success! ' : 'Failure! ') + res.message
        });
      }
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
        var res = JSON.parse(get.responseText);
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
          ),
          React.createElement(
            'th',
            null,
            'Actions'
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
        null,
        ' ',
        this.props.store.name
      ),
      React.createElement(
        'td',
        null,
        ' ',
        this.props.user.username
      ),
      React.createElement(
        'td',
        null,
        React.createElement(
          'button',
          { onClick: this.getTransactions },
          'View'
        ),
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
          // console.log(this.state);
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
      req.onreadystatechange = function () {
        var res = JSON.parse(req.responseText);
        console.log(res);
        _this4.setState({
          status_message: (res.success ? 'Success!' : 'Failure!') + res.message
        });
        _this4.props.onUpdate(res.user);
      };
      req.setRequestHeader('Content-type', 'application/json');
      req = set_HTTP_header(req);
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
    _this.componentWillMount = _this.componentWillMount.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    _this.updateUser = _this.updateUser.bind(_this);
    _this.logout = _this.logout.bind(_this);
    return _this;
  }

  _createClass(Home_Page, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
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

      if (token != null) {
        req = set_HTTP_header(req);
      }
      req.send();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      dispatcher.addEventListener('send_store_transactions', function (store_trans) {
        console.log(store_trans);
        //First, take out the "active store"
        var active_store = store_trans.active_store;
        delete store_trans.active_store;
        _this3.state.store_transactions = store_trans;
        _this3.state.active_store = active_store;
        // console.log(this.state.store_transactions);
        _this3.setState({
          active_store: _this3.state.active_store,
          store_transactions: _this3.state.store_transactions
        });
      });

      dispatcher.addEventListener('send_transaction_details', function (transaction) {
        _this3.state.transaction_shown = transaction;
        _this3.setState({
          transaction_shown: _this3.state.transaction_shown
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
        var id = _this3.state.transaction_shown._id;
        // console.log(id);
        var url = '/user/' + _user_id + '/store/' + _this3.state.active_store._id + '/trans/' + id + '/' + action;
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
      var _this4 = this;

      return function (e) {
        var active_page = page;
        console.log(active_page);
        _this4.setState({
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
    key: 'logout',
    value: function logout() {
      localStorage.clear();
      window.location = '/login.html';
    }
  }, {
    key: 'render',
    value: function render() {
      console.log(this.state.status_message);
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
            { onClick: this.logout },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwiYWRkX3N0b3JlLmpzeCIsImFkZF90cmFuc2FjdGlvbi5qc3giLCJ0cmFuc2FjdGlvbl92aWV3X2RldGFpbC5qc3giLCJ0cmFuc2FjdGlvbnNfdmlldy5qc3giLCJzdG9yZV9tYW5hZ2VtZW50LmpzeCIsInN0b3Jlc19wYWdlLmpzeCIsInVzZXJfbWFuYWdlbWVudC5qc3giLCJtYWluLmpzeCJdLCJuYW1lcyI6WyJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0Iiwic2V0X0hUVFBfaGVhZGVyIiwicmVxdWVzdCIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNldFJlcXVlc3RIZWFkZXIiLCJtYWtlX3JlcXVlc3QiLCJhY3Rpb24iLCJ1cmkiLCJ3aGVuX3Jlc3BvbnNlIiwiZGF0YSIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzZXRfcmVxdWVzdF9oZWFkZXJzIiwic2VuZF9kYXRhIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJCYWNrX3RvX0hvbWVfQnV0dG9uIiwiUmVhY3QiLCJjcmVhdGVDbGFzcyIsImhhbmRsZUNsaWNrIiwiZXZlbnQiLCJhY3RpdmVfcGFnZSIsImhvbWVQYWdlIiwic2V0U3RhdGUiLCJwcmV2ZW50RGVmYXVsdCIsInJlbmRlciIsImRpc3BhdGNoZXIiLCJEaXNwYXRjaGVyIiwiRXZlbnQiLCJuYW1lIiwiY2FsbGJhY2tzIiwicHJvdG90eXBlIiwicmVnaXN0ZXJDYWxsYmFjayIsImNhbGxiYWNrIiwicHVzaCIsImV2ZW50cyIsInJlZ2lzdGVyRXZlbnQiLCJldmVudF9uYW1lIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50X2FyZ3VtZW50cyIsImZvckVhY2giLCJhZGRFdmVudExpc3RlbmVyIiwiQWRkX1N0b3JlX1BhZ2UiLCJwcm9wcyIsInN0YXRlIiwiX2lkIiwib3duZXIiLCJjb250cmlidXRvcnNfaWRzIiwiY29udHJpYnV0b3JzIiwib3V0cHV0X2NvbnRlbnQiLCJzdGF0dXNfbWVzc2FnZSIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTdWJtaXQiLCJlIiwiY29uc29sZSIsImxvZyIsImNsaWNrZWQiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwiaWQiLCJpbmRleE9mIiwiY29udHJpYnV0b3JzX2lkIiwia2V5IiwidmFsdWUiLCJyZXMiLCJwYXJzZSIsInJlc3BvbnNlVGV4dCIsIl91c2VyX2lkIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJyb3dzIiwiYyIsImkiLCJsZW5ndGgiLCJ1c2VybmFtZSIsInBob25lX251bWJlciIsImQiLCJDb21wb25lbnQiLCJBZGRfSXRlbV9CdXR0b24iLCJDbGljayIsIlJlbW92ZV9JdGVtX0J1dHRvbiIsIkFkZF9UcmFuc2FjdGlvbl9QYWdlIiwiZ2V0SW5pdGlhbFN0YXRlIiwiaXRlbV9jb3VudCIsIml0ZW1zIiwiYW1vdW50IiwiZXhwaXJ5X2RhdGVfbnVtYmVyIiwiZXhwaXJ5X2RhdGVfc2VsZWN0b3IiLCJoYW5kbGVBZGRDbGljayIsIml0ZW1fbmFtZSIsIml0ZW1fYW1vdW50IiwiaGFuZGxlUmVtb3ZlQ2xpY2siLCJzcGxpY2UiLCJhc3NlcnQiLCJyZXBsYWNlIiwiYWN0aXZlX3N0b3JlIiwiaGFuZGxlTmFtZUNoYW5nZSIsImhhbmRsZVBob25lTm9DaGFuZ2UiLCJoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlIiwiaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2UiLCJJdGVtIiwib25DaGFuZ2UiLCJyZWFjdF9rZXkiLCJyZWZzIiwidmFsdWVzIiwiVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSIsInRyYW5zYWN0aW9uIiwiUmV0dXJuX0l0ZW1zX0J1dHRvbiIsIlJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiIsIlRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSIsImFsbF9pdGVtcyIsIml0ZW0iLCJkYXRlIiwic3Vic3RyaW5nIiwiZXhwaXJ5X2RhdGUiLCJyZXR1cm5lZCIsInRvU3RyaW5nIiwiVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSIsInRyYW5zYWN0aW9ucyIsIkFkZF9UcmFuc2FjdGlvbl9CdXR0b24iLCJUcmFuc2FjdGlvbl9UYWJsZSIsIlRyYW5zYWN0aW9uX1RhYmxlX0hlYWRlcl9Sb3ciLCJUYWJsZV9Sb3ciLCJkYXlzX3RpbGxfZXhwaXJ5IiwiZV9kIiwiRGF0ZSIsIk1hdGgiLCJjZWlsIiwibm93IiwicGFyc2VfZGF0ZSIsInN0YXR1cyIsInRyX3N0eWxlIiwidGV4dERlY29yYXRpb24iLCJjb2xvciIsImJhY2tncm91bmRDb2xvciIsIlN0b3JlX01hbmFnZW1lbnRfUGFnZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0cHJvcHMiLCJzaG93X21lc3NhZ2UiLCJTdG9yZXNfUGFnZSIsIkFkZF9TdG9yZV9CdXR0b24iLCJTdG9yZXNfVGFibGUiLCJzdG9yZXMiLCJ1c2VycyIsImNvbXBvbmVudERpZE1vdW50IiwicmVxdWVzdF91cmwiLCJnZXQiLCJ1c2VyIiwidW5kZWZpbmVkIiwiU3RvcmVzX1RhYmxlX1JvdyIsImdldFRyYW5zYWN0aW9ucyIsIlVSTCIsInN0b3JlIiwibWFuYWdlU3RvcmUiLCJVc2VyX01hbmFnZW1lbnRfUGFnZSIsIm9uVXBkYXRlIiwiSG9tZV9QYWdlIiwic3RvcmVfdHJhbnNhY3Rpb25zIiwidHJhbnNhY3Rpb25fc2hvd24iLCJnb1RvIiwiY29tcG9uZW50V2lsbE1vdW50IiwidXBkYXRlVXNlciIsImxvZ291dCIsInVybCIsInN0b3JlX3RyYW5zIiwidXBkYXRlIiwicGFnZSIsImNsZWFyIiwid2luZG93IiwibG9jYXRpb24iLCJjcmVhdGVNZXNzYWdlIiwiX19odG1sIiwi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dCI6WyIvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4vLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4vLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbi8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRfSFRUUF9oZWFkZXIocmVxdWVzdCkge1xuICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xuXG4gIGlmICh0b2tlbikge1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcigneC1hY2Nlc3MtdG9rZW4nLCB0b2tlbik7XG4gICAgcmV0dXJuKHJlcXVlc3QpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybignRXJyb3I6IHRva2VuIGNvdWxkIG5vdCBiZSBmb3VuZC4gQ2hlY2sgbG9jYWxTdG9yYWdlJyk7XG4gIH1cbn1cblxuLypcbi8vIDFcbnJlcS5vcGVuKCdQVVQnLCBgL3VzZXIvJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKX0vc3RvcmUvYCArXG50aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyAnL21hbmFnZScpOyBcblxuLy8gMiAoMiB0aGluZ3MpXG5yZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5zZXRfSFRUUF9oZWFkZXIocmVxdWVzdCk7XG5cbi8vIDNcbnJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiovXG5cbmZ1bmN0aW9uIG1ha2VfcmVxdWVzdChhY3Rpb24sIHVyaSwgd2hlbl9yZXNwb25zZSwgZGF0YSkge1xuICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcS5vcGVuKGFjdGlvbiwgdXJpKTtcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgd2hlbl9yZXNwb25zZShyZXEpO1xuICAgIH0gXG4gIH07XG4gIHNldF9yZXF1ZXN0X2hlYWRlcnMocmVxLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gc2V0X3JlcXVlc3RfaGVhZGVycyhyZXF1ZXN0LCBkYXRhKSB7XG4gIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuICBzZW5kX2RhdGEocmVxdWVzdCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRfZGF0YShyZXF1ZXN0LCBkYXRhKXtcbiAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cbiIsInZhciBCYWNrX3RvX0hvbWVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdIb21lX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImhvbWVfYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgQmFja1xuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIERpc3BhdGNoZXIvIFJlYWN0b3IgcGF0dGVybiBtb2RlbFxuICpcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTUzMDgzNzEvY3VzdG9tLWV2ZW50cy1tb2RlbC1cbiAqIHdpdGhvdXQtdXNpbmctZG9tLWV2ZW50cy1pbi1qYXZhc2NyaXB0XG4gKlxuICogSG93IGl0IHdvcmtzOlxuICogLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSZWdpc3RlciBldmVudHMuIEFuIGV2ZW50IGlzIGJhc2ljYWxseSBhIHJlcG9zaXRvcnkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICogQ2FsbCB0aGUgZXZlbnQgdG8gY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zLiBcbiAqIEhvdyB0byBjYWxsIHRoZSBldmVudD8gVXNlIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudF9uYW1lKVxuICogXG4gKiBBIERpc3BhdGNoZXIgaXMgYSBsaXN0IG9mIEV2ZW50cy4gU28gY2FsbGluZyBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnRcbiAqIGJhc2ljYWxseSBmaW5kcyB0aGUgZXZlbnQgaW4gdGhlIERpc3BhdGNoZXIgYW5kIGNhbGxzIGl0XG4gKlxuICogRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50IC0tPiBjYWxscyB0aGUgRXZlbnQgLS0tPiBjYWxscyB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHMpIG9mIHRoZSBFdmVudC4gXG4gKlxuICogSG93IGRvIHdlIHNldCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zIG9mIHRoZSBFdmVudD8gVXNlIGFkZEV2ZW50TGlzdGVuZXIuXG4gKiBhZGRFdmVudExpc3RlbmVyIGlzIHJlYWxseSBhIG1pc25vbWVyLCBpdCBzaG91bGQgYmUgY2FsbGVkIGFkZENhbGxCYWNrLlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIGRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5mdW5jdGlvbiBFdmVudChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuY2FsbGJhY2tzID0gW107XG59O1xuXG5FdmVudC5wcm90b3R5cGUucmVnaXN0ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG59O1xuXG5mdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICB0aGlzLmV2ZW50cyA9IHt9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSkge1xuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnRfbmFtZSk7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdID0gZXZlbnQ7XG4gIC8vIGNvbnNvbGUubG9nKHRoaXMuZXZlbnRzKTtcbn1cblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGV2ZW50X2FyZ3VtZW50cyl7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2soZXZlbnRfYXJndW1lbnRzKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZGlzcGF0Y2hlZCcpO1xuICAgIC8vIGNvbnNvbGUubG9nKGNhbGxiYWNrLCBldmVudF9hcmd1bWVudHMpO1xuICB9KTtcbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudF9uYW1lLCBjYWxsYmFjaykge1xuICB0aGlzLmV2ZW50c1tldmVudF9uYW1lXS5yZWdpc3RlckNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgLy8gY29uc29sZS5sb2coY2FsbGJhY2spO1xufTtcblxuLyogLS0tLS0tLS0tLS0tLVxuICogRGlzcGF0Y2hlciBldmVudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0qL1xuXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycpO1xuLy9TZW5kIFRyYW5zYWN0aW9uIERldGFpbHMgaGFzIGEgbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQgXG4vL3RoYXQgdGFrZXMgaW4gYSBKU09OIG9iamVjdCBhcyBhIHBhcmFtZXRlci4gVGhpcyBKU09OIG9iamVjdCBpcyB0aGUgXG4vL3RyYW5zYWN0aW9uLiBUaGVuIHRoZSBEZXRhaWwgVmlldyBUYWJsZSB3aWxsIHVwZGF0ZS4gXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicpXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJyk7XG5cblxuXG4iLCIvKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBzZXRfSFRUUF9oZWFkZXI6dHJ1ZSovXG4vKmVzbGludCBuby11bmRlZjogXCJlcnJvclwiKi9cbi8qZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIqL1xuLyplc2xpbnQtZW52IG5vZGUqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBBZGRfU3RvcmVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLmluZGV4T2YodGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpICE9IC0xKSB7XG4gICAgICBjb25zb2xlLmxvZygnY29udHJpYnV0b3IgYWxyZWFkeSBleGlzdHMnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnY29udHJpYnV0b3JzJykge1xuICAgICAgICAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKCdHRVQnLCAnL3VzZXIvJyArIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiByZXNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBPU1QgcmVxdWVzdCcpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgX3VzZXJfaWQ6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH07XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKCdQT1NUJywgICcvdXNlci8nICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyAnL3N0b3JlJyk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7dGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzISAnIDogJ0ZhaWx1cmUhICcpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTsgICAgICBcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdBZGRfU3RvcmVfUGFnZScpIHtcbiAgICAgIHJldHVybiAobnVsbCk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxoMT5BZGQgc3RvcmU8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj48dGQ+RGlzcGxheSBuYW1lPC90ZD48dGQ+UGhvbmUgbnVtYmVyPC90ZD48L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gKlxuICogQWRkIFRyYW5zYWN0aW9uIEZvcm0gUGFnZSBcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgQWRkX0l0ZW1fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIHRoaXMucHJvcHMuQ2xpY2soKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9pdGVtX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIEFkZCBuZXcgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxudmFyIFJlbW92ZV9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyZW1vdmVfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBSZW1vdmUgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxuXG52YXIgQWRkX1RyYW5zYWN0aW9uX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIHJldHVybiAgKHtcbiAgICBpdGVtX2NvdW50OiAxLFxuICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgbmFtZTogJycsXG4gICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG4gICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6ICdtb250aCdcbiAgICB9KVxuICB9LFxuICBoYW5kbGVBZGRDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMucHVzaCh7aXRlbV9uYW1lOiAnJywgaXRlbV9hbW91bnQ6ICcnfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQgKyAxLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5pdGVtX2NvdW50O1xuICB9LCAgXG4gIGhhbmRsZVJlbW92ZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgdGhpcy5zdGF0ZS5pdGVtcy5zcGxpY2UoLTEsIDEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuaXRlbXMpO1xuICAgIGlmICh0aGlzLnN0YXRlLml0ZW1fY291bnQgPT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLml0ZW1fY291bnQgLS07XG4gICAgfVxuICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3RhdGUuaXRlbV9jb3VudCA+PSAwKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1fY291bnQ6IHRoaXMuc3RhdGUuaXRlbV9jb3VudCxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7ICAgIFxuICAgIHZhciBkYXRhID0gIHtcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIC8vU3RyaXAgcGhvbmUgbnVtYmVyIGlucHV0cy5cbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIucmVwbGFjZSgvIC9nLCAnJyksXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtcyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIsXG4gICAgICBleHBpcnlfZGF0ZV9zZWxlY3RvcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvclxuICAgIH07XG4gICAgXG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5uYW1lKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICBcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbihcIlBPU1RcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyB0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxdWVzdCA9IHNldF9IVFRQX2hlYWRlcihyZXF1ZXN0KTtcbiBcbiBcbiAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFxuICAgIC8vQ2xlYXIgZXZlcnl0aGluZy4uLlxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogMSxcbiAgICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG5cbiAgICB9KTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oa2V5LCBuYW1lLCBhbW91bnQpe1xuICAgIC8vIGNvbnNvbGUubG9nKGtleSwgaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuc3RhdGUuaXRlbXNba2V5XS5hbW91bnQgPSBhbW91bnQ7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICB9LFxuICBoYW5kbGVOYW1lQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZS5uYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lXG4gICAgfSk7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm5hbWUpO1xuICB9LFxuICBoYW5kbGVQaG9uZU5vQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJcbiAgICB9KTtcbiAgfSxcbiAgaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3Rvcik7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnQWRkX1RyYW5zX1BhZ2UnKTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGUuaXRlbV9jb3VudDsgaSsrKSB7XG4gICAgICBpdGVtcy5wdXNoKDxJdGVtIHJlYWN0X2tleT17aX0ga2V5PXtpfSB2YWx1ZXM9e3RoaXMuc3RhdGUuaXRlbXNbaV19XG4gICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+KVxuICAgIH07XG4gICAgcmV0dXJuKFxuICAgICAgPGRpdiBjbGFzcyA9XCJwYWdlXCI+XG4gICAgICA8Zm9ybT5cbiAgICAgIDxoMT5BZGQgbmV3IGxvYW48L2gxPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIG5hbWU9XCJuYW1lXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nTmFtZScgXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubmFtZX0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTmFtZUNoYW5nZX0gXG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGhvbmVfbnVtYmVyXCI+UGhvbmUgbnVtYmVyPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGUgPSd0ZWwnIFxuICAgICAgICAgIG5hbWU9XCJwaG9uZV9udW1iZXJcIiBcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nUGhvbmUgbnVtYmVyJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9IFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVBob25lTm9DaGFuZ2V9XG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZXhwaXJ5X2R1cmF0aW9uX251bWJlclwiPkV4cGlyeSBkYXRlPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgLy9jbGFzc05hbWUgPSAnaGFsZi13aWR0aCdcbiAgICAgICAgICBpZCA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJ1xuICAgICAgICAgIG5hbWUgPSAnZXhwaXJ5X2R1cmF0aW9uX251bWJlcidcbiAgICAgICAgICBwbGFjZWhvbGRlciA9ICcxJ1xuICAgICAgICAgIHZhbHVlID0ge3RoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2V9XG4gICAgICAgICAgbWluID0gXCIxXCJcbiAgICAgICAgICByZXF1aXJlZFxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxzZWxlY3QgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPVwibW9udGhcIiBcbiAgICAgICAgICBuYW1lPVwiZXhwaXJ5X2R1cmF0aW9uX3NlbGVjdG9yXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJkYXlcIj5kYXk8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2Vla1wiPndlZWs8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibW9udGhcIj5tb250aDwvb3B0aW9uPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPEFkZF9JdGVtX0J1dHRvbiBDbGljaz17dGhpcy5oYW5kbGVBZGRDbGlja30vPlxuICAgICAgICA8UmVtb3ZlX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZUNsaWNrfS8+XG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+SXRlbSBuYW1lPC90aD5cbiAgICAgICAgICAgIDx0aD5JdGVtIGFtb3VudDwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nQWRkIGxvYW4nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fT48L2lucHV0PlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG52YXIgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHsgIFxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIC8vQ2FsbHMgdGhlIGZ1bmN0aW9uIG9uQ2hhbmdlIGluIEFkZF9UcmFuc2FjdGlvbl9Gb3JtIHRvIG11dGF0ZSB0aGUgc3RhdGUgaW4gdGhlIHBhcmVudC4gXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnByb3BzLnJlYWN0X2tleSwgdGhpcy5yZWZzLm5hbWUudmFsdWUsXG4gICAgdGhpcy5yZWZzLmFtb3VudC52YWx1ZSk7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIGhlaWdodD1cIjIwcHhcIj5cbiAgICAgIDx0ZD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgdHlwZSA9ICd0ZXh0JyBcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkl0ZW0gbmFtZVwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9IFxuICAgICAgICAgIHJlZj1cIm5hbWVcIlxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgPlxuICAgICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDx0ZD5cbiAgICAgIDxpbnB1dCBcbiAgICAgICAgdHlwZSA9ICdudW1iZXInIFxuICAgICAgICBtaW49IFwiMVwiXG4gICAgICAgIHBsYWNlaG9sZGVyID0gXCJBbW91bnRcIlxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMuYW1vdW50fVxuICAgICAgICByZWY9XCJhbW91bnRcIlxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIHJlcXVpcmVkPlxuICAgICAgPC9pbnB1dD5cbiAgICAgIDwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9uIFZpZXcgRGV0YWlsIHBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKXtcbiAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnKSB7XG4gICAgcmV0dXJuKG51bGwpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5wcm9wcyk7XG4gIHJldHVybihcbiAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxoMT5Mb2FucyB2aWV3IChkZXRhaWwpPC9oMT5cbiAgICAgIDxUcmFuc2FjdGlvbl9EZXRhaWxfVGFibGUgdHJhbnNhY3Rpb249e3RoaXMucHJvcHMudHJhbnNhY3Rpb259Lz5cbiAgICAgIDxSZXR1cm5fSXRlbXNfQnV0dG9uIC8+XG4gICAgICA8UmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgIDwvZGl2PlxuICAgIClcbiAgfSBcbiAgIFxuICB9XG59KTtcblxudmFyIFJldHVybl9JdGVtc19CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJywgJ3JldHVybicpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5SZXR1cm4gaXRlbXM8L2J1dHRvbj5cbiAgKVxuIH0gXG59KTtcblxudmFyIFJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmVuZXcnKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICg8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJlbmV3IGxvYW48L2J1dHRvbj4pXG4gfSBcbn0pXG5cblxudmFyIFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSB0aGlzLnByb3BzLnRyYW5zYWN0aW9uO1xuICAgICAgdmFyIGFsbF9pdGVtcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaXRlbSBpbiB0cmFuc2FjdGlvbi5pdGVtcykge1xuICAgICAgICBhbGxfaXRlbXMucHVzaChcbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5JdGVtIE5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0ubmFtZX08L3RkPlxuICAgICAgICAgIDx0aD5Oby48L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0uYW1vdW50fTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIClcbiAgICAgIH1cbiAgcmV0dXJuIChcbiAgICA8dGFibGUgaWQ9XCJ0cmFuc2FjdGlvbl9kZXRhaWxfdGFibGVcIj5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5EYXRlPC90aD5cbiAgICAgICAgICA8dGQ+e3RyYW5zYWN0aW9uLmRhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZXhwaXJ5X2RhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+UmV0dXJuZWQ8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ucmV0dXJuZWQudG9TdHJpbmcoKX08L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ubmFtZX08L3RkPlxuICAgICAgICA8L3RyPlxuXG4gICAgICAgIHthbGxfaXRlbXN9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBUcmFuc2FjdGlvbnMgVmlldyBQYWdlXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gXCJUcmFuc2FjdGlvbnNfVmlld19QYWdlXCIpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBXaGVuIHRoaXMgcGFnZSBsb2Fkc1xuICAgICAgcmV0dXJuICAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgICA8aDE+IExvYW5zIG92ZXJ2aWV3IGZvciB7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUubmFtZX08L2gxPlxuICAgICAgICA8VHJhbnNhY3Rpb25fVGFibGUgdHJhbnNhY3Rpb25zID0ge3RoaXMucHJvcHMudHJhbnNhY3Rpb25zfSAvPlxuICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX0J1dHRvbiAvPlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn0pXG5cbnZhciBBZGRfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJztcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF90cmFuc2FjdGlvbl9idXR0b25cIlxuICAgICAgb25DbGljaz17IHRoaXMuaGFuZGxlQ2xpY2sgfT5cbiAgICAgIEFkZCBuZXcgbG9hblxuICAgICAgPC9idXR0b24+XG4gICAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5wcm9wcy50cmFuc2FjdGlvbnMpO1xuICAgIHZhciByb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BzLnRyYW5zYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uc1tpXSk7XG4gICAgICByb3dzLnB1c2goPFRhYmxlX1JvdyBrZXk9e2l9IHZhbHVlcz17dGhpcy5wcm9wcy50cmFuc2FjdGlvbnNbaV19Lz4pXG4gICAgfVxuIFxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICA8dGFibGU+XG4gICAgICA8VHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyAvPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAoXG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj5cbiAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgIDx0aD5QaG9uZSBOdW1iZXI8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICApXG4gIH1cbn0pXG5cblxudmFyIFRhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlJztcblxuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHtcbiAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIGZ1bmN0aW9uIGRheXNfdGlsbF9leHBpcnkoZGF0ZSkge1xuICAgICAgdmFyIGVfZCA9IERhdGUucGFyc2UoZGF0ZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QpO1xuICAgICAgLy8gY29uc29sZS5sb2coRGF0ZS5ub3coKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QgLSBEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSlcbiAgICAgIHJldHVybihNYXRoLmNlaWwoKGVfZCAtIERhdGUubm93KCkpLygxMDAwKjYwKjYwKjI0KSkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBwYXJzZV9kYXRlKGRhdGUpe1xuICAgICAgcmV0dXJuKGRhdGUuc3Vic3RyaW5nKDAsMTApKTtcbiAgICB9O1xuICAgdmFyIHN0YXR1cyA9IGRheXNfdGlsbF9leHBpcnkodGhpcy5wcm9wcy52YWx1ZXMuZXhwaXJ5X2RhdGUpO1xuICAgdmFyIHRyX3N0eWxlID0ge1xuICAgIFxuICAgfVxuICAgaWYgKHRoaXMucHJvcHMudmFsdWVzLnJldHVybmVkID09PSB0cnVlKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIHRleHREZWNvcmF0aW9uOiAnbGluZS10aHJvdWdoJyxcbiAgICAgICBjb2xvcjogJ2hzbCgzMCwgNCUsIDc2JSknXG4gICAgIH1cbiAgIH1cbiAgIGVsc2UgaWYgKHN0YXR1cyA8PSAwKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2hzbCgwLCA5NyUsIDY4JSknXG4gICAgIH1cbiAgIH1cbiAgICBlbHNlIGlmIChzdGF0dXMgPD0gMykge1xuICAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDMwLCA3OCUsIDYzJSknICBcbiAgICAgIH1cbiAgICAgfVxuICAgIHJldHVybihcbiAgICAgIDx0ciBzdHlsZT17dHJfc3R5bGV9IG9uQ2xpY2s9IHt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmRhdGUpfTwvdGQ+XG4gICAgICAgIDx0ZD57cGFyc2VfZGF0ZSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5uYW1lfTwvdGQ+XG4gICAgICAgIDx0ZD57dGhpcy5wcm9wcy52YWx1ZXMucGhvbmVfbnVtYmVyfTwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcbiIsIi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIHNldF9IVFRQX2hlYWRlcjp0cnVlKi9cbi8qZXNsaW50IG5vLXVuZGVmOiBcImVycm9yXCIqL1xuLyplc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiovXG4vKmVzbGludC1lbnYgbm9kZSovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgU3RvcmVfTWFuYWdlbWVudF9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8vV2hlbiBjb21wb25lbnQgbW91bnRzLCBzZW5kIGEgR0VUIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBwb3B1bGF0ZVxuICAgICAgLy90aGVzZSBmaWVsZHMgXG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRwcm9wcykge1xuICAgIGNvbnNvbGUubG9nKGBwcm9wIGNoYW5nZWQ6ICR7bmV4dHByb3BzLmFjdGl2ZV9wYWdlfWApO1xuICAgIGlmIChuZXh0cHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3JlX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyBjYWxsZWQnKTtcbiAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHJlcS5vcGVuKCdHRVQnLCBgL3VzZXIvJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKX1cbiAgICAgIC9zdG9yZS8ke25leHRwcm9wcy5hY3RpdmVfc3RvcmUuX2lkfS9tYW5hZ2VgKTtcbiAgICAgIGNvbnNvbGUubG9nKHNldF9IVFRQX2hlYWRlcihyZXEpKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlcSk7XG4gICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgLy8gRmlyc3QgaXRlbSBpcyB0aGUgc3RvcmUgb2JqZWN0LCBcbiAgICAgICAgICAvLyBzZWNvbmQgdGhlIG93bmVyIG9iamVjdCxcbiAgICAgICAgICAvLyB0aGlyZCBpdGVtIHRoZSBhcnJheSBvZiBjb250cmlidXRvcnNcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICAgIG5hbWU6IHJlc1swXS5uYW1lLFxuICAgICAgICAgICAgY29udHJpYnV0b3JzX2lkczogcmVzWzBdLmNvbnRyaWJ1dG9ycyxcbiAgICAgICAgICAgIG93bmVyOiByZXNbMV0sXG4gICAgICAgICAgICBjb250cmlidXRvcnM6IHJlc1syXVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgbGV0IGNsaWNrZWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmlkO1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkcy5pbmRleE9mKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0uX2lkKSAhPSAtMSkge1xuICAgICAgY29uc29sZS5sb2coJ2NvbnRyaWJ1dG9yIGFscmVhZHkgZXhpc3RzJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnMucHVzaCh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkcy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0uX2lkKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBjb250cmlidXRvcnNfaWQ6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkLFxuICAgICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuY29udHJpYnV0b3JzKTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnRyaWJ1dG9ycycpIHtcbiAgICAgICAgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgcmVxLm9wZW4oJ0dFVCcsICcvdXNlci8nICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHNldF9IVFRQX2hlYWRlcihyZXEpLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSxcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9O1xuICAgIG1ha2VfcmVxdWVzdCAoXG4gICAgICAnUFVUJywgXG4gICAgICAoYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlLyR7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkfS9tYW5hZ2VgKSxcbiAgICAgIHNob3dfbWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgZGF0YVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBzaG93X21lc3NhZ2UocmVxdWVzdCl7XG4gICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEgJyA6ICdGYWlsdXJlISAnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZV9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+Q2hhbmdlIHN0b3JlIGRldGFpbHM8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPHA+T3duZXI6IHt0aGlzLnN0YXRlLm93bmVyLnVzZXJuYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj4gPHRkPkRpc3BsYXkgbmFtZTwvdGQ+PHRkPlBob25lIG51bWJlcjwvdGQ+PC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7cm93c31cbiAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgXG4gICAgfVxuICB9XG59XG5cbiIsIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBcbiAqIFN0b3JlcyB0YWJsZSBhbmQgcGFnZVxuICogXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgU3RvcmVzX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZXNfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2VcIj5cbiAgICAgICAgPFN0b3Jlc19UYWJsZSAvPlxuICAgICAgICA8QWRkX1N0b3JlX0J1dHRvbiBvbkNsaWNrID0ge3RoaXMuaGFuZGxlQ2xpY2t9Lz5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxudmFyIEFkZF9TdG9yZV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1N0b3JlX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3N0b3JlX2J1dHRvblwiIFxuICAgICAgICBvbkNsaWNrID0ge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgICAgQWRkIG5ldyBzdG9yZVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKVxuICB9XG59KVxuXG5cbnZhciBTdG9yZXNfVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh7XG4gICAgICBzdG9yZXM6IFtdLFxuICAgICAgdXNlcnM6IFtdXG4gICAgfSk7XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgdmFyIF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG4gICAgdmFyIHJlcXVlc3RfdXJsID0gJy91c2VyLycgKyBfdXNlcl9pZCArICcvc3RvcmUnO1xuXG4gICAgdmFyIGdldCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGdldC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RfdXJsKTtcbiAgICBnZXQgPSBzZXRfSFRUUF9oZWFkZXIoZ2V0KTtcbiAgICBnZXQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKGdldC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoZ2V0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0b3JlczogcmVzLnN0b3JlcyxcbiAgICAgICAgICB1c2VyczogcmVzLnVzZXJzXG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9XG4gICAgZ2V0LnNlbmQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcm93cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5zdG9yZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbnNbaV0pOyBcbiAgICAgIHZhciB1c2VyID0gdGhpcy5zdGF0ZS51c2Vyc1tpXTtcbiAgICAgIGlmICh1c2VyID09PSB1bmRlZmluZWQpIHsgdXNlciA9IG51bGw7IH1cblxuICAgICAgICByb3dzLnB1c2goXG5cbiAgICAgICAgICA8U3RvcmVzX1RhYmxlX1JvdyBcbiAgICAgICAgICAgIGtleT17aX0gXG4gICAgICAgICAgICBzdG9yZT17dGhpcy5zdGF0ZS5zdG9yZXNbaV19IFxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICAgIHJldHVybihcbiAgICAgICAgPHRhYmxlPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgPHRoPlN0b3JlPC90aD5cbiAgICAgICAgICAgICAgPHRoPk93bmVyPC90aD5cbiAgICAgICAgICAgICAgPHRoPkFjdGlvbnM8L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgKVxuICB9XG59KVxuXG52YXIgU3RvcmVzX1RhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0VHJhbnNhY3Rpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZhciBVUkwgPSAoXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyBcbiAgICAgICAgdGhpcy5wcm9wcy5zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBVUkwpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgLy8gSSBoYXZlIHRvIHBhc3MgdGhpcyBcInJlc1wiIHRvIHRoZSByZWFscGFnZSBvciB0cmFucyB2aWV3IHBhZ2VcbiAgICAgICAgbGV0IGFjdGl2ZV9wYWdlID0gJ1RyYW5zYWN0aW9uc19WaWV3X1BhZ2UnO1xuICAgICAgICByZXMuYWN0aXZlX3N0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycsIChyZXMpKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9LFxuICBtYW5hZ2VTdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gXCJTdG9yZV9NYW5hZ2VtZW50X1BhZ2VcIjtcbiAgICBsZXQgYWN0aXZlX3N0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlLCBhY3RpdmVfc3RvcmU6IGFjdGl2ZV9zdG9yZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDx0cj5cbiAgICAgICAgPHRkPiB7IHRoaXMucHJvcHMuc3RvcmUubmFtZSB9PC90ZD5cbiAgICAgICAgPHRkPiB7IHRoaXMucHJvcHMudXNlci51c2VybmFtZSB9PC90ZD5cbiAgICAgICAgPHRkPjxidXR0b24gb25DbGljayA9IHt0aGlzLmdldFRyYW5zYWN0aW9uc30+VmlldzwvYnV0dG9uPjxidXR0b24gb25DbGljayA9IHt0aGlzLm1hbmFnZVN0b3JlfT5FZGl0PC9idXR0b24+PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICB9XG59KVxuXG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgVXNlcl9NYW5hZ2VtZW50X1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgLy9XaGVuIGNvbXBvbmVudCBtb3VudHMsIHNlbmQgYSBHRVQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIHBvcHVsYXRlXG4gICAgICAvL3RoZXNlIGZpZWxkcyBcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBfaWQ6ICcnLFxuICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZygnbW91bnRlZCcpO1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmtleXMocmVzWzBdKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc1swXVsndXNlcm5hbWUnXSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHBob25lX251bWJlcjogcmVzWzBdLnBob25lX251bWJlcixcbiAgICAgICAgICBfaWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgdXNlcm5hbWU6IHJlc1swXS51c2VybmFtZVxuICAgICAgICB9KVxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgIHN0YXRlW2tleV0gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgfVxuICB9XG4gIFxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBQVVQgcmVxdWVzdCcpO1xuICAgIC8vU2VuZCBhIFBPU1QgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgLy8gVGhlIHNlcnZlciBuZWVkcyB0byBjaGVjayB0aGF0IHRoaXMgcGhvbmUgbnVtYmVyIGlzbid0IGFscmVhZHkgdXNlZFxuICAgIHZhciBkYXRhID0ge1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlcixcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lXG4gICAgfVxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIlBVVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzIScgOiAnRmFpbHVyZSEnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgfSk7XG4gICAgICB0aGlzLnByb3BzLm9uVXBkYXRlKHJlcy51c2VyKTtcbiAgICB9ICAgICAgXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnVXNlcl9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgIHJldHVybihcbiAgICAgICAgPGRpdiBpZD1cImJvZHlcIj5cbiAgICAgICAgPHA+IHt0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlfSA8L3A+XG4gICAgICAgIDxoMT5DaGFuZ2UgdXNlciBkZXRhaWxzPC9oMT5cbiAgICAgICAgPHA+SWYgeW91IGNoYW5nZSB5b3VyIHBob25lIG51bWJlciwgeW91IGNhbiBlZGl0IGl0IGhlcmUuPC9wPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+UGhvbmU6IHt0aGlzLnN0YXRlLnBob25lX251bWJlcn0gPC9wPlxuICAgICAgICA8cD5Vc2VyOiB7dGhpcy5zdGF0ZS51c2VybmFtZX0gPC9wPlxuICAgICAgICBcbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXIgKGxvZ2luIHdpdGggdGhpcyk8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZXF1aXJlZD0ncmVxdWlyZWQnXG4gICAgICAgICAgdHlwZT0nbnVtYmVyJyBcbiAgICAgICAgICBpZD0ncGhvbmVfbnVtYmVyJyBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgncGhvbmVfbnVtYmVyJylcbiAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9J3VzZXJfbmFtZSc+TmFtZTogQ2hvb3NlIGFcbiAgICAgICAgbmFtZSB0aGF0IGlzIHVuaXF1ZSBzbyBwZW9wbGUgY2FuIGZpbmQgeW91LjwvbGFiZWw+XG4gICAgICAgIDxpbnB1dCBcbiAgICAgICAgICByZXF1aXJlZD0ncmVxdWlyZWQnXG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgaWQ9XCJ1c2VyX25hbWVcIiBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCd1c2VybmFtZScpfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICB9XG59XG5cbi8vIFJlYWN0RE9NLnJlbmRlciggPFVzZXJfTWFuYWdlbWVudF9QYWdlLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykgKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBIb21lX1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlcjoge30sXG4gICAgICBhY3RpdmVfcGFnZTogJ0hvbWUgUGFnZScsXG4gICAgICBhY3RpdmVfc3RvcmU6IHt9LFxuICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB7fSxcbiAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB7fSxcbiAgICAgIHN0YXR1c19tZXNzYWdlOiAnJyxcbiAgICB9O1xuICAgIHRoaXMuZ29UbyA9IHRoaXMuZ29Uby5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50V2lsbE1vdW50ID0gdGhpcy5jb21wb25lbnRXaWxsTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBvbmVudERpZE1vdW50ID0gdGhpcy5jb21wb25lbnREaWRNb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMudXBkYXRlVXNlciA9IHRoaXMudXBkYXRlVXNlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMubG9nb3V0ID0gdGhpcy5sb2dvdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgY29uc3QgX3VzZXJfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKTtcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xuXG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGxldCB1cmwgPSAnL3VzZXIvJyArIF91c2VyX2lkO1xuXG4gICAgY29uc29sZS5sb2codXJsKTtcblxuICAgIHJlcS5vcGVuKCdHRVQnLCB1cmwpO1xuXG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIGlmIChyZXMuc3VjY2VzcyA9PSBmYWxzZSApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMubWVzc2FnZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzdGF0dXNfbWVzc2FnZTogcmVzLm1lc3NhZ2VcbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciB1c2VyID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudXNlciA9IHVzZXJbMF07XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgdXNlcjogdGhpcy5zdGF0ZS51c2VyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudXNlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodG9rZW4gIT0gbnVsbCkge1xuICAgICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgfVxuICAgIHJlcS5zZW5kKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcblxuICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcignc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnLCAoc3RvcmVfdHJhbnMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coc3RvcmVfdHJhbnMpO1xuICAgICAgICAvL0ZpcnN0LCB0YWtlIG91dCB0aGUgXCJhY3RpdmUgc3RvcmVcIlxuICAgICAgICB2YXIgYWN0aXZlX3N0b3JlID0gc3RvcmVfdHJhbnMuYWN0aXZlX3N0b3JlO1xuICAgICAgICBkZWxldGUgc3RvcmVfdHJhbnMuYWN0aXZlX3N0b3JlO1xuICAgICAgICB0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9ucyA9IHN0b3JlX3RyYW5zO1xuICAgICAgICB0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZSA9IGFjdGl2ZV9zdG9yZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnMpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBhY3RpdmVfc3RvcmU6IHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlLFxuICAgICAgICAgIHN0b3JlX3RyYW5zYWN0aW9uczogdGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnNcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLFxuICAgICAgICAodHJhbnNhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24gPSB0cmFuc2FjdGlvbjtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICB0cmFuc2FjdGlvbl9zaG93bjogdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93blxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGVkJyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24pO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkaXNwYXRjaGVyLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZV90cmFuc2FjdGlvbicsIChhY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgX3VzZXJfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKTtcbiAgICAgICAgdmFyIHVwZGF0ZSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duLl9pZCk7XG4gICAgICAgIGxldCBpZCA9IHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24uX2lkO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpZCk7XG4gICAgICAgIGxldCB1cmwgPSAnL3VzZXIvJysgX3VzZXJfaWQgKyAnL3N0b3JlLycgKyB0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZS5faWQgKyAnL3RyYW5zLycgKyBpZCArICcvJyArIGFjdGlvbjtcbiAgICAgICAgY29uc29sZS5sb2codXJsKTtcbiAgICAgICAgLy8gL3RyYW5zL19pZC9yZW5ld1xuICAgICAgICB1cGRhdGUub3BlbignUFVUJywgdXJsKTtcblxuICAgICAgICB1cGRhdGUub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgIGlmICh1cGRhdGUucmVhZHlTdGF0ZSA9PSA0KXtcbiAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJywgXG4gICAgICAgICAgICBKU09OLnBhcnNlKHVwZGF0ZS5yZXNwb25zZVRleHQpKVxuICAgICAgICAgICAgLy8gV2h5IGRvIEkgZXZlbiBuZWVkIHRvIGRpc3BhdGNoIHRoaXMgZXZlbnQgdG8gYmUgaG9uZXN0XG4gICAgICAgICAgICAvLyBJIGNhbiBtdXRhdGUgdGhlIHN0YXRlIHN0cmFpZ2h0IGF3YXkgZnJvbSBoZXJlLiBBaCB3ZWxsXG4gICAgICAgICAgICAvLyBJIHRoaW5rIGl0J3MgY2xlYW5lciB0byBkbyB0aGlzLiBEUlkgYWZ0ZXIgYWxsLi4uXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBzZXRfSFRUUF9oZWFkZXIodXBkYXRlKS5zZW5kKCk7XG4gICAgICAgfSk7XG4gIH1cblxuICBnb1RvKHBhZ2UpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgICBsZXQgYWN0aXZlX3BhZ2UgPSBwYWdlO1xuICAgICAgY29uc29sZS5sb2coYWN0aXZlX3BhZ2UpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgXG4gIHVwZGF0ZVVzZXIodXNlcikge1xuICAgIHRoaXMuc3RhdGUudXNlciA9IHVzZXI7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1c2VyOiB1c2VyXG4gICAgfSlcbiAgfVxuXG4gIGxvZ291dCgpIHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICB3aW5kb3cubG9jYXRpb24gPSAnL2xvZ2luLmh0bWwnO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UpO1xuICAgIGlmICh0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlICE9PSAnJykge1xuICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlO1xuICAgICAgZnVuY3Rpb24gY3JlYXRlTWVzc2FnZShtZXNzYWdlKSB7cmV0dXJuIHtfX2h0bWw6IG1lc3NhZ2V9fVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17Y3JlYXRlTWVzc2FnZShtZXNzYWdlKX0gLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4oXG4gICAgICAgIDxkaXY+XG4gICAgICAgIDxoZWFkZXI+e3RoaXMuc3RhdGUudXNlci51c2VybmFtZX0gPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmxvZ291dH0+TG9nb3V0PC9idXR0b24+PC9oZWFkZXI+XG4gICAgICAgIDxoMT57dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX08L2gxPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuZ29UbygnVXNlcl9NYW5hZ2VtZW50X1BhZ2UnKX0+RWRpdCB1c2VyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5nb1RvKCdTdG9yZXNfUGFnZScpfT5WaWV3IHN0b3JlczwvYnV0dG9uPlxuXG4gICAgICAgIDxTdG9yZXNfUGFnZSBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfS8+XG4gICAgICAgICAgPEFkZF9TdG9yZV9QYWdlIFxuICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTdG9yZV9NYW5hZ2VtZW50X1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgYWN0aXZlX3N0b3JlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRyYW5zYWN0aW9uc19WaWV3X1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfc3RvcmU9e3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgICAgYWN0aXZlX3BhZ2U9e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM9e3RoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX1BhZ2VcbiAgICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgICAgYWN0aXZlX3N0b3JlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlXG4gICAgICAgICAgICAgIGFjdGl2ZV9wYWdlPXt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgICB0cmFuc2FjdGlvbiA9e3RoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd259XG4gICAgICAgICAgICAvPlxuICAgICAgICA8VXNlcl9NYW5hZ2VtZW50X1BhZ2UgXG4gICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICBvblVwZGF0ZSA9IHt0aGlzLnVwZGF0ZVVzZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gIH1cbn1cblxudmFyIGhvbWVQYWdlID0gUmVhY3RET00ucmVuZGVyKCA8SG9tZV9QYWdlLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
