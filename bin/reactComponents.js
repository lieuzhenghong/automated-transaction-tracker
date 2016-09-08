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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwiYWRkX3N0b3JlLmpzeCIsImFkZF90cmFuc2FjdGlvbi5qc3giLCJ0cmFuc2FjdGlvbl92aWV3X2RldGFpbC5qc3giLCJ0cmFuc2FjdGlvbnNfdmlldy5qc3giLCJzdG9yZV9tYW5hZ2VtZW50LmpzeCIsInN0b3Jlc19wYWdlLmpzeCIsInVzZXJfbWFuYWdlbWVudC5qc3giLCJtYWluLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVMsZUFBVCxDQUF5QixPQUF6QixFQUFrQztBQUNoQyxNQUFNLFFBQVEsYUFBYSxPQUFiLENBQXFCLE9BQXJCLENBQWQ7O0FBRUEsTUFBSSxLQUFKLEVBQVc7QUFDVCxZQUFRLGdCQUFSLENBQXlCLGdCQUF6QixFQUEyQyxLQUEzQztBQUNBLFdBQU8sT0FBUDtBQUNELEdBSEQsTUFJSztBQUNILFdBQU8scURBQVA7QUFDRDtBQUNGOzs7QUNWRCxJQUFJLHNCQUFzQixNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDMUMsZUFBYSxxQkFBUyxLQUFULEVBQWU7QUFDMUIsUUFBSSxjQUFjLFdBQWxCO0FBQ0EsYUFBUyxRQUFULENBQWtCLEVBQUMsYUFBYSxXQUFkLEVBQWxCO0FBQ0EsVUFBTSxjQUFOO0FBQ0QsR0FMeUM7QUFNMUMsVUFBUSxrQkFBVztBQUNqQixXQUNFO0FBQUE7QUFBQSxRQUFRLFdBQVUsYUFBbEIsRUFBZ0MsU0FDL0IsS0FBSyxXQUROO0FBQUE7QUFBQSxLQURGO0FBTUQ7QUFieUMsQ0FBbEIsQ0FBMUI7QUNBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsSUFBSSxhQUFhLElBQUksVUFBSixFQUFqQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCO0FBQ25CLE9BQUssSUFBTCxHQUFZLElBQVo7QUFDQSxPQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDRDs7QUFFRCxNQUFNLFNBQU4sQ0FB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Y0FBVCxDQUF3QixTQUF4QixDQUEvQixDQUFmIiwiZmlsZSI6InJlYWN0Q29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNldF9IVFRQX2hlYWRlcihyZXF1ZXN0KSB7XG4gIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XG5cbiAgaWYgKHRva2VuKSB7XG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCd4LWFjY2Vzcy10b2tlbicsIHRva2VuKTtcbiAgICByZXR1cm4ocmVxdWVzdCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuKFwiRXJyb3I6IHRva2VuIGNvdWxkIG5vdCBiZSBmb3VuZC4gQ2hlY2sgbG9jYWxTdG9yYWdlXCIpO1xuICB9XG59XG4iLCJ2YXIgQmFja190b19Ib21lX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnSG9tZV9QYWdlJztcbiAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlfSk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJob21lX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIEJhY2tcbiAgICAgIDwvYnV0dG9uPlxuICAgIClcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBEaXNwYXRjaGVyLyBSZWFjdG9yIHBhdHRlcm4gbW9kZWxcbiAqXG4gKiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE1MzA4MzcxL2N1c3RvbS1ldmVudHMtbW9kZWwtXG4gKiB3aXRob3V0LXVzaW5nLWRvbS1ldmVudHMtaW4tamF2YXNjcmlwdFxuICpcbiAqIEhvdyBpdCB3b3JrczpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLVxuICogUmVnaXN0ZXIgZXZlbnRzLiBBbiBldmVudCBpcyBiYXNpY2FsbHkgYSByZXBvc2l0b3J5IG9mIGNhbGxiYWNrIGZ1bmN0aW9ucy5cbiAqIENhbGwgdGhlIGV2ZW50IHRvIGNhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9ucy4gXG4gKiBIb3cgdG8gY2FsbCB0aGUgZXZlbnQ/IFVzZSBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRfbmFtZSlcbiAqIFxuICogQSBEaXNwYXRjaGVyIGlzIGEgbGlzdCBvZiBFdmVudHMuIFNvIGNhbGxpbmcgRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50XG4gKiBiYXNpY2FsbHkgZmluZHMgdGhlIGV2ZW50IGluIHRoZSBEaXNwYXRjaGVyIGFuZCBjYWxscyBpdFxuICpcbiAqIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCAtLT4gY2FsbHMgdGhlIEV2ZW50IC0tLT4gY2FsbHMgdGhlIGNhbGxiYWNrXG4gKiBmdW5jdGlvbihzKSBvZiB0aGUgRXZlbnQuIFxuICpcbiAqIEhvdyBkbyB3ZSBzZXQgdGhlIGNhbGxiYWNrIGZ1bmN0aW9ucyBvZiB0aGUgRXZlbnQ/IFVzZSBhZGRFdmVudExpc3RlbmVyLlxuICogYWRkRXZlbnRMaXN0ZW5lciBpcyByZWFsbHkgYSBtaXNub21lciwgaXQgc2hvdWxkIGJlIGNhbGxlZCBhZGRDYWxsQmFjay5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBkaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcblxuZnVuY3Rpb24gRXZlbnQobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmNhbGxiYWNrcyA9IFtdO1xufTtcblxuRXZlbnQucHJvdG90eXBlLnJlZ2lzdGVyQ2FsbGJhY2sgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gIHRoaXMuY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xufTtcblxuZnVuY3Rpb24gRGlzcGF0Y2hlcigpIHtcbiAgdGhpcy5ldmVudHMgPSB7fVxufTtcblxuRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXJFdmVudCA9IGZ1bmN0aW9uKGV2ZW50X25hbWUpIHtcbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50X25hbWUpO1xuICB0aGlzLmV2ZW50c1tldmVudF9uYW1lXSA9IGV2ZW50O1xuICAvLyBjb25zb2xlLmxvZyh0aGlzLmV2ZW50cyk7XG59XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbihldmVudF9uYW1lLCBldmVudF9hcmd1bWVudHMpe1xuICB0aGlzLmV2ZW50c1tldmVudF9uYW1lXS5jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrKGV2ZW50X2FyZ3VtZW50cyk7XG4gICAgLy8gY29uc29sZS5sb2coJ2Rpc3BhdGNoZWQnKTtcbiAgICAvLyBjb25zb2xlLmxvZyhjYWxsYmFjaywgZXZlbnRfYXJndW1lbnRzKTtcbiAgfSk7XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRfbmFtZSwgY2FsbGJhY2spIHtcbiAgdGhpcy5ldmVudHNbZXZlbnRfbmFtZV0ucmVnaXN0ZXJDYWxsYmFjayhjYWxsYmFjayk7XG4gIC8vIGNvbnNvbGUubG9nKGNhbGxiYWNrKTtcbn07XG5cbi8qIC0tLS0tLS0tLS0tLS1cbiAqIERpc3BhdGNoZXIgZXZlbnRzXG4gKiAtLS0tLS0tLS0tLS0tLS0tKi9cblxuZGlzcGF0Y2hlci5yZWdpc3RlckV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnKTtcbi8vU2VuZCBUcmFuc2FjdGlvbiBEZXRhaWxzIGhhcyBhIGxpc3RlbmVyIGF0dGFjaGVkIHRvIGl0IFxuLy90aGF0IHRha2VzIGluIGEgSlNPTiBvYmplY3QgYXMgYSBwYXJhbWV0ZXIuIFRoaXMgSlNPTiBvYmplY3QgaXMgdGhlIFxuLy90cmFuc2FjdGlvbi4gVGhlbiB0aGUgRGV0YWlsIFZpZXcgVGFibGUgd2lsbCB1cGRhdGUuIFxuZGlzcGF0Y2hlci5yZWdpc3RlckV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nKVxuZGlzcGF0Y2hlci5yZWdpc3RlckV2ZW50KCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycpO1xuXG5cblxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIEFkZF9TdG9yZV9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIF9pZDogJycsXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIG93bmVyOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yc19pZHM6IFtdLFxuICAgICAgY29udHJpYnV0b3JzOiBbXSxcbiAgICAgIG91dHB1dF9jb250ZW50OiBbXSxcbiAgICAgIHN0YXR1c19tZXNzYWdlOiAnJ1xuICAgIH1cbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gIH1cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgbGV0IGNsaWNrZWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmlkO1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnMucHVzaCh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc19pZHMucHVzaCh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdLl9pZCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250cmlidXRvcnNfaWQ6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH0pXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGlmIChrZXkgPT09ICdjb250cmlidXRvcnMnKSB7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBkZWJvdW5jZSB0aGlzXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPSAnJykgeyAvL01ha2Ugc3VyZSBJIGRvbid0IHNlbmQgYSB1c2VsZXNzIGJsYW5rIHJlcXVlc3RcbiAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgcmVxLm9wZW4oXCJHRVRcIiwgXCIvdXNlci9cIiArIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiByZXNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldF9IVFRQX2hlYWRlcihyZXEpLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBQT1NUIHJlcXVlc3QnKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSxcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiUE9TVFwiLCAgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgJy9zdG9yZScpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG5cbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEgJyA6ICdGYWlsdXJlISAnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9ICAgICAgXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgc2V0X0hUVFBfaGVhZGVyKHJlcSkuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPilcbiAgICB9XG5cbiAgICB2YXIgY29udHJpYnV0b3JzID0gW107XG4gICAgbGV0IGQgPSB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29udHJpYnV0b3JzLnB1c2goXG4gICAgICAgICAgPGxpIGlkPXtpfT5cbiAgICAgICAgICAgIHtkW2ldLnVzZXJuYW1lfVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ0FkZF9TdG9yZV9QYWdlJykge1xuICAgICAgcmV0dXJuIChudWxsKTtcbiAgICB9XG5cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybihcbiAgICAgICAgPGRpdiBpZD1cImJvZHlcIj5cbiAgICAgICAgPGgxPkFkZCBzdG9yZTwvaDE+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD57dGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZX08L3A+XG4gICAgICAgIDxwPlN0b3JlIG5hbWU6IHt0aGlzLnN0YXRlLm5hbWV9PC9wPlxuICAgICAgICA8cD5Pd25lcjoge3RoaXMuc3RhdGUub3duZXIudXNlcm5hbWV9PC9wPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIENvbnRyaWJ1dG9yczpcbiAgICAgICAgICA8dWw+XG4gICAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPlN0b3JlIG5hbWU8L2xhYmVsPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIGlkPSduYW1lJyBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUubmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ25hbWUnKX1cbiAgICAgICAgICAvPlxuXG4gICAgICAgIDxkaXYgaWQgPSAnc2VhcmNoJz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3IgPSdzZWFyY2hfY29udHJpYnV0b3JzJz5Db250cmlidXRvcnM8L2xhYmVsPlxuXG4gICAgICAgIDx1bD5cbiAgICAgICAge2NvbnRyaWJ1dG9yc31cbiAgICAgICAgPC91bD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZCA9ICdzZWFyY2hfY29udHJpYnV0b3JzJ1xuICAgICAgICAgIHR5cGU9J3NlYXJjaCcgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdjb250cmlidXRvcnMnKX0gXG4gICAgICAgIC8+XG4gICAgICAgIFxuICAgICAgICA8dGFibGUgaWQgPSBcIm91dHB1dF9jb250ZW50XCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPjx0ZD5EaXNwbGF5IG5hbWU8L3RkPjx0ZD5QaG9uZSBudW1iZXI8L3RkPjwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgXG4gICAgfVxuICB9XG59XG5cblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuICpcbiAqIEFkZCBUcmFuc2FjdGlvbiBGb3JtIFBhZ2UgXG4gKiBcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqLyBcblxudmFyIEFkZF9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhZGRfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBBZGQgbmV3IGl0ZW1cbiAgICAgIDwvYnV0dG9uPlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBSZW1vdmVfSXRlbV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCl7XG4gICAgdGhpcy5wcm9wcy5DbGljaygpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicmVtb3ZlX2l0ZW1fYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgUmVtb3ZlIGl0ZW1cbiAgICAgIDwvYnV0dG9uPlxuICAgIClcbiAgfVxufSk7XG5cblxudmFyIEFkZF9UcmFuc2FjdGlvbl9QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gICh7XG4gICAgaXRlbV9jb3VudDogMSxcbiAgICBpdGVtczogW3tuYW1lOiAnJywgYW1vdW50OiAnJ31dLFxuICAgIG5hbWU6ICcnLFxuICAgIHBob25lX251bWJlcjogJycsXG4gICAgZXhwaXJ5X2RhdGVfbnVtYmVyOiAxLFxuICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiAnbW9udGgnXG4gICAgfSlcbiAgfSxcbiAgaGFuZGxlQWRkQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwiY2xpY2tlZFwiKTtcbiAgICB0aGlzLnN0YXRlLml0ZW1zLnB1c2goe2l0ZW1fbmFtZTogJycsIGl0ZW1fYW1vdW50OiAnJ30pO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogdGhpcy5zdGF0ZS5pdGVtX2NvdW50ICsgMSxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSwgIFxuICBoYW5kbGVSZW1vdmVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMuc3BsaWNlKC0xLCAxKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLml0ZW1zKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5pdGVtX2NvdW50ID09IDApIHtcbiAgICAgIHRoaXMuc3RhdGUuaXRlbV9jb3VudCA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50IC0tO1xuICAgIH1cbiAgICBjb25zb2xlLmFzc2VydCh0aGlzLnN0YXRlLml0ZW1fY291bnQgPj0gMCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQsXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLnN0YXRlLml0ZW1fY291bnQ7XG4gIH0sXG5cbiAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbihldmVudCkgeyAgICBcbiAgICB2YXIgZGF0YSA9ICB7XG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWUsXG4gICAgICAvL1N0cmlwIHBob25lIG51bWJlciBpbnB1dHMuXG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyLnJlcGxhY2UoLyAvZywgJycpLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXMsXG4gICAgICBleHBpcnlfZGF0ZV9udW1iZXI6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyLFxuICAgICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfc2VsZWN0b3JcbiAgICB9O1xuICAgIFxuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubmFtZSk7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuXG4gICAgXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oXCJQT1NUXCIsIFwiL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIHRoaXMucHJvcHMuYWN0aXZlX3N0b3JlLl9pZCArIFwiL3RyYW5zXCIpO1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXF1ZXN0ID0gc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuIFxuIFxuICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgXG4gICAgLy9DbGVhciBldmVyeXRoaW5nLi4uXG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiAxLFxuICAgICAgaXRlbXM6IFt7bmFtZTogJycsIGFtb3VudDogJyd9XSxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogMSxcblxuICAgIH0pO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihrZXksIG5hbWUsIGFtb3VudCl7XG4gICAgLy8gY29uc29sZS5sb2coa2V5LCBpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnN0YXRlLml0ZW1zW2tleV0ubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLmFtb3VudCA9IGFtb3VudDtcbiAgICAvLyBjb25zb2xlLmxvZyhpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZU5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB0aGlzLnN0YXRlLm5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWVcbiAgICB9KTtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUubmFtZSk7XG4gIH0sXG4gIGhhbmRsZVBob25lTm9DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfbnVtYmVyOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfc2VsZWN0b3JcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdBZGRfVHJhbnNfUGFnZScpO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5pdGVtX2NvdW50OyBpKyspIHtcbiAgICAgIGl0ZW1zLnB1c2goPEl0ZW0gcmVhY3Rfa2V5PXtpfSBrZXk9e2l9IHZhbHVlcz17dGhpcy5zdGF0ZS5pdGVtc1tpXX1cbiAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz4pXG4gICAgfTtcbiAgICByZXR1cm4oXG4gICAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxmb3JtPlxuICAgICAgPGgxPkFkZCBuZXcgbG9hbjwvaDE+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgbmFtZT1cIm5hbWVcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdOYW1lJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5uYW1lfSBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVOYW1lQ2hhbmdlfSBcbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXI8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZSA9J3RlbCcgXG4gICAgICAgICAgbmFtZT1cInBob25lX251bWJlclwiIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdQaG9uZSBudW1iZXInIFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnBob25lX251bWJlcn0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUGhvbmVOb0NoYW5nZX1cbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJleHBpcnlfZHVyYXRpb25fbnVtYmVyXCI+RXhwaXJ5IGRhdGU8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICAvL2NsYXNzTmFtZSA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIGlkID0gJ2hhbGYtd2lkdGgnXG4gICAgICAgICAgdHlwZSA9ICdudW1iZXInXG4gICAgICAgICAgbmFtZSA9ICdleHBpcnlfZHVyYXRpb25fbnVtYmVyJ1xuICAgICAgICAgIHBsYWNlaG9sZGVyID0gJzEnXG4gICAgICAgICAgdmFsdWUgPSB7dGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RGF0ZU51bWJlckNoYW5nZX1cbiAgICAgICAgICBtaW4gPSBcIjFcIlxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgID5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPHNlbGVjdCBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9XCJtb250aFwiIFxuICAgICAgICAgIG5hbWU9XCJleHBpcnlfZHVyYXRpb25fc2VsZWN0b3JcIlxuICAgICAgICA+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRheVwiPmRheTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3ZWVrXCI+d2Vlazwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtb250aFwiPm1vbnRoPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8QWRkX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZUFkZENsaWNrfS8+XG4gICAgICAgIDxSZW1vdmVfSXRlbV9CdXR0b24gQ2xpY2s9e3RoaXMuaGFuZGxlUmVtb3ZlQ2xpY2t9Lz5cbiAgICAgICAgPHRhYmxlPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5JdGVtIG5hbWU8L3RoPlxuICAgICAgICAgICAgPHRoPkl0ZW0gYW1vdW50PC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdBZGQgbG9hbicgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9PjwvaW5wdXQ+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbnZhciBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3MoeyAgXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgLy9DYWxscyB0aGUgZnVuY3Rpb24gb25DaGFuZ2UgaW4gQWRkX1RyYW5zYWN0aW9uX0Zvcm0gdG8gbXV0YXRlIHRoZSBzdGF0ZSBpbiB0aGUgcGFyZW50LiBcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMucHJvcHMucmVhY3Rfa2V5LCB0aGlzLnJlZnMubmFtZS52YWx1ZSxcbiAgICB0aGlzLnJlZnMuYW1vdW50LnZhbHVlKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMudmFsdWVzKTtcbiAgICByZXR1cm4oXG4gICAgICA8dHIgaGVpZ2h0PVwiMjBweFwiPlxuICAgICAgPHRkPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICB0eXBlID0gJ3RleHQnIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSXRlbSBuYW1lXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMubmFtZX0gXG4gICAgICAgICAgcmVmPVwibmFtZVwiXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICA8L3RkPlxuICAgICAgPHRkPlxuICAgICAgPGlucHV0IFxuICAgICAgICB0eXBlID0gJ251bWJlcicgXG4gICAgICAgIG1pbj0gXCIxXCJcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBcIkFtb3VudFwiXG4gICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlcy5hbW91bnR9XG4gICAgICAgIHJlZj1cImFtb3VudFwiXG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgcmVxdWlyZWQ+XG4gICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogVHJhbnNhY3Rpb24gVmlldyBEZXRhaWwgcGFnZVxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpe1xuICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZScpIHtcbiAgICByZXR1cm4obnVsbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcbiAgcmV0dXJuKFxuICAgIDxkaXYgY2xhc3MgPVwicGFnZVwiPlxuICAgICAgPGgxPkxvYW5zIHZpZXcgKGRldGFpbCk8L2gxPlxuICAgICAgPFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSB0cmFuc2FjdGlvbj17dGhpcy5wcm9wcy50cmFuc2FjdGlvbn0vPlxuICAgICAgPFJldHVybl9JdGVtc19CdXR0b24gLz5cbiAgICAgIDxSZW5ld19UcmFuc2FjdGlvbl9CdXR0b24gLz5cbiAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9IFxuICAgXG4gIH1cbn0pO1xuXG52YXIgUmV0dXJuX0l0ZW1zX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmV0dXJuJyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJldHVybiBpdGVtczwvYnV0dG9uPlxuICApXG4gfSBcbn0pO1xuXG52YXIgUmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljaygpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicsICdyZW5ldycpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+UmVuZXcgbG9hbjwvYnV0dG9uPilcbiB9IFxufSlcblxuXG52YXIgVHJhbnNhY3Rpb25fRGV0YWlsX1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCB0cmFuc2FjdGlvbiA9IHRoaXMucHJvcHMudHJhbnNhY3Rpb247XG4gICAgICB2YXIgYWxsX2l0ZW1zID0gW107XG4gICAgICBmb3IgKHZhciBpdGVtIGluIHRyYW5zYWN0aW9uLml0ZW1zKSB7XG4gICAgICAgIGFsbF9pdGVtcy5wdXNoKFxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkl0ZW0gTmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5uYW1lfTwvdGQ+XG4gICAgICAgICAgPHRoPk5vLjwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5hbW91bnR9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICAgICAgfVxuICByZXR1cm4gKFxuICAgIDx0YWJsZSBpZD1cInRyYW5zYWN0aW9uX2RldGFpbF90YWJsZVwiPlxuICAgICAgPHRib2R5PlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5leHBpcnlfZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5SZXR1cm5lZDwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5yZXR1cm5lZC50b1N0cmluZygpfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5uYW1lfTwvdGQ+XG4gICAgICAgIDwvdHI+XG5cbiAgICAgICAge2FsbF9pdGVtc31cbiAgICAgIDwvdGJvZHk+XG4gICAgPC90YWJsZT5cbiAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9ucyBWaWV3IFBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8gXG5cbnZhciBUcmFuc2FjdGlvbnNfVmlld19QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSBcIlRyYW5zYWN0aW9uc19WaWV3X1BhZ2VcIikge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFdoZW4gdGhpcyBwYWdlIGxvYWRzXG4gICAgICByZXR1cm4gIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlXCI+XG4gICAgICAgIDxoMT4gTG9hbnMgb3ZlcnZpZXcgZm9yIHt0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5uYW1lfTwvaDE+XG4gICAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZSB0cmFuc2FjdGlvbnMgPSB7dGhpcy5wcm9wcy50cmFuc2FjdGlvbnN9IC8+XG4gICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufSlcblxudmFyIEFkZF9UcmFuc2FjdGlvbl9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnO1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3RyYW5zYWN0aW9uX2J1dHRvblwiXG4gICAgICBvbkNsaWNrPXsgdGhpcy5oYW5kbGVDbGljayB9PlxuICAgICAgQWRkIG5ldyBsb2FuXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnByb3BzLnRyYW5zYWN0aW9ucyk7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcHMudHJhbnNhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTtcbiAgICAgIHJvd3MucHVzaCg8VGFibGVfUm93IGtleT17aX0gdmFsdWVzPXt0aGlzLnByb3BzLnRyYW5zYWN0aW9uc1tpXX0vPilcbiAgICB9XG4gXG4gICAgXG4gICAgcmV0dXJuIChcbiAgICAgIDx0YWJsZT5cbiAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93IC8+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPlxuICAgICAgICA8dGg+RGF0ZTwvdGg+XG4gICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgPHRoPlBob25lIE51bWJlcjwvdGg+XG4gICAgICAgIDwvdHI+XG4gICAgICA8L3RoZWFkPlxuICAgIClcbiAgfVxufSlcblxuXG52YXIgVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnO1xuXG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCB0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gZGF5c190aWxsX2V4cGlyeShkYXRlKSB7XG4gICAgICB2YXIgZV9kID0gRGF0ZS5wYXJzZShkYXRlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCAtIERhdGUubm93KCkpO1xuICAgICAgLy8gY29uc29sZS5sb2coTWF0aC5jZWlsKChlX2QgLSBEYXRlLm5vdygpKS8oMTAwMCo2MCo2MCoyNCkpKVxuICAgICAgcmV0dXJuKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHBhcnNlX2RhdGUoZGF0ZSl7XG4gICAgICByZXR1cm4oZGF0ZS5zdWJzdHJpbmcoMCwxMCkpO1xuICAgIH07XG4gICB2YXIgc3RhdHVzID0gZGF5c190aWxsX2V4cGlyeSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSk7XG4gICB2YXIgdHJfc3R5bGUgPSB7XG4gICAgXG4gICB9XG4gICBpZiAodGhpcy5wcm9wcy52YWx1ZXMucmV0dXJuZWQgPT09IHRydWUpIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgdGV4dERlY29yYXRpb246ICdsaW5lLXRocm91Z2gnLFxuICAgICAgIGNvbG9yOiAnaHNsKDMwLCA0JSwgNzYlKSdcbiAgICAgfVxuICAgfVxuICAgZWxzZSBpZiAoc3RhdHVzIDw9IDApIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDAsIDk3JSwgNjglKSdcbiAgICAgfVxuICAgfVxuICAgIGVsc2UgaWYgKHN0YXR1cyA8PSAzKSB7XG4gICAgICB0cl9zdHlsZSA9IHtcbiAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdoc2woMzAsIDc4JSwgNjMlKScgIFxuICAgICAgfVxuICAgICB9XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIHN0eWxlPXt0cl9zdHlsZX0gb25DbGljaz0ge3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8dGQ+e3BhcnNlX2RhdGUodGhpcy5wcm9wcy52YWx1ZXMuZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmV4cGlyeV9kYXRlKX08L3RkPlxuICAgICAgICA8dGQ+e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIFN0b3JlX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgX2lkOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgb3duZXI6IFtdLFxuICAgICAgY29udHJpYnV0b3JzX2lkczogW10sXG4gICAgICBjb250cmlidXRvcnM6IFtdLFxuICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMub25SZW5kZXIgPSB0aGlzLm9uUmVuZGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIG9uUmVuZGVyKCkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIFxuICAgICAgdGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkICsgXCIvbWFuYWdlXCIpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgLy8gRmlyc3QgaXRlbSBpcyB0aGUgc3RvcmUgb2JqZWN0LCBcbiAgICAgICAgLy8gc2Vjb25kIHRoZSBvd25lciBvYmplY3QsXG4gICAgICAgIC8vIHRoaXJkIGl0ZW0gdGhlIGFycmF5IG9mIGNvbnRyaWJ1dG9yc1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBfaWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgbmFtZTogcmVzWzBdLm5hbWUsXG4gICAgICAgICAgY29udHJpYnV0b3JzX2lkczogcmVzWzBdLmNvbnRyaWJ1dG9ycyxcbiAgICAgICAgICBvd25lcjogcmVzWzFdLFxuICAgICAgICAgIGNvbnRyaWJ1dG9yczogcmVzWzJdXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGxldCBjbGlja2VkID0gZS50YXJnZXQucGFyZW50Tm9kZS5pZDtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY29udHJpYnV0b3JzX2lkOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc19pZCxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuY29udHJpYnV0b3JzKTtcbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnY29udHJpYnV0b3JzJykge1xuICAgICAgICAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKFwiR0VUXCIsIFwiL3VzZXIvXCIgKyBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBvdXRwdXRfY29udGVudDogcmVzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICAvL1NlbmQgYSBQVVQgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgLy8gUFVUIC86X3N0b3JlX2lkL21hbmFnZVxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBQVVQgcmVxdWVzdCcpO1xuICAgIC8vU2VuZCBhIFBPU1QgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgLy8gVGhlIHNlcnZlciBuZWVkcyB0byBjaGVjayB0aGF0IHRoaXMgcGhvbmUgbnVtYmVyIGlzbid0IGFscmVhZHkgdXNlZFxuICAgIHZhciBkYXRhID0ge1xuICAgICAgX3VzZXJfaWQ6IHRoaXMuc3RhdGUuX3VzZXJfaWQsXG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWUsXG4gICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgfVxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIlBVVFwiLCAgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyBcbiAgICAgIHRoaXMucHJvcHMuX2lkICsgXCIvbWFuYWdlXCIpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuIFxuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG5cbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEnIDogJ0ZhaWx1cmUhJykgKyByZXMubWVzc2FnZSBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSAgICAgIFxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHNldF9IVFRQX2hlYWRlcihyZXEpLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICB2YXIgcm93cyA9IFtdO1xuICAgIGxldCBjID0gdGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudDtcbiAgICBcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJvd3MucHVzaChcbiAgICAgICAgICA8dHJcbiAgICAgICAgICBpZD17aX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICA8dGQ+e2NbaV0udXNlcm5hbWV9PC90ZD5cbiAgICAgICAgICA8dGQ+e2NbaV0ucGhvbmVfbnVtYmVyfTwvdGQ+XG4gICAgICAgICAgPC90cj4pXG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZV9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5vblJlbmRlcigpO1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+Q2hhbmdlIHN0b3JlIGRldGFpbHM8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPHA+T3duZXI6IHt0aGlzLnN0YXRlLm93bmVyLnVzZXJuYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj4gPHRkPkRpc3BsYXkgbmFtZTwvdGQ+PHRkPlBob25lIG51bWJlcjwvdGQ+PC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7cm93c31cbiAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFxuICogU3RvcmVzIHRhYmxlIGFuZCBwYWdlXG4gKiBcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBTdG9yZXNfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3Jlc19QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlXCI+XG4gICAgICA8U3RvcmVzX1RhYmxlIC8+XG4gICAgICA8QWRkX1N0b3JlX0J1dHRvbiBvbkNsaWNrID0ge3RoaXMuaGFuZGxlQ2xpY2t9Lz5cblxuICAgICAgPC9kaXY+XG4gICAgKVxuXG4gICAgfVxuICB9XG59KVxuXG52YXIgQWRkX1N0b3JlX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdBZGRfU3RvcmVfUGFnZSc7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhZGRfc3RvcmVfYnV0dG9uXCIgXG4gICAgICAgIG9uQ2xpY2sgPSB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgICBBZGQgbmV3IHN0b3JlXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApXG4gIH1cbn0pXG5cblxudmFyIFN0b3Jlc19UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHtcbiAgICAgIHN0b3JlczogW10sXG4gICAgICB1c2VyczogW11cbiAgICB9KTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICB2YXIgX3VzZXJfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKTtcbiAgICB2YXIgcmVxdWVzdF91cmwgPSAnL3VzZXIvJyArIF91c2VyX2lkICsgJy9zdG9yZSc7XG5cbiAgICB2YXIgZ2V0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgZ2V0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdF91cmwpO1xuICAgIGdldCA9IHNldF9IVFRQX2hlYWRlcihnZXQpO1xuICAgIGdldC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAoZ2V0LnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICBjb25zb2xlLmxvZygnT0snKTtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoZ2V0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RvcmVzOiByZXMuc3RvcmVzLFxuICAgICAgICAgIHVzZXJzOiByZXMudXNlcnNcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH1cbiAgICBnZXQuc2VuZCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YXRlLnN0b3Jlcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uc1tpXSk7IFxuICAgICAgdmFyIHVzZXIgPSB0aGlzLnN0YXRlLnVzZXJzW2ldO1xuICAgICAgaWYgKHVzZXIgPT09IHVuZGVmaW5lZCkgeyB1c2VyID0gbnVsbDsgfVxuXG4gICAgICAgIHJvd3MucHVzaChcblxuICAgICAgICAgIDxTdG9yZXNfVGFibGVfUm93IFxuICAgICAgICAgICAga2V5PXtpfSBcbiAgICAgICAgICAgIHN0b3JlPXt0aGlzLnN0YXRlLnN0b3Jlc1tpXX0gXG4gICAgICAgICAgICB1c2VyPXt1c2VyfVxuICAgICAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuKFxuICAgICAgICA8dGFibGU+XG4gICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICA8dGg+U3RvcmU8L3RoPlxuICAgICAgICAgICAgICA8dGg+T3duZXI8L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgKVxuICB9XG59KVxuXG52YXIgU3RvcmVzX1RhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0VHJhbnNhY3Rpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZhciBVUkwgPSAoXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyBcbiAgICAgICAgdGhpcy5wcm9wcy5zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICBjb25zb2xlLmxvZyhVUkwpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIFVSTCk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAvLyBJIGhhdmUgdG8gcGFzcyB0aGlzIFwicmVzXCIgdG8gdGhlIHJlYWxwYWdlIG9yIHRyYW5zIHZpZXcgcGFnZVxuICAgICAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSc7XG4gICAgICAgIHJlcy5hY3RpdmVfc3RvcmUgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJywgKHJlcykpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlcS5zZW5kKCk7XG4gIH0sXG4gIG1hbmFnZVN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSBcIlN0b3JlX01hbmFnZW1lbnRfUGFnZVwiO1xuICAgIGxldCBhY3RpdmVfc3RvcmUgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2UsIGFjdGl2ZV9zdG9yZTogYWN0aXZlX3N0b3JlfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHRyPlxuICAgICAgICA8dGQgb25DbGljayA9IHt0aGlzLmdldFRyYW5zYWN0aW9uc30+eyB0aGlzLnByb3BzLnN0b3JlLm5hbWUgfTwvdGQ+XG4gICAgICAgIDx0ZCBvbkNsaWNrID0ge3RoaXMuZ2V0VHJhbnNhY3Rpb25zfT57IHRoaXMucHJvcHMudXNlci51c2VybmFtZSB9PC90ZD5cbiAgICAgICAgPHRkPjxidXR0b24gb25DbGljayA9IHt0aGlzLm1hbmFnZVN0b3JlfT5FZGl0PC9idXR0b24+PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICB9XG59KVxuXG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgVXNlcl9NYW5hZ2VtZW50X1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgLy9XaGVuIGNvbXBvbmVudCBtb3VudHMsIHNlbmQgYSBHRVQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIHBvcHVsYXRlXG4gICAgICAvL3RoZXNlIGZpZWxkcyBcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBfaWQ6ICcnLFxuICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZygnbW91bnRlZCcpO1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmtleXMocmVzWzBdKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc1swXVsndXNlcm5hbWUnXSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHBob25lX251bWJlcjogcmVzWzBdLnBob25lX251bWJlcixcbiAgICAgICAgICBfaWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgdXNlcm5hbWU6IHJlc1swXS51c2VybmFtZVxuICAgICAgICB9KVxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgIHN0YXRlW2tleV0gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgfVxuICB9XG4gIFxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBQVVQgcmVxdWVzdCcpO1xuICAgIC8vU2VuZCBhIFBPU1QgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgLy8gVGhlIHNlcnZlciBuZWVkcyB0byBjaGVjayB0aGF0IHRoaXMgcGhvbmUgbnVtYmVyIGlzbid0IGFscmVhZHkgdXNlZFxuICAgIHZhciBkYXRhID0ge1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlcixcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lXG4gICAgfVxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIlBVVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzIScgOiAnRmFpbHVyZSEnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgfSk7XG4gICAgICB0aGlzLnByb3BzLm9uVXBkYXRlKHJlcy51c2VyKTtcbiAgICB9ICAgICAgXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnVXNlcl9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgIHJldHVybihcbiAgICAgICAgPGRpdiBpZD1cImJvZHlcIj5cbiAgICAgICAgPHA+IHt0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlfSA8L3A+XG4gICAgICAgIDxoMT5DaGFuZ2UgdXNlciBkZXRhaWxzPC9oMT5cbiAgICAgICAgPHA+SWYgeW91IGNoYW5nZSB5b3VyIHBob25lIG51bWJlciwgeW91IGNhbiBlZGl0IGl0IGhlcmUuPC9wPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+UGhvbmU6IHt0aGlzLnN0YXRlLnBob25lX251bWJlcn0gPC9wPlxuICAgICAgICA8cD5Vc2VyOiB7dGhpcy5zdGF0ZS51c2VybmFtZX0gPC9wPlxuICAgICAgICBcbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXIgKGxvZ2luIHdpdGggdGhpcyk8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZXF1aXJlZD0ncmVxdWlyZWQnXG4gICAgICAgICAgdHlwZT0nbnVtYmVyJyBcbiAgICAgICAgICBpZD0ncGhvbmVfbnVtYmVyJyBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgncGhvbmVfbnVtYmVyJylcbiAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9J3VzZXJfbmFtZSc+TmFtZTogQ2hvb3NlIGFcbiAgICAgICAgbmFtZSB0aGF0IGlzIHVuaXF1ZSBzbyBwZW9wbGUgY2FuIGZpbmQgeW91LjwvbGFiZWw+XG4gICAgICAgIDxpbnB1dCBcbiAgICAgICAgICByZXF1aXJlZD0ncmVxdWlyZWQnXG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgaWQ9XCJ1c2VyX25hbWVcIiBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCd1c2VybmFtZScpfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICB9XG59XG5cbi8vIFJlYWN0RE9NLnJlbmRlciggPFVzZXJfTWFuYWdlbWVudF9QYWdlLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykgKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBIb21lX1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlcjoge30sXG4gICAgICBhY3RpdmVfcGFnZTogJ0hvbWUgUGFnZScsXG4gICAgICBhY3RpdmVfc3RvcmU6IHt9LFxuICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB7fSxcbiAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB7fSxcbiAgICAgIHN0YXR1c19tZXNzYWdlOiAnJyxcbiAgICB9O1xuICAgIHRoaXMuZ29UbyA9IHRoaXMuZ29Uby5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy51cGRhdGVVc2VyID0gdGhpcy51cGRhdGVVc2VyLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgY29uc3QgX3VzZXJfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKTtcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpXG5cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IHVybCA9ICcvdXNlci8nICsgX3VzZXJfaWQ7XG5cbiAgICBjb25zb2xlLmxvZyh1cmwpO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHJlcy5zdWNjZXNzID09IGZhbHNlICkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5tZXNzYWdlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0YXR1c19tZXNzYWdlOiByZXMubWVzc2FnZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlclswXTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICB1c2VyOiB0aGlzLnN0YXRlLnVzZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEuc2VuZCgpO1xuXG4gICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycsIChzdG9yZV90cmFucykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhzdG9yZV90cmFucyk7XG4gICAgICAgIC8vRmlyc3QsIHRha2Ugb3V0IHRoZSBcImFjdGl2ZSBzdG9yZVwiXG4gICAgICAgIHZhciBhY3RpdmVfc3RvcmUgPSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIGRlbGV0ZSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zID0gc3RvcmVfdHJhbnM7XG4gICAgICAgIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlID0gYWN0aXZlX3N0b3JlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9ucyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGFjdGl2ZV9zdG9yZTogdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUsXG4gICAgICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9uc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycsXG4gICAgICAgICh0cmFuc2FjdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93biA9IHRyYW5zYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQnKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3BhdGNoZXIuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlX3RyYW5zYWN0aW9uJywgKGFjdGlvbikgPT4ge1xuICAgICAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgICAgICB2YXIgdXBkYXRlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24uX2lkKTtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bi5faWQ7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgICAgbGV0IHVybCA9ICcvdXNlci8nKyBfdXNlcl9pZCArICcvc3RvcmUvJyArIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlLl9pZCArICcvdHJhbnMvJyArIGlkICsgJy8nICsgYWN0aW9uO1xuICAgICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICAvLyAvdHJhbnMvX2lkL3JlbmV3XG4gICAgICAgIHVwZGF0ZS5vcGVuKCdQVVQnLCB1cmwpO1xuXG4gICAgICAgIHVwZGF0ZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHVwZGF0ZS5yZWFkeVN0YXRlID09IDQpe1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCBcbiAgICAgICAgICAgIEpTT04ucGFyc2UodXBkYXRlLnJlc3BvbnNlVGV4dCkpXG4gICAgICAgICAgICAvLyBXaHkgZG8gSSBldmVuIG5lZWQgdG8gZGlzcGF0Y2ggdGhpcyBldmVudCB0byBiZSBob25lc3RcbiAgICAgICAgICAgIC8vIEkgY2FuIG11dGF0ZSB0aGUgc3RhdGUgc3RyYWlnaHQgYXdheSBmcm9tIGhlcmUuIEFoIHdlbGxcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgaXQncyBjbGVhbmVyIHRvIGRvIHRoaXMuIERSWSBhZnRlciBhbGwuLi5cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHNldF9IVFRQX2hlYWRlcih1cGRhdGUpLnNlbmQoKTtcbiAgICAgICB9KTtcbiAgfVxuXG4gIGdvVG8ocGFnZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgIGxldCBhY3RpdmVfcGFnZSA9IHBhZ2U7XG4gICAgICBjb25zb2xlLmxvZyhhY3RpdmVfcGFnZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBcbiAgdXBkYXRlVXNlcih1c2VyKSB7XG4gICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlcjtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXI6IHVzZXJcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlICE9PSAnJykge1xuICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlO1xuICAgICAgZnVuY3Rpb24gY3JlYXRlTWVzc2FnZShtZXNzYWdlKSB7cmV0dXJuIHtfX2h0bWw6IG1lc3NhZ2V9fVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17Y3JlYXRlTWVzc2FnZShtZXNzYWdlKX0gLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4oXG4gICAgICAgIDxkaXY+XG4gICAgICAgIDxoZWFkZXI+e3RoaXMuc3RhdGUudXNlci51c2VybmFtZX0gPGJ1dHRvbj5Mb2dvdXQ8L2J1dHRvbj48L2hlYWRlcj5cbiAgICAgICAgPGgxPnt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfTwvaDE+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5nb1RvKCdVc2VyX01hbmFnZW1lbnRfUGFnZScpfT5FZGl0IHVzZXI8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmdvVG8oJ1N0b3Jlc19QYWdlJyl9PlZpZXcgc3RvcmVzPC9idXR0b24+XG5cbiAgICAgICAgPFN0b3Jlc19QYWdlIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9Lz5cbiAgICAgICAgICA8QWRkX1N0b3JlX1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0b3JlX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9zdG9yZT17dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICBhY3RpdmVfcGFnZT17dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgIHRyYW5zYWN0aW9ucz17dGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fUGFnZVxuICAgICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2VcbiAgICAgICAgICAgICAgYWN0aXZlX3BhZ2U9e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uID17dGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDxVc2VyX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIG9uVXBkYXRlID0ge3RoaXMudXBkYXRlVXNlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgfVxufVxuXG52YXIgaG9tZVBhZ2UgPSBSZWFjdERPTS5yZW5kZXIoIDxIb21lX1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
