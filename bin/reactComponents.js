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
      req.open("POST", "/user/" + localStorage.getItem('_user_id') + '/store');
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
      set_HTTP_header(req).send(JSON.stringify(data));
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
      req.open('PUT', '/user/' + localStorage.getItem('_user_id') + '/store/' + this.props.active_store._id + '/manage');
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
      set_HTTP_header(req).send(JSON.stringify(data));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwiYWRkX3N0b3JlLmpzeCIsImFkZF90cmFuc2FjdGlvbi5qc3giLCJ0cmFuc2FjdGlvbl92aWV3X2RldGFpbC5qc3giLCJ0cmFuc2FjdGlvbnNfdmlldy5qc3giLCJzdG9yZV9tYW5hZ2VtZW50LmpzeCIsInN0b3Jlc19wYWdlLmpzeCIsInVzZXJfbWFuYWdlbWVudC5qc3giLCJtYWluLmpzeCJdLCJuYW1lcyI6WyJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0Iiwic2V0X0hUVFBfaGVhZGVyIiwicmVxdWVzdCIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNldFJlcXVlc3RIZWFkZXIiLCJCYWNrX3RvX0hvbWVfQnV0dG9uIiwiUmVhY3QiLCJjcmVhdGVDbGFzcyIsImhhbmRsZUNsaWNrIiwiZXZlbnQiLCJhY3RpdmVfcGFnZSIsImhvbWVQYWdlIiwic2V0U3RhdGUiLCJwcmV2ZW50RGVmYXVsdCIsInJlbmRlciIsImRpc3BhdGNoZXIiLCJEaXNwYXRjaGVyIiwiRXZlbnQiLCJuYW1lIiwiY2FsbGJhY2tzIiwicHJvdG90eXBlIiwicmVnaXN0ZXJDYWxsYmFjayIsImNhbGxiYWNrIiwicHVzaCIsImV2ZW50cyIsInJlZ2lzdGVyRXZlbnQiLCJldmVudF9uYW1lIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50X2FyZ3VtZW50cyIsImZvckVhY2giLCJhZGRFdmVudExpc3RlbmVyIiwiQWRkX1N0b3JlX1BhZ2UiLCJwcm9wcyIsInN0YXRlIiwiX2lkIiwib3duZXIiLCJjb250cmlidXRvcnNfaWRzIiwiY29udHJpYnV0b3JzIiwib3V0cHV0X2NvbnRlbnQiLCJzdGF0dXNfbWVzc2FnZSIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTdWJtaXQiLCJlIiwiY29uc29sZSIsImxvZyIsImNsaWNrZWQiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwiaWQiLCJjb250cmlidXRvcnNfaWQiLCJrZXkiLCJ2YWx1ZSIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJyZXMiLCJKU09OIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJzZW5kIiwiZGF0YSIsIl91c2VyX2lkIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJzdHJpbmdpZnkiLCJyb3dzIiwiYyIsImkiLCJsZW5ndGgiLCJ1c2VybmFtZSIsInBob25lX251bWJlciIsImQiLCJDb21wb25lbnQiLCJBZGRfSXRlbV9CdXR0b24iLCJDbGljayIsIlJlbW92ZV9JdGVtX0J1dHRvbiIsIkFkZF9UcmFuc2FjdGlvbl9QYWdlIiwiZ2V0SW5pdGlhbFN0YXRlIiwiaXRlbV9jb3VudCIsIml0ZW1zIiwiYW1vdW50IiwiZXhwaXJ5X2RhdGVfbnVtYmVyIiwiZXhwaXJ5X2RhdGVfc2VsZWN0b3IiLCJoYW5kbGVBZGRDbGljayIsIml0ZW1fbmFtZSIsIml0ZW1fYW1vdW50IiwiaGFuZGxlUmVtb3ZlQ2xpY2siLCJzcGxpY2UiLCJhc3NlcnQiLCJyZXBsYWNlIiwiYWN0aXZlX3N0b3JlIiwiaGFuZGxlTmFtZUNoYW5nZSIsImhhbmRsZVBob25lTm9DaGFuZ2UiLCJoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlIiwiaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2UiLCJJdGVtIiwib25DaGFuZ2UiLCJyZWFjdF9rZXkiLCJyZWZzIiwidmFsdWVzIiwiVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSIsInRyYW5zYWN0aW9uIiwiUmV0dXJuX0l0ZW1zX0J1dHRvbiIsIlJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiIsIlRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSIsImFsbF9pdGVtcyIsIml0ZW0iLCJkYXRlIiwic3Vic3RyaW5nIiwiZXhwaXJ5X2RhdGUiLCJyZXR1cm5lZCIsInRvU3RyaW5nIiwiVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSIsInRyYW5zYWN0aW9ucyIsIkFkZF9UcmFuc2FjdGlvbl9CdXR0b24iLCJUcmFuc2FjdGlvbl9UYWJsZSIsIlRyYW5zYWN0aW9uX1RhYmxlX0hlYWRlcl9Sb3ciLCJUYWJsZV9Sb3ciLCJkYXlzX3RpbGxfZXhwaXJ5IiwiZV9kIiwiRGF0ZSIsIk1hdGgiLCJjZWlsIiwibm93IiwicGFyc2VfZGF0ZSIsInN0YXR1cyIsInRyX3N0eWxlIiwidGV4dERlY29yYXRpb24iLCJjb2xvciIsImJhY2tncm91bmRDb2xvciIsIlN0b3JlX01hbmFnZW1lbnRfUGFnZSIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0cHJvcHMiLCJTdG9yZXNfUGFnZSIsIkFkZF9TdG9yZV9CdXR0b24iLCJTdG9yZXNfVGFibGUiLCJzdG9yZXMiLCJ1c2VycyIsImNvbXBvbmVudERpZE1vdW50IiwicmVxdWVzdF91cmwiLCJnZXQiLCJ1c2VyIiwidW5kZWZpbmVkIiwiU3RvcmVzX1RhYmxlX1JvdyIsImdldFRyYW5zYWN0aW9ucyIsIlVSTCIsInN0b3JlIiwibWFuYWdlU3RvcmUiLCJVc2VyX01hbmFnZW1lbnRfUGFnZSIsIm9uVXBkYXRlIiwiSG9tZV9QYWdlIiwic3RvcmVfdHJhbnNhY3Rpb25zIiwidHJhbnNhY3Rpb25fc2hvd24iLCJnb1RvIiwiY29tcG9uZW50V2lsbE1vdW50IiwidXBkYXRlVXNlciIsImxvZ291dCIsInVybCIsInN0b3JlX3RyYW5zIiwiYWN0aW9uIiwidXBkYXRlIiwicGFnZSIsImNsZWFyIiwid2luZG93IiwibG9jYXRpb24iLCJjcmVhdGVNZXNzYWdlIiwiX19odG1sIiwiUmVhY3RET00iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVNBLFFBQVQsQ0FBa0JD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Q0FBZiIsImZpbGUiOiJyZWFjdENvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4vLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4vLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbi8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRfSFRUUF9oZWFkZXIocmVxdWVzdCkge1xuICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xuXG4gIGlmICh0b2tlbikge1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcigneC1hY2Nlc3MtdG9rZW4nLCB0b2tlbik7XG4gICAgcmV0dXJuKHJlcXVlc3QpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybignRXJyb3I6IHRva2VuIGNvdWxkIG5vdCBiZSBmb3VuZC4gQ2hlY2sgbG9jYWxTdG9yYWdlJyk7XG4gIH1cbn1cbiIsInZhciBCYWNrX3RvX0hvbWVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdIb21lX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImhvbWVfYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgQmFja1xuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIERpc3BhdGNoZXIvIFJlYWN0b3IgcGF0dGVybiBtb2RlbFxuICpcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTUzMDgzNzEvY3VzdG9tLWV2ZW50cy1tb2RlbC1cbiAqIHdpdGhvdXQtdXNpbmctZG9tLWV2ZW50cy1pbi1qYXZhc2NyaXB0XG4gKlxuICogSG93IGl0IHdvcmtzOlxuICogLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSZWdpc3RlciBldmVudHMuIEFuIGV2ZW50IGlzIGJhc2ljYWxseSBhIHJlcG9zaXRvcnkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICogQ2FsbCB0aGUgZXZlbnQgdG8gY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zLiBcbiAqIEhvdyB0byBjYWxsIHRoZSBldmVudD8gVXNlIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudF9uYW1lKVxuICogXG4gKiBBIERpc3BhdGNoZXIgaXMgYSBsaXN0IG9mIEV2ZW50cy4gU28gY2FsbGluZyBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnRcbiAqIGJhc2ljYWxseSBmaW5kcyB0aGUgZXZlbnQgaW4gdGhlIERpc3BhdGNoZXIgYW5kIGNhbGxzIGl0XG4gKlxuICogRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50IC0tPiBjYWxscyB0aGUgRXZlbnQgLS0tPiBjYWxscyB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHMpIG9mIHRoZSBFdmVudC4gXG4gKlxuICogSG93IGRvIHdlIHNldCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zIG9mIHRoZSBFdmVudD8gVXNlIGFkZEV2ZW50TGlzdGVuZXIuXG4gKiBhZGRFdmVudExpc3RlbmVyIGlzIHJlYWxseSBhIG1pc25vbWVyLCBpdCBzaG91bGQgYmUgY2FsbGVkIGFkZENhbGxCYWNrLlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIGRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5mdW5jdGlvbiBFdmVudChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuY2FsbGJhY2tzID0gW107XG59O1xuXG5FdmVudC5wcm90b3R5cGUucmVnaXN0ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG59O1xuXG5mdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICB0aGlzLmV2ZW50cyA9IHt9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSkge1xuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnRfbmFtZSk7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdID0gZXZlbnQ7XG4gIC8vIGNvbnNvbGUubG9nKHRoaXMuZXZlbnRzKTtcbn1cblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGV2ZW50X2FyZ3VtZW50cyl7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2soZXZlbnRfYXJndW1lbnRzKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZGlzcGF0Y2hlZCcpO1xuICAgIC8vIGNvbnNvbGUubG9nKGNhbGxiYWNrLCBldmVudF9hcmd1bWVudHMpO1xuICB9KTtcbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudF9uYW1lLCBjYWxsYmFjaykge1xuICB0aGlzLmV2ZW50c1tldmVudF9uYW1lXS5yZWdpc3RlckNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgLy8gY29uc29sZS5sb2coY2FsbGJhY2spO1xufTtcblxuLyogLS0tLS0tLS0tLS0tLVxuICogRGlzcGF0Y2hlciBldmVudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0qL1xuXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycpO1xuLy9TZW5kIFRyYW5zYWN0aW9uIERldGFpbHMgaGFzIGEgbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQgXG4vL3RoYXQgdGFrZXMgaW4gYSBKU09OIG9iamVjdCBhcyBhIHBhcmFtZXRlci4gVGhpcyBKU09OIG9iamVjdCBpcyB0aGUgXG4vL3RyYW5zYWN0aW9uLiBUaGVuIHRoZSBEZXRhaWwgVmlldyBUYWJsZSB3aWxsIHVwZGF0ZS4gXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicpXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJyk7XG5cblxuXG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgQWRkX1N0b3JlX1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgX2lkOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgb3duZXI6IFtdLFxuICAgICAgY29udHJpYnV0b3JzX2lkczogW10sXG4gICAgICBjb250cmlidXRvcnM6IFtdLFxuICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkcy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0uX2lkKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycyk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnRyaWJ1dG9ycycpIHtcbiAgICAgICAgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0X0hUVFBfaGVhZGVyKHJlcSkuc2VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIHN0YXRlID0ge307XG4gICAgICAgIHN0YXRlW2tleV0gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBPU1QgcmVxdWVzdCcpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgX3VzZXJfaWQ6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH1cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJQT1NUXCIsICBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyAnL3N0b3JlJyk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblxuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7dGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzISAnIDogJ0ZhaWx1cmUhICcpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBsZXQgYyA9IHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnQ7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICByb3dzLnB1c2goXG4gICAgICAgICAgPHRyXG4gICAgICAgICAgaWQ9e2l9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgICAgPHRkPntjW2ldLnVzZXJuYW1lfTwvdGQ+XG4gICAgICAgICAgPHRkPntjW2ldLnBob25lX251bWJlcn08L3RkPlxuICAgICAgICAgIDwvdHI+KVxuICAgIH1cblxuICAgIHZhciBjb250cmlidXRvcnMgPSBbXTtcbiAgICBsZXQgZCA9IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb250cmlidXRvcnMucHVzaChcbiAgICAgICAgICA8bGkgaWQ9e2l9PlxuICAgICAgICAgICAge2RbaV0udXNlcm5hbWV9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnQWRkX1N0b3JlX1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+QWRkIHN0b3JlPC9oMT5cbiAgICAgICAgPGZvcm0+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlfTwvcD5cbiAgICAgICAgPHA+U3RvcmUgbmFtZToge3RoaXMuc3RhdGUubmFtZX08L3A+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgQ29udHJpYnV0b3JzOlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICB7Y29udHJpYnV0b3JzfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+U3RvcmUgbmFtZTwvbGFiZWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgaWQ9J25hbWUnIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5uYW1lfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnbmFtZScpfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgPGRpdiBpZCA9ICdzZWFyY2gnPlxuICAgICAgICA8bGFiZWwgaHRtbEZvciA9J3NlYXJjaF9jb250cmlidXRvcnMnPkNvbnRyaWJ1dG9yczwvbGFiZWw+XG5cbiAgICAgICAgPHVsPlxuICAgICAgICB7Y29udHJpYnV0b3JzfVxuICAgICAgICA8L3VsPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGlkID0gJ3NlYXJjaF9jb250cmlidXRvcnMnXG4gICAgICAgICAgdHlwZT0nc2VhcmNoJyBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ2NvbnRyaWJ1dG9ycycpfSBcbiAgICAgICAgLz5cbiAgICAgICAgXG4gICAgICAgIDx0YWJsZSBpZCA9IFwib3V0cHV0X2NvbnRlbnRcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICA8dHI+PHRkPkRpc3BsYXkgbmFtZTwvdGQ+PHRkPlBob25lIG51bWJlcjwvdGQ+PC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7cm93c31cbiAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gKlxuICogQWRkIFRyYW5zYWN0aW9uIEZvcm0gUGFnZSBcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgQWRkX0l0ZW1fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIHRoaXMucHJvcHMuQ2xpY2soKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9pdGVtX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIEFkZCBuZXcgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxudmFyIFJlbW92ZV9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyZW1vdmVfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBSZW1vdmUgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxuXG52YXIgQWRkX1RyYW5zYWN0aW9uX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIHJldHVybiAgKHtcbiAgICBpdGVtX2NvdW50OiAxLFxuICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgbmFtZTogJycsXG4gICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG4gICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6ICdtb250aCdcbiAgICB9KVxuICB9LFxuICBoYW5kbGVBZGRDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMucHVzaCh7aXRlbV9uYW1lOiAnJywgaXRlbV9hbW91bnQ6ICcnfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQgKyAxLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5pdGVtX2NvdW50O1xuICB9LCAgXG4gIGhhbmRsZVJlbW92ZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgdGhpcy5zdGF0ZS5pdGVtcy5zcGxpY2UoLTEsIDEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuaXRlbXMpO1xuICAgIGlmICh0aGlzLnN0YXRlLml0ZW1fY291bnQgPT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLml0ZW1fY291bnQgLS07XG4gICAgfVxuICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3RhdGUuaXRlbV9jb3VudCA+PSAwKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1fY291bnQ6IHRoaXMuc3RhdGUuaXRlbV9jb3VudCxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7ICAgIFxuICAgIHZhciBkYXRhID0gIHtcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIC8vU3RyaXAgcGhvbmUgbnVtYmVyIGlucHV0cy5cbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIucmVwbGFjZSgvIC9nLCAnJyksXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtcyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIsXG4gICAgICBleHBpcnlfZGF0ZV9zZWxlY3RvcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvclxuICAgIH07XG4gICAgXG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5uYW1lKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICBcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbihcIlBPU1RcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyB0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxdWVzdCA9IHNldF9IVFRQX2hlYWRlcihyZXF1ZXN0KTtcbiBcbiBcbiAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFxuICAgIC8vQ2xlYXIgZXZlcnl0aGluZy4uLlxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogMSxcbiAgICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG5cbiAgICB9KTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oa2V5LCBuYW1lLCBhbW91bnQpe1xuICAgIC8vIGNvbnNvbGUubG9nKGtleSwgaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuc3RhdGUuaXRlbXNba2V5XS5hbW91bnQgPSBhbW91bnQ7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICB9LFxuICBoYW5kbGVOYW1lQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZS5uYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lXG4gICAgfSk7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm5hbWUpO1xuICB9LFxuICBoYW5kbGVQaG9uZU5vQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJcbiAgICB9KTtcbiAgfSxcbiAgaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3Rvcik7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnQWRkX1RyYW5zX1BhZ2UnKTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGUuaXRlbV9jb3VudDsgaSsrKSB7XG4gICAgICBpdGVtcy5wdXNoKDxJdGVtIHJlYWN0X2tleT17aX0ga2V5PXtpfSB2YWx1ZXM9e3RoaXMuc3RhdGUuaXRlbXNbaV19XG4gICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+KVxuICAgIH07XG4gICAgcmV0dXJuKFxuICAgICAgPGRpdiBjbGFzcyA9XCJwYWdlXCI+XG4gICAgICA8Zm9ybT5cbiAgICAgIDxoMT5BZGQgbmV3IGxvYW48L2gxPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIG5hbWU9XCJuYW1lXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nTmFtZScgXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubmFtZX0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTmFtZUNoYW5nZX0gXG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGhvbmVfbnVtYmVyXCI+UGhvbmUgbnVtYmVyPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGUgPSd0ZWwnIFxuICAgICAgICAgIG5hbWU9XCJwaG9uZV9udW1iZXJcIiBcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nUGhvbmUgbnVtYmVyJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9IFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVBob25lTm9DaGFuZ2V9XG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZXhwaXJ5X2R1cmF0aW9uX251bWJlclwiPkV4cGlyeSBkYXRlPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgLy9jbGFzc05hbWUgPSAnaGFsZi13aWR0aCdcbiAgICAgICAgICBpZCA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJ1xuICAgICAgICAgIG5hbWUgPSAnZXhwaXJ5X2R1cmF0aW9uX251bWJlcidcbiAgICAgICAgICBwbGFjZWhvbGRlciA9ICcxJ1xuICAgICAgICAgIHZhbHVlID0ge3RoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2V9XG4gICAgICAgICAgbWluID0gXCIxXCJcbiAgICAgICAgICByZXF1aXJlZFxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxzZWxlY3QgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPVwibW9udGhcIiBcbiAgICAgICAgICBuYW1lPVwiZXhwaXJ5X2R1cmF0aW9uX3NlbGVjdG9yXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJkYXlcIj5kYXk8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2Vla1wiPndlZWs8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibW9udGhcIj5tb250aDwvb3B0aW9uPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPEFkZF9JdGVtX0J1dHRvbiBDbGljaz17dGhpcy5oYW5kbGVBZGRDbGlja30vPlxuICAgICAgICA8UmVtb3ZlX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZUNsaWNrfS8+XG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+SXRlbSBuYW1lPC90aD5cbiAgICAgICAgICAgIDx0aD5JdGVtIGFtb3VudDwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nQWRkIGxvYW4nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fT48L2lucHV0PlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG52YXIgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHsgIFxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIC8vQ2FsbHMgdGhlIGZ1bmN0aW9uIG9uQ2hhbmdlIGluIEFkZF9UcmFuc2FjdGlvbl9Gb3JtIHRvIG11dGF0ZSB0aGUgc3RhdGUgaW4gdGhlIHBhcmVudC4gXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnByb3BzLnJlYWN0X2tleSwgdGhpcy5yZWZzLm5hbWUudmFsdWUsXG4gICAgdGhpcy5yZWZzLmFtb3VudC52YWx1ZSk7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIGhlaWdodD1cIjIwcHhcIj5cbiAgICAgIDx0ZD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgdHlwZSA9ICd0ZXh0JyBcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkl0ZW0gbmFtZVwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9IFxuICAgICAgICAgIHJlZj1cIm5hbWVcIlxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgPlxuICAgICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDx0ZD5cbiAgICAgIDxpbnB1dCBcbiAgICAgICAgdHlwZSA9ICdudW1iZXInIFxuICAgICAgICBtaW49IFwiMVwiXG4gICAgICAgIHBsYWNlaG9sZGVyID0gXCJBbW91bnRcIlxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMuYW1vdW50fVxuICAgICAgICByZWY9XCJhbW91bnRcIlxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIHJlcXVpcmVkPlxuICAgICAgPC9pbnB1dD5cbiAgICAgIDwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9uIFZpZXcgRGV0YWlsIHBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKXtcbiAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnKSB7XG4gICAgcmV0dXJuKG51bGwpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5wcm9wcyk7XG4gIHJldHVybihcbiAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxoMT5Mb2FucyB2aWV3IChkZXRhaWwpPC9oMT5cbiAgICAgIDxUcmFuc2FjdGlvbl9EZXRhaWxfVGFibGUgdHJhbnNhY3Rpb249e3RoaXMucHJvcHMudHJhbnNhY3Rpb259Lz5cbiAgICAgIDxSZXR1cm5fSXRlbXNfQnV0dG9uIC8+XG4gICAgICA8UmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgIDwvZGl2PlxuICAgIClcbiAgfSBcbiAgIFxuICB9XG59KTtcblxudmFyIFJldHVybl9JdGVtc19CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJywgJ3JldHVybicpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5SZXR1cm4gaXRlbXM8L2J1dHRvbj5cbiAgKVxuIH0gXG59KTtcblxudmFyIFJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmVuZXcnKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICg8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJlbmV3IGxvYW48L2J1dHRvbj4pXG4gfSBcbn0pXG5cblxudmFyIFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSB0aGlzLnByb3BzLnRyYW5zYWN0aW9uO1xuICAgICAgdmFyIGFsbF9pdGVtcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaXRlbSBpbiB0cmFuc2FjdGlvbi5pdGVtcykge1xuICAgICAgICBhbGxfaXRlbXMucHVzaChcbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5JdGVtIE5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0ubmFtZX08L3RkPlxuICAgICAgICAgIDx0aD5Oby48L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0uYW1vdW50fTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIClcbiAgICAgIH1cbiAgcmV0dXJuIChcbiAgICA8dGFibGUgaWQ9XCJ0cmFuc2FjdGlvbl9kZXRhaWxfdGFibGVcIj5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5EYXRlPC90aD5cbiAgICAgICAgICA8dGQ+e3RyYW5zYWN0aW9uLmRhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZXhwaXJ5X2RhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+UmV0dXJuZWQ8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ucmV0dXJuZWQudG9TdHJpbmcoKX08L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ubmFtZX08L3RkPlxuICAgICAgICA8L3RyPlxuXG4gICAgICAgIHthbGxfaXRlbXN9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBUcmFuc2FjdGlvbnMgVmlldyBQYWdlXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gXCJUcmFuc2FjdGlvbnNfVmlld19QYWdlXCIpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBXaGVuIHRoaXMgcGFnZSBsb2Fkc1xuICAgICAgcmV0dXJuICAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgICA8aDE+IExvYW5zIG92ZXJ2aWV3IGZvciB7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUubmFtZX08L2gxPlxuICAgICAgICA8VHJhbnNhY3Rpb25fVGFibGUgdHJhbnNhY3Rpb25zID0ge3RoaXMucHJvcHMudHJhbnNhY3Rpb25zfSAvPlxuICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX0J1dHRvbiAvPlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn0pXG5cbnZhciBBZGRfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJztcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF90cmFuc2FjdGlvbl9idXR0b25cIlxuICAgICAgb25DbGljaz17IHRoaXMuaGFuZGxlQ2xpY2sgfT5cbiAgICAgIEFkZCBuZXcgbG9hblxuICAgICAgPC9idXR0b24+XG4gICAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5wcm9wcy50cmFuc2FjdGlvbnMpO1xuICAgIHZhciByb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BzLnRyYW5zYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uc1tpXSk7XG4gICAgICByb3dzLnB1c2goPFRhYmxlX1JvdyBrZXk9e2l9IHZhbHVlcz17dGhpcy5wcm9wcy50cmFuc2FjdGlvbnNbaV19Lz4pXG4gICAgfVxuIFxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICA8dGFibGU+XG4gICAgICA8VHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyAvPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAoXG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj5cbiAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgIDx0aD5QaG9uZSBOdW1iZXI8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICApXG4gIH1cbn0pXG5cblxudmFyIFRhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlJztcblxuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHtcbiAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIGZ1bmN0aW9uIGRheXNfdGlsbF9leHBpcnkoZGF0ZSkge1xuICAgICAgdmFyIGVfZCA9IERhdGUucGFyc2UoZGF0ZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QpO1xuICAgICAgLy8gY29uc29sZS5sb2coRGF0ZS5ub3coKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QgLSBEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSlcbiAgICAgIHJldHVybihNYXRoLmNlaWwoKGVfZCAtIERhdGUubm93KCkpLygxMDAwKjYwKjYwKjI0KSkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBwYXJzZV9kYXRlKGRhdGUpe1xuICAgICAgcmV0dXJuKGRhdGUuc3Vic3RyaW5nKDAsMTApKTtcbiAgICB9O1xuICAgdmFyIHN0YXR1cyA9IGRheXNfdGlsbF9leHBpcnkodGhpcy5wcm9wcy52YWx1ZXMuZXhwaXJ5X2RhdGUpO1xuICAgdmFyIHRyX3N0eWxlID0ge1xuICAgIFxuICAgfVxuICAgaWYgKHRoaXMucHJvcHMudmFsdWVzLnJldHVybmVkID09PSB0cnVlKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIHRleHREZWNvcmF0aW9uOiAnbGluZS10aHJvdWdoJyxcbiAgICAgICBjb2xvcjogJ2hzbCgzMCwgNCUsIDc2JSknXG4gICAgIH1cbiAgIH1cbiAgIGVsc2UgaWYgKHN0YXR1cyA8PSAwKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2hzbCgwLCA5NyUsIDY4JSknXG4gICAgIH1cbiAgIH1cbiAgICBlbHNlIGlmIChzdGF0dXMgPD0gMykge1xuICAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDMwLCA3OCUsIDYzJSknICBcbiAgICAgIH1cbiAgICAgfVxuICAgIHJldHVybihcbiAgICAgIDx0ciBzdHlsZT17dHJfc3R5bGV9IG9uQ2xpY2s9IHt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmRhdGUpfTwvdGQ+XG4gICAgICAgIDx0ZD57cGFyc2VfZGF0ZSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5uYW1lfTwvdGQ+XG4gICAgICAgIDx0ZD57dGhpcy5wcm9wcy52YWx1ZXMucGhvbmVfbnVtYmVyfTwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcbiIsIi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIHNldF9IVFRQX2hlYWRlcjp0cnVlKi9cbi8qZXNsaW50IG5vLXVuZGVmOiBcImVycm9yXCIqL1xuLyplc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiovXG4vKmVzbGludC1lbnYgbm9kZSovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgU3RvcmVfTWFuYWdlbWVudF9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8vV2hlbiBjb21wb25lbnQgbW91bnRzLCBzZW5kIGEgR0VUIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBwb3B1bGF0ZVxuICAgICAgLy90aGVzZSBmaWVsZHMgXG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRwcm9wcykge1xuICAgIGNvbnNvbGUubG9nKGBwcm9wIGNoYW5nZWQ6ICR7bmV4dHByb3BzLmFjdGl2ZV9wYWdlfWApO1xuICAgIGlmIChuZXh0cHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3JlX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyBjYWxsZWQnKVxuICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgcmVxLm9wZW4oJ0dFVCcsIGAvdXNlci8ke2xvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpfVxuICAgICAgL3N0b3JlLyR7bmV4dHByb3BzLmFjdGl2ZV9zdG9yZS5faWR9L21hbmFnZWApO1xuICAgICAgY29uc29sZS5sb2coc2V0X0hUVFBfaGVhZGVyKHJlcSkpO1xuICAgICAgY29uc29sZS5sb2cocmVxKTtcbiAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAvLyBGaXJzdCBpdGVtIGlzIHRoZSBzdG9yZSBvYmplY3QsIFxuICAgICAgICAgIC8vIHNlY29uZCB0aGUgb3duZXIgb2JqZWN0LFxuICAgICAgICAgIC8vIHRoaXJkIGl0ZW0gdGhlIGFycmF5IG9mIGNvbnRyaWJ1dG9yc1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgX2lkOiByZXNbMF0uX2lkLFxuICAgICAgICAgICAgbmFtZTogcmVzWzBdLm5hbWUsXG4gICAgICAgICAgICBjb250cmlidXRvcnNfaWRzOiByZXNbMF0uY29udHJpYnV0b3JzLFxuICAgICAgICAgICAgb3duZXI6IHJlc1sxXSxcbiAgICAgICAgICAgIGNvbnRyaWJ1dG9yczogcmVzWzJdXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXEuc2VuZCgpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkcy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0uX2lkKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGlmIChrZXkgPT09ICdjb250cmlidXRvcnMnKSB7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBkZWJvdW5jZSB0aGlzXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPSAnJykgeyAvL01ha2Ugc3VyZSBJIGRvbid0IHNlbmQgYSB1c2VsZXNzIGJsYW5rIHJlcXVlc3RcbiAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKCdHRVQnLCAnL3VzZXIvJyArIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiByZXNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgLy9TZW5kIGEgUFVUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFBVVCAvOl9zdG9yZV9pZC9tYW5hZ2VcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICAvL1NlbmQgYSBQT1NUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFRoZSBzZXJ2ZXIgbmVlZHMgdG8gY2hlY2sgdGhhdCB0aGlzIHBob25lIG51bWJlciBpc24ndCBhbHJlYWR5IHVzZWRcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiB0aGlzLnN0YXRlLl91c2VyX2lkLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH07XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKCdQVVQnLCAgJy91c2VyLycgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArICcvc3RvcmUvJyArIFxuICAgICAgdGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkICsgJy9tYW5hZ2UnKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiBcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTt0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhJyA6ICdGYWlsdXJlIScpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07ICAgICAgXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgc2V0X0hUVFBfaGVhZGVyKHJlcSkuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZV9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+Q2hhbmdlIHN0b3JlIGRldGFpbHM8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPHA+T3duZXI6IHt0aGlzLnN0YXRlLm93bmVyLnVzZXJuYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj4gPHRkPkRpc3BsYXkgbmFtZTwvdGQ+PHRkPlBob25lIG51bWJlcjwvdGQ+PC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7cm93c31cbiAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgXG4gICAgfVxuICB9XG59XG5cbiIsIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBcbiAqIFN0b3JlcyB0YWJsZSBhbmQgcGFnZVxuICogXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgU3RvcmVzX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZXNfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgPFN0b3Jlc19UYWJsZSAvPlxuICAgICAgPEFkZF9TdG9yZV9CdXR0b24gb25DbGljayA9IHt0aGlzLmhhbmRsZUNsaWNrfS8+XG5cbiAgICAgIDwvZGl2PlxuICAgIClcblxuICAgIH1cbiAgfVxufSlcblxudmFyIEFkZF9TdG9yZV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1N0b3JlX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3N0b3JlX2J1dHRvblwiIFxuICAgICAgICBvbkNsaWNrID0ge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgICAgQWRkIG5ldyBzdG9yZVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKVxuICB9XG59KVxuXG5cbnZhciBTdG9yZXNfVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh7XG4gICAgICBzdG9yZXM6IFtdLFxuICAgICAgdXNlcnM6IFtdXG4gICAgfSk7XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgdmFyIF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG4gICAgdmFyIHJlcXVlc3RfdXJsID0gJy91c2VyLycgKyBfdXNlcl9pZCArICcvc3RvcmUnO1xuXG4gICAgdmFyIGdldCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGdldC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RfdXJsKTtcbiAgICBnZXQgPSBzZXRfSFRUUF9oZWFkZXIoZ2V0KTtcbiAgICBnZXQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKGdldC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoZ2V0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0b3JlczogcmVzLnN0b3JlcyxcbiAgICAgICAgICB1c2VyczogcmVzLnVzZXJzXG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9XG4gICAgZ2V0LnNlbmQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcm93cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5zdG9yZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbnNbaV0pOyBcbiAgICAgIHZhciB1c2VyID0gdGhpcy5zdGF0ZS51c2Vyc1tpXTtcbiAgICAgIGlmICh1c2VyID09PSB1bmRlZmluZWQpIHsgdXNlciA9IG51bGw7IH1cblxuICAgICAgICByb3dzLnB1c2goXG5cbiAgICAgICAgICA8U3RvcmVzX1RhYmxlX1JvdyBcbiAgICAgICAgICAgIGtleT17aX0gXG4gICAgICAgICAgICBzdG9yZT17dGhpcy5zdGF0ZS5zdG9yZXNbaV19IFxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICAgIHJldHVybihcbiAgICAgICAgPHRhYmxlPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgPHRoPlN0b3JlPC90aD5cbiAgICAgICAgICAgICAgPHRoPk93bmVyPC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIClcbiAgfVxufSlcblxudmFyIFN0b3Jlc19UYWJsZV9Sb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldFRyYW5zYWN0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgVVJMID0gKFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArIFwiL3N0b3JlL1wiICsgXG4gICAgICAgIHRoaXMucHJvcHMuc3RvcmUuX2lkICsgXCIvdHJhbnNcIik7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgVVJMKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBwYXNzIHRoaXMgXCJyZXNcIiB0byB0aGUgcmVhbHBhZ2Ugb3IgdHJhbnMgdmlldyBwYWdlXG4gICAgICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbnNfVmlld19QYWdlJztcbiAgICAgICAgcmVzLmFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnLCAocmVzKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfSxcbiAgbWFuYWdlU3RvcmU6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9IFwiU3RvcmVfTWFuYWdlbWVudF9QYWdlXCI7XG4gICAgbGV0IGFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZSwgYWN0aXZlX3N0b3JlOiBhY3RpdmVfc3RvcmV9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8dHI+XG4gICAgICAgIDx0ZCBvbkNsaWNrID0ge3RoaXMuZ2V0VHJhbnNhY3Rpb25zfT57IHRoaXMucHJvcHMuc3RvcmUubmFtZSB9PC90ZD5cbiAgICAgICAgPHRkIG9uQ2xpY2sgPSB7dGhpcy5nZXRUcmFuc2FjdGlvbnN9PnsgdGhpcy5wcm9wcy51c2VyLnVzZXJuYW1lIH08L3RkPlxuICAgICAgICA8dGQ+PGJ1dHRvbiBvbkNsaWNrID0ge3RoaXMubWFuYWdlU3RvcmV9PkVkaXQ8L2J1dHRvbj48L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICApXG4gIH1cbn0pXG5cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBVc2VyX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIF9pZDogJycsXG4gICAgICB1c2VybmFtZTogJycsXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9XG4gICAgdGhpcy5jb21wb25lbnREaWRNb3VudCA9IHRoaXMuY29tcG9uZW50RGlkTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKCdtb3VudGVkJyk7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhyZXNbMF0pKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzWzBdWyd1c2VybmFtZSddKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGhvbmVfbnVtYmVyOiByZXNbMF0ucGhvbmVfbnVtYmVyLFxuICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICB1c2VybmFtZTogcmVzWzBdLnVzZXJuYW1lXG4gICAgICAgIH0pXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICB9XG4gIH1cbiAgXG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBVVCByZXF1ZXN0Jyk7XG4gICAgLy9TZW5kIGEgUE9TVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAvLyBUaGUgc2VydmVyIG5lZWRzIHRvIGNoZWNrIHRoYXQgdGhpcyBwaG9uZSBudW1iZXIgaXNuJ3QgYWxyZWFkeSB1c2VkXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyLFxuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWVcbiAgICB9XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiUFVUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhJyA6ICdGYWlsdXJlIScpICsgcmVzLm1lc3NhZ2UgXG4gICAgICB9KTtcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGUocmVzLnVzZXIpO1xuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdVc2VyX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8cD4ge3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9IDwvcD5cbiAgICAgICAgPGgxPkNoYW5nZSB1c2VyIGRldGFpbHM8L2gxPlxuICAgICAgICA8cD5JZiB5b3UgY2hhbmdlIHlvdXIgcGhvbmUgbnVtYmVyLCB5b3UgY2FuIGVkaXQgaXQgaGVyZS48L3A+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD5QaG9uZToge3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfSA8L3A+XG4gICAgICAgIDxwPlVzZXI6IHt0aGlzLnN0YXRlLnVzZXJuYW1lfSA8L3A+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInBob25lX251bWJlclwiPlBob25lIG51bWJlciAobG9naW4gd2l0aCB0aGlzKTwvbGFiZWw+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSdudW1iZXInIFxuICAgICAgICAgIGlkPSdwaG9uZV9udW1iZXInIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdwaG9uZV9udW1iZXInKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj0ndXNlcl9uYW1lJz5OYW1lOiBDaG9vc2UgYVxuICAgICAgICBuYW1lIHRoYXQgaXMgdW5pcXVlIHNvIHBlb3BsZSBjYW4gZmluZCB5b3UuPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD1cInVzZXJfbmFtZVwiIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ3VzZXJuYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gIH1cbn1cblxuLy8gUmVhY3RET00ucmVuZGVyKCA8VXNlcl9NYW5hZ2VtZW50X1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSApO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIEhvbWVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VyOiB7fSxcbiAgICAgIGFjdGl2ZV9wYWdlOiAnSG9tZSBQYWdlJyxcbiAgICAgIGFjdGl2ZV9zdG9yZToge30sXG4gICAgICBzdG9yZV90cmFuc2FjdGlvbnM6IHt9LFxuICAgICAgdHJhbnNhY3Rpb25fc2hvd246IHt9LFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnLFxuICAgIH07XG4gICAgdGhpcy5nb1RvID0gdGhpcy5nb1RvLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb21wb25lbnRXaWxsTW91bnQgPSB0aGlzLmNvbXBvbmVudFdpbGxNb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy51cGRhdGVVc2VyID0gdGhpcy51cGRhdGVVc2VyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5sb2dvdXQgPSB0aGlzLmxvZ291dC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XG5cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IHVybCA9ICcvdXNlci8nICsgX3VzZXJfaWQ7XG5cbiAgICBjb25zb2xlLmxvZyh1cmwpO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHJlcy5zdWNjZXNzID09IGZhbHNlICkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5tZXNzYWdlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0YXR1c19tZXNzYWdlOiByZXMubWVzc2FnZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlclswXTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICB1c2VyOiB0aGlzLnN0YXRlLnVzZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0b2tlbiAhPSBudWxsKSB7XG4gICAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuXG4gICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycsIChzdG9yZV90cmFucykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhzdG9yZV90cmFucyk7XG4gICAgICAgIC8vRmlyc3QsIHRha2Ugb3V0IHRoZSBcImFjdGl2ZSBzdG9yZVwiXG4gICAgICAgIHZhciBhY3RpdmVfc3RvcmUgPSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIGRlbGV0ZSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zID0gc3RvcmVfdHJhbnM7XG4gICAgICAgIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlID0gYWN0aXZlX3N0b3JlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9ucyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGFjdGl2ZV9zdG9yZTogdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUsXG4gICAgICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9uc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycsXG4gICAgICAgICh0cmFuc2FjdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93biA9IHRyYW5zYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQnKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3BhdGNoZXIuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlX3RyYW5zYWN0aW9uJywgKGFjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgICAgICB2YXIgdXBkYXRlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24uX2lkKTtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bi5faWQ7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgICAgbGV0IHVybCA9ICcvdXNlci8nKyBfdXNlcl9pZCArICcvc3RvcmUvJyArIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlLl9pZCArICcvdHJhbnMvJyArIGlkICsgJy8nICsgYWN0aW9uO1xuICAgICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICAvLyAvdHJhbnMvX2lkL3JlbmV3XG4gICAgICAgIHVwZGF0ZS5vcGVuKCdQVVQnLCB1cmwpO1xuXG4gICAgICAgIHVwZGF0ZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHVwZGF0ZS5yZWFkeVN0YXRlID09IDQpe1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCBcbiAgICAgICAgICAgIEpTT04ucGFyc2UodXBkYXRlLnJlc3BvbnNlVGV4dCkpXG4gICAgICAgICAgICAvLyBXaHkgZG8gSSBldmVuIG5lZWQgdG8gZGlzcGF0Y2ggdGhpcyBldmVudCB0byBiZSBob25lc3RcbiAgICAgICAgICAgIC8vIEkgY2FuIG11dGF0ZSB0aGUgc3RhdGUgc3RyYWlnaHQgYXdheSBmcm9tIGhlcmUuIEFoIHdlbGxcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgaXQncyBjbGVhbmVyIHRvIGRvIHRoaXMuIERSWSBhZnRlciBhbGwuLi5cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHNldF9IVFRQX2hlYWRlcih1cGRhdGUpLnNlbmQoKTtcbiAgICAgICB9KTtcbiAgfVxuXG4gIGdvVG8ocGFnZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgIGxldCBhY3RpdmVfcGFnZSA9IHBhZ2U7XG4gICAgICBjb25zb2xlLmxvZyhhY3RpdmVfcGFnZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlVXNlcih1c2VyKSB7XG4gICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlcjtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXI6IHVzZXJcbiAgICB9KVxuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvbG9naW4uaHRtbCc7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UgIT09ICcnKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2U7XG4gICAgICBmdW5jdGlvbiBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpIHtyZXR1cm4ge19faHRtbDogbWVzc2FnZX19XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpfSAvPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybihcbiAgICAgICAgPGRpdj5cbiAgICAgICAgPGhlYWRlcj57dGhpcy5zdGF0ZS51c2VyLnVzZXJuYW1lfSA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMubG9nb3V0fT5Mb2dvdXQ8L2J1dHRvbj48L2hlYWRlcj5cbiAgICAgICAgPGgxPnt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfTwvaDE+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5nb1RvKCdVc2VyX01hbmFnZW1lbnRfUGFnZScpfT5FZGl0IHVzZXI8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmdvVG8oJ1N0b3Jlc19QYWdlJyl9PlZpZXcgc3RvcmVzPC9idXR0b24+XG5cbiAgICAgICAgPFN0b3Jlc19QYWdlIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9Lz5cbiAgICAgICAgICA8QWRkX1N0b3JlX1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0b3JlX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9zdG9yZT17dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICBhY3RpdmVfcGFnZT17dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgIHRyYW5zYWN0aW9ucz17dGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fUGFnZVxuICAgICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2VcbiAgICAgICAgICAgICAgYWN0aXZlX3BhZ2U9e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uID17dGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDxVc2VyX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIG9uVXBkYXRlID0ge3RoaXMudXBkYXRlVXNlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgfVxufVxuXG52YXIgaG9tZVBhZ2UgPSBSZWFjdERPTS5yZW5kZXIoIDxIb21lX1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
