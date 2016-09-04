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
      req.open("GET", "/" + localStorage.getItem('_user_id') + "/store/" + this.props.active_store._id + "/manage");
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
      req.open("PUT", "/" + localStorage.getItem('_user_id') + "/store/" + this.props._id + "/manage");

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
    var request_url = '/' + _user_id + '/store';

    var get = new XMLHttpRequest();
    get.open("GET", request_url);
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
    req.open("GET", "/" + localStorage.getItem('_user_id') + "/store/" + this.props.store._id + "/trans");
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
      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);
          _this2.setState({
            phone_number: res.phone_number,
            _id: res._id,
            username: res.username
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
      req.onreadystatechange = function () {
        var res = JSON.parse(req.responseText);
        console.log(res);
        _this4.setState({
          status_message: (res.success ? 'Success!' : 'Failure!') + res.message
        });
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
            this.state.phone_number
          ),
          React.createElement(
            'p',
            null,
            'User: ',
            this.state.username
          ),
          React.createElement(
            'label',
            { htmlFor: 'phone_number' },
            'Phone number (login with this)'
          ),
          React.createElement('input', {
            type: 'number',
            id: 'phone_number',
            defaultValue: this.state.phone_number,
            onChange: this.handleChange('phone_number')
          }),
          React.createElement(
            'label',
            { htmlFor: 'user_name' },
            'Name: Others can use this to find you. Choose a name that is easily recognisable and not too common.'
          ),
          React.createElement('input', {
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
      active_store: '',
      store_transactions: {},
      transaction_shown: {}
    };
    _this.goTo = _this.goTo.bind(_this);
    _this.componentDidMount = _this.componentDidMount.bind(_this);
    return _this;
  }

  _createClass(Home_Page, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      console.log(localStorage.getItem('_user_id'));
      var _user_id = localStorage.getItem('_user_id');

      var req = new XMLHttpRequest();
      var url = '/user/' + _user_id;

      console.log(url);

      req.open('GET', url);
      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          var user = JSON.parse(req.responseText);
          _this2.state.user = user[0];
          _this2.setState({
            user: _this2.state.user
          });
          console.log(_this2.state.user);
        }
      };
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
        var update = new XMLHttpRequest();
        // console.log(this.state.transaction_shown._id);
        var id = _this2.state.transaction_shown._id;
        // console.log(id);
        var url = '/store/' + _this2.state.active_store + '/trans/' + id + '/' + action;
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
        update.send();
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
    key: 'render',
    value: function render() {
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
        React.createElement(User_Management_Page, { active_page: this.state.active_page })
      );
    }
  }]);

  return Home_Page;
}(React.Component);

var homePage = ReactDOM.render(React.createElement(Home_Page, null), document.getElementById('content'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWVfYnV0dG9uLmpzeCIsImRpc3BhdGNoZXIuanMiLCJhZGRfc3RvcmUuanN4IiwiYWRkX3RyYW5zYWN0aW9uLmpzeCIsInRyYW5zYWN0aW9uX3ZpZXdfZGV0YWlsLmpzeCIsInRyYW5zYWN0aW9uc192aWV3LmpzeCIsInN0b3JlX21hbmFnZW1lbnQuanN4Iiwic3RvcmVzX3BhZ2UuanN4IiwidXNlcl9tYW5hZ2VtZW50LmpzeCIsIm1haW4uanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxzQkFBc0IsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzFDLGVBQWEscUJBQVMsS0FBVCxFQUFlO0FBQzFCLFFBQUksY0FBYyxXQUFsQjtBQUNBLGFBQVMsUUFBVCxDQUFrQixFQUFDLGFBQWEsV0FBZCxFQUFsQjtBQUNBLFVBQU0sY0FBTjtBQUNELEdBTHlDO0FBTTFDLFVBQVEsa0JBQVc7QUFDakIsV0FDRTtBQUFBO0FBQUEsUUFBUSxXQUFVLGFBQWxCLEVBQWdDLFNBQy9CLEtBQUssV0FETjtBQUFBO0FBQUEsS0FERjtBQU1EO0FBYnlDLENBQWxCLENBQTFCO0FDQUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLElBQUksYUFBYSxJQUFJLFVBQUosRUFBakI7O0FBRUEsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQjtBQUNuQixPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsT0FBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0Q7O0FBRUQsTUFBTSxTQUFOLENBQWdCLGdCQUFoQixHQUFtQyxVQUFTLFFBQVQsRUFBa0I7QUFDbkQsT0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixRQUFwQjtBQUNELENBRkQ7O0FBSUEsU0FBUyxVQUFULEdBQXNCO0FBQ3BCLE9BQUssTUFBTCxHQUFjLEVBQWQ7QUFDRDs7QUFFRCxXQUFXLFNBQVgsQ0FBcUIsYUFBckIsR0FBcUMsVUFBUyxVQUFULEVBQXFCO0FBQ3hELE1BQUksUUFBUSxJQUFJLEtBQUosQ0FBVSxVQUFWLENBQVo7QUFDQSxPQUFLLE1BQUwsQ0FBWSxVQUFaLElBQTBCLEtBQTFCO0FBQ0E7QUFDRCxDQUpEOztBQU1BLFdBQVcsU0FBWCxDQUFxQixhQUFyQixHQUFxQyxVQUFTLFVBQVQsRUFBcUIsZUFBckIsRUFBcUM7QUFDeEUsT0FBSyxNQUFMLENBQVksVUFBWixFQUF3QixTQUF4QixDQUFrQyxPQUFsQyxDQUEwQyxVQUFTLFFBQVQsRUFBbUI7QUFDM0QsYUFBUyxlQUFUO0FBQ0E7QUFDQTtBQUNELEdBSkQ7QUFLRCxDQU5EOztBQVFBLFdBQVcsU0FBWCxDQUFxQixnQkFBckIsR0FBd0MsVUFBUyxVQUFULEVBQXFCLFFBQXJCLEVBQStCO0FBQ3JFLE9BQUssTUFBTCxDQUFZLFVBQVosRUFBd0IsZ0JBQXhCLENBQXlDLFFBQXpDO0FBQ0E7QUFDRCxDQUhEOztBQUtBOzs7O0FBSUEsV0FBVyxhQUFYLENBQXlCLDBCQUF6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsYUFBWCxDQUF5QixvQkFBekI7QUFDQSxXQUFXLGFBQVgsQ0FBeUIseUJBQXpCO0FDcEVBOzs7Ozs7Ozs7O0lBRU07OztBQUNKLDBCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxnSUFDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYO0FBQ0E7QUFDQSxXQUFLLEVBSE07QUFJWCxZQUFNLEVBSks7QUFLWCxhQUFPLEVBTEk7QUFNWCx3QkFBa0IsRUFOUDtBQU9YLG9CQUFjLEVBUEg7QUFRWCxzQkFBZ0IsRUFSTDtBQVNYLHNCQUFnQjtBQVRMLEtBQWI7QUFXQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5CO0FBQ0EsVUFBSyxZQUFMLEdBQW9CLE1BQUssWUFBTCxDQUFrQixJQUFsQixPQUFwQjtBQUNBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFmaUI7QUFnQmxCOzs7O2dDQUNXLEdBQUc7QUFDYixjQUFRLEdBQVIsQ0FBWSxTQUFaO0FBQ0EsVUFBSSxVQUFVLEVBQUUsTUFBRixDQUFTLFVBQVQsQ0FBb0IsRUFBbEM7QUFDQTtBQUNBLFdBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsSUFBeEIsQ0FBNkIsS0FBSyxLQUFMLENBQVcsY0FBWCxDQUEwQixPQUExQixDQUE3QjtBQUNBLFdBQUssS0FBTCxDQUFXLGdCQUFYLENBQTRCLElBQTVCLENBQWlDLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsT0FBMUIsRUFBbUMsR0FBcEU7QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUNaLHlCQUFpQixLQUFLLEtBQUwsQ0FBVyxlQURoQjtBQUVaLHNCQUFjLEtBQUssS0FBTCxDQUFXO0FBRmIsT0FBZDtBQUlBLGNBQVEsR0FBUixDQUFZLEtBQUssS0FBTCxDQUFXLFlBQXZCO0FBQ0Q7OztpQ0FDWSxLQUFLO0FBQUE7O0FBQ2hCLGFBQU8sVUFBQyxDQUFELEVBQU87QUFDWixZQUFJLFFBQVEsY0FBWixFQUE0QjtBQUMxQjtBQUNBLGNBQUksRUFBRSxNQUFGLENBQVMsS0FBVCxJQUFrQixFQUF0QixFQUEwQjtBQUFFO0FBQzFCLGdCQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7QUFDQSxnQkFBSSxJQUFKLENBQVMsS0FBVCxFQUFnQixXQUFXLEVBQUUsTUFBRixDQUFTLEtBQXBDO0FBQ0EsZ0JBQUksa0JBQUosR0FBeUIsWUFBTTtBQUM3QixrQkFBSSxJQUFJLFVBQUosSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsb0JBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxJQUFJLFlBQWYsQ0FBVjtBQUNBLHVCQUFLLFFBQUwsQ0FBYztBQUNaLGtDQUFnQjtBQURKLGlCQUFkO0FBR0Q7QUFDRixhQVBEO0FBUUEsZ0JBQUksSUFBSjtBQUNELFdBWkQsTUFhSztBQUNILG1CQUFLLFFBQUwsQ0FBYztBQUNaLDhCQUFnQjtBQURKLGFBQWQ7QUFHRDtBQUNGLFNBcEJELE1BcUJLO0FBQ0gsY0FBSSxRQUFRLEVBQVo7QUFDQSxnQkFBTSxHQUFOLElBQWEsRUFBRSxNQUFGLENBQVMsS0FBdEI7QUFDQSxpQkFBSyxRQUFMLENBQWMsS0FBZDtBQUNBO0FBQ0Q7QUFDRixPQTVCRDtBQTZCRDs7O2lDQUNZLEdBQUc7QUFBQTs7QUFDZCxRQUFFLGNBQUY7QUFDQSxjQUFRLEdBQVIsQ0FBWSxzQkFBWjtBQUNBLFVBQUksT0FBTztBQUNULGtCQUFVLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUREO0FBRVQsY0FBTSxLQUFLLEtBQUwsQ0FBVyxJQUZSO0FBR1Qsc0JBQWMsS0FBSyxLQUFMLENBQVc7QUFIaEIsT0FBWDtBQUtBLFVBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLFVBQUksSUFBSixDQUFTLE1BQVQsRUFBa0IsTUFBTSxhQUFhLE9BQWIsQ0FBcUIsVUFBckIsQ0FBTixHQUF5QyxRQUEzRDs7QUFFQSxVQUFJLGtCQUFKLEdBQXlCLFlBQU07O0FBRTdCLFlBQUksSUFBSSxVQUFKLElBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGNBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxJQUFJLFlBQWYsQ0FBVjtBQUNBLGtCQUFRLEdBQVIsQ0FBWSxHQUFaLEVBQWlCLE9BQUssUUFBTCxDQUFjO0FBQzdCLDRCQUFnQixDQUFDLElBQUksT0FBSixHQUFjLFdBQWQsR0FBNEIsV0FBN0IsSUFBNEMsSUFBSTtBQURuQyxXQUFkO0FBR2xCO0FBQ0YsT0FSRDtBQVNBLFVBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsa0JBQXJDO0FBQ0EsVUFBSSxJQUFKLENBQVMsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFUO0FBQ0Q7Ozs2QkFDUTtBQUNQLFVBQUksT0FBTyxFQUFYO0FBQ0EsVUFBSSxJQUFJLEtBQUssS0FBTCxDQUFXLGNBQW5COztBQUVBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxFQUFFLE1BQXRCLEVBQThCLEdBQTlCLEVBQW1DO0FBQ2pDLGFBQUssSUFBTCxDQUNJO0FBQUE7QUFBQTtBQUNBLGdCQUFJLENBREo7QUFFQSxxQkFBUyxLQUFLLFdBRmQ7QUFHQTtBQUFBO0FBQUE7QUFBSyxjQUFFLENBQUYsRUFBSztBQUFWLFdBSEE7QUFJQTtBQUFBO0FBQUE7QUFBSyxjQUFFLENBQUYsRUFBSztBQUFWO0FBSkEsU0FESjtBQU9EOztBQUVELFVBQUksZUFBZSxFQUFuQjtBQUNBLFVBQUksSUFBSSxLQUFLLEtBQUwsQ0FBVyxZQUFuQjs7QUFFQSxXQUFLLElBQUksS0FBSSxDQUFiLEVBQWdCLEtBQUksRUFBRSxNQUF0QixFQUE4QixJQUE5QixFQUFtQztBQUNqQyxxQkFBYSxJQUFiLENBQ0k7QUFBQTtBQUFBLFlBQUksSUFBSSxFQUFSO0FBQ0csWUFBRSxFQUFGLEVBQUs7QUFEUixTQURKO0FBS0Q7O0FBRUQsVUFBSSxLQUFLLEtBQUwsQ0FBVyxXQUFYLElBQTBCLGdCQUE5QixFQUFnRDtBQUM5QyxlQUFRLElBQVI7QUFDRCxPQUZELE1BSUs7QUFDSCxlQUNFO0FBQUE7QUFBQSxZQUFLLElBQUcsTUFBUjtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FEQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFJLG1CQUFLLEtBQUwsQ0FBVztBQUFmLGFBREE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFnQixtQkFBSyxLQUFMLENBQVc7QUFBM0IsYUFGQTtBQUdBO0FBQUE7QUFBQTtBQUFBO0FBQVcsbUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUI7QUFBNUIsYUFIQTtBQUlBO0FBQUE7QUFBQTtBQUFBO0FBRUU7QUFBQTtBQUFBO0FBQ0M7QUFERDtBQUZGLGFBSkE7QUFXQTtBQUFBO0FBQUEsZ0JBQU8sU0FBUSxNQUFmO0FBQUE7QUFBQSxhQVhBO0FBYUE7QUFDRSxvQkFBSyxNQURQO0FBRUUsa0JBQUcsTUFGTDtBQUdFLDRCQUFjLEtBQUssS0FBTCxDQUFXLElBSDNCO0FBSUUsd0JBQVUsS0FBSyxZQUFMLENBQWtCLE1BQWxCO0FBSlosY0FiQTtBQW9CQTtBQUFBO0FBQUEsZ0JBQUssSUFBSyxRQUFWO0FBQ0E7QUFBQTtBQUFBLGtCQUFPLFNBQVMscUJBQWhCO0FBQUE7QUFBQSxlQURBO0FBR0E7QUFBQTtBQUFBO0FBQ0M7QUFERCxlQUhBO0FBT0E7QUFDRSxvQkFBSyxxQkFEUDtBQUVFLHNCQUFLLFFBRlA7QUFHRSwwQkFBVSxLQUFLLFlBQUwsQ0FBa0IsY0FBbEI7QUFIWixnQkFQQTtBQWFBO0FBQUE7QUFBQSxrQkFBTyxJQUFLLGdCQUFaO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFBSjtBQUF5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXpCO0FBREEsaUJBREE7QUFJQTtBQUFBO0FBQUE7QUFDQztBQUREO0FBSkE7QUFiQSxhQXBCQTtBQTJDQSwyQ0FBTyxNQUFLLFFBQVosRUFBcUIsT0FBTSxjQUEzQixFQUEwQyxTQUFTLEtBQUssWUFBeEQ7QUEzQ0E7QUFGQSxTQURGO0FBbUREO0FBQ0Y7Ozs7RUF0SzBCLE1BQU07OztBQ0ZuQzs7Ozs7O0FBTUEsSUFBSSxrQkFBa0IsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ3RDLGVBQWEscUJBQVMsS0FBVCxFQUFlO0FBQzFCLFNBQUssS0FBTCxDQUFXLEtBQVg7QUFDQSxVQUFNLGNBQU47QUFDRCxHQUpxQztBQUt0QyxVQUFRLGtCQUFXO0FBQ2pCLFdBQ0U7QUFBQTtBQUFBLFFBQVEsV0FBVSxpQkFBbEIsRUFBb0MsU0FDbkMsS0FBSyxXQUROO0FBQUE7QUFBQSxLQURGO0FBTUQ7QUFacUMsQ0FBbEIsQ0FBdEI7O0FBZUEsSUFBSSxxQkFBcUIsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ3pDLGVBQWEscUJBQVMsS0FBVCxFQUFlO0FBQzFCLFNBQUssS0FBTCxDQUFXLEtBQVg7QUFDQSxVQUFNLGNBQU47QUFDRCxHQUp3QztBQUt6QyxVQUFRLGtCQUFXO0FBQ2pCLFdBQ0U7QUFBQTtBQUFBLFFBQVEsV0FBVSxvQkFBbEIsRUFBdUMsU0FDdEMsS0FBSyxXQUROO0FBQUE7QUFBQSxLQURGO0FBTUQ7QUFad0MsQ0FBbEIsQ0FBekI7O0FBZ0JBLElBQUksdUJBQXVCLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUMzQyxtQkFBaUIsMkJBQVc7QUFDNUIsV0FBUztBQUNQLGtCQUFZLENBREw7QUFFUCxhQUFPLENBQUMsRUFBQyxNQUFNLEVBQVAsRUFBVyxRQUFRLEVBQW5CLEVBQUQsQ0FGQTtBQUdQLFlBQU0sRUFIQztBQUlQLG9CQUFjLEVBSlA7QUFLUCwwQkFBb0IsQ0FMYjtBQU1QLDRCQUFzQjtBQU5mLEtBQVQ7QUFRQyxHQVYwQztBQVczQyxrQkFBZ0IsMEJBQVc7QUFDekIsWUFBUSxHQUFSLENBQVksU0FBWjtBQUNBLFNBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsSUFBakIsQ0FBc0IsRUFBQyxXQUFXLEVBQVosRUFBZ0IsYUFBYSxFQUE3QixFQUF0QjtBQUNBLFNBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVksS0FBSyxLQUFMLENBQVcsVUFBWCxHQUF3QixDQUR4QjtBQUVaLGFBQU8sS0FBSyxLQUFMLENBQVc7QUFGTixLQUFkO0FBSUEsV0FBTyxLQUFLLEtBQUwsQ0FBVyxVQUFsQjtBQUNELEdBbkIwQztBQW9CM0MscUJBQW1CLDZCQUFXO0FBQzVCLFlBQVEsR0FBUixDQUFZLFNBQVo7QUFDQSxTQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE1BQWpCLENBQXdCLENBQUMsQ0FBekIsRUFBNEIsQ0FBNUI7QUFDQSxZQUFRLEdBQVIsQ0FBWSxLQUFLLEtBQUwsQ0FBVyxLQUF2QjtBQUNBLFFBQUksS0FBSyxLQUFMLENBQVcsVUFBWCxJQUF5QixDQUE3QixFQUFnQztBQUM5QixXQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLENBQXhCO0FBQ0QsS0FGRCxNQUdLO0FBQ0gsV0FBSyxLQUFMLENBQVcsVUFBWDtBQUNEO0FBQ0QsWUFBUSxNQUFSLENBQWUsS0FBSyxLQUFMLENBQVcsVUFBWCxJQUF5QixDQUF4QztBQUNBLFNBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVksS0FBSyxLQUFMLENBQVcsVUFEWDtBQUVaLGFBQU8sS0FBSyxLQUFMLENBQVc7QUFGTixLQUFkO0FBSUEsV0FBTyxLQUFLLEtBQUwsQ0FBVyxVQUFsQjtBQUNELEdBcEMwQzs7QUFzQzNDLGdCQUFjLHNCQUFTLEtBQVQsRUFBZ0I7QUFDNUIsUUFBSSxPQUFRO0FBQ1YsWUFBTSxLQUFLLEtBQUwsQ0FBVyxJQURQO0FBRVY7QUFDQSxvQkFBYyxLQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLE9BQXhCLENBQWdDLElBQWhDLEVBQXNDLEVBQXRDLENBSEo7QUFJVixhQUFPLEtBQUssS0FBTCxDQUFXLEtBSlI7QUFLViwwQkFBb0IsS0FBSyxLQUFMLENBQVcsa0JBTHJCO0FBTVYsNEJBQXNCLEtBQUssS0FBTCxDQUFXO0FBTnZCLEtBQVo7O0FBU0EsWUFBUSxHQUFSLENBQVksSUFBWjtBQUNBLFlBQVEsR0FBUixDQUFZLEtBQUssS0FBTCxDQUFXLElBQXZCO0FBQ0EsWUFBUSxHQUFSLENBQVksS0FBSyxTQUFMLENBQWUsSUFBZixDQUFaOztBQUdBLFFBQUksVUFBVSxJQUFJLGNBQUosRUFBZDtBQUNBLFlBQVEsSUFBUixDQUFhLE1BQWIsRUFBcUIsTUFBTSxhQUFhLE9BQWIsQ0FBcUIsVUFBckIsQ0FBTixHQUF5QyxTQUF6QyxHQUFxRCxLQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLEdBQTdFLEdBQW1GLFFBQXhHO0FBQ0EsWUFBUSxnQkFBUixDQUF5QixjQUF6QixFQUF5QyxrQkFBekM7QUFDQSxZQUFRLElBQVIsQ0FBYSxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQWI7O0FBRUE7O0FBRUEsU0FBSyxRQUFMLENBQWM7QUFDWixrQkFBWSxDQURBO0FBRVosYUFBTyxDQUFDLEVBQUMsTUFBTSxFQUFQLEVBQVcsUUFBUSxFQUFuQixFQUFELENBRks7QUFHWixZQUFNLEVBSE07QUFJWixvQkFBYyxFQUpGO0FBS1osMEJBQW9COztBQUxSLEtBQWQ7O0FBU0EsVUFBTSxjQUFOO0FBQ0QsR0F0RTBDO0FBdUUzQyxnQkFBYyxzQkFBUyxHQUFULEVBQWMsSUFBZCxFQUFvQixNQUFwQixFQUEyQjtBQUN2QztBQUNBLFNBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsSUFBdEIsR0FBNkIsSUFBN0I7QUFDQSxTQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLE1BQXRCLEdBQStCLE1BQS9CO0FBQ0E7QUFDQSxTQUFLLFFBQUwsQ0FBYztBQUNaLGFBQU8sS0FBSyxLQUFMLENBQVc7QUFETixLQUFkO0FBR0QsR0EvRTBDO0FBZ0YzQyxvQkFBa0IsMEJBQVMsS0FBVCxFQUFnQjtBQUNoQyxZQUFRLEdBQVIsQ0FBWSxNQUFNLE1BQU4sQ0FBYSxLQUF6QjtBQUNBLFNBQUssS0FBTCxDQUFXLElBQVgsR0FBa0IsTUFBTSxNQUFOLENBQWEsS0FBL0I7QUFDQSxTQUFLLFFBQUwsQ0FBYztBQUNaLFlBQU0sS0FBSyxLQUFMLENBQVc7QUFETCxLQUFkO0FBR0E7QUFDRCxHQXZGMEM7QUF3RjNDLHVCQUFxQiw2QkFBUyxLQUFULEVBQWdCO0FBQ25DLFNBQUssS0FBTCxDQUFXLFlBQVgsR0FBMEIsTUFBTSxNQUFOLENBQWEsS0FBdkM7QUFDQSxTQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFjLEtBQUssS0FBTCxDQUFXO0FBRGIsS0FBZDtBQUdELEdBN0YwQztBQThGM0MsZ0NBQThCLHNDQUFTLEtBQVQsRUFBZ0I7QUFDNUMsU0FBSyxLQUFMLENBQVcsa0JBQVgsR0FBZ0MsTUFBTSxNQUFOLENBQWEsS0FBN0M7QUFDQSxZQUFRLEdBQVIsQ0FBWSxLQUFLLEtBQUwsQ0FBVyxrQkFBdkI7QUFDQSxTQUFLLFFBQUwsQ0FBYztBQUNaLDBCQUFvQixLQUFLLEtBQUwsQ0FBVztBQURuQixLQUFkO0FBR0QsR0FwRzBDO0FBcUczQyw4QkFBNEIsb0NBQVMsS0FBVCxFQUFnQjtBQUMxQyxTQUFLLEtBQUwsQ0FBVyxvQkFBWCxHQUFrQyxNQUFNLE1BQU4sQ0FBYSxLQUEvQztBQUNBLFNBQUssUUFBTCxDQUFjO0FBQ1osNEJBQXNCLEtBQUssS0FBTCxDQUFXO0FBRHJCLEtBQWQ7QUFHQSxZQUFRLEdBQVIsQ0FBWSxLQUFLLEtBQUwsQ0FBVyxvQkFBdkI7QUFDRCxHQTNHMEM7O0FBNkczQyxVQUFRLGtCQUFVO0FBQ2hCLFFBQUksS0FBSyxLQUFMLENBQVcsV0FBWCxJQUEwQixzQkFBOUIsRUFBc0Q7QUFDcEQsYUFBTyxJQUFQO0FBQ0Q7QUFDRCxZQUFRLEdBQVIsQ0FBWSxnQkFBWjtBQUNBLFFBQUksUUFBUSxFQUFaO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssS0FBTCxDQUFXLFVBQS9CLEVBQTJDLEdBQTNDLEVBQWdEO0FBQzlDLFlBQU0sSUFBTixDQUFXLG9CQUFDLElBQUQsSUFBTSxXQUFXLENBQWpCLEVBQW9CLEtBQUssQ0FBekIsRUFBNEIsUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLENBQWpCLENBQXBDO0FBQ1gsa0JBQVUsS0FBSyxZQURKLEdBQVg7QUFFRDtBQUNELFdBQ0U7QUFBQTtBQUFBLFFBQUssU0FBTyxNQUFaO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURBO0FBRUU7QUFBQTtBQUFBLFlBQU8sU0FBUSxNQUFmO0FBQUE7QUFBQSxTQUZGO0FBR0U7QUFDRSxnQkFBSyxNQURQO0FBRUUsZ0JBQUssTUFGUDtBQUdFLHVCQUFZLE1BSGQ7QUFJRSxpQkFBTyxLQUFLLEtBQUwsQ0FBVyxJQUpwQjtBQUtFLG9CQUFVLEtBQUssZ0JBTGpCO0FBTUUsd0JBTkYsR0FIRjtBQVdFO0FBQUE7QUFBQSxZQUFPLFNBQVEsY0FBZjtBQUFBO0FBQUEsU0FYRjtBQVlFO0FBQ0UsZ0JBQU0sS0FEUjtBQUVFLGdCQUFLLGNBRlA7QUFHRSx1QkFBWSxjQUhkO0FBSUUsaUJBQU8sS0FBSyxLQUFMLENBQVcsWUFKcEI7QUFLRSxvQkFBVSxLQUFLLG1CQUxqQjtBQU1FLHdCQU5GLEdBWkY7QUFvQkU7QUFBQTtBQUFBLFlBQU8sU0FBUSx3QkFBZjtBQUFBO0FBQUEsU0FwQkY7QUFxQkU7QUFDRTtBQUNBLGNBQUssWUFGUDtBQUdFLGdCQUFPLFFBSFQ7QUFJRSxnQkFBTyx3QkFKVDtBQUtFLHVCQUFjLEdBTGhCO0FBTUUsaUJBQVMsS0FBSyxLQUFMLENBQVcsa0JBTnRCO0FBT0Usb0JBQVUsS0FBSyw0QkFQakI7QUFRRSxlQUFNLEdBUlI7QUFTRTtBQVRGLFVBckJGO0FBaUNFO0FBQUE7QUFBQTtBQUNFLHNCQUFVLEtBQUssMEJBRGpCO0FBRUUsMEJBQWEsT0FGZjtBQUdFLGtCQUFLO0FBSFA7QUFLRTtBQUFBO0FBQUEsY0FBUSxPQUFNLEtBQWQ7QUFBQTtBQUFBLFdBTEY7QUFNRTtBQUFBO0FBQUEsY0FBUSxPQUFNLE1BQWQ7QUFBQTtBQUFBLFdBTkY7QUFPRTtBQUFBO0FBQUEsY0FBUSxPQUFNLE9BQWQ7QUFBQTtBQUFBO0FBUEYsU0FqQ0Y7QUEwQ0UsNEJBQUMsZUFBRCxJQUFpQixPQUFPLEtBQUssY0FBN0IsR0ExQ0Y7QUEyQ0UsNEJBQUMsa0JBQUQsSUFBb0IsT0FBTyxLQUFLLGlCQUFoQyxHQTNDRjtBQTRDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkE7QUFERixXQURGO0FBT0U7QUFBQTtBQUFBO0FBQ0M7QUFERDtBQVBGLFNBNUNGO0FBdURFLHVDQUFPLE1BQUssUUFBWixFQUFxQixPQUFNLFVBQTNCLEVBQXNDLFNBQVMsS0FBSyxZQUFwRCxHQXZERjtBQXdERSw0QkFBQyxtQkFBRDtBQXhERjtBQURBLEtBREY7QUE4REQ7QUFyTDBDLENBQWxCLENBQTNCOztBQXdMQSxJQUFJLE9BQU8sTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQzNCLGdCQUFjLHdCQUFXO0FBQ3ZCO0FBQ0EsU0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUFLLEtBQUwsQ0FBVyxTQUEvQixFQUEwQyxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsS0FBekQsRUFDQSxLQUFLLElBQUwsQ0FBVSxNQUFWLENBQWlCLEtBRGpCO0FBRUQsR0FMMEI7O0FBTzNCLFVBQVEsa0JBQVU7QUFDaEI7QUFDQSxXQUNFO0FBQUE7QUFBQSxRQUFJLFFBQU8sTUFBWDtBQUNBO0FBQUE7QUFBQTtBQUNFO0FBQ0Usd0JBREY7QUFFRSxnQkFBTyxNQUZUO0FBR0UsdUJBQVksV0FIZDtBQUlFLGlCQUFPLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsSUFKM0I7QUFLRSxlQUFJLE1BTE47QUFNRSxvQkFBVSxLQUFLO0FBTmpCO0FBREYsT0FEQTtBQVlBO0FBQUE7QUFBQTtBQUNBO0FBQ0UsZ0JBQU8sUUFEVDtBQUVFLGVBQUssR0FGUDtBQUdFLHVCQUFjLFFBSGhCO0FBSUUsaUJBQU8sS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUozQjtBQUtFLGVBQUksUUFMTjtBQU1FLG9CQUFVLEtBQUssWUFOakI7QUFPRSx3QkFQRjtBQURBO0FBWkEsS0FERjtBQTBCRDtBQW5DMEIsQ0FBbEIsQ0FBWDs7O0FDN05BOzs7Ozs7QUFNQSxJQUFJLCtCQUErQixNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDbkQsVUFBUSxrQkFBVztBQUNuQixRQUFJLEtBQUssS0FBTCxDQUFXLFdBQVgsSUFBMEIsOEJBQTlCLEVBQThEO0FBQzVELGFBQU8sSUFBUDtBQUNELEtBRkQsTUFHSztBQUNIO0FBQ0YsYUFDRTtBQUFBO0FBQUEsVUFBSyxTQUFPLE1BQVo7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREY7QUFFRSw0QkFBQyx3QkFBRCxJQUEwQixhQUFhLEtBQUssS0FBTCxDQUFXLFdBQWxELEdBRkY7QUFHRSw0QkFBQyxtQkFBRCxPQUhGO0FBSUUsNEJBQUMsd0JBQUQsT0FKRjtBQUtFLDRCQUFDLG1CQUFEO0FBTEYsT0FERjtBQVNDO0FBRUE7QUFsQmtELENBQWxCLENBQW5DOztBQXFCQSxJQUFJLHNCQUFzQixNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUMxQyxhQUQwQyx5QkFDNUI7QUFDWixlQUFXLGFBQVgsQ0FBeUIsb0JBQXpCLEVBQStDLFFBQS9DO0FBQ0QsR0FIeUM7O0FBSTFDLFVBQVEsa0JBQVk7QUFDbEIsV0FDRTtBQUFBO0FBQUEsUUFBUSxTQUFTLEtBQUssV0FBdEI7QUFBQTtBQUFBLEtBREY7QUFHRjtBQVIwQyxDQUFsQixDQUExQjs7QUFXQSxJQUFJLDJCQUEyQixNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUMvQyxhQUQrQyx5QkFDakM7QUFDWixlQUFXLGFBQVgsQ0FBeUIsb0JBQXpCLEVBQStDLE9BQS9DO0FBQ0QsR0FIOEM7OztBQUsvQyxVQUFRLGtCQUFZO0FBQ3BCLFdBQVE7QUFBQTtBQUFBLFFBQVEsU0FBUyxLQUFLLFdBQXRCO0FBQUE7QUFBQSxLQUFSO0FBQ0E7QUFQK0MsQ0FBbEIsQ0FBL0I7O0FBV0EsSUFBSSwyQkFBMkIsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQy9DLFVBQVEsa0JBQVc7QUFDakIsUUFBSSxjQUFjLEtBQUssS0FBTCxDQUFXLFdBQTdCO0FBQ0UsUUFBSSxZQUFZLEVBQWhCO0FBQ0EsU0FBSyxJQUFJLElBQVQsSUFBaUIsWUFBWSxLQUE3QixFQUFvQztBQUNsQyxnQkFBVSxJQUFWLENBQ0E7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURGO0FBRUU7QUFBQTtBQUFBO0FBQUssc0JBQVksS0FBWixDQUFrQixJQUFsQixFQUF3QjtBQUE3QixTQUZGO0FBR0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUhGO0FBSUU7QUFBQTtBQUFBO0FBQUssc0JBQVksS0FBWixDQUFrQixJQUFsQixFQUF3QjtBQUE3QjtBQUpGLE9BREE7QUFRRDtBQUNMLFdBQ0U7QUFBQTtBQUFBLFFBQU8sSUFBRywwQkFBVjtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQTtBQUFLLHdCQUFZLElBQVosQ0FBaUIsU0FBakIsQ0FBMkIsQ0FBM0IsRUFBNkIsRUFBN0I7QUFBTDtBQUZGLFNBREY7QUFLRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUFBO0FBQUE7QUFBSyx3QkFBWSxXQUFaLENBQXdCLFNBQXhCLENBQWtDLENBQWxDLEVBQW9DLEVBQXBDO0FBQUw7QUFGRixTQUxGO0FBU0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBO0FBQUssd0JBQVksUUFBWixDQUFxQixRQUFyQjtBQUFMO0FBRkYsU0FURjtBQWFFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQTtBQUFLLHdCQUFZO0FBQWpCO0FBRkYsU0FiRjtBQWtCRztBQWxCSDtBQURGLEtBREY7QUF3QkM7QUF0QzhDLENBQWxCLENBQS9COzs7QUNqREE7Ozs7OztBQU1BLElBQUkseUJBQXlCLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUM3QyxVQUFRLGtCQUFZO0FBQ2xCLFFBQUksS0FBSyxLQUFMLENBQVcsV0FBWCxJQUEwQix3QkFBOUIsRUFBd0Q7QUFDdEQsYUFBTyxJQUFQO0FBQ0QsS0FGRCxNQUdLO0FBQ0g7QUFDQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsTUFBZjtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQXlCLGVBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0I7QUFBakQsU0FEQTtBQUVBLDRCQUFDLGlCQUFELElBQW1CLGNBQWdCLEtBQUssS0FBTCxDQUFXLFlBQTlDLEdBRkE7QUFHQSw0QkFBQyxzQkFBRCxPQUhBO0FBSUEsNEJBQUMsbUJBQUQ7QUFKQSxPQURGO0FBUUQ7QUFDRjtBQWhCNEMsQ0FBbEIsQ0FBN0I7O0FBbUJBLElBQUkseUJBQXlCLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUM3QyxlQUFhLHVCQUFXO0FBQ3RCLFFBQUksY0FBYyxzQkFBbEI7QUFDQSxZQUFRLEdBQVIsQ0FBWSxTQUFaO0FBQ0EsYUFBUyxRQUFULENBQWtCLEVBQUMsYUFBYSxXQUFkLEVBQWxCO0FBQ0QsR0FMNEM7QUFNN0MsVUFBUSxrQkFBVztBQUNqQixXQUNFO0FBQUE7QUFBQSxRQUFRLFdBQVUsd0JBQWxCO0FBQ0EsaUJBQVUsS0FBSyxXQURmO0FBQUE7QUFBQSxLQURGO0FBTUQ7QUFiNEMsQ0FBbEIsQ0FBN0I7O0FBZ0JBLElBQUksb0JBQW9CLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUN4QyxVQUFRLGtCQUFXO0FBQ2pCO0FBQ0EsUUFBSSxPQUFPLEVBQVg7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixNQUE1QyxFQUFvRCxHQUFwRCxFQUF5RDtBQUN2RDtBQUNBLFdBQUssSUFBTCxDQUFVLG9CQUFDLFNBQUQsSUFBVyxLQUFLLENBQWhCLEVBQW1CLFFBQVEsS0FBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixDQUF4QixDQUEzQixHQUFWO0FBQ0Q7O0FBR0QsV0FDRTtBQUFBO0FBQUE7QUFDQSwwQkFBQyw0QkFBRCxPQURBO0FBRUU7QUFBQTtBQUFBO0FBQ0M7QUFERDtBQUZGLEtBREY7QUFRRDtBQWxCdUMsQ0FBbEIsQ0FBeEI7O0FBcUJBLElBQUksK0JBQStCLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUNuRCxVQUFRLGtCQUFVO0FBQ2hCLFdBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUZBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUhBO0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUpBO0FBREYsS0FERjtBQVVEO0FBWmtELENBQWxCLENBQW5DOztBQWdCQSxJQUFJLFlBQVksTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ2hDLGVBQWEsdUJBQVc7QUFDdEIsUUFBSSxjQUFjLDhCQUFsQjs7QUFFQSxlQUFXLGFBQVgsQ0FBeUIsMEJBQXpCLEVBQXFELEtBQUssS0FBTCxDQUFXLE1BQWhFO0FBQ0EsYUFBUyxRQUFULENBQWtCO0FBQ2hCLG1CQUFhO0FBREcsS0FBbEI7QUFHRCxHQVIrQjtBQVNoQyxVQUFRLGtCQUFXOztBQUVqQixhQUFTLGdCQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQzlCLFVBQUksTUFBTSxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQVY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQU8sS0FBSyxJQUFMLENBQVUsQ0FBQyxNQUFNLEtBQUssR0FBTCxFQUFQLEtBQW9CLE9BQUssRUFBTCxHQUFRLEVBQVIsR0FBVyxFQUEvQixDQUFWLENBQVA7QUFDRDs7QUFFRCxhQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBeUI7QUFDdkIsYUFBTyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWlCLEVBQWpCLENBQVA7QUFDRDtBQUNGLFFBQUksU0FBUyxpQkFBaUIsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixXQUFuQyxDQUFiO0FBQ0EsUUFBSSxXQUFXLEVBQWY7QUFHQSxRQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsUUFBbEIsS0FBK0IsSUFBbkMsRUFBeUM7QUFDdkMsaUJBQVc7QUFDVCx3QkFBZ0IsY0FEUDtBQUVULGVBQU87QUFGRSxPQUFYO0FBSUQsS0FMRCxNQU1LLElBQUksVUFBVSxDQUFkLEVBQWlCO0FBQ3BCLGlCQUFXO0FBQ1QseUJBQWlCO0FBRFIsT0FBWDtBQUdELEtBSkksTUFLQyxJQUFJLFVBQVUsQ0FBZCxFQUFpQjtBQUNwQixpQkFBVztBQUNWLHlCQUFpQjtBQURQLE9BQVg7QUFHQTtBQUNGLFdBQ0U7QUFBQTtBQUFBLFFBQUksT0FBTyxRQUFYLEVBQXFCLFNBQVUsS0FBSyxXQUFwQztBQUNFO0FBQUE7QUFBQTtBQUFLLG1CQUFXLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsSUFBN0I7QUFBTCxPQURGO0FBRUU7QUFBQTtBQUFBO0FBQUssbUJBQVcsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixXQUE3QjtBQUFMLE9BRkY7QUFHRTtBQUFBO0FBQUE7QUFBSyxhQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCO0FBQXZCLE9BSEY7QUFJRTtBQUFBO0FBQUE7QUFBSyxhQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCO0FBQXZCO0FBSkYsS0FERjtBQVFEO0FBbkQrQixDQUFsQixDQUFoQjtBQzlFQTs7Ozs7Ozs7OztJQUVNOzs7QUFDSixpQ0FBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOElBQ1gsS0FEVzs7QUFFakIsVUFBSyxLQUFMLEdBQWE7QUFDWDtBQUNBO0FBQ0EsV0FBSyxFQUhNO0FBSVgsWUFBTSxFQUpLO0FBS1gsYUFBTyxFQUxJO0FBTVgsd0JBQWtCLEVBTlA7QUFPWCxvQkFBYyxFQVBIO0FBUVgsc0JBQWdCLEVBUkw7QUFTWCxzQkFBZ0I7QUFUTCxLQUFiO0FBV0EsVUFBSyxRQUFMLEdBQWdCLE1BQUssUUFBTCxDQUFjLElBQWQsT0FBaEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5CO0FBQ0EsVUFBSyxZQUFMLEdBQW9CLE1BQUssWUFBTCxDQUFrQixJQUFsQixPQUFwQjtBQUNBLFVBQUssWUFBTCxHQUFvQixNQUFLLFlBQUwsQ0FBa0IsSUFBbEIsT0FBcEI7QUFoQmlCO0FBaUJsQjs7OzsrQkFDVTtBQUFBOztBQUNULFVBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLFVBQUksSUFBSixDQUFTLEtBQVQsRUFBZ0IsTUFBTSxhQUFhLE9BQWIsQ0FBcUIsVUFBckIsQ0FBTixHQUF5QyxTQUF6QyxHQUNkLEtBQUssS0FBTCxDQUFXLFlBQVgsQ0FBd0IsR0FEVixHQUNnQixTQURoQztBQUVBLFVBQUksa0JBQUosR0FBeUIsWUFBTTtBQUM3QixZQUFJLElBQUksVUFBSixJQUFrQixDQUF0QixFQUF5QjtBQUN2QixjQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsSUFBSSxZQUFmLENBQVY7QUFDQSxrQkFBUSxHQUFSLENBQVksR0FBWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFLLFFBQUwsQ0FBYztBQUNaLGlCQUFLLElBQUksQ0FBSixFQUFPLEdBREE7QUFFWixrQkFBTSxJQUFJLENBQUosRUFBTyxJQUZEO0FBR1osOEJBQWtCLElBQUksQ0FBSixFQUFPLFlBSGI7QUFJWixtQkFBTyxJQUFJLENBQUosQ0FKSztBQUtaLDBCQUFjLElBQUksQ0FBSjtBQUxGLFdBQWQ7QUFPQSxrQkFBUSxHQUFSLENBQVksT0FBSyxLQUFqQjtBQUNEO0FBQ0YsT0FoQkQ7QUFpQkEsVUFBSSxJQUFKO0FBQ0Q7OztnQ0FDVyxHQUFHO0FBQ2IsY0FBUSxHQUFSLENBQVksU0FBWjtBQUNBLFVBQUksVUFBVSxFQUFFLE1BQUYsQ0FBUyxVQUFULENBQW9CLEVBQWxDO0FBQ0E7QUFDQSxXQUFLLEtBQUwsQ0FBVyxZQUFYLENBQXdCLElBQXhCLENBQTZCLEtBQUssS0FBTCxDQUFXLGNBQVgsQ0FBMEIsT0FBMUIsQ0FBN0I7QUFDQSxXQUFLLEtBQUwsQ0FBVyxnQkFBWCxDQUE0QixJQUE1QixDQUFpQyxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLE9BQTFCLEVBQW1DLEdBQXBFO0FBQ0EsV0FBSyxRQUFMLENBQWM7QUFDWix5QkFBaUIsS0FBSyxLQUFMLENBQVcsZUFEaEI7QUFFWixzQkFBYyxLQUFLLEtBQUwsQ0FBVztBQUZiLE9BQWQ7QUFJQSxjQUFRLEdBQVIsQ0FBWSxLQUFLLEtBQUwsQ0FBVyxZQUF2QjtBQUNEOzs7aUNBQ1ksS0FBSztBQUFBOztBQUNoQixhQUFPLFVBQUMsQ0FBRCxFQUFPO0FBQ1osWUFBSSxRQUFRLGNBQVosRUFBNEI7QUFDMUI7QUFDQSxjQUFJLEVBQUUsTUFBRixDQUFTLEtBQVQsSUFBa0IsRUFBdEIsRUFBMEI7QUFBRTtBQUMxQixnQkFBSSxNQUFNLElBQUksY0FBSixFQUFWO0FBQ0EsZ0JBQUksSUFBSixDQUFTLEtBQVQsRUFBZ0IsV0FBVyxFQUFFLE1BQUYsQ0FBUyxLQUFwQztBQUNBLGdCQUFJLGtCQUFKLEdBQXlCLFlBQU07QUFDN0Isa0JBQUksSUFBSSxVQUFKLElBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLG9CQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsSUFBSSxZQUFmLENBQVY7QUFDQSx1QkFBSyxRQUFMLENBQWM7QUFDWixrQ0FBZ0I7QUFESixpQkFBZDtBQUdEO0FBQ0YsYUFQRDtBQVFBLGdCQUFJLElBQUo7QUFDRCxXQVpELE1BYUs7QUFDSCxtQkFBSyxRQUFMLENBQWM7QUFDWiw4QkFBZ0I7QUFESixhQUFkO0FBR0Q7QUFDRixTQXBCRCxNQXFCSztBQUNILGNBQUksUUFBUSxFQUFaO0FBQ0EsZ0JBQU0sR0FBTixJQUFhLEVBQUUsTUFBRixDQUFTLEtBQXRCO0FBQ0EsaUJBQUssUUFBTCxDQUFjLEtBQWQ7QUFDQTtBQUNEO0FBQ0YsT0E1QkQ7QUE2QkQ7OztpQ0FDWSxHQUFHO0FBQUE7O0FBQ2Q7QUFDQTtBQUNBLFFBQUUsY0FBRjtBQUNBLGNBQVEsR0FBUixDQUFZLHFCQUFaO0FBQ0E7QUFDQTtBQUNBLFVBQUksT0FBTztBQUNULGtCQUFVLEtBQUssS0FBTCxDQUFXLFFBRFo7QUFFVCxjQUFNLEtBQUssS0FBTCxDQUFXLElBRlI7QUFHVCxzQkFBYyxLQUFLLEtBQUwsQ0FBVztBQUhoQixPQUFYO0FBS0EsVUFBSSxNQUFNLElBQUksY0FBSixFQUFWO0FBQ0EsVUFBSSxJQUFKLENBQVMsS0FBVCxFQUFpQixNQUFNLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUFOLEdBQXlDLFNBQXpDLEdBQ2YsS0FBSyxLQUFMLENBQVcsR0FESSxHQUNFLFNBRG5COztBQUdBLFVBQUksa0JBQUosR0FBeUIsWUFBTTs7QUFFN0IsWUFBSSxJQUFJLFVBQUosSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsY0FBSSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQUksWUFBZixDQUFWO0FBQ0Esa0JBQVEsR0FBUixDQUFZLEdBQVosRUFBaUIsT0FBSyxRQUFMLENBQWM7QUFDN0IsNEJBQWdCLENBQUMsSUFBSSxPQUFKLEdBQWMsVUFBZCxHQUEyQixVQUE1QixJQUEwQyxJQUFJO0FBRGpDLFdBQWQ7QUFHbEI7QUFDRixPQVJEO0FBU0EsVUFBSSxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxrQkFBckM7QUFDQSxVQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQVQ7QUFDRDs7OzZCQUNRO0FBQ1AsVUFBSSxPQUFPLEVBQVg7QUFDQSxVQUFJLElBQUksS0FBSyxLQUFMLENBQVcsY0FBbkI7O0FBRUEsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQUUsTUFBdEIsRUFBOEIsR0FBOUIsRUFBbUM7QUFDakMsYUFBSyxJQUFMLENBQ0k7QUFBQTtBQUFBO0FBQ0EsZ0JBQUksQ0FESjtBQUVBLHFCQUFTLEtBQUssV0FGZDtBQUdBO0FBQUE7QUFBQTtBQUFLLGNBQUUsQ0FBRixFQUFLO0FBQVYsV0FIQTtBQUlBO0FBQUE7QUFBQTtBQUFLLGNBQUUsQ0FBRixFQUFLO0FBQVY7QUFKQSxTQURKO0FBT0Q7O0FBRUQsVUFBSSxlQUFlLEVBQW5CO0FBQ0EsVUFBSSxJQUFJLEtBQUssS0FBTCxDQUFXLFlBQW5COztBQUVBLFdBQUssSUFBSSxLQUFJLENBQWIsRUFBZ0IsS0FBSSxFQUFFLE1BQXRCLEVBQThCLElBQTlCLEVBQW1DO0FBQ2pDLHFCQUFhLElBQWIsQ0FDSTtBQUFBO0FBQUEsWUFBSSxJQUFJLEVBQVI7QUFDRyxZQUFFLEVBQUYsRUFBSztBQURSLFNBREo7QUFLRDs7QUFFRCxVQUFJLEtBQUssS0FBTCxDQUFXLFdBQVgsSUFBMEIsdUJBQTlCLEVBQXVEO0FBQ3JELGVBQVEsSUFBUjtBQUNELE9BRkQsTUFJSztBQUNILGFBQUssUUFBTDtBQUNBLGVBQ0U7QUFBQTtBQUFBLFlBQUssSUFBRyxNQUFSO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQURBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUksbUJBQUssS0FBTCxDQUFXO0FBQWYsYUFEQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQWdCLG1CQUFLLEtBQUwsQ0FBVztBQUEzQixhQUZBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBVyxtQkFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQjtBQUE1QixhQUhBO0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFFRTtBQUFBO0FBQUE7QUFDQztBQUREO0FBRkYsYUFKQTtBQVdBO0FBQUE7QUFBQSxnQkFBTyxTQUFRLE1BQWY7QUFBQTtBQUFBLGFBWEE7QUFhQTtBQUNFLG9CQUFLLE1BRFA7QUFFRSxrQkFBRyxNQUZMO0FBR0UsNEJBQWMsS0FBSyxLQUFMLENBQVcsSUFIM0I7QUFJRSx3QkFBVSxLQUFLLFlBQUwsQ0FBa0IsTUFBbEI7QUFKWixjQWJBO0FBb0JBO0FBQUE7QUFBQSxnQkFBSyxJQUFLLFFBQVY7QUFDQTtBQUFBO0FBQUEsa0JBQU8sU0FBUyxxQkFBaEI7QUFBQTtBQUFBLGVBREE7QUFHQTtBQUFBO0FBQUE7QUFDQztBQURELGVBSEE7QUFPQTtBQUNFLG9CQUFLLHFCQURQO0FBRUUsc0JBQUssUUFGUDtBQUdFLDBCQUFVLEtBQUssWUFBTCxDQUFrQixjQUFsQjtBQUhaLGdCQVBBO0FBYUE7QUFBQTtBQUFBLGtCQUFPLElBQUssZ0JBQVo7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQUw7QUFBMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUExQjtBQURBLGlCQURBO0FBSUE7QUFBQTtBQUFBO0FBQ0M7QUFERDtBQUpBO0FBYkEsYUFwQkE7QUEyQ0EsMkNBQU8sTUFBSyxRQUFaLEVBQXFCLE9BQU0sY0FBM0IsRUFBMEMsU0FBUyxLQUFLLFlBQXhEO0FBM0NBO0FBRkEsU0FERjtBQW1ERDtBQUNGOzs7O0VBcE1pQyxNQUFNOzs7QUNGMUM7Ozs7OztBQU1BLElBQUksY0FBYyxNQUFNLFdBQU4sQ0FBa0I7QUFBQTs7QUFDbEMsVUFBUSxrQkFBWTtBQUNsQixRQUFJLEtBQUssS0FBTCxDQUFXLFdBQVgsSUFBMEIsYUFBOUIsRUFBNkM7QUFDM0MsYUFBTyxJQUFQO0FBQ0QsS0FGRCxNQUdLO0FBQ0wsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLE1BQWY7QUFDQSw0QkFBQyxZQUFELE9BREE7QUFFQSw0QkFBQyxnQkFBRCxJQUFrQixTQUFXLEtBQUssV0FBbEM7QUFGQSxPQURGO0FBUUM7QUFDRjtBQWZpQyxDQUFsQixDQUFsQjs7QUFrQkEsSUFBSSxtQkFBbUIsTUFBTSxXQUFOLENBQWtCO0FBQUE7O0FBQ3ZDLGVBQWEsdUJBQVc7QUFDdEIsUUFBSSxjQUFjLGdCQUFsQjtBQUNBLGFBQVMsUUFBVCxDQUFrQixFQUFDLGFBQWEsV0FBZCxFQUFsQjtBQUNELEdBSnNDO0FBS3ZDLFVBQVEsa0JBQVc7QUFDakIsV0FDSTtBQUFBO0FBQUEsUUFBUSxXQUFVLGtCQUFsQjtBQUNBLGlCQUFXLEtBQUssV0FEaEI7QUFBQTtBQUFBLEtBREo7QUFNRDtBQVpzQyxDQUFsQixDQUF2Qjs7QUFnQkEsSUFBSSxlQUFlLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUNuQyxtQkFBaUIsMkJBQVc7QUFDMUIsV0FBUTtBQUNOLGNBQVEsRUFERjtBQUVOLGFBQU87QUFGRCxLQUFSO0FBSUQsR0FOa0M7QUFPbkMscUJBQW1CLDZCQUFXO0FBQUE7O0FBQzVCLFlBQVEsR0FBUixDQUFZLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUFaO0FBQ0EsUUFBSSxXQUFXLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUFmO0FBQ0EsUUFBSSxjQUFjLE1BQU0sUUFBTixHQUFpQixRQUFuQzs7QUFFQSxRQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7QUFDQSxRQUFJLElBQUosQ0FBUyxLQUFULEVBQWdCLFdBQWhCO0FBQ0EsUUFBSSxrQkFBSixHQUF5QixZQUFNO0FBQzdCLFVBQUksSUFBSSxVQUFKLElBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGdCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsWUFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQUksWUFBZixDQUFWO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLEdBQVo7O0FBRUEsY0FBSyxRQUFMLENBQWM7QUFDWixrQkFBUSxJQUFJLE1BREE7QUFFWixpQkFBTyxJQUFJO0FBRkMsU0FBZDtBQUtEO0FBQ0YsS0FaRDtBQWFBLFFBQUksSUFBSjtBQUNELEdBNUJrQztBQTZCbkMsVUFBUSxrQkFBVztBQUNqQixRQUFJLE9BQU8sRUFBWDtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE1BQXRDLEVBQThDLEdBQTlDLEVBQW1EO0FBQ2pEO0FBQ0EsVUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBWDtBQUNBLFVBQUksU0FBUyxTQUFiLEVBQXdCO0FBQUUsZUFBTyxJQUFQO0FBQWM7O0FBRXRDLFdBQUssSUFBTCxDQUVFLG9CQUFDLGdCQUFEO0FBQ0UsYUFBSyxDQURQO0FBRUUsZUFBTyxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLENBQWxCLENBRlQ7QUFHRSxjQUFNO0FBSFIsUUFGRjtBQVFIO0FBQ0QsV0FDSTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRkY7QUFERixPQURGO0FBT0U7QUFBQTtBQUFBO0FBQ0U7QUFERjtBQVBGLEtBREo7QUFhRDtBQTFEa0MsQ0FBbEIsQ0FBbkI7O0FBNkRBLElBQUksbUJBQW1CLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUN2QyxtQkFBaUIsMkJBQVk7QUFBQTs7QUFDM0IsUUFBSSxNQUFNLElBQUksY0FBSixFQUFWO0FBQ0EsUUFBSSxJQUFKLENBQVMsS0FBVCxFQUFpQixNQUFNLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUFOLEdBQXlDLFNBQXpDLEdBQ1QsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixHQURSLEdBQ2MsUUFEL0I7QUFFQSxRQUFJLGtCQUFKLEdBQXlCLFlBQU07QUFDN0IsVUFBSSxJQUFJLFVBQUosSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsWUFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQUksWUFBZixDQUFWO0FBQ0E7QUFDQSxZQUFJLGNBQWMsd0JBQWxCO0FBQ0EsWUFBSSxZQUFKLEdBQW1CLE9BQUssS0FBTCxDQUFXLEtBQTlCO0FBQ0EsbUJBQVcsYUFBWCxDQUF5Qix5QkFBekIsRUFBcUQsR0FBckQ7QUFDQSxnQkFBUSxHQUFSLENBQVksR0FBWjtBQUNBLGlCQUFTLFFBQVQsQ0FBa0IsRUFBQyxhQUFhLFdBQWQsRUFBbEI7QUFDRDtBQUNGLEtBVkQ7QUFXQSxRQUFJLElBQUo7QUFDRCxHQWpCc0M7QUFrQnZDLGVBQWEsdUJBQVc7QUFDdEIsUUFBSSxjQUFjLHVCQUFsQjtBQUNBLFFBQUksZUFBZSxLQUFLLEtBQUwsQ0FBVyxLQUE5QjtBQUNBLGFBQVMsUUFBVCxDQUFrQixFQUFDLGFBQWEsV0FBZCxFQUEyQixjQUFjLFlBQXpDLEVBQWxCO0FBQ0QsR0F0QnNDO0FBdUJ2QyxVQUFRLGtCQUFXO0FBQ2pCLFdBQ0k7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLFVBQUksU0FBVyxLQUFLLGVBQXBCO0FBQXVDLGFBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUI7QUFBeEQsT0FEQTtBQUVBO0FBQUE7QUFBQSxVQUFJLFNBQVcsS0FBSyxlQUFwQjtBQUF1QyxhQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCO0FBQXZELE9BRkE7QUFHQTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsWUFBUSxTQUFXLEtBQUssV0FBeEI7QUFBQTtBQUFBO0FBQUo7QUFIQSxLQURKO0FBT0Q7QUEvQnNDLENBQWxCLENBQXZCO0FDckdBOzs7Ozs7Ozs7O0lBRU07OztBQUNKLGdDQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0SUFDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYO0FBQ0E7QUFDQSxvQkFBYyxFQUhIO0FBSVgsV0FBSyxFQUpNO0FBS1gsZ0JBQVUsRUFMQztBQU1YLHNCQUFnQjtBQU5MLEtBQWI7QUFRQSxVQUFLLGlCQUFMLEdBQXlCLE1BQUssaUJBQUwsQ0FBdUIsSUFBdkIsT0FBekI7QUFDQSxVQUFLLFlBQUwsR0FBb0IsTUFBSyxZQUFMLENBQWtCLElBQWxCLE9BQXBCO0FBQ0EsVUFBSyxZQUFMLEdBQW9CLE1BQUssWUFBTCxDQUFrQixJQUFsQixPQUFwQjtBQVppQjtBQWFsQjs7Ozt3Q0FDbUI7QUFBQTs7QUFDbEIsY0FBUSxHQUFSLENBQVksU0FBWjtBQUNBLFVBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLFVBQUksSUFBSixDQUFTLEtBQVQsRUFBZ0IsV0FBVyxhQUFhLE9BQWIsQ0FBcUIsVUFBckIsQ0FBM0I7QUFDQSxVQUFJLGtCQUFKLEdBQXlCLFlBQU07QUFDN0IsWUFBSSxJQUFJLFVBQUosSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsY0FBSSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQUksWUFBZixDQUFWO0FBQ0EsaUJBQUssUUFBTCxDQUFjO0FBQ1osMEJBQWMsSUFBSSxZQUROO0FBRVosaUJBQUssSUFBSSxHQUZHO0FBR1osc0JBQVUsSUFBSTtBQUhGLFdBQWQ7QUFLQSxrQkFBUSxHQUFSLENBQVksT0FBSyxLQUFqQjtBQUNEO0FBQ0YsT0FWRDtBQVdBLFVBQUksSUFBSjtBQUNEOzs7aUNBQ1ksS0FBSztBQUFBOztBQUNoQixhQUFPLFVBQUMsQ0FBRCxFQUFPO0FBQ1osWUFBSSxRQUFRLEVBQVo7QUFDQSxjQUFNLEdBQU4sSUFBYSxFQUFFLE1BQUYsQ0FBUyxLQUF0QjtBQUNBLGVBQUssUUFBTCxDQUFjLEtBQWQ7QUFDQSxnQkFBUSxHQUFSLENBQVksT0FBSyxLQUFqQjtBQUNELE9BTEQ7QUFNRDs7O2lDQUNZLEdBQUc7QUFBQTs7QUFDZCxRQUFFLGNBQUY7QUFDQSxjQUFRLEdBQVIsQ0FBWSxxQkFBWjtBQUNBO0FBQ0E7QUFDQSxVQUFJLE9BQU87QUFDVCxzQkFBYyxLQUFLLEtBQUwsQ0FBVyxZQURoQjtBQUVULGtCQUFVLEtBQUssS0FBTCxDQUFXO0FBRlosT0FBWDtBQUlBLFVBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLFVBQUksSUFBSixDQUFTLEtBQVQsRUFBZ0IsV0FBVyxhQUFhLE9BQWIsQ0FBcUIsVUFBckIsQ0FBM0I7QUFDQSxVQUFJLGtCQUFKLEdBQXlCLFlBQU07QUFDN0IsWUFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLElBQUksWUFBZixDQUFWO0FBQ0EsZ0JBQVEsR0FBUixDQUFZLEdBQVo7QUFDQSxlQUFLLFFBQUwsQ0FBYztBQUNaLDBCQUFnQixDQUFDLElBQUksT0FBSixHQUFjLFVBQWQsR0FBMkIsVUFBNUIsSUFBMEMsSUFBSTtBQURsRCxTQUFkO0FBR0QsT0FORDtBQU9BLFVBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsa0JBQXJDO0FBQ0EsVUFBSSxJQUFKLENBQVMsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFUO0FBQ0Q7Ozs2QkFDUTtBQUNQLFVBQUksS0FBSyxLQUFMLENBQVcsV0FBWCxJQUEwQixzQkFBOUIsRUFBc0Q7QUFDcEQsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFDSTtBQUFBO0FBQUEsVUFBSyxJQUFHLE1BQVI7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFLLGVBQUssS0FBTCxDQUFXLGNBQWhCO0FBQUE7QUFBQSxTQURBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUZBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUhBO0FBSUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBVyxpQkFBSyxLQUFMLENBQVc7QUFBdEIsV0FEQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQVUsaUJBQUssS0FBTCxDQUFXO0FBQXJCLFdBRkE7QUFJQTtBQUFBO0FBQUEsY0FBTyxTQUFRLGNBQWY7QUFBQTtBQUFBLFdBSkE7QUFLQTtBQUNFLGtCQUFLLFFBRFA7QUFFRSxnQkFBRyxjQUZMO0FBR0UsMEJBQWMsS0FBSyxLQUFMLENBQVcsWUFIM0I7QUFJRSxzQkFBVSxLQUFLLFlBQUwsQ0FBa0IsY0FBbEI7QUFKWixZQUxBO0FBWUE7QUFBQTtBQUFBLGNBQU8sU0FBUSxXQUFmO0FBQUE7QUFBQSxXQVpBO0FBY0E7QUFDRSxrQkFBSyxNQURQO0FBRUUsZ0JBQUcsV0FGTDtBQUdFLDBCQUFjLEtBQUssS0FBTCxDQUFXLFFBSDNCO0FBSUUsc0JBQVUsS0FBSyxZQUFMLENBQWtCLFVBQWxCO0FBSlosWUFkQTtBQXFCQSx5Q0FBTyxNQUFLLFFBQVosRUFBcUIsT0FBTSxjQUEzQixFQUEwQyxTQUFTLEtBQUssWUFBeEQ7QUFyQkE7QUFKQSxPQURKO0FBOEJEOzs7O0VBaEdnQyxNQUFNOztBQW1HekM7QUNyR0E7Ozs7Ozs7Ozs7SUFFTTs7O0FBQ0oscUJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHNIQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsWUFBTSxFQURLO0FBRVgsbUJBQWEsV0FGRjtBQUdYLG9CQUFjLEVBSEg7QUFJWCwwQkFBb0IsRUFKVDtBQUtYLHlCQUFtQjtBQUxSLEtBQWI7QUFPQSxVQUFLLElBQUwsR0FBWSxNQUFLLElBQUwsQ0FBVSxJQUFWLE9BQVo7QUFDQSxVQUFLLGlCQUFMLEdBQXlCLE1BQUssaUJBQUwsQ0FBdUIsSUFBdkIsT0FBekI7QUFWaUI7QUFXbEI7Ozs7d0NBRW1CO0FBQUE7O0FBQ2xCLGNBQVEsR0FBUixDQUFZLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUFaO0FBQ0EsVUFBSSxXQUFXLGFBQWEsT0FBYixDQUFxQixVQUFyQixDQUFmOztBQUVBLFVBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLFVBQUksTUFBTSxXQUFXLFFBQXJCOztBQUVBLGNBQVEsR0FBUixDQUFZLEdBQVo7O0FBRUEsVUFBSSxJQUFKLENBQVMsS0FBVCxFQUFnQixHQUFoQjtBQUNBLFVBQUksa0JBQUosR0FBeUIsWUFBTTtBQUM3QixZQUFJLElBQUksVUFBSixJQUFrQixDQUF0QixFQUF5QjtBQUN2QixjQUFJLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBSSxZQUFmLENBQVg7QUFDRSxpQkFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixLQUFLLENBQUwsQ0FBbEI7QUFDQSxpQkFBSyxRQUFMLENBQWM7QUFDWixrQkFBTSxPQUFLLEtBQUwsQ0FBVztBQURMLFdBQWQ7QUFHQSxrQkFBUSxHQUFSLENBQVksT0FBSyxLQUFMLENBQVcsSUFBdkI7QUFDSDtBQUNGLE9BVEQ7QUFVQSxVQUFJLElBQUo7O0FBRUEsaUJBQVcsZ0JBQVgsQ0FBNEIseUJBQTVCLEVBQXVELFVBQUMsV0FBRCxFQUFpQjtBQUNwRSxnQkFBUSxHQUFSLENBQVksV0FBWjtBQUNBO0FBQ0EsWUFBSSxlQUFlLFlBQVksWUFBL0I7QUFDQSxlQUFPLFlBQVksWUFBbkI7QUFDQSxlQUFLLEtBQUwsQ0FBVyxrQkFBWCxHQUFnQyxXQUFoQztBQUNBLGVBQUssS0FBTCxDQUFXLFlBQVgsR0FBMEIsWUFBMUI7QUFDQTtBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osd0JBQWMsT0FBSyxLQUFMLENBQVcsWUFEYjtBQUVaLDhCQUFvQixPQUFLLEtBQUwsQ0FBVztBQUZuQixTQUFkO0FBSUQsT0FaSDs7QUFjRSxpQkFBVyxnQkFBWCxDQUE0QiwwQkFBNUIsRUFDRSxVQUFDLFdBQUQsRUFBaUI7QUFDYixlQUFLLEtBQUwsQ0FBVyxpQkFBWCxHQUErQixXQUEvQjtBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osNkJBQW1CLE9BQUssS0FBTCxDQUFXO0FBRGxCLFNBQWQ7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNMLE9BVkQ7O0FBWUEsaUJBQVcsZ0JBQVgsQ0FBNEIsb0JBQTVCLEVBQWtELFVBQUMsTUFBRCxFQUFZO0FBQzVELFlBQUksU0FBUyxJQUFJLGNBQUosRUFBYjtBQUNBO0FBQ0EsWUFBSSxLQUFLLE9BQUssS0FBTCxDQUFXLGlCQUFYLENBQTZCLEdBQXRDO0FBQ0E7QUFDQSxZQUFJLE1BQU0sWUFBWSxPQUFLLEtBQUwsQ0FBVyxZQUF2QixHQUFzQyxTQUF0QyxHQUNWLEVBRFUsR0FDTCxHQURLLEdBQ0MsTUFEWDtBQUVBLGdCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0E7QUFDQSxlQUFPLElBQVAsQ0FBWSxLQUFaLEVBQW1CLEdBQW5CO0FBQ0EsZUFBTyxrQkFBUCxHQUE0QixZQUFNO0FBQ2hDLGNBQUksT0FBTyxVQUFQLElBQXFCLENBQXpCLEVBQTJCO0FBQ3pCLHVCQUFXLGFBQVgsQ0FBeUIsMEJBQXpCLEVBQ0EsS0FBSyxLQUFMLENBQVcsT0FBTyxZQUFsQixDQURBO0FBRUE7QUFDQTtBQUNBO0FBQ0Q7QUFDRixTQVJEO0FBU0EsZUFBTyxJQUFQO0FBQ0EsT0FwQkY7QUFxQkg7Ozt5QkFFSSxNQUFNO0FBQUE7O0FBQ1QsYUFBTyxVQUFDLENBQUQsRUFBTztBQUNYLFlBQUksY0FBYyxJQUFsQjtBQUNELGdCQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsZUFBSyxRQUFMLENBQWM7QUFDWix1QkFBYTtBQURELFNBQWQ7QUFHRCxPQU5EO0FBT0Q7Ozs2QkFFUTtBQUNQLGFBQ0k7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQVMsZUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixRQUF6QjtBQUFBO0FBQW1DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBbkMsU0FEQTtBQUVBO0FBQUE7QUFBQTtBQUFLLGVBQUssS0FBTCxDQUFXO0FBQWhCLFNBRkE7QUFHQTtBQUFBO0FBQUEsWUFBUSxTQUFTLEtBQUssSUFBTCxDQUFVLHNCQUFWLENBQWpCO0FBQUE7QUFBQSxTQUhBO0FBSUE7QUFBQTtBQUFBLFlBQVEsU0FBUyxLQUFLLElBQUwsQ0FBVSxhQUFWLENBQWpCO0FBQUE7QUFBQSxTQUpBO0FBTUEsNEJBQUMsV0FBRCxJQUFhLGFBQWUsS0FBSyxLQUFMLENBQVcsV0FBdkMsR0FOQTtBQU9FLDRCQUFDLGNBQUQ7QUFDRSx1QkFBZSxLQUFLLEtBQUwsQ0FBVztBQUQ1QixVQVBGO0FBVUUsNEJBQUMscUJBQUQ7QUFDRSx1QkFBZSxLQUFLLEtBQUwsQ0FBVyxXQUQ1QjtBQUVFLHdCQUFnQixLQUFLLEtBQUwsQ0FBVztBQUY3QixVQVZGO0FBY0UsNEJBQUMsc0JBQUQ7QUFDRSx3QkFBYyxLQUFLLEtBQUwsQ0FBVyxZQUQzQjtBQUVFLHVCQUFhLEtBQUssS0FBTCxDQUFXLFdBRjFCO0FBR0Usd0JBQWMsS0FBSyxLQUFMLENBQVc7QUFIM0IsVUFkRjtBQW1CSSw0QkFBQyxvQkFBRDtBQUNFLHVCQUFlLEtBQUssS0FBTCxDQUFXLFdBRDVCO0FBRUUsd0JBQWdCLEtBQUssS0FBTCxDQUFXO0FBRjdCLFVBbkJKO0FBdUJJLDRCQUFDLDRCQUFEO0FBQ0UsdUJBQWEsS0FBSyxLQUFMLENBQVcsV0FEMUI7QUFFRSx1QkFBYyxLQUFLLEtBQUwsQ0FBVztBQUYzQixVQXZCSjtBQTJCQSw0QkFBQyxvQkFBRCxJQUFzQixhQUFlLEtBQUssS0FBTCxDQUFXLFdBQWhEO0FBM0JBLE9BREo7QUErQkQ7Ozs7RUEvSHFCLE1BQU07O0FBa0k5QixJQUFJLFdBQVcsU0FBUyxNQUFULENBQWlCLG9CQUFDLFNBQUQsT0FBakIsRUFBK0IsU0FBUyxjQUFULENBQXdCLFNBQXhCLENBQS9CLENBQWYiLCJmaWxlIjoicmVhY3RDb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJhY2tfdG9fSG9tZV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCl7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0hvbWVfUGFnZSc7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiaG9tZV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBCYWNrXG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogRGlzcGF0Y2hlci8gUmVhY3RvciBwYXR0ZXJuIG1vZGVsXG4gKlxuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTMwODM3MS9jdXN0b20tZXZlbnRzLW1vZGVsLVxuICogd2l0aG91dC11c2luZy1kb20tZXZlbnRzLWluLWphdmFzY3JpcHRcbiAqXG4gKiBIb3cgaXQgd29ya3M6XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFJlZ2lzdGVyIGV2ZW50cy4gQW4gZXZlbnQgaXMgYmFzaWNhbGx5IGEgcmVwb3NpdG9yeSBvZiBjYWxsYmFjayBmdW5jdGlvbnMuXG4gKiBDYWxsIHRoZSBldmVudCB0byBjYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbnMuIFxuICogSG93IHRvIGNhbGwgdGhlIGV2ZW50PyBVc2UgRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50X25hbWUpXG4gKiBcbiAqIEEgRGlzcGF0Y2hlciBpcyBhIGxpc3Qgb2YgRXZlbnRzLiBTbyBjYWxsaW5nIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudFxuICogYmFzaWNhbGx5IGZpbmRzIHRoZSBldmVudCBpbiB0aGUgRGlzcGF0Y2hlciBhbmQgY2FsbHMgaXRcbiAqXG4gKiBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQgLS0+IGNhbGxzIHRoZSBFdmVudCAtLS0+IGNhbGxzIHRoZSBjYWxsYmFja1xuICogZnVuY3Rpb24ocykgb2YgdGhlIEV2ZW50LiBcbiAqXG4gKiBIb3cgZG8gd2Ugc2V0IHRoZSBjYWxsYmFjayBmdW5jdGlvbnMgb2YgdGhlIEV2ZW50PyBVc2UgYWRkRXZlbnRMaXN0ZW5lci5cbiAqIGFkZEV2ZW50TGlzdGVuZXIgaXMgcmVhbGx5IGEgbWlzbm9tZXIsIGl0IHNob3VsZCBiZSBjYWxsZWQgYWRkQ2FsbEJhY2suXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgZGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbmZ1bmN0aW9uIEV2ZW50KG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5jYWxsYmFja3MgPSBbXTtcbn07XG5cbkV2ZW50LnByb3RvdHlwZS5yZWdpc3RlckNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbn07XG5cbmZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gIHRoaXMuZXZlbnRzID0ge31cbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyRXZlbnQgPSBmdW5jdGlvbihldmVudF9uYW1lKSB7XG4gIHZhciBldmVudCA9IG5ldyBFdmVudChldmVudF9uYW1lKTtcbiAgdGhpcy5ldmVudHNbZXZlbnRfbmFtZV0gPSBldmVudDtcbiAgLy8gY29uc29sZS5sb2codGhpcy5ldmVudHMpO1xufVxuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSwgZXZlbnRfYXJndW1lbnRzKXtcbiAgdGhpcy5ldmVudHNbZXZlbnRfbmFtZV0uY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayhldmVudF9hcmd1bWVudHMpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdkaXNwYXRjaGVkJyk7XG4gICAgLy8gY29uc29sZS5sb2coY2FsbGJhY2ssIGV2ZW50X2FyZ3VtZW50cyk7XG4gIH0pO1xufTtcblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGNhbGxiYWNrKSB7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLnJlZ2lzdGVyQ2FsbGJhY2soY2FsbGJhY2spO1xuICAvLyBjb25zb2xlLmxvZyhjYWxsYmFjayk7XG59O1xuXG4vKiAtLS0tLS0tLS0tLS0tXG4gKiBEaXNwYXRjaGVyIGV2ZW50c1xuICogLS0tLS0tLS0tLS0tLS0tLSovXG5cbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJyk7XG4vL1NlbmQgVHJhbnNhY3Rpb24gRGV0YWlscyBoYXMgYSBsaXN0ZW5lciBhdHRhY2hlZCB0byBpdCBcbi8vdGhhdCB0YWtlcyBpbiBhIEpTT04gb2JqZWN0IGFzIGEgcGFyYW1ldGVyLiBUaGlzIEpTT04gb2JqZWN0IGlzIHRoZSBcbi8vdHJhbnNhY3Rpb24uIFRoZW4gdGhlIERldGFpbCBWaWV3IFRhYmxlIHdpbGwgdXBkYXRlLiBcbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJylcbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgnc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnKTtcblxuXG5cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBBZGRfU3RvcmVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgX2lkOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgb3duZXI6IFtdLFxuICAgICAgY29udHJpYnV0b3JzX2lkczogW10sXG4gICAgICBjb250cmlidXRvcnM6IFtdLFxuICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkcy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0uX2lkKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycyk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnRyaWJ1dG9ycycpIHtcbiAgICAgICAgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVxLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBQT1NUIHJlcXVlc3QnKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSxcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiUE9TVFwiLCAgXCIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArICcvc3RvcmUnKTtcbiBcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuXG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTt0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhICcgOiAnRmFpbHVyZSEgJykgKyByZXMubWVzc2FnZSBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSAgICAgIFxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBsZXQgYyA9IHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnQ7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICByb3dzLnB1c2goXG4gICAgICAgICAgPHRyXG4gICAgICAgICAgaWQ9e2l9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgICAgPHRkPntjW2ldLnVzZXJuYW1lfTwvdGQ+XG4gICAgICAgICAgPHRkPntjW2ldLnBob25lX251bWJlcn08L3RkPlxuICAgICAgICAgIDwvdHI+KVxuICAgIH1cblxuICAgIHZhciBjb250cmlidXRvcnMgPSBbXTtcbiAgICBsZXQgZCA9IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb250cmlidXRvcnMucHVzaChcbiAgICAgICAgICA8bGkgaWQ9e2l9PlxuICAgICAgICAgICAge2RbaV0udXNlcm5hbWV9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnQWRkX1N0b3JlX1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+QWRkIHN0b3JlPC9oMT5cbiAgICAgICAgPGZvcm0+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlfTwvcD5cbiAgICAgICAgPHA+U3RvcmUgbmFtZToge3RoaXMuc3RhdGUubmFtZX08L3A+XG4gICAgICAgIDxwPk93bmVyOiB7dGhpcy5zdGF0ZS5vd25lci51c2VybmFtZX08L3A+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgQ29udHJpYnV0b3JzOlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICB7Y29udHJpYnV0b3JzfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+U3RvcmUgbmFtZTwvbGFiZWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgaWQ9J25hbWUnIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5uYW1lfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnbmFtZScpfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgPGRpdiBpZCA9ICdzZWFyY2gnPlxuICAgICAgICA8bGFiZWwgaHRtbEZvciA9J3NlYXJjaF9jb250cmlidXRvcnMnPkNvbnRyaWJ1dG9yczwvbGFiZWw+XG5cbiAgICAgICAgPHVsPlxuICAgICAgICB7Y29udHJpYnV0b3JzfVxuICAgICAgICA8L3VsPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGlkID0gJ3NlYXJjaF9jb250cmlidXRvcnMnXG4gICAgICAgICAgdHlwZT0nc2VhcmNoJyBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ2NvbnRyaWJ1dG9ycycpfSBcbiAgICAgICAgLz5cbiAgICAgICAgXG4gICAgICAgIDx0YWJsZSBpZCA9IFwib3V0cHV0X2NvbnRlbnRcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICA8dHI+PHRkPkRpc3BsYXkgbmFtZTwvdGQ+PHRkPlBob25lIG51bWJlcjwvdGQ+PC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICB7cm93c31cbiAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICAgXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gKlxuICogQWRkIFRyYW5zYWN0aW9uIEZvcm0gUGFnZSBcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgQWRkX0l0ZW1fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIHRoaXMucHJvcHMuQ2xpY2soKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9pdGVtX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIEFkZCBuZXcgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxudmFyIFJlbW92ZV9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyZW1vdmVfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBSZW1vdmUgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxuXG52YXIgQWRkX1RyYW5zYWN0aW9uX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIHJldHVybiAgKHtcbiAgICBpdGVtX2NvdW50OiAxLFxuICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgbmFtZTogJycsXG4gICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG4gICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6ICdtb250aCdcbiAgICB9KVxuICB9LFxuICBoYW5kbGVBZGRDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMucHVzaCh7aXRlbV9uYW1lOiAnJywgaXRlbV9hbW91bnQ6ICcnfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQgKyAxLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5pdGVtX2NvdW50O1xuICB9LCAgXG4gIGhhbmRsZVJlbW92ZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgdGhpcy5zdGF0ZS5pdGVtcy5zcGxpY2UoLTEsIDEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuaXRlbXMpO1xuICAgIGlmICh0aGlzLnN0YXRlLml0ZW1fY291bnQgPT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLml0ZW1fY291bnQgLS07XG4gICAgfVxuICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3RhdGUuaXRlbV9jb3VudCA+PSAwKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1fY291bnQ6IHRoaXMuc3RhdGUuaXRlbV9jb3VudCxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7ICAgIFxuICAgIHZhciBkYXRhID0gIHtcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIC8vU3RyaXAgcGhvbmUgbnVtYmVyIGlucHV0cy5cbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIucmVwbGFjZSgvIC9nLCAnJyksXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtcyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIsXG4gICAgICBleHBpcnlfZGF0ZV9zZWxlY3RvcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvclxuICAgIH07XG4gICAgXG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5uYW1lKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICBcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbihcIlBPU1RcIiwgXCIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArIFwiL3N0b3JlL1wiICsgdGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkICsgXCIvdHJhbnNcIik7XG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHJlcXVlc3Quc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgXG4gICAgLy9DbGVhciBldmVyeXRoaW5nLi4uXG4gICAgXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiAxLFxuICAgICAgaXRlbXM6IFt7bmFtZTogJycsIGFtb3VudDogJyd9XSxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogMSxcblxuICAgIH0pO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgaGFuZGxlQ2hhbmdlOiBmdW5jdGlvbihrZXksIG5hbWUsIGFtb3VudCl7XG4gICAgLy8gY29uc29sZS5sb2coa2V5LCBpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnN0YXRlLml0ZW1zW2tleV0ubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLmFtb3VudCA9IGFtb3VudDtcbiAgICAvLyBjb25zb2xlLmxvZyhpdGVtX25hbWUsIGl0ZW1fYW1vdW50KTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZU5hbWVDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB0aGlzLnN0YXRlLm5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuYW1lOiB0aGlzLnN0YXRlLm5hbWVcbiAgICB9KTtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUubmFtZSk7XG4gIH0sXG4gIGhhbmRsZVBob25lTm9DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyXG4gICAgfSk7XG4gIH0sXG4gIGhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfbnVtYmVyOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6IHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfc2VsZWN0b3JcbiAgICB9KTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdBZGRfVHJhbnNfUGFnZScpO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5pdGVtX2NvdW50OyBpKyspIHtcbiAgICAgIGl0ZW1zLnB1c2goPEl0ZW0gcmVhY3Rfa2V5PXtpfSBrZXk9e2l9IHZhbHVlcz17dGhpcy5zdGF0ZS5pdGVtc1tpXX1cbiAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gLz4pXG4gICAgfTtcbiAgICByZXR1cm4oXG4gICAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxmb3JtPlxuICAgICAgPGgxPkFkZCBuZXcgbG9hbjwvaDE+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwibmFtZVwiPk5hbWU8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgbmFtZT1cIm5hbWVcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdOYW1lJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5uYW1lfSBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVOYW1lQ2hhbmdlfSBcbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXI8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgdHlwZSA9J3RlbCcgXG4gICAgICAgICAgbmFtZT1cInBob25lX251bWJlclwiIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPSdQaG9uZSBudW1iZXInIFxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnBob25lX251bWJlcn0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUGhvbmVOb0NoYW5nZX1cbiAgICAgICAgICByZXF1aXJlZD5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJleHBpcnlfZHVyYXRpb25fbnVtYmVyXCI+RXhwaXJ5IGRhdGU8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICAvL2NsYXNzTmFtZSA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIGlkID0gJ2hhbGYtd2lkdGgnXG4gICAgICAgICAgdHlwZSA9ICdudW1iZXInXG4gICAgICAgICAgbmFtZSA9ICdleHBpcnlfZHVyYXRpb25fbnVtYmVyJ1xuICAgICAgICAgIHBsYWNlaG9sZGVyID0gJzEnXG4gICAgICAgICAgdmFsdWUgPSB7dGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RGF0ZU51bWJlckNoYW5nZX1cbiAgICAgICAgICBtaW4gPSBcIjFcIlxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgID5cbiAgICAgICAgPC9pbnB1dD5cbiAgICAgICAgPHNlbGVjdCBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZX1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9XCJtb250aFwiIFxuICAgICAgICAgIG5hbWU9XCJleHBpcnlfZHVyYXRpb25fc2VsZWN0b3JcIlxuICAgICAgICA+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRheVwiPmRheTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3ZWVrXCI+d2Vlazwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtb250aFwiPm1vbnRoPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8QWRkX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZUFkZENsaWNrfS8+XG4gICAgICAgIDxSZW1vdmVfSXRlbV9CdXR0b24gQ2xpY2s9e3RoaXMuaGFuZGxlUmVtb3ZlQ2xpY2t9Lz5cbiAgICAgICAgPHRhYmxlPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0aD5JdGVtIG5hbWU8L3RoPlxuICAgICAgICAgICAgPHRoPkl0ZW0gYW1vdW50PC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAge2l0ZW1zfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdBZGQgbG9hbicgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9PjwvaW5wdXQ+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn0pXG5cbnZhciBJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3MoeyAgXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgLy9DYWxscyB0aGUgZnVuY3Rpb24gb25DaGFuZ2UgaW4gQWRkX1RyYW5zYWN0aW9uX0Zvcm0gdG8gbXV0YXRlIHRoZSBzdGF0ZSBpbiB0aGUgcGFyZW50LiBcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMucHJvcHMucmVhY3Rfa2V5LCB0aGlzLnJlZnMubmFtZS52YWx1ZSxcbiAgICB0aGlzLnJlZnMuYW1vdW50LnZhbHVlKTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMucHJvcHMudmFsdWVzKTtcbiAgICByZXR1cm4oXG4gICAgICA8dHIgaGVpZ2h0PVwiMjBweFwiPlxuICAgICAgPHRkPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgcmVxdWlyZWRcbiAgICAgICAgICB0eXBlID0gJ3RleHQnIFxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiSXRlbSBuYW1lXCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMubmFtZX0gXG4gICAgICAgICAgcmVmPVwibmFtZVwiXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfVxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICA8L3RkPlxuICAgICAgPHRkPlxuICAgICAgPGlucHV0IFxuICAgICAgICB0eXBlID0gJ251bWJlcicgXG4gICAgICAgIG1pbj0gXCIxXCJcbiAgICAgICAgcGxhY2Vob2xkZXIgPSBcIkFtb3VudFwiXG4gICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnZhbHVlcy5hbW91bnR9XG4gICAgICAgIHJlZj1cImFtb3VudFwiXG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgcmVxdWlyZWQ+XG4gICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogVHJhbnNhY3Rpb24gVmlldyBEZXRhaWwgcGFnZVxuICpcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpe1xuICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZScpIHtcbiAgICByZXR1cm4obnVsbCk7XG4gIH1cbiAgZWxzZSB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcbiAgcmV0dXJuKFxuICAgIDxkaXYgY2xhc3MgPVwicGFnZVwiPlxuICAgICAgPGgxPkxvYW5zIHZpZXcgKGRldGFpbCk8L2gxPlxuICAgICAgPFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSB0cmFuc2FjdGlvbj17dGhpcy5wcm9wcy50cmFuc2FjdGlvbn0vPlxuICAgICAgPFJldHVybl9JdGVtc19CdXR0b24gLz5cbiAgICAgIDxSZW5ld19UcmFuc2FjdGlvbl9CdXR0b24gLz5cbiAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgPC9kaXY+XG4gICAgKVxuICB9IFxuICAgXG4gIH1cbn0pO1xuXG52YXIgUmV0dXJuX0l0ZW1zX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmV0dXJuJyk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJldHVybiBpdGVtczwvYnV0dG9uPlxuICApXG4gfSBcbn0pO1xuXG52YXIgUmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljaygpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicsICdyZW5ldycpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+UmVuZXcgbG9hbjwvYnV0dG9uPilcbiB9IFxufSlcblxuXG52YXIgVHJhbnNhY3Rpb25fRGV0YWlsX1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIGxldCB0cmFuc2FjdGlvbiA9IHRoaXMucHJvcHMudHJhbnNhY3Rpb247XG4gICAgICB2YXIgYWxsX2l0ZW1zID0gW107XG4gICAgICBmb3IgKHZhciBpdGVtIGluIHRyYW5zYWN0aW9uLml0ZW1zKSB7XG4gICAgICAgIGFsbF9pdGVtcy5wdXNoKFxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkl0ZW0gTmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5uYW1lfTwvdGQ+XG4gICAgICAgICAgPHRoPk5vLjwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5pdGVtc1tpdGVtXS5hbW91bnR9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICAgICAgfVxuICByZXR1cm4gKFxuICAgIDx0YWJsZSBpZD1cInRyYW5zYWN0aW9uX2RldGFpbF90YWJsZVwiPlxuICAgICAgPHRib2R5PlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5leHBpcnlfZGF0ZS5zdWJzdHJpbmcoMCwxMCl9PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5SZXR1cm5lZDwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5yZXR1cm5lZC50b1N0cmluZygpfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgPHRkPnt0cmFuc2FjdGlvbi5uYW1lfTwvdGQ+XG4gICAgICAgIDwvdHI+XG5cbiAgICAgICAge2FsbF9pdGVtc31cbiAgICAgIDwvdGJvZHk+XG4gICAgPC90YWJsZT5cbiAgKVxuICB9XG59KVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9ucyBWaWV3IFBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi8gXG5cbnZhciBUcmFuc2FjdGlvbnNfVmlld19QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSBcIlRyYW5zYWN0aW9uc19WaWV3X1BhZ2VcIikge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFdoZW4gdGhpcyBwYWdlIGxvYWRzXG4gICAgICByZXR1cm4gIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlXCI+XG4gICAgICAgIDxoMT4gTG9hbnMgb3ZlcnZpZXcgZm9yIHt0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5uYW1lfTwvaDE+XG4gICAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZSB0cmFuc2FjdGlvbnMgPSB7dGhpcy5wcm9wcy50cmFuc2FjdGlvbnN9IC8+XG4gICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICAgIDxCYWNrX3RvX0hvbWVfQnV0dG9uIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxufSlcblxudmFyIEFkZF9UcmFuc2FjdGlvbl9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1RyYW5zYWN0aW9uX1BhZ2UnO1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3RyYW5zYWN0aW9uX2J1dHRvblwiXG4gICAgICBvbkNsaWNrPXsgdGhpcy5oYW5kbGVDbGljayB9PlxuICAgICAgQWRkIG5ldyBsb2FuXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnByb3BzLnRyYW5zYWN0aW9ucyk7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcHMudHJhbnNhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTtcbiAgICAgIHJvd3MucHVzaCg8VGFibGVfUm93IGtleT17aX0gdmFsdWVzPXt0aGlzLnByb3BzLnRyYW5zYWN0aW9uc1tpXX0vPilcbiAgICB9XG4gXG4gICAgXG4gICAgcmV0dXJuIChcbiAgICAgIDx0YWJsZT5cbiAgICAgIDxUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93IC8+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIClcbiAgfVxufSk7XG5cbnZhciBUcmFuc2FjdGlvbl9UYWJsZV9IZWFkZXJfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIChcbiAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPlxuICAgICAgICA8dGg+RGF0ZTwvdGg+XG4gICAgICAgIDx0aD5FeHBpcnkgRGF0ZTwvdGg+XG4gICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgPHRoPlBob25lIE51bWJlcjwvdGg+XG4gICAgICAgIDwvdHI+XG4gICAgICA8L3RoZWFkPlxuICAgIClcbiAgfVxufSlcblxuXG52YXIgVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnO1xuXG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCB0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgZnVuY3Rpb24gZGF5c190aWxsX2V4cGlyeShkYXRlKSB7XG4gICAgICB2YXIgZV9kID0gRGF0ZS5wYXJzZShkYXRlKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGVfZCAtIERhdGUubm93KCkpO1xuICAgICAgLy8gY29uc29sZS5sb2coTWF0aC5jZWlsKChlX2QgLSBEYXRlLm5vdygpKS8oMTAwMCo2MCo2MCoyNCkpKVxuICAgICAgcmV0dXJuKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIHBhcnNlX2RhdGUoZGF0ZSl7XG4gICAgICByZXR1cm4oZGF0ZS5zdWJzdHJpbmcoMCwxMCkpO1xuICAgIH07XG4gICB2YXIgc3RhdHVzID0gZGF5c190aWxsX2V4cGlyeSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSk7XG4gICB2YXIgdHJfc3R5bGUgPSB7XG4gICAgXG4gICB9XG4gICBpZiAodGhpcy5wcm9wcy52YWx1ZXMucmV0dXJuZWQgPT09IHRydWUpIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgdGV4dERlY29yYXRpb246ICdsaW5lLXRocm91Z2gnLFxuICAgICAgIGNvbG9yOiAnaHNsKDMwLCA0JSwgNzYlKSdcbiAgICAgfVxuICAgfVxuICAgZWxzZSBpZiAoc3RhdHVzIDw9IDApIHtcbiAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDAsIDk3JSwgNjglKSdcbiAgICAgfVxuICAgfVxuICAgIGVsc2UgaWYgKHN0YXR1cyA8PSAzKSB7XG4gICAgICB0cl9zdHlsZSA9IHtcbiAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdoc2woMzAsIDc4JSwgNjMlKScgIFxuICAgICAgfVxuICAgICB9XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIHN0eWxlPXt0cl9zdHlsZX0gb25DbGljaz0ge3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICA8dGQ+e3BhcnNlX2RhdGUodGhpcy5wcm9wcy52YWx1ZXMuZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmV4cGlyeV9kYXRlKX08L3RkPlxuICAgICAgICA8dGQ+e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgIDwvdHI+XG4gICAgKVxuICB9XG59KVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIFN0b3JlX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgX2lkOiAnJyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgb3duZXI6IFtdLFxuICAgICAgY29udHJpYnV0b3JzX2lkczogW10sXG4gICAgICBjb250cmlidXRvcnM6IFtdLFxuICAgICAgb3V0cHV0X2NvbnRlbnQ6IFtdLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMub25SZW5kZXIgPSB0aGlzLm9uUmVuZGVyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDbGljayA9IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIG9uUmVuZGVyKCkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBcIi9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyBcbiAgICAgIHRoaXMucHJvcHMuYWN0aXZlX3N0b3JlLl9pZCArIFwiL21hbmFnZVwiKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIC8vIEZpcnN0IGl0ZW0gaXMgdGhlIHN0b3JlIG9iamVjdCwgXG4gICAgICAgIC8vIHNlY29uZCB0aGUgb3duZXIgb2JqZWN0LFxuICAgICAgICAvLyB0aGlyZCBpdGVtIHRoZSBhcnJheSBvZiBjb250cmlidXRvcnNcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgX2lkOiByZXNbMF0uX2lkLFxuICAgICAgICAgIG5hbWU6IHJlc1swXS5uYW1lLFxuICAgICAgICAgIGNvbnRyaWJ1dG9yc19pZHM6IHJlc1swXS5jb250cmlidXRvcnMsXG4gICAgICAgICAgb3duZXI6IHJlc1sxXSxcbiAgICAgICAgICBjb250cmlidXRvcnM6IHJlc1syXVxuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIHRoaXMuc3RhdGUuY29udHJpYnV0b3JzX2lkcy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0uX2lkKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICBjb250cmlidXRvcnM6IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzXG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycyk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnRyaWJ1dG9ycycpIHtcbiAgICAgICAgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmVxLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIC8vU2VuZCBhIFBVVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAvLyBQVVQgLzpfc3RvcmVfaWQvbWFuYWdlXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBVVCByZXF1ZXN0Jyk7XG4gICAgLy9TZW5kIGEgUE9TVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAvLyBUaGUgc2VydmVyIG5lZWRzIHRvIGNoZWNrIHRoYXQgdGhpcyBwaG9uZSBudW1iZXIgaXNuJ3QgYWxyZWFkeSB1c2VkXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBfdXNlcl9pZDogdGhpcy5zdGF0ZS5fdXNlcl9pZCxcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiUFVUXCIsICBcIi9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyBcbiAgICAgIHRoaXMucHJvcHMuX2lkICsgXCIvbWFuYWdlXCIpO1xuIFxuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG5cbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO3RoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEnIDogJ0ZhaWx1cmUhJykgKyByZXMubWVzc2FnZSBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSAgICAgIFxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBsZXQgYyA9IHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnQ7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICByb3dzLnB1c2goXG4gICAgICAgICAgPHRyXG4gICAgICAgICAgaWQ9e2l9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja30+XG4gICAgICAgICAgPHRkPntjW2ldLnVzZXJuYW1lfTwvdGQ+XG4gICAgICAgICAgPHRkPntjW2ldLnBob25lX251bWJlcn08L3RkPlxuICAgICAgICAgIDwvdHI+KVxuICAgIH1cblxuICAgIHZhciBjb250cmlidXRvcnMgPSBbXTtcbiAgICBsZXQgZCA9IHRoaXMuc3RhdGUuY29udHJpYnV0b3JzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb250cmlidXRvcnMucHVzaChcbiAgICAgICAgICA8bGkgaWQ9e2l9PlxuICAgICAgICAgICAge2RbaV0udXNlcm5hbWV9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnU3RvcmVfTWFuYWdlbWVudF9QYWdlJykge1xuICAgICAgcmV0dXJuIChudWxsKTtcbiAgICB9XG5cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMub25SZW5kZXIoKTtcbiAgICAgIHJldHVybihcbiAgICAgICAgPGRpdiBpZD1cImJvZHlcIj5cbiAgICAgICAgPGgxPkNoYW5nZSBzdG9yZSBkZXRhaWxzPC9oMT5cbiAgICAgICAgPGZvcm0+XG4gICAgICAgIDxwPnt0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlfTwvcD5cbiAgICAgICAgPHA+U3RvcmUgbmFtZToge3RoaXMuc3RhdGUubmFtZX08L3A+XG4gICAgICAgIDxwPk93bmVyOiB7dGhpcy5zdGF0ZS5vd25lci51c2VybmFtZX08L3A+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgQ29udHJpYnV0b3JzOlxuICAgICAgICAgIDx1bD5cbiAgICAgICAgICB7Y29udHJpYnV0b3JzfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJuYW1lXCI+U3RvcmUgbmFtZTwvbGFiZWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgaWQ9J25hbWUnIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5uYW1lfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnbmFtZScpfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgPGRpdiBpZCA9ICdzZWFyY2gnPlxuICAgICAgICA8bGFiZWwgaHRtbEZvciA9J3NlYXJjaF9jb250cmlidXRvcnMnPkNvbnRyaWJ1dG9yczwvbGFiZWw+XG5cbiAgICAgICAgPHVsPlxuICAgICAgICB7Y29udHJpYnV0b3JzfVxuICAgICAgICA8L3VsPlxuXG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGlkID0gJ3NlYXJjaF9jb250cmlidXRvcnMnXG4gICAgICAgICAgdHlwZT0nc2VhcmNoJyBcbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ2NvbnRyaWJ1dG9ycycpfSBcbiAgICAgICAgLz5cbiAgICAgICAgXG4gICAgICAgIDx0YWJsZSBpZCA9IFwib3V0cHV0X2NvbnRlbnRcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICA8dHI+IDx0ZD5EaXNwbGF5IG5hbWU8L3RkPjx0ZD5QaG9uZSBudW1iZXI8L3RkPjwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICAgIFxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgXG4gICAgfVxuICB9XG59XG5cbiIsIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBcbiAqIFN0b3JlcyB0YWJsZSBhbmQgcGFnZVxuICogXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgU3RvcmVzX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZXNfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgPFN0b3Jlc19UYWJsZSAvPlxuICAgICAgPEFkZF9TdG9yZV9CdXR0b24gb25DbGljayA9IHt0aGlzLmhhbmRsZUNsaWNrfS8+XG5cbiAgICAgIDwvZGl2PlxuICAgIClcblxuICAgIH1cbiAgfVxufSlcblxudmFyIEFkZF9TdG9yZV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1N0b3JlX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3N0b3JlX2J1dHRvblwiIFxuICAgICAgICBvbkNsaWNrID0ge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgICAgQWRkIG5ldyBzdG9yZVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKVxuICB9XG59KVxuXG5cbnZhciBTdG9yZXNfVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh7XG4gICAgICBzdG9yZXM6IFtdLFxuICAgICAgdXNlcnM6IFtdXG4gICAgfSk7XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgdmFyIF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG4gICAgdmFyIHJlcXVlc3RfdXJsID0gJy8nICsgX3VzZXJfaWQgKyAnL3N0b3JlJztcblxuICAgIHZhciBnZXQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBnZXQub3BlbihcIkdFVFwiLCByZXF1ZXN0X3VybCk7XG4gICAgZ2V0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChnZXQucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPSycpO1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShnZXQucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdG9yZXM6IHJlcy5zdG9yZXMsXG4gICAgICAgICAgdXNlcnM6IHJlcy51c2Vyc1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgfVxuICAgIGdldC5zZW5kKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUuc3RvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTsgXG4gICAgICB2YXIgdXNlciA9IHRoaXMuc3RhdGUudXNlcnNbaV07XG4gICAgICBpZiAodXNlciA9PT0gdW5kZWZpbmVkKSB7IHVzZXIgPSBudWxsOyB9XG5cbiAgICAgICAgcm93cy5wdXNoKFxuXG4gICAgICAgICAgPFN0b3Jlc19UYWJsZV9Sb3cgXG4gICAgICAgICAgICBrZXk9e2l9IFxuICAgICAgICAgICAgc3RvcmU9e3RoaXMuc3RhdGUuc3RvcmVzW2ldfSBcbiAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4oXG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIDx0aD5TdG9yZTwvdGg+XG4gICAgICAgICAgICAgIDx0aD5Pd25lcjwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICB7cm93c31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICApXG4gIH1cbn0pXG5cbnZhciBTdG9yZXNfVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRUcmFuc2FjdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgKFwiL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIFxuICAgICAgICAgICAgdGhpcy5wcm9wcy5zdG9yZS5faWQgKyBcIi90cmFuc1wiKSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAvLyBJIGhhdmUgdG8gcGFzcyB0aGlzIFwicmVzXCIgdG8gdGhlIHJlYWxwYWdlIG9yIHRyYW5zIHZpZXcgcGFnZVxuICAgICAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSc7XG4gICAgICAgIHJlcy5hY3RpdmVfc3RvcmUgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJywgKHJlcykpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlcS5zZW5kKCk7XG4gIH0sXG4gIG1hbmFnZVN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSBcIlN0b3JlX01hbmFnZW1lbnRfUGFnZVwiO1xuICAgIGxldCBhY3RpdmVfc3RvcmUgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2UsIGFjdGl2ZV9zdG9yZTogYWN0aXZlX3N0b3JlfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHRyPlxuICAgICAgICA8dGQgb25DbGljayA9IHt0aGlzLmdldFRyYW5zYWN0aW9uc30+eyB0aGlzLnByb3BzLnN0b3JlLm5hbWUgfTwvdGQ+XG4gICAgICAgIDx0ZCBvbkNsaWNrID0ge3RoaXMuZ2V0VHJhbnNhY3Rpb25zfT57IHRoaXMucHJvcHMudXNlci51c2VybmFtZSB9PC90ZD5cbiAgICAgICAgPHRkPjxidXR0b24gb25DbGljayA9IHt0aGlzLm1hbmFnZVN0b3JlfT5FZGl0PC9idXR0b24+PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICB9XG59KVxuXG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgVXNlcl9NYW5hZ2VtZW50X1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgLy9XaGVuIGNvbXBvbmVudCBtb3VudHMsIHNlbmQgYSBHRVQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIHBvcHVsYXRlXG4gICAgICAvL3RoZXNlIGZpZWxkcyBcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBfaWQ6ICcnLFxuICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZygnbW91bnRlZCcpO1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGhvbmVfbnVtYmVyOiByZXMucGhvbmVfbnVtYmVyLFxuICAgICAgICAgIF9pZDogcmVzLl9pZCxcbiAgICAgICAgICB1c2VybmFtZTogcmVzLnVzZXJuYW1lXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICAvL1NlbmQgYSBQT1NUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFRoZSBzZXJ2ZXIgbmVlZHMgdG8gY2hlY2sgdGhhdCB0aGlzIHBob25lIG51bWJlciBpc24ndCBhbHJlYWR5IHVzZWRcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIsXG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZVxuICAgIH1cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJQVVRcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEnIDogJ0ZhaWx1cmUhJykgKyByZXMubWVzc2FnZSBcbiAgICAgIH0pO1xuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdVc2VyX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8cD4ge3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9IDwvcD5cbiAgICAgICAgPGgxPkNoYW5nZSB1c2VyIGRldGFpbHM8L2gxPlxuICAgICAgICA8cD5JZiB5b3UgY2hhbmdlIHlvdXIgcGhvbmUgbnVtYmVyLCB5b3UgY2FuIGVkaXQgaXQgaGVyZS48L3A+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD5QaG9uZToge3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfTwvcD5cbiAgICAgICAgPHA+VXNlcjoge3RoaXMuc3RhdGUudXNlcm5hbWV9PC9wPlxuICAgICAgICBcbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXIgKGxvZ2luIHdpdGggdGhpcyk8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSdudW1iZXInIFxuICAgICAgICAgIGlkPSdwaG9uZV9udW1iZXInIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdwaG9uZV9udW1iZXInKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj0ndXNlcl9uYW1lJz5OYW1lOiBPdGhlcnMgY2FuIHVzZSB0aGlzIHRvIGZpbmQgeW91LiBDaG9vc2UgYVxuICAgICAgICBuYW1lIHRoYXQgaXMgZWFzaWx5IHJlY29nbmlzYWJsZSBhbmQgbm90IHRvbyBjb21tb24uPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIGlkPVwidXNlcl9uYW1lXCIgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnVzZXJuYW1lfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgndXNlcm5hbWUnKX1cbiAgICAgICAgICAvPlxuXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgfVxufVxuXG4vLyBSZWFjdERPTS5yZW5kZXIoIDxVc2VyX01hbmFnZW1lbnRfUGFnZS8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpICk7XG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgSG9tZV9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXI6IHt9LFxuICAgICAgYWN0aXZlX3BhZ2U6ICdIb21lIFBhZ2UnLFxuICAgICAgYWN0aXZlX3N0b3JlOiAnJyxcbiAgICAgIHN0b3JlX3RyYW5zYWN0aW9uczoge30sXG4gICAgICB0cmFuc2FjdGlvbl9zaG93bjoge31cbiAgICB9O1xuICAgIHRoaXMuZ29UbyA9IHRoaXMuZ29Uby5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgdmFyIF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG5cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IHVybCA9ICcvdXNlci8nICsgX3VzZXJfaWQ7XG4gIFxuICAgIGNvbnNvbGUubG9nKHVybCk7XG5cbiAgICByZXEub3BlbignR0VUJywgdXJsKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHVzZXIgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIHRoaXMuc3RhdGUudXNlciA9IHVzZXJbMF07XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB1c2VyOiB0aGlzLnN0YXRlLnVzZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnVzZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuXG4gICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycsIChzdG9yZV90cmFucykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhzdG9yZV90cmFucyk7XG4gICAgICAgIC8vRmlyc3QsIHRha2Ugb3V0IHRoZSBcImFjdGl2ZSBzdG9yZVwiXG4gICAgICAgIHZhciBhY3RpdmVfc3RvcmUgPSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIGRlbGV0ZSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICAgIHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zID0gc3RvcmVfdHJhbnM7XG4gICAgICAgIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlID0gYWN0aXZlX3N0b3JlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9ucyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGFjdGl2ZV9zdG9yZTogdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUsXG4gICAgICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9uc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycsXG4gICAgICAgICh0cmFuc2FjdGlvbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93biA9IHRyYW5zYWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQnKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3BhdGNoZXIuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlX3RyYW5zYWN0aW9uJywgKGFjdGlvbikgPT4ge1xuICAgICAgICB2YXIgdXBkYXRlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24uX2lkKTtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bi5faWQ7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgICAgbGV0IHVybCA9ICcvc3RvcmUvJyArIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlICsgJy90cmFucy8nICtcbiAgICAgICAgaWQgKyAnLycgKyBhY3Rpb247XG4gICAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIC8vIC90cmFucy9faWQvcmVuZXdcbiAgICAgICAgdXBkYXRlLm9wZW4oJ1BVVCcsIHVybCk7XG4gICAgICAgIHVwZGF0ZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgaWYgKHVwZGF0ZS5yZWFkeVN0YXRlID09IDQpe1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCBcbiAgICAgICAgICAgIEpTT04ucGFyc2UodXBkYXRlLnJlc3BvbnNlVGV4dCkpXG4gICAgICAgICAgICAvLyBXaHkgZG8gSSBldmVuIG5lZWQgdG8gZGlzcGF0Y2ggdGhpcyBldmVudCB0byBiZSBob25lc3RcbiAgICAgICAgICAgIC8vIEkgY2FuIG11dGF0ZSB0aGUgc3RhdGUgc3RyYWlnaHQgYXdheSBmcm9tIGhlcmUuIEFoIHdlbGxcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgaXQncyBjbGVhbmVyIHRvIGRvIHRoaXMuIERSWSBhZnRlciBhbGwuLi5cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZS5zZW5kKCk7XG4gICAgICAgfSk7XG4gIH1cblxuICBnb1RvKHBhZ2UpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgICBsZXQgYWN0aXZlX3BhZ2UgPSBwYWdlO1xuICAgICAgY29uc29sZS5sb2coYWN0aXZlX3BhZ2UpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2PlxuICAgICAgICA8aGVhZGVyPnt0aGlzLnN0YXRlLnVzZXIudXNlcm5hbWV9IDxidXR0b24+TG9nb3V0PC9idXR0b24+PC9oZWFkZXI+XG4gICAgICAgIDxoMT57dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX08L2gxPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuZ29UbygnVXNlcl9NYW5hZ2VtZW50X1BhZ2UnKX0+RWRpdCB1c2VyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5nb1RvKCdTdG9yZXNfUGFnZScpfT5WaWV3IHN0b3JlczwvYnV0dG9uPlxuXG4gICAgICAgIDxTdG9yZXNfUGFnZSBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfS8+XG4gICAgICAgICAgPEFkZF9TdG9yZV9QYWdlIFxuICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTdG9yZV9NYW5hZ2VtZW50X1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgYWN0aXZlX3N0b3JlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRyYW5zYWN0aW9uc19WaWV3X1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfc3RvcmU9e3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgICAgYWN0aXZlX3BhZ2U9e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM9e3RoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX1BhZ2VcbiAgICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgICAgYWN0aXZlX3N0b3JlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlXG4gICAgICAgICAgICAgIGFjdGl2ZV9wYWdlPXt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgICB0cmFuc2FjdGlvbiA9e3RoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd259XG4gICAgICAgICAgICAvPlxuICAgICAgICA8VXNlcl9NYW5hZ2VtZW50X1BhZ2UgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICB9XG59XG5cbnZhciBob21lUGFnZSA9IFJlYWN0RE9NLnJlbmRlciggPEhvbWVfUGFnZS8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
