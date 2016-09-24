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
      req.open('GET', '/user/' + localStorage.getItem('_user_id') + '/store/' + this.props.active_store._id + '/manage');
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
            console.log(e.target.value);
            var req = new XMLHttpRequest();
            req.open("GET", '/user/' + e.target.value);
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
      req.open("PUT", "/user/" + localStorage.getItem('_user_id') + "/store/" + this.props.active_store._id + "/manage");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwiYWRkX3N0b3JlLmpzeCIsImFkZF90cmFuc2FjdGlvbi5qc3giLCJ0cmFuc2FjdGlvbl92aWV3X2RldGFpbC5qc3giLCJ0cmFuc2FjdGlvbnNfdmlldy5qc3giLCJzdG9yZV9tYW5hZ2VtZW50LmpzeCIsInN0b3Jlc19wYWdlLmpzeCIsInVzZXJfbWFuYWdlbWVudC5qc3giLCJtYWluLmpzeCJdLCJuYW1lcyI6WyJkZWJvdW5jZSIsImZ1bmMiLCJ3YWl0IiwiaW1tZWRpYXRlIiwidGltZW91dCIsImNvbnRleHQiLCJhcmdzIiwiYXJndW1lbnRzIiwibGF0ZXIiLCJhcHBseSIsImNhbGxOb3ciLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0Iiwic2V0X0hUVFBfaGVhZGVyIiwicmVxdWVzdCIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNldFJlcXVlc3RIZWFkZXIiLCJCYWNrX3RvX0hvbWVfQnV0dG9uIiwiUmVhY3QiLCJjcmVhdGVDbGFzcyIsImhhbmRsZUNsaWNrIiwiZXZlbnQiLCJhY3RpdmVfcGFnZSIsImhvbWVQYWdlIiwic2V0U3RhdGUiLCJwcmV2ZW50RGVmYXVsdCIsInJlbmRlciIsImRpc3BhdGNoZXIiLCJEaXNwYXRjaGVyIiwiRXZlbnQiLCJuYW1lIiwiY2FsbGJhY2tzIiwicHJvdG90eXBlIiwicmVnaXN0ZXJDYWxsYmFjayIsImNhbGxiYWNrIiwicHVzaCIsImV2ZW50cyIsInJlZ2lzdGVyRXZlbnQiLCJldmVudF9uYW1lIiwiZGlzcGF0Y2hFdmVudCIsImV2ZW50X2FyZ3VtZW50cyIsImZvckVhY2giLCJhZGRFdmVudExpc3RlbmVyIiwiQWRkX1N0b3JlX1BhZ2UiLCJwcm9wcyIsInN0YXRlIiwiX2lkIiwib3duZXIiLCJjb250cmlidXRvcnNfaWRzIiwiY29udHJpYnV0b3JzIiwib3V0cHV0X2NvbnRlbnQiLCJzdGF0dXNfbWVzc2FnZSIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTdWJtaXQiLCJlIiwiY29uc29sZSIsImxvZyIsImNsaWNrZWQiLCJ0YXJnZXQiLCJwYXJlbnROb2RlIiwiaWQiLCJjb250cmlidXRvcnNfaWQiLCJrZXkiLCJ2YWx1ZSIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJyZXMiLCJKU09OIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJzZW5kIiwiZGF0YSIsIl91c2VyX2lkIiwic3VjY2VzcyIsIm1lc3NhZ2UiLCJzdHJpbmdpZnkiLCJyb3dzIiwiYyIsImkiLCJsZW5ndGgiLCJ1c2VybmFtZSIsInBob25lX251bWJlciIsImQiLCJDb21wb25lbnQiLCJBZGRfSXRlbV9CdXR0b24iLCJDbGljayIsIlJlbW92ZV9JdGVtX0J1dHRvbiIsIkFkZF9UcmFuc2FjdGlvbl9QYWdlIiwiZ2V0SW5pdGlhbFN0YXRlIiwiaXRlbV9jb3VudCIsIml0ZW1zIiwiYW1vdW50IiwiZXhwaXJ5X2RhdGVfbnVtYmVyIiwiZXhwaXJ5X2RhdGVfc2VsZWN0b3IiLCJoYW5kbGVBZGRDbGljayIsIml0ZW1fbmFtZSIsIml0ZW1fYW1vdW50IiwiaGFuZGxlUmVtb3ZlQ2xpY2siLCJzcGxpY2UiLCJhc3NlcnQiLCJyZXBsYWNlIiwiYWN0aXZlX3N0b3JlIiwiaGFuZGxlTmFtZUNoYW5nZSIsImhhbmRsZVBob25lTm9DaGFuZ2UiLCJoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlIiwiaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2UiLCJJdGVtIiwib25DaGFuZ2UiLCJyZWFjdF9rZXkiLCJyZWZzIiwidmFsdWVzIiwiVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSIsInRyYW5zYWN0aW9uIiwiUmV0dXJuX0l0ZW1zX0J1dHRvbiIsIlJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiIsIlRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSIsImFsbF9pdGVtcyIsIml0ZW0iLCJkYXRlIiwic3Vic3RyaW5nIiwiZXhwaXJ5X2RhdGUiLCJyZXR1cm5lZCIsInRvU3RyaW5nIiwiVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSIsInRyYW5zYWN0aW9ucyIsIkFkZF9UcmFuc2FjdGlvbl9CdXR0b24iLCJUcmFuc2FjdGlvbl9UYWJsZSIsIlRyYW5zYWN0aW9uX1RhYmxlX0hlYWRlcl9Sb3ciLCJUYWJsZV9Sb3ciLCJkYXlzX3RpbGxfZXhwaXJ5IiwiZV9kIiwiRGF0ZSIsIk1hdGgiLCJjZWlsIiwibm93IiwicGFyc2VfZGF0ZSIsInN0YXR1cyIsInRyX3N0eWxlIiwidGV4dERlY29yYXRpb24iLCJjb2xvciIsImJhY2tncm91bmRDb2xvciIsIlN0b3JlX01hbmFnZW1lbnRfUGFnZSIsIm9uUmVuZGVyIiwiU3RvcmVzX1BhZ2UiLCJBZGRfU3RvcmVfQnV0dG9uIiwiU3RvcmVzX1RhYmxlIiwic3RvcmVzIiwidXNlcnMiLCJjb21wb25lbnREaWRNb3VudCIsInJlcXVlc3RfdXJsIiwiZ2V0IiwidXNlciIsInVuZGVmaW5lZCIsIlN0b3Jlc19UYWJsZV9Sb3ciLCJnZXRUcmFuc2FjdGlvbnMiLCJVUkwiLCJzdG9yZSIsIm1hbmFnZVN0b3JlIiwiVXNlcl9NYW5hZ2VtZW50X1BhZ2UiLCJvblVwZGF0ZSIsIkhvbWVfUGFnZSIsInN0b3JlX3RyYW5zYWN0aW9ucyIsInRyYW5zYWN0aW9uX3Nob3duIiwiZ29UbyIsImNvbXBvbmVudFdpbGxNb3VudCIsInVwZGF0ZVVzZXIiLCJsb2dvdXQiLCJ1cmwiLCJzdG9yZV90cmFucyIsImFjdGlvbiIsInVwZGF0ZSIsInBhZ2UiLCJjbGVhciIsIndpbmRvdyIsImxvY2F0aW9uIiwiY3JlYXRlTWVzc2FnZSIsIl9faHRtbCIsIlJlYWN0RE9NIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTQSxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsSUFBeEIsRUFBOEJDLFNB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QUE7QUFBQSxTQUhBO0FBSUE7QUFBQTtBQUFBLFlBQVEsU0FBUyxLQUFLQSxJQUFMLENBQVUsYUFBVixDQUFqQjtBQUFBO0FBQUEsU0FKQTtBQU1BLDRCQUFDLFdBQUQsSUFBYSxhQUFlLEtBQUsxSCxLQUFMLENBQVd2QixXQUF2QyxHQU5BO0FBT0UsNEJBQUMsY0FBRDtBQUNFLHVCQUFlLEtBQUt1QixLQUFMLENBQVd2QjtBQUQ1QixVQVBGO0FBVUUsNEJBQUMscUJBQUQ7QUFDRSx1QkFBZSxLQUFLdUIsS0FBTCxDQUFXdkIsV0FENUI7QUFFRSx3QkFBZ0IsS0FBS3VCLEtBQUwsQ0FBVzREO0FBRjdCLFVBVkY7QUFjRSw0QkFBQyxzQkFBRDtBQUNFLHdCQUFjLEtBQUs1RCxLQUFMLENBQVc0RCxZQUQzQjtBQUVFLHVCQUFhLEtBQUs1RCxLQUFMLENBQVd2QixXQUYxQjtBQUdFLHdCQUFjLEtBQUt1QixLQUFMLENBQVd3SDtBQUgzQixVQWRGO0FBbUJJLDRCQUFDLG9CQUFEO0FBQ0UsdUJBQWUsS0FBS3hILEtBQUwsQ0FBV3ZCLFdBRDVCO0FBRUUsd0JBQWdCLEtBQUt1QixLQUFMLENBQVc0RDtBQUY3QixVQW5CSjtBQXVCSSw0QkFBQyw0QkFBRDtBQUNFLHVCQUFhLEtBQUs1RCxLQUFMLENBQVd2QixXQUQxQjtBQUVFLHVCQUFjLEtBQUt1QixLQUFMLENBQVd5SDtBQUYzQixVQXZCSjtBQTJCQSw0QkFBQyxvQkFBRDtBQUNFLHVCQUFlLEtBQUt6SCxLQUFMLENBQVd2QixXQUQ1QjtBQUVFLG9CQUFZLEtBQUttSjtBQUZuQjtBQTNCQSxPQURKO0FBa0NEOzs7O0VBaExxQnZKLE1BQU1xRTs7QUFtTDlCLElBQUloRSxXQUFXOEosU0FBUzNKLE1BQVQsQ0FBaUIsb0JBQUMsU0FBRCxPQUFqQixFQUErQjRKLFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBL0IsQ0FBZiIsImZpbGUiOiJyZWFjdENvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4vLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4vLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbi8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9O1xufVxuXG5cbmZ1bmN0aW9uIHNldF9IVFRQX2hlYWRlcihyZXF1ZXN0KSB7XG4gIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XG5cbiAgaWYgKHRva2VuKSB7XG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCd4LWFjY2Vzcy10b2tlbicsIHRva2VuKTtcbiAgICByZXR1cm4ocmVxdWVzdCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuKCdFcnJvcjogdG9rZW4gY291bGQgbm90IGJlIGZvdW5kLiBDaGVjayBsb2NhbFN0b3JhZ2UnKTtcbiAgfVxufVxuIiwidmFyIEJhY2tfdG9fSG9tZV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCl7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0hvbWVfUGFnZSc7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiaG9tZV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBCYWNrXG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogRGlzcGF0Y2hlci8gUmVhY3RvciBwYXR0ZXJuIG1vZGVsXG4gKlxuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTMwODM3MS9jdXN0b20tZXZlbnRzLW1vZGVsLVxuICogd2l0aG91dC11c2luZy1kb20tZXZlbnRzLWluLWphdmFzY3JpcHRcbiAqXG4gKiBIb3cgaXQgd29ya3M6XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFJlZ2lzdGVyIGV2ZW50cy4gQW4gZXZlbnQgaXMgYmFzaWNhbGx5IGEgcmVwb3NpdG9yeSBvZiBjYWxsYmFjayBmdW5jdGlvbnMuXG4gKiBDYWxsIHRoZSBldmVudCB0byBjYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbnMuIFxuICogSG93IHRvIGNhbGwgdGhlIGV2ZW50PyBVc2UgRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50X25hbWUpXG4gKiBcbiAqIEEgRGlzcGF0Y2hlciBpcyBhIGxpc3Qgb2YgRXZlbnRzLiBTbyBjYWxsaW5nIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudFxuICogYmFzaWNhbGx5IGZpbmRzIHRoZSBldmVudCBpbiB0aGUgRGlzcGF0Y2hlciBhbmQgY2FsbHMgaXRcbiAqXG4gKiBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQgLS0+IGNhbGxzIHRoZSBFdmVudCAtLS0+IGNhbGxzIHRoZSBjYWxsYmFja1xuICogZnVuY3Rpb24ocykgb2YgdGhlIEV2ZW50LiBcbiAqXG4gKiBIb3cgZG8gd2Ugc2V0IHRoZSBjYWxsYmFjayBmdW5jdGlvbnMgb2YgdGhlIEV2ZW50PyBVc2UgYWRkRXZlbnRMaXN0ZW5lci5cbiAqIGFkZEV2ZW50TGlzdGVuZXIgaXMgcmVhbGx5IGEgbWlzbm9tZXIsIGl0IHNob3VsZCBiZSBjYWxsZWQgYWRkQ2FsbEJhY2suXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgZGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbmZ1bmN0aW9uIEV2ZW50KG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5jYWxsYmFja3MgPSBbXTtcbn07XG5cbkV2ZW50LnByb3RvdHlwZS5yZWdpc3RlckNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbn07XG5cbmZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gIHRoaXMuZXZlbnRzID0ge31cbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyRXZlbnQgPSBmdW5jdGlvbihldmVudF9uYW1lKSB7XG4gIHZhciBldmVudCA9IG5ldyBFdmVudChldmVudF9uYW1lKTtcbiAgdGhpcy5ldmVudHNbZXZlbnRfbmFtZV0gPSBldmVudDtcbiAgLy8gY29uc29sZS5sb2codGhpcy5ldmVudHMpO1xufVxuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSwgZXZlbnRfYXJndW1lbnRzKXtcbiAgdGhpcy5ldmVudHNbZXZlbnRfbmFtZV0uY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayhldmVudF9hcmd1bWVudHMpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdkaXNwYXRjaGVkJyk7XG4gICAgLy8gY29uc29sZS5sb2coY2FsbGJhY2ssIGV2ZW50X2FyZ3VtZW50cyk7XG4gIH0pO1xufTtcblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGNhbGxiYWNrKSB7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLnJlZ2lzdGVyQ2FsbGJhY2soY2FsbGJhY2spO1xuICAvLyBjb25zb2xlLmxvZyhjYWxsYmFjayk7XG59O1xuXG4vKiAtLS0tLS0tLS0tLS0tXG4gKiBEaXNwYXRjaGVyIGV2ZW50c1xuICogLS0tLS0tLS0tLS0tLS0tLSovXG5cbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJyk7XG4vL1NlbmQgVHJhbnNhY3Rpb24gRGV0YWlscyBoYXMgYSBsaXN0ZW5lciBhdHRhY2hlZCB0byBpdCBcbi8vdGhhdCB0YWtlcyBpbiBhIEpTT04gb2JqZWN0IGFzIGEgcGFyYW1ldGVyLiBUaGlzIEpTT04gb2JqZWN0IGlzIHRoZSBcbi8vdHJhbnNhY3Rpb24uIFRoZW4gdGhlIERldGFpbCBWaWV3IFRhYmxlIHdpbGwgdXBkYXRlLiBcbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJylcbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgnc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnKTtcblxuXG5cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBZGRfU3RvcmVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGxldCBjbGlja2VkID0gZS50YXJnZXQucGFyZW50Tm9kZS5pZDtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29udHJpYnV0b3JzX2lkOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc19pZCxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuY29udHJpYnV0b3JzKTtcbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnY29udHJpYnV0b3JzJykge1xuICAgICAgICAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIFwiL3VzZXIvXCIgKyBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBvdXRwdXRfY29udGVudDogcmVzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUE9TVCByZXF1ZXN0Jyk7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBfdXNlcl9pZDogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyksXG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWUsXG4gICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgfVxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIlBPU1RcIiwgIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArICcvc3RvcmUnKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTt0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhICcgOiAnRmFpbHVyZSEgJykgKyByZXMubWVzc2FnZSBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSAgICAgIFxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHNldF9IVFRQX2hlYWRlcihyZXEpLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICB2YXIgcm93cyA9IFtdO1xuICAgIGxldCBjID0gdGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudDtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJvd3MucHVzaChcbiAgICAgICAgICA8dHJcbiAgICAgICAgICBpZD17aX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICA8dGQ+e2NbaV0udXNlcm5hbWV9PC90ZD5cbiAgICAgICAgICA8dGQ+e2NbaV0ucGhvbmVfbnVtYmVyfTwvdGQ+XG4gICAgICAgICAgPC90cj4pXG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdBZGRfU3RvcmVfUGFnZScpIHtcbiAgICAgIHJldHVybiAobnVsbCk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxoMT5BZGQgc3RvcmU8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj48dGQ+RGlzcGxheSBuYW1lPC90ZD48dGQ+UGhvbmUgbnVtYmVyPC90ZD48L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIFxuICAgIH1cbiAgfVxufVxuXG5cbiIsIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcbiAqXG4gKiBBZGQgVHJhbnNhY3Rpb24gRm9ybSBQYWdlIFxuICogXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8gXG5cbnZhciBBZGRfSXRlbV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCl7XG4gICAgdGhpcy5wcm9wcy5DbGljaygpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX2l0ZW1fYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgQWRkIG5ldyBpdGVtXG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgUmVtb3ZlX0l0ZW1fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIHRoaXMucHJvcHMuQ2xpY2soKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInJlbW92ZV9pdGVtX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIFJlbW92ZSBpdGVtXG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cbn0pO1xuXG5cbnZhciBBZGRfVHJhbnNhY3Rpb25fUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICAoe1xuICAgIGl0ZW1fY291bnQ6IDEsXG4gICAgaXRlbXM6IFt7bmFtZTogJycsIGFtb3VudDogJyd9XSxcbiAgICBuYW1lOiAnJyxcbiAgICBwaG9uZV9udW1iZXI6ICcnLFxuICAgIGV4cGlyeV9kYXRlX251bWJlcjogMSxcbiAgICBleHBpcnlfZGF0ZV9zZWxlY3RvcjogJ21vbnRoJ1xuICAgIH0pXG4gIH0sXG4gIGhhbmRsZUFkZENsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgdGhpcy5zdGF0ZS5pdGVtcy5wdXNoKHtpdGVtX25hbWU6ICcnLCBpdGVtX2Ftb3VudDogJyd9KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1fY291bnQ6IHRoaXMuc3RhdGUuaXRlbV9jb3VudCArIDEsXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnN0YXRlLml0ZW1fY291bnQ7XG4gIH0sICBcbiAgaGFuZGxlUmVtb3ZlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZFwiKTtcbiAgICB0aGlzLnN0YXRlLml0ZW1zLnNwbGljZSgtMSwgMSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5pdGVtcyk7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXRlbV9jb3VudCA9PSAwKSB7XG4gICAgICB0aGlzLnN0YXRlLml0ZW1fY291bnQgPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUuaXRlbV9jb3VudCAtLTtcbiAgICB9XG4gICAgY29uc29sZS5hc3NlcnQodGhpcy5zdGF0ZS5pdGVtX2NvdW50ID49IDApO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogdGhpcy5zdGF0ZS5pdGVtX2NvdW50LFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5pdGVtX2NvdW50O1xuICB9LFxuXG4gIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24oZXZlbnQpIHsgICAgXG4gICAgdmFyIGRhdGEgPSAge1xuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgLy9TdHJpcCBwaG9uZSBudW1iZXIgaW5wdXRzLlxuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlci5yZXBsYWNlKC8gL2csICcnKSxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zLFxuICAgICAgZXhwaXJ5X2RhdGVfbnVtYmVyOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX251bWJlcixcbiAgICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yXG4gICAgfTtcbiAgICBcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm5hbWUpO1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcblxuICAgIFxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC5vcGVuKFwiUE9TVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIHRoaXMucHJvcHMuYWN0aXZlX3N0b3JlLl9pZCArIFwiL3RyYW5zXCIpO1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXF1ZXN0ID0gc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuIFxuIFxuICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgXG4gICAgLy9DbGVhciBldmVyeXRoaW5nLi4uXG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiAxLFxuICAgICAgaXRlbXM6IFt7bmFtZTogJycsIGFtb3VudDogJyd9XSxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogMSxcblxuICAgIH0pO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihrZXksIG5hbWUsIGFtb3VudCl7XG4gICAgLy8gY29uc29sZS5sb2coa2V5LCBpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnN0YXRlLml0ZW1zW2tleV0ubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLmFtb3VudCA9IGFtb3VudDtcbiAgICAvLyBjb25zb2xlLmxvZyhpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZU5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB0aGlzLnN0YXRlLm5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWVcbiAgICB9KTtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUubmFtZSk7XG4gIH0sXG4gIGhhbmRsZVBob25lTm9DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfbnVtYmVyOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfc2VsZWN0b3JcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdBZGRfVHJhbnNfUGFnZScpO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5pdGVtX2NvdW50OyBpKyspIHtcbiAgICAgIGl0ZW1zLnB1c2goPEl0ZW0gcmVhY3Rfa2V5PXtpfSBrZXk9e2l9IHZhbHVlcz17dGhpcy5zdGF0ZS5pdGVtc1tpXX1cbiAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz4pXG4gICAgfTtcbiAgICByZXR1cm4oXG4gICAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxmb3JtPlxuICAgICAgPGgxPkFkZCBuZXcgbG9hbjwvaDE+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgbmFtZT1cIm5hbWVcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdOYW1lJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5uYW1lfSBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVOYW1lQ2hhbmdlfSBcbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXI8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZSA9J3RlbCcgXG4gICAgICAgICAgbmFtZT1cInBob25lX251bWJlclwiIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdQaG9uZSBudW1iZXInIFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnBob25lX251bWJlcn0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUGhvbmVOb0NoYW5nZX1cbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJleHBpcnlfZHVyYXRpb25fbnVtYmVyXCI+RXhwaXJ5IGRhdGU8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICAvL2NsYXNzTmFtZSA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIGlkID0gJ2hhbGYtd2lkdGgnXG4gICAgICAgICAgdHlwZSA9ICdudW1iZXInXG4gICAgICAgICAgbmFtZSA9ICdleHBpcnlfZHVyYXRpb25fbnVtYmVyJ1xuICAgICAgICAgIHBsYWNlaG9sZGVyID0gJzEnXG4gICAgICAgICAgdmFsdWUgPSB7dGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RGF0ZU51bWJlckNoYW5nZX1cbiAgICAgICAgICBtaW4gPSBcIjFcIlxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgID5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPHNlbGVjdCBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9XCJtb250aFwiIFxuICAgICAgICAgIG5hbWU9XCJleHBpcnlfZHVyYXRpb25fc2VsZWN0b3JcIlxuICAgICAgICA+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRheVwiPmRheTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3ZWVrXCI+d2Vlazwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtb250aFwiPm1vbnRoPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8QWRkX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZUFkZENsaWNrfS8+XG4gICAgICAgIDxSZW1vdmVfSXRlbV9CdXR0b24gQ2xpY2s9e3RoaXMuaGFuZGxlUmVtb3ZlQ2xpY2t9Lz5cbiAgICAgICAgPHRhYmxlPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5JdGVtIG5hbWU8L3RoPlxuICAgICAgICAgICAgPHRoPkl0ZW0gYW1vdW50PC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdBZGQgbG9hbicgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9PjwvaW5wdXQ+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbnZhciBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3MoeyAgXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgLy9DYWxscyB0aGUgZnVuY3Rpb24gb25DaGFuZ2UgaW4gQWRkX1RyYW5zYWN0aW9uX0Zvcm0gdG8gbXV0YXRlIHRoZSBzdGF0ZSBpbiB0aGUgcGFyZW50LiBcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMucHJvcHMucmVhY3Rfa2V5LCB0aGlzLnJlZnMubmFtZS52YWx1ZSxcbiAgICB0aGlzLnJlZnMuYW1vdW50LnZhbHVlKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMudmFsdWVzKTtcbiAgICByZXR1cm4oXG4gICAgICA8dHIgaGVpZ2h0PVwiMjBweFwiPlxuICAgICAgPHRkPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICB0eXBlID0gJ3RleHQnIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSXRlbSBuYW1lXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMubmFtZX0gXG4gICAgICAgICAgcmVmPVwibmFtZVwiXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICA8L3RkPlxuICAgICAgPHRkPlxuICAgICAgPGlucHV0IFxuICAgICAgICB0eXBlID0gJ251bWJlcicgXG4gICAgICAgIG1pbj0gXCIxXCJcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBcIkFtb3VudFwiXG4gICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlcy5hbW91bnR9XG4gICAgICAgIHJlZj1cImFtb3VudFwiXG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgcmVxdWlyZWQ+XG4gICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogVHJhbnNhY3Rpb24gVmlldyBEZXRhaWwgcGFnZVxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpe1xuICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZScpIHtcbiAgICByZXR1cm4obnVsbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcbiAgcmV0dXJuKFxuICAgIDxkaXYgY2xhc3MgPVwicGFnZVwiPlxuICAgICAgPGgxPkxvYW5zIHZpZXcgKGRldGFpbCk8L2gxPlxuICAgICAgPFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSB0cmFuc2FjdGlvbj17dGhpcy5wcm9wcy50cmFuc2FjdGlvbn0vPlxuICAgICAgPFJldHVybl9JdGVtc19CdXR0b24gLz5cbiAgICAgIDxSZW5ld19UcmFuc2FjdGlvbl9CdXR0b24gLz5cbiAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9IFxuICAgXG4gIH1cbn0pO1xuXG52YXIgUmV0dXJuX0l0ZW1zX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmV0dXJuJyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJldHVybiBpdGVtczwvYnV0dG9uPlxuICApXG4gfSBcbn0pO1xuXG52YXIgUmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljaygpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicsICdyZW5ldycpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+UmVuZXcgbG9hbjwvYnV0dG9uPilcbiB9IFxufSlcblxuXG52YXIgVHJhbnNhY3Rpb25fRGV0YWlsX1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCB0cmFuc2FjdGlvbiA9IHRoaXMucHJvcHMudHJhbnNhY3Rpb247XG4gICAgICB2YXIgYWxsX2l0ZW1zID0gW107XG4gICAgICBmb3IgKHZhciBpdGVtIGluIHRyYW5zYWN0aW9uLml0ZW1zKSB7XG4gICAgICAgIGFsbF9pdGVtcy5wdXNoKFxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkl0ZW0gTmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5uYW1lfTwvdGQ+XG4gICAgICAgICAgPHRoPk5vLjwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5hbW91bnR9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICAgICAgfVxuICByZXR1cm4gKFxuICAgIDx0YWJsZSBpZD1cInRyYW5zYWN0aW9uX2RldGFpbF90YWJsZVwiPlxuICAgICAgPHRib2R5PlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5leHBpcnlfZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5SZXR1cm5lZDwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5yZXR1cm5lZC50b1N0cmluZygpfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5uYW1lfTwvdGQ+XG4gICAgICAgIDwvdHI+XG5cbiAgICAgICAge2FsbF9pdGVtc31cbiAgICAgIDwvdGJvZHk+XG4gICAgPC90YWJsZT5cbiAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9ucyBWaWV3IFBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8gXG5cbnZhciBUcmFuc2FjdGlvbnNfVmlld19QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSBcIlRyYW5zYWN0aW9uc19WaWV3X1BhZ2VcIikge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFdoZW4gdGhpcyBwYWdlIGxvYWRzXG4gICAgICByZXR1cm4gIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlXCI+XG4gICAgICAgIDxoMT4gTG9hbnMgb3ZlcnZpZXcgZm9yIHt0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5uYW1lfTwvaDE+XG4gICAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZSB0cmFuc2FjdGlvbnMgPSB7dGhpcy5wcm9wcy50cmFuc2FjdGlvbnN9IC8+XG4gICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufSlcblxudmFyIEFkZF9UcmFuc2FjdGlvbl9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnO1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3RyYW5zYWN0aW9uX2J1dHRvblwiXG4gICAgICBvbkNsaWNrPXsgdGhpcy5oYW5kbGVDbGljayB9PlxuICAgICAgQWRkIG5ldyBsb2FuXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnByb3BzLnRyYW5zYWN0aW9ucyk7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcHMudHJhbnNhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTtcbiAgICAgIHJvd3MucHVzaCg8VGFibGVfUm93IGtleT17aX0gdmFsdWVzPXt0aGlzLnByb3BzLnRyYW5zYWN0aW9uc1tpXX0vPilcbiAgICB9XG4gXG4gICAgXG4gICAgcmV0dXJuIChcbiAgICAgIDx0YWJsZT5cbiAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93IC8+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPlxuICAgICAgICA8dGg+RGF0ZTwvdGg+XG4gICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgPHRoPlBob25lIE51bWJlcjwvdGg+XG4gICAgICAgIDwvdHI+XG4gICAgICA8L3RoZWFkPlxuICAgIClcbiAgfVxufSlcblxuXG52YXIgVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnO1xuXG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCB0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gZGF5c190aWxsX2V4cGlyeShkYXRlKSB7XG4gICAgICB2YXIgZV9kID0gRGF0ZS5wYXJzZShkYXRlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCAtIERhdGUubm93KCkpO1xuICAgICAgLy8gY29uc29sZS5sb2coTWF0aC5jZWlsKChlX2QgLSBEYXRlLm5vdygpKS8oMTAwMCo2MCo2MCoyNCkpKVxuICAgICAgcmV0dXJuKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHBhcnNlX2RhdGUoZGF0ZSl7XG4gICAgICByZXR1cm4oZGF0ZS5zdWJzdHJpbmcoMCwxMCkpO1xuICAgIH07XG4gICB2YXIgc3RhdHVzID0gZGF5c190aWxsX2V4cGlyeSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSk7XG4gICB2YXIgdHJfc3R5bGUgPSB7XG4gICAgXG4gICB9XG4gICBpZiAodGhpcy5wcm9wcy52YWx1ZXMucmV0dXJuZWQgPT09IHRydWUpIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgdGV4dERlY29yYXRpb246ICdsaW5lLXRocm91Z2gnLFxuICAgICAgIGNvbG9yOiAnaHNsKDMwLCA0JSwgNzYlKSdcbiAgICAgfVxuICAgfVxuICAgZWxzZSBpZiAoc3RhdHVzIDw9IDApIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDAsIDk3JSwgNjglKSdcbiAgICAgfVxuICAgfVxuICAgIGVsc2UgaWYgKHN0YXR1cyA8PSAzKSB7XG4gICAgICB0cl9zdHlsZSA9IHtcbiAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdoc2woMzAsIDc4JSwgNjMlKScgIFxuICAgICAgfVxuICAgICB9XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIHN0eWxlPXt0cl9zdHlsZX0gb25DbGljaz0ge3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8dGQ+e3BhcnNlX2RhdGUodGhpcy5wcm9wcy52YWx1ZXMuZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmV4cGlyeV9kYXRlKX08L3RkPlxuICAgICAgICA8dGQ+e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuIiwiLypnbG9iYWwgUmVhY3QqL1xuLypnbG9iYWwgc2V0X0hUVFBfaGVhZGVyOnRydWUqL1xuLyplc2xpbnQgbm8tdW5kZWY6IFwiZXJyb3JcIiovXG4vKmVzbGludC1lbnYgbm9kZSovXG5cbid1c2Ugc3RyaWN0JztcblxuXG5cbmNsYXNzIFN0b3JlX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgX2lkOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgb3duZXI6IFtdLFxuICAgICAgY29udHJpYnV0b3JzX2lkczogW10sXG4gICAgICBjb250cmlidXRvcnM6IFtdLFxuICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfTtcbiAgICB0aGlzLm9uUmVuZGVyID0gdGhpcy5vblJlbmRlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBvblJlbmRlcigpIHtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oJ0dFVCcsICcvdXNlci8nICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyAnL3N0b3JlLycgKyBcbiAgICAgIHRoaXMucHJvcHMuYWN0aXZlX3N0b3JlLl9pZCArICcvbWFuYWdlJyk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAvLyBGaXJzdCBpdGVtIGlzIHRoZSBzdG9yZSBvYmplY3QsIFxuICAgICAgICAvLyBzZWNvbmQgdGhlIG93bmVyIG9iamVjdCxcbiAgICAgICAgLy8gdGhpcmQgaXRlbSB0aGUgYXJyYXkgb2YgY29udHJpYnV0b3JzXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICBuYW1lOiByZXNbMF0ubmFtZSxcbiAgICAgICAgICBjb250cmlidXRvcnNfaWRzOiByZXNbMF0uY29udHJpYnV0b3JzLFxuICAgICAgICAgIG93bmVyOiByZXNbMV0sXG4gICAgICAgICAgY29udHJpYnV0b3JzOiByZXNbMl1cbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlcS5zZW5kKCk7XG4gIH1cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgbGV0IGNsaWNrZWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmlkO1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnMucHVzaCh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc19pZHMucHVzaCh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdLl9pZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250cmlidXRvcnNfaWQ6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH0pXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGlmIChrZXkgPT09ICdjb250cmlidXRvcnMnKSB7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBkZWJvdW5jZSB0aGlzXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPSAnJykgeyAvL01ha2Ugc3VyZSBJIGRvbid0IHNlbmQgYSB1c2VsZXNzIGJsYW5rIHJlcXVlc3RcbiAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKFwiR0VUXCIsICcvdXNlci8nICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0X0hUVFBfaGVhZGVyKHJlcSkuc2VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFyIHN0YXRlID0ge307XG4gICAgICAgIHN0YXRlW2tleV0gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgLy9TZW5kIGEgUFVUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFBVVCAvOl9zdG9yZV9pZC9tYW5hZ2VcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICAvL1NlbmQgYSBQT1NUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFRoZSBzZXJ2ZXIgbmVlZHMgdG8gY2hlY2sgdGhhdCB0aGlzIHBob25lIG51bWJlciBpc24ndCBhbHJlYWR5IHVzZWRcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiB0aGlzLnN0YXRlLl91c2VyX2lkLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH1cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJQVVRcIiwgIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArIFwiL3N0b3JlL1wiICsgXG4gICAgICB0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyBcIi9tYW5hZ2VcIik7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gXG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcblxuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7dGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzIScgOiAnRmFpbHVyZSEnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9ICAgICAgXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgc2V0X0hUVFBfaGVhZGVyKHJlcSkuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPilcbiAgICB9XG5cbiAgICB2YXIgY29udHJpYnV0b3JzID0gW107XG4gICAgbGV0IGQgPSB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29udHJpYnV0b3JzLnB1c2goXG4gICAgICAgICAgPGxpIGlkPXtpfT5cbiAgICAgICAgICAgIHtkW2ldLnVzZXJuYW1lfVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3JlX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICAgIHJldHVybiAobnVsbCk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICB0aGlzLm9uUmVuZGVyKCk7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxoMT5DaGFuZ2Ugc3RvcmUgZGV0YWlsczwvaDE+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZX08L3A+XG4gICAgICAgIDxwPlN0b3JlIG5hbWU6IHt0aGlzLnN0YXRlLm5hbWV9PC9wPlxuICAgICAgICA8cD5Pd25lcjoge3RoaXMuc3RhdGUub3duZXIudXNlcm5hbWV9PC9wPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIENvbnRyaWJ1dG9yczpcbiAgICAgICAgICA8dWw+XG4gICAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPlN0b3JlIG5hbWU8L2xhYmVsPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIGlkPSduYW1lJyBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUubmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ25hbWUnKX1cbiAgICAgICAgICAvPlxuXG4gICAgICAgIDxkaXYgaWQgPSAnc2VhcmNoJz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3IgPSdzZWFyY2hfY29udHJpYnV0b3JzJz5Db250cmlidXRvcnM8L2xhYmVsPlxuXG4gICAgICAgIDx1bD5cbiAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgPC91bD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZCA9ICdzZWFyY2hfY29udHJpYnV0b3JzJ1xuICAgICAgICAgIHR5cGU9J3NlYXJjaCcgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdjb250cmlidXRvcnMnKX0gXG4gICAgICAgIC8+XG4gICAgICAgIFxuICAgICAgICA8dGFibGUgaWQgPSBcIm91dHB1dF9jb250ZW50XCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPiA8dGQ+RGlzcGxheSBuYW1lPC90ZD48dGQ+UGhvbmUgbnVtYmVyPC90ZD48L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIFxuICAgIH1cbiAgfVxufVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogXG4gKiBTdG9yZXMgdGFibGUgYW5kIHBhZ2VcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIFN0b3Jlc19QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnU3RvcmVzX1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2VcIj5cbiAgICAgIDxTdG9yZXNfVGFibGUgLz5cbiAgICAgIDxBZGRfU3RvcmVfQnV0dG9uIG9uQ2xpY2sgPSB7dGhpcy5oYW5kbGVDbGlja30vPlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG5cbiAgICB9XG4gIH1cbn0pXG5cbnZhciBBZGRfU3RvcmVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9TdG9yZV9QYWdlJztcbiAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9zdG9yZV9idXR0b25cIiBcbiAgICAgICAgb25DbGljayA9IHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICAgIEFkZCBuZXcgc3RvcmVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIClcbiAgfVxufSlcblxuXG52YXIgU3RvcmVzX1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoe1xuICAgICAgc3RvcmVzOiBbXSxcbiAgICAgIHVzZXJzOiBbXVxuICAgIH0pO1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2cobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHZhciBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgIHZhciByZXF1ZXN0X3VybCA9ICcvdXNlci8nICsgX3VzZXJfaWQgKyAnL3N0b3JlJztcblxuICAgIHZhciBnZXQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBnZXQub3BlbihcIkdFVFwiLCByZXF1ZXN0X3VybCk7XG4gICAgZ2V0ID0gc2V0X0hUVFBfaGVhZGVyKGdldCk7XG4gICAgZ2V0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChnZXQucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPSycpO1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShnZXQucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdG9yZXM6IHJlcy5zdG9yZXMsXG4gICAgICAgICAgdXNlcnM6IHJlcy51c2Vyc1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgfVxuICAgIGdldC5zZW5kKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUuc3RvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTsgXG4gICAgICB2YXIgdXNlciA9IHRoaXMuc3RhdGUudXNlcnNbaV07XG4gICAgICBpZiAodXNlciA9PT0gdW5kZWZpbmVkKSB7IHVzZXIgPSBudWxsOyB9XG5cbiAgICAgICAgcm93cy5wdXNoKFxuXG4gICAgICAgICAgPFN0b3Jlc19UYWJsZV9Sb3cgXG4gICAgICAgICAgICBrZXk9e2l9IFxuICAgICAgICAgICAgc3RvcmU9e3RoaXMuc3RhdGUuc3RvcmVzW2ldfSBcbiAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4oXG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIDx0aD5TdG9yZTwvdGg+XG4gICAgICAgICAgICAgIDx0aD5Pd25lcjwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICB7cm93c31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICApXG4gIH1cbn0pXG5cbnZhciBTdG9yZXNfVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRUcmFuc2FjdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIFVSTCA9IChcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIFxuICAgICAgICB0aGlzLnByb3BzLnN0b3JlLl9pZCArIFwiL3RyYW5zXCIpO1xuICAgIGNvbnNvbGUubG9nKFVSTCk7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgVVJMKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBwYXNzIHRoaXMgXCJyZXNcIiB0byB0aGUgcmVhbHBhZ2Ugb3IgdHJhbnMgdmlldyBwYWdlXG4gICAgICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbnNfVmlld19QYWdlJztcbiAgICAgICAgcmVzLmFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnLCAocmVzKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfSxcbiAgbWFuYWdlU3RvcmU6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9IFwiU3RvcmVfTWFuYWdlbWVudF9QYWdlXCI7XG4gICAgbGV0IGFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZSwgYWN0aXZlX3N0b3JlOiBhY3RpdmVfc3RvcmV9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8dHI+XG4gICAgICAgIDx0ZCBvbkNsaWNrID0ge3RoaXMuZ2V0VHJhbnNhY3Rpb25zfT57IHRoaXMucHJvcHMuc3RvcmUubmFtZSB9PC90ZD5cbiAgICAgICAgPHRkIG9uQ2xpY2sgPSB7dGhpcy5nZXRUcmFuc2FjdGlvbnN9PnsgdGhpcy5wcm9wcy51c2VyLnVzZXJuYW1lIH08L3RkPlxuICAgICAgICA8dGQ+PGJ1dHRvbiBvbkNsaWNrID0ge3RoaXMubWFuYWdlU3RvcmV9PkVkaXQ8L2J1dHRvbj48L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICApXG4gIH1cbn0pXG5cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBVc2VyX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIF9pZDogJycsXG4gICAgICB1c2VybmFtZTogJycsXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9XG4gICAgdGhpcy5jb21wb25lbnREaWRNb3VudCA9IHRoaXMuY29tcG9uZW50RGlkTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKCdtb3VudGVkJyk7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhyZXNbMF0pKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzWzBdWyd1c2VybmFtZSddKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGhvbmVfbnVtYmVyOiByZXNbMF0ucGhvbmVfbnVtYmVyLFxuICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICB1c2VybmFtZTogcmVzWzBdLnVzZXJuYW1lXG4gICAgICAgIH0pXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICB9XG4gIH1cbiAgXG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBVVCByZXF1ZXN0Jyk7XG4gICAgLy9TZW5kIGEgUE9TVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAvLyBUaGUgc2VydmVyIG5lZWRzIHRvIGNoZWNrIHRoYXQgdGhpcyBwaG9uZSBudW1iZXIgaXNuJ3QgYWxyZWFkeSB1c2VkXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyLFxuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWVcbiAgICB9XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiUFVUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhJyA6ICdGYWlsdXJlIScpICsgcmVzLm1lc3NhZ2UgXG4gICAgICB9KTtcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGUocmVzLnVzZXIpO1xuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdVc2VyX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8cD4ge3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9IDwvcD5cbiAgICAgICAgPGgxPkNoYW5nZSB1c2VyIGRldGFpbHM8L2gxPlxuICAgICAgICA8cD5JZiB5b3UgY2hhbmdlIHlvdXIgcGhvbmUgbnVtYmVyLCB5b3UgY2FuIGVkaXQgaXQgaGVyZS48L3A+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD5QaG9uZToge3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfSA8L3A+XG4gICAgICAgIDxwPlVzZXI6IHt0aGlzLnN0YXRlLnVzZXJuYW1lfSA8L3A+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInBob25lX251bWJlclwiPlBob25lIG51bWJlciAobG9naW4gd2l0aCB0aGlzKTwvbGFiZWw+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSdudW1iZXInIFxuICAgICAgICAgIGlkPSdwaG9uZV9udW1iZXInIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdwaG9uZV9udW1iZXInKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj0ndXNlcl9uYW1lJz5OYW1lOiBDaG9vc2UgYVxuICAgICAgICBuYW1lIHRoYXQgaXMgdW5pcXVlIHNvIHBlb3BsZSBjYW4gZmluZCB5b3UuPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD1cInVzZXJfbmFtZVwiIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ3VzZXJuYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gIH1cbn1cblxuLy8gUmVhY3RET00ucmVuZGVyKCA8VXNlcl9NYW5hZ2VtZW50X1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSApO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIEhvbWVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VyOiB7fSxcbiAgICAgIGFjdGl2ZV9wYWdlOiAnSG9tZSBQYWdlJyxcbiAgICAgIGFjdGl2ZV9zdG9yZToge30sXG4gICAgICBzdG9yZV90cmFuc2FjdGlvbnM6IHt9LFxuICAgICAgdHJhbnNhY3Rpb25fc2hvd246IHt9LFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnLFxuICAgIH07XG4gICAgdGhpcy5nb1RvID0gdGhpcy5nb1RvLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb21wb25lbnRXaWxsTW91bnQgPSB0aGlzLmNvbXBvbmVudFdpbGxNb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy51cGRhdGVVc2VyID0gdGhpcy51cGRhdGVVc2VyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5sb2dvdXQgPSB0aGlzLmxvZ291dC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XG5cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IHVybCA9ICcvdXNlci8nICsgX3VzZXJfaWQ7XG5cbiAgICBjb25zb2xlLmxvZyh1cmwpO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHJlcy5zdWNjZXNzID09IGZhbHNlICkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5tZXNzYWdlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0YXR1c19tZXNzYWdlOiByZXMubWVzc2FnZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlclswXTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICB1c2VyOiB0aGlzLnN0YXRlLnVzZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0b2tlbiAhPSBudWxsKSB7XG4gICAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuXG4gICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycsIChzdG9yZV90cmFucykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhzdG9yZV90cmFucyk7XG4gICAgICAgIC8vRmlyc3QsIHRha2Ugb3V0IHRoZSBcImFjdGl2ZSBzdG9yZVwiXG4gICAgICAgIHZhciBhY3RpdmVfc3RvcmUgPSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIGRlbGV0ZSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zID0gc3RvcmVfdHJhbnM7XG4gICAgICAgIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlID0gYWN0aXZlX3N0b3JlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9ucyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGFjdGl2ZV9zdG9yZTogdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUsXG4gICAgICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9uc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycsXG4gICAgICAgICh0cmFuc2FjdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93biA9IHRyYW5zYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQnKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3BhdGNoZXIuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlX3RyYW5zYWN0aW9uJywgKGFjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgICAgICB2YXIgdXBkYXRlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24uX2lkKTtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bi5faWQ7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgICAgbGV0IHVybCA9ICcvdXNlci8nKyBfdXNlcl9pZCArICcvc3RvcmUvJyArIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlLl9pZCArICcvdHJhbnMvJyArIGlkICsgJy8nICsgYWN0aW9uO1xuICAgICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICAvLyAvdHJhbnMvX2lkL3JlbmV3XG4gICAgICAgIHVwZGF0ZS5vcGVuKCdQVVQnLCB1cmwpO1xuXG4gICAgICAgIHVwZGF0ZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHVwZGF0ZS5yZWFkeVN0YXRlID09IDQpe1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCBcbiAgICAgICAgICAgIEpTT04ucGFyc2UodXBkYXRlLnJlc3BvbnNlVGV4dCkpXG4gICAgICAgICAgICAvLyBXaHkgZG8gSSBldmVuIG5lZWQgdG8gZGlzcGF0Y2ggdGhpcyBldmVudCB0byBiZSBob25lc3RcbiAgICAgICAgICAgIC8vIEkgY2FuIG11dGF0ZSB0aGUgc3RhdGUgc3RyYWlnaHQgYXdheSBmcm9tIGhlcmUuIEFoIHdlbGxcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgaXQncyBjbGVhbmVyIHRvIGRvIHRoaXMuIERSWSBhZnRlciBhbGwuLi5cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHNldF9IVFRQX2hlYWRlcih1cGRhdGUpLnNlbmQoKTtcbiAgICAgICB9KTtcbiAgfVxuXG4gIGdvVG8ocGFnZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgIGxldCBhY3RpdmVfcGFnZSA9IHBhZ2U7XG4gICAgICBjb25zb2xlLmxvZyhhY3RpdmVfcGFnZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlVXNlcih1c2VyKSB7XG4gICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlcjtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXI6IHVzZXJcbiAgICB9KVxuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvbG9naW4uaHRtbCc7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UgIT09ICcnKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2U7XG4gICAgICBmdW5jdGlvbiBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpIHtyZXR1cm4ge19faHRtbDogbWVzc2FnZX19XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpfSAvPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybihcbiAgICAgICAgPGRpdj5cbiAgICAgICAgPGhlYWRlcj57dGhpcy5zdGF0ZS51c2VyLnVzZXJuYW1lfSA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMubG9nb3V0fT5Mb2dvdXQ8L2J1dHRvbj48L2hlYWRlcj5cbiAgICAgICAgPGgxPnt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfTwvaDE+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5nb1RvKCdVc2VyX01hbmFnZW1lbnRfUGFnZScpfT5FZGl0IHVzZXI8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmdvVG8oJ1N0b3Jlc19QYWdlJyl9PlZpZXcgc3RvcmVzPC9idXR0b24+XG5cbiAgICAgICAgPFN0b3Jlc19QYWdlIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9Lz5cbiAgICAgICAgICA8QWRkX1N0b3JlX1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0b3JlX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9zdG9yZT17dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICBhY3RpdmVfcGFnZT17dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgIHRyYW5zYWN0aW9ucz17dGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fUGFnZVxuICAgICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2VcbiAgICAgICAgICAgICAgYWN0aXZlX3BhZ2U9e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uID17dGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDxVc2VyX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIG9uVXBkYXRlID0ge3RoaXMudXBkYXRlVXNlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgfVxufVxuXG52YXIgaG9tZVBhZ2UgPSBSZWFjdERPTS5yZW5kZXIoIDxIb21lX1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
