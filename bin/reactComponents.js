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
  if (typeof data === 'undefined') {
    data = null;
  }
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
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*global React*/
/*global set_HTTP_header:true*/
/*eslint no-undef: "error"*/
/*eslint no-console: "off"*/
/*eslint-env node*/

var User_Search_Widget = function (_React$Component) {
  _inherits(User_Search_Widget, _React$Component);

  function User_Search_Widget(props) {
    _classCallCheck(this, User_Search_Widget);

    var _this = _possibleConstructorReturn(this, (User_Search_Widget.__proto__ || Object.getPrototypeOf(User_Search_Widget)).call(this, props));

    _this.state = {
      users: [],
      selected_users: [],
      selected_users_id: []
    };
    _this.componentWillReceiveProps = _this.componentWillReceiveProps.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(User_Search_Widget, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      console.log('clicked');
      var clicked = e.target.parentNode.id;
      //console.log(this.state.output_content[clicked]);
      if (this.state.selected_users_id.indexOf(this.state.users[clicked]._id) != -1) {
        console.log('contributor already exists');
      } else {
        this.state.selected_users.push(this.state.users[clicked]);
        this.state.selected_users_id.push(this.state.users[clicked]._id);
        this.setState({
          selected_users_id: this.state.selected_users_id,
          selected_users: this.state.selected_users
        });
      }
      this.props.passUsers(this.state.selected_users, this.state.selected_users_id);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(key) {
      var _this2 = this;

      return function (e) {
        function get_users(req) {
          var res = JSON.parse(req.responseText);
          console.log(res);
          this.setState({
            users: res
          });
        }
        if (key === 'users') {
          // I have to debounce this
          if (e.target.value != '') {
            //Make sure I don't send a useless blank request
            console.log(e.target.value);
            make_request('GET', '/user/' + e.target.value, get_users.bind(_this2));
          } else {
            _this2.setState({
              users: []
            });
          }
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var rows = [];
      var c = this.state.users;

      if (c === undefined) {
        console.log('this.state.users is ' + this.state.users);
        return null;
      } else {
        for (var i = 0; i < c.length; i++) {
          rows.push(React.createElement(
            'tr',
            {
              id: i,
              key: i,
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
        return React.createElement(
          'div',
          { id: 'search' },
          React.createElement(
            'label',
            { htmlFor: 'search_users' },
            'Users'
          ),
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
          ),
          React.createElement('input', {
            id: 'search_users',
            type: 'search',
            onChange: this.handleChange('users')
          })
        );
      }
    }
  }]);

  return User_Search_Widget;
}(React.Component);
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
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleUsers = _this.handleUsers.bind(_this);
    return _this;
  }

  _createClass(Store_Management_Page, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextprops) {
      var _this2 = this;

      if (nextprops.active_page != 'Store_Management_Page') {} else {
        var req = new XMLHttpRequest();
        req.open('GET', '/user/' + localStorage.getItem('_user_id') + '/store/' + nextprops.active_store._id + '/manage');
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
          }
        };
        req.send();
      }
    }
  }, {
    key: 'handleUsers',
    value: function handleUsers(users, user_ids) {
      console.log('handleUsers function called');
      this.setState({
        contributors_ids: user_ids,
        contributors: users
      });
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
            key: 'tr=' + i,
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
          { id: _i, key: 'list-' + _i },
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
            React.createElement(User_Search_Widget, { users: this.state.contributors, passUsers: this.handleUsers }),
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

      // console.log(localStorage.getItem('_user_id'));
      var _user_id = localStorage.getItem('_user_id');
      var token = localStorage.getItem('token');

      var req = new XMLHttpRequest();
      var url = '/user/' + _user_id;

      // console.log(url);

      req.open('GET', url);

      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          var res = JSON.parse(req.responseText);

          if (res.success == false) {
            // console.log(res.message);
            _this2.setState({
              status_message: res.message
            });
            // console.log(this.state.status_message);
          } else {
            var user = JSON.parse(req.responseText);
            _this2.state.user = user[0];
            _this2.setState({
              user: _this2.state.user
            });
            // console.log(this.state.user);
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
        // console.log(store_trans);
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
          }
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
        //console.log(active_page);
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
      //console.log(this.state.status_message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwiVXNlcl9TZWFyY2hfV2lkZ2V0LmpzeCIsImFkZF9zdG9yZS5qc3giLCJhZGRfdHJhbnNhY3Rpb24uanN4IiwidHJhbnNhY3Rpb25fdmlld19kZXRhaWwuanN4IiwidHJhbnNhY3Rpb25zX3ZpZXcuanN4Iiwic3RvcmVfbWFuYWdlbWVudC5qc3giLCJzdG9yZXNfcGFnZS5qc3giLCJ1c2VyX21hbmFnZW1lbnQuanN4IiwibWFpbi5qc3giXSwibmFtZXMiOlsiZGVib3VuY2UiLCJmdW5jIiwid2FpdCIsImltbWVkaWF0ZSIsInRpbWVvdXQiLCJjb250ZXh0IiwiYXJncyIsImFyZ3VtZW50cyIsImxhdGVyIiwiYXBwbHkiLCJjYWxsTm93IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInNldF9IVFRQX2hlYWRlciIsInJlcXVlc3QiLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRSZXF1ZXN0SGVhZGVyIiwibWFrZV9yZXF1ZXN0IiwiYWN0aW9uIiwidXJpIiwid2hlbl9yZXNwb25zZSIsImRhdGEiLCJyZXEiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic2V0X3JlcXVlc3RfaGVhZGVycyIsInNlbmRfZGF0YSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiQmFja190b19Ib21lX0J1dHRvbiIsIlJlYWN0IiwiY3JlYXRlQ2xhc3MiLCJoYW5kbGVDbGljayIsImV2ZW50IiwiYWN0aXZlX3BhZ2UiLCJob21lUGFnZSIsInNldFN0YXRlIiwicHJldmVudERlZmF1bHQiLCJyZW5kZXIiLCJkaXNwYXRjaGVyIiwiRGlzcGF0Y2hlciIsIkV2ZW50IiwibmFtZSIsImNhbGxiYWNrcyIsInByb3RvdHlwZSIsInJlZ2lzdGVyQ2FsbGJhY2siLCJjYWxsYmFjayIsInB1c2giLCJldmVudHMiLCJyZWdpc3RlckV2ZW50IiwiZXZlbnRfbmFtZSIsImRpc3BhdGNoRXZlbnQiLCJldmVudF9hcmd1bWVudHMiLCJmb3JFYWNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsIlVzZXJfU2VhcmNoX1dpZGdldCIsInByb3BzIiwic3RhdGUiLCJ1c2VycyIsInNlbGVjdGVkX3VzZXJzIiwic2VsZWN0ZWRfdXNlcnNfaWQiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsIm5leHRQcm9wcyIsImUiLCJjb25zb2xlIiwibG9nIiwiY2xpY2tlZCIsInRhcmdldCIsInBhcmVudE5vZGUiLCJpZCIsImluZGV4T2YiLCJfaWQiLCJwYXNzVXNlcnMiLCJrZXkiLCJnZXRfdXNlcnMiLCJyZXMiLCJwYXJzZSIsInJlc3BvbnNlVGV4dCIsInZhbHVlIiwicm93cyIsImMiLCJ1bmRlZmluZWQiLCJpIiwibGVuZ3RoIiwidXNlcm5hbWUiLCJwaG9uZV9udW1iZXIiLCJDb21wb25lbnQiLCJBZGRfU3RvcmVfUGFnZSIsIm93bmVyIiwiY29udHJpYnV0b3JzX2lkcyIsImNvbnRyaWJ1dG9ycyIsIm91dHB1dF9jb250ZW50Iiwic3RhdHVzX21lc3NhZ2UiLCJoYW5kbGVTdWJtaXQiLCJjb250cmlidXRvcnNfaWQiLCJfdXNlcl9pZCIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwiZCIsIkFkZF9JdGVtX0J1dHRvbiIsIkNsaWNrIiwiUmVtb3ZlX0l0ZW1fQnV0dG9uIiwiQWRkX1RyYW5zYWN0aW9uX1BhZ2UiLCJnZXRJbml0aWFsU3RhdGUiLCJpdGVtX2NvdW50IiwiaXRlbXMiLCJhbW91bnQiLCJleHBpcnlfZGF0ZV9udW1iZXIiLCJleHBpcnlfZGF0ZV9zZWxlY3RvciIsImhhbmRsZUFkZENsaWNrIiwiaXRlbV9uYW1lIiwiaXRlbV9hbW91bnQiLCJoYW5kbGVSZW1vdmVDbGljayIsInNwbGljZSIsImFzc2VydCIsInJlcGxhY2UiLCJhY3RpdmVfc3RvcmUiLCJoYW5kbGVOYW1lQ2hhbmdlIiwiaGFuZGxlUGhvbmVOb0NoYW5nZSIsImhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2UiLCJoYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZSIsIkl0ZW0iLCJvbkNoYW5nZSIsInJlYWN0X2tleSIsInJlZnMiLCJ2YWx1ZXMiLCJUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlIiwidHJhbnNhY3Rpb24iLCJSZXR1cm5fSXRlbXNfQnV0dG9uIiwiUmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIiwiVHJhbnNhY3Rpb25fRGV0YWlsX1RhYmxlIiwiYWxsX2l0ZW1zIiwiaXRlbSIsImRhdGUiLCJzdWJzdHJpbmciLCJleHBpcnlfZGF0ZSIsInJldHVybmVkIiwidG9TdHJpbmciLCJUcmFuc2FjdGlvbnNfVmlld19QYWdlIiwidHJhbnNhY3Rpb25zIiwiQWRkX1RyYW5zYWN0aW9uX0J1dHRvbiIsIlRyYW5zYWN0aW9uX1RhYmxlIiwiVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyIsIlRhYmxlX1JvdyIsImRheXNfdGlsbF9leHBpcnkiLCJlX2QiLCJEYXRlIiwiTWF0aCIsImNlaWwiLCJub3ciLCJwYXJzZV9kYXRlIiwic3RhdHVzIiwidHJfc3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiU3RvcmVfTWFuYWdlbWVudF9QYWdlIiwiaGFuZGxlVXNlcnMiLCJuZXh0cHJvcHMiLCJ1c2VyX2lkcyIsInNob3dfbWVzc2FnZSIsIlN0b3Jlc19QYWdlIiwiQWRkX1N0b3JlX0J1dHRvbiIsIlN0b3Jlc19UYWJsZSIsInN0b3JlcyIsImNvbXBvbmVudERpZE1vdW50IiwicmVxdWVzdF91cmwiLCJnZXQiLCJ1c2VyIiwiU3RvcmVzX1RhYmxlX1JvdyIsImdldFRyYW5zYWN0aW9ucyIsIlVSTCIsInN0b3JlIiwibWFuYWdlU3RvcmUiLCJVc2VyX01hbmFnZW1lbnRfUGFnZSIsIm9uVXBkYXRlIiwiSG9tZV9QYWdlIiwic3RvcmVfdHJhbnNhY3Rpb25zIiwidHJhbnNhY3Rpb25fc2hvd24iLCJnb1RvIiwiY29tcG9uZW50V2lsbE1vdW50IiwidXBkYXRlVXNlciIsImxvZ291dCIsInVybCIsInN0b3JlX3RyYW5zIiwidXBkYXRlIiwicGFnZSIsImNsZWFyIiwid2luZG93IiwibG9jYXRpb24iLCJjcmVhdGVNZXNzYWdlIiwiX19odG1sIiwiUmVhY3RET00iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVNBLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCQyxJQUF4QixFQUE4QkMsU0FBOUIsRUFBeUM7QUFDdkMsTUFBSUMsT0FBSjtBQUNBLFNBQU8sWUFBVztBQUNoQixRQUFJQyxVQUFVLElBQWQ7QUFBQSxRQUFvQkMsT0FBT0MsU0FBM0I7QUFDQSxRQUFJQyxRQUFRLFNBQVJBLEtBQVEsR0FBVztBQUNyQkosZ0JBQVUsSUFBVjtBQUNBLFVBQUksQ0FBQ0QsU0FBTCxFQUFnQkYsS0FBS1EsS0FBTCxDQUFXSixPQUFYLEVBQW9CQyxJQUFwQjtBQUNqQixLQUhEO0FBSUEsUUFBSUksVUFBVVAsYUFBYSxDQUFDQyxPQUE1QjtBQUNBTyxpQkFBYVAsT0FBYjtBQUNBQSxjQUFVUSxXQUFXSixLQUFYLEVBQWtCTixJQUFsQixDQUFWO0FBQ0EsUUFBSVEsT0FBSixFQUFhVCxLQUFLUSxLQUFMLENBQVdKLE9BQVgsRUFBb0JDLElBQXBCO0FBQ2QsR0FWRDtBQVdEOztBQUVELFNBQVNPLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDO0FBQ2hDLE1BQU1DLFFBQVFDLGFBQWFDLE9BQWIsQ0FBcUIsT0FBckIsQ0FBZDs7QUFFQSxNQUFJRixLQUFKLEVBQVc7QUFDVEQsWUFBUUksZ0JBQVIsQ0FBeUIsZ0JBQXpCLEVBQTJDSCxLQUEzQztBQUNBLFdBQU9ELE9BQVA7QUFDRCxHQUhELE1BSUs7QUFDSCxXQUFPLHFEQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWFBLFNBQVNLLFlBQVQsQ0FBc0JDLE1BQXRCLEVB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RCxZQUQzQjtBQUVFLHVCQUFhLEtBQUs3RCxLQUFMLENBQVd2QixXQUYxQjtBQUdFLHdCQUFjLEtBQUt1QixLQUFMLENBQVcwSDtBQUgzQixVQWRGO0FBbUJJLDRCQUFDLG9CQUFEO0FBQ0UsdUJBQWUsS0FBSzFILEtBQUwsQ0FBV3ZCLFdBRDVCO0FBRUUsd0JBQWdCLEtBQUt1QixLQUFMLENBQVc2RDtBQUY3QixVQW5CSjtBQXVCSSw0QkFBQyw0QkFBRDtBQUNFLHVCQUFhLEtBQUs3RCxLQUFMLENBQVd2QixXQUQxQjtBQUVFLHVCQUFjLEtBQUt1QixLQUFMLENBQVcySDtBQUYzQixVQXZCSjtBQTJCQSw0QkFBQyxvQkFBRDtBQUNFLHVCQUFlLEtBQUszSCxLQUFMLENBQVd2QixXQUQ1QjtBQUVFLG9CQUFZLEtBQUtxSjtBQUZuQjtBQTNCQSxPQURKO0FBa0NEOzs7O0VBaExxQnpKLE1BQU0wRDs7QUFtTDlCLElBQUlyRCxXQUFXK0osU0FBUzVKLE1BQVQsQ0FBaUIsb0JBQUMsU0FBRCxPQUFqQixFQUErQjZKLFNBQVNDLGNBQVQsQ0FBd0IsU0FBeEIsQ0FBL0IsQ0FBZiIsImZpbGUiOiJyZWFjdENvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4vLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4vLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbi8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXRfSFRUUF9oZWFkZXIocmVxdWVzdCkge1xuICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xuXG4gIGlmICh0b2tlbikge1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcigneC1hY2Nlc3MtdG9rZW4nLCB0b2tlbik7XG4gICAgcmV0dXJuKHJlcXVlc3QpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybignRXJyb3I6IHRva2VuIGNvdWxkIG5vdCBiZSBmb3VuZC4gQ2hlY2sgbG9jYWxTdG9yYWdlJyk7XG4gIH1cbn1cblxuLypcbi8vIDFcbnJlcS5vcGVuKCdQVVQnLCBgL3VzZXIvJHtsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKX0vc3RvcmUvYCArXG50aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyAnL21hbmFnZScpOyBcblxuLy8gMiAoMiB0aGluZ3MpXG5yZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG5zZXRfSFRUUF9oZWFkZXIocmVxdWVzdCk7XG5cbi8vIDNcbnJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiovXG5cbmZ1bmN0aW9uIG1ha2VfcmVxdWVzdChhY3Rpb24sIHVyaSwgd2hlbl9yZXNwb25zZSwgZGF0YSkge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnKSB7IGRhdGEgPSBudWxsOyB9XG4gIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxLm9wZW4oYWN0aW9uLCB1cmkpO1xuICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICB3aGVuX3Jlc3BvbnNlKHJlcSk7XG4gICAgfSBcbiAgfTtcbiAgc2V0X3JlcXVlc3RfaGVhZGVycyhyZXEsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBzZXRfcmVxdWVzdF9oZWFkZXJzKHJlcXVlc3QsIGRhdGEpIHtcbiAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICBzZXRfSFRUUF9oZWFkZXIocmVxdWVzdCk7XG4gIHNlbmRfZGF0YShyZXF1ZXN0LCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gc2VuZF9kYXRhKHJlcXVlc3QsIGRhdGEpe1xuICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xufVxuIiwidmFyIEJhY2tfdG9fSG9tZV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihldmVudCl7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0hvbWVfUGFnZSc7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiaG9tZV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBCYWNrXG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKlxuICogRGlzcGF0Y2hlci8gUmVhY3RvciBwYXR0ZXJuIG1vZGVsXG4gKlxuICogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNTMwODM3MS9jdXN0b20tZXZlbnRzLW1vZGVsLVxuICogd2l0aG91dC11c2luZy1kb20tZXZlbnRzLWluLWphdmFzY3JpcHRcbiAqXG4gKiBIb3cgaXQgd29ya3M6XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFJlZ2lzdGVyIGV2ZW50cy4gQW4gZXZlbnQgaXMgYmFzaWNhbGx5IGEgcmVwb3NpdG9yeSBvZiBjYWxsYmFjayBmdW5jdGlvbnMuXG4gKiBDYWxsIHRoZSBldmVudCB0byBjYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbnMuIFxuICogSG93IHRvIGNhbGwgdGhlIGV2ZW50PyBVc2UgRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50X25hbWUpXG4gKiBcbiAqIEEgRGlzcGF0Y2hlciBpcyBhIGxpc3Qgb2YgRXZlbnRzLiBTbyBjYWxsaW5nIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudFxuICogYmFzaWNhbGx5IGZpbmRzIHRoZSBldmVudCBpbiB0aGUgRGlzcGF0Y2hlciBhbmQgY2FsbHMgaXRcbiAqXG4gKiBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQgLS0+IGNhbGxzIHRoZSBFdmVudCAtLS0+IGNhbGxzIHRoZSBjYWxsYmFja1xuICogZnVuY3Rpb24ocykgb2YgdGhlIEV2ZW50LiBcbiAqXG4gKiBIb3cgZG8gd2Ugc2V0IHRoZSBjYWxsYmFjayBmdW5jdGlvbnMgb2YgdGhlIEV2ZW50PyBVc2UgYWRkRXZlbnRMaXN0ZW5lci5cbiAqIGFkZEV2ZW50TGlzdGVuZXIgaXMgcmVhbGx5IGEgbWlzbm9tZXIsIGl0IHNob3VsZCBiZSBjYWxsZWQgYWRkQ2FsbEJhY2suXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgZGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbmZ1bmN0aW9uIEV2ZW50KG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5jYWxsYmFja3MgPSBbXTtcbn07XG5cbkV2ZW50LnByb3RvdHlwZS5yZWdpc3RlckNhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbn07XG5cbmZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gIHRoaXMuZXZlbnRzID0ge31cbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyRXZlbnQgPSBmdW5jdGlvbihldmVudF9uYW1lKSB7XG4gIHZhciBldmVudCA9IG5ldyBFdmVudChldmVudF9uYW1lKTtcbiAgdGhpcy5ldmVudHNbZXZlbnRfbmFtZV0gPSBldmVudDtcbiAgLy8gY29uc29sZS5sb2codGhpcy5ldmVudHMpO1xufVxuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSwgZXZlbnRfYXJndW1lbnRzKXtcbiAgdGhpcy5ldmVudHNbZXZlbnRfbmFtZV0uY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayhldmVudF9hcmd1bWVudHMpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdkaXNwYXRjaGVkJyk7XG4gICAgLy8gY29uc29sZS5sb2coY2FsbGJhY2ssIGV2ZW50X2FyZ3VtZW50cyk7XG4gIH0pO1xufTtcblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGNhbGxiYWNrKSB7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLnJlZ2lzdGVyQ2FsbGJhY2soY2FsbGJhY2spO1xuICAvLyBjb25zb2xlLmxvZyhjYWxsYmFjayk7XG59O1xuXG4vKiAtLS0tLS0tLS0tLS0tXG4gKiBEaXNwYXRjaGVyIGV2ZW50c1xuICogLS0tLS0tLS0tLS0tLS0tLSovXG5cbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJyk7XG4vL1NlbmQgVHJhbnNhY3Rpb24gRGV0YWlscyBoYXMgYSBsaXN0ZW5lciBhdHRhY2hlZCB0byBpdCBcbi8vdGhhdCB0YWtlcyBpbiBhIEpTT04gb2JqZWN0IGFzIGEgcGFyYW1ldGVyLiBUaGlzIEpTT04gb2JqZWN0IGlzIHRoZSBcbi8vdHJhbnNhY3Rpb24uIFRoZW4gdGhlIERldGFpbCBWaWV3IFRhYmxlIHdpbGwgdXBkYXRlLiBcbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJylcbmRpc3BhdGNoZXIucmVnaXN0ZXJFdmVudCgnc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnKTtcblxuXG5cbiIsIi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIHNldF9IVFRQX2hlYWRlcjp0cnVlKi9cbi8qZXNsaW50IG5vLXVuZGVmOiBcImVycm9yXCIqL1xuLyplc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiovXG4vKmVzbGludC1lbnYgbm9kZSovXG5cbmNsYXNzIFVzZXJfU2VhcmNoX1dpZGdldCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VycyA6IFtdLFxuICAgICAgc2VsZWN0ZWRfdXNlcnM6IFtdLFxuICAgICAgc2VsZWN0ZWRfdXNlcnNfaWQ6IFtdICAgICAgICBcbiAgICB9O1xuICAgIHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG4gIFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuXG4gIH1cbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgbGV0IGNsaWNrZWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmlkO1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnNfaWQuaW5kZXhPZih0aGlzLnN0YXRlLnVzZXJzW2NsaWNrZWRdLl9pZCkgIT0gLTEpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjb250cmlidXRvciBhbHJlYWR5IGV4aXN0cycpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnMucHVzaCh0aGlzLnN0YXRlLnVzZXJzW2NsaWNrZWRdKTtcbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnNfaWQucHVzaCh0aGlzLnN0YXRlLnVzZXJzW2NsaWNrZWRdLl9pZCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRfdXNlcnNfaWQ6IHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnNfaWQsXG4gICAgICAgIHNlbGVjdGVkX3VzZXJzOiB0aGlzLnN0YXRlLnNlbGVjdGVkX3VzZXJzXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5wcm9wcy5wYXNzVXNlcnModGhpcy5zdGF0ZS5zZWxlY3RlZF91c2VycywgdGhpcy5zdGF0ZS5zZWxlY3RlZF91c2Vyc19pZCk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZnVuY3Rpb24gZ2V0X3VzZXJzKHJlcSkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgdXNlcnM6IHJlc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICd1c2VycycpIHsgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICBtYWtlX3JlcXVlc3QgKFxuICAgICAgICAgICAgJ0dFVCcsIFxuICAgICAgICAgICAgYC91c2VyLyR7ZS50YXJnZXQudmFsdWV9YCxcbiAgICAgICAgICAgIGdldF91c2Vycy5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB1c2VyczogW11cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBsZXQgYyA9IHRoaXMuc3RhdGUudXNlcnM7XG5cbiAgICBpZiAoYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgdGhpcy5zdGF0ZS51c2VycyBpcyAke3RoaXMuc3RhdGUudXNlcnN9YCk7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvd3MucHVzaChcbiAgICAgICAgICAgICAgPHRyXG4gICAgICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgICAgICA8dGQ+e2NbaV0udXNlcm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgPHRkPntjW2ldLnBob25lX251bWJlcn08L3RkPlxuICAgICAgICAgICAgICA8L3RyPik7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgaWQgPSAnc2VhcmNoJz5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvciA9J3NlYXJjaF91c2Vycyc+VXNlcnM8L2xhYmVsPlxuXG5cblxuICAgICAgICAgIDx0YWJsZSBpZCA9IFwib3V0cHV0X2NvbnRlbnRcIj5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgPHRyPjx0ZD5EaXNwbGF5IG5hbWU8L3RkPjx0ZD5QaG9uZSBudW1iZXI8L3RkPjwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBpZCA9ICdzZWFyY2hfdXNlcnMnXG4gICAgICAgICAgICAgIHR5cGU9J3NlYXJjaCcgXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgndXNlcnMnKX0gXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iLCIvKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBzZXRfSFRUUF9oZWFkZXI6dHJ1ZSovXG4vKmVzbGludCBuby11bmRlZjogXCJlcnJvclwiKi9cbi8qZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIqL1xuLyplc2xpbnQtZW52IG5vZGUqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBBZGRfU3RvcmVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLmluZGV4T2YodGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpICE9IC0xKSB7XG4gICAgICBjb25zb2xlLmxvZygnY29udHJpYnV0b3IgYWxyZWFkeSBleGlzdHMnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnY29udHJpYnV0b3JzJykge1xuICAgICAgICAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKCdHRVQnLCAnL3VzZXIvJyArIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiByZXNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBPU1QgcmVxdWVzdCcpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgX3VzZXJfaWQ6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH07XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKCdQT1NUJywgICcvdXNlci8nICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyAnL3N0b3JlJyk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7dGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzISAnIDogJ0ZhaWx1cmUhICcpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTsgICAgICBcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdBZGRfU3RvcmVfUGFnZScpIHtcbiAgICAgIHJldHVybiAobnVsbCk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxoMT5BZGQgc3RvcmU8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj48dGQ+RGlzcGxheSBuYW1lPC90ZD48dGQ+UGhvbmUgbnVtYmVyPC90ZD48L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gKlxuICogQWRkIFRyYW5zYWN0aW9uIEZvcm0gUGFnZSBcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgQWRkX0l0ZW1fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIHRoaXMucHJvcHMuQ2xpY2soKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9pdGVtX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIEFkZCBuZXcgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxudmFyIFJlbW92ZV9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyZW1vdmVfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBSZW1vdmUgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxuXG52YXIgQWRkX1RyYW5zYWN0aW9uX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIHJldHVybiAgKHtcbiAgICBpdGVtX2NvdW50OiAxLFxuICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgbmFtZTogJycsXG4gICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG4gICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6ICdtb250aCdcbiAgICB9KVxuICB9LFxuICBoYW5kbGVBZGRDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMucHVzaCh7aXRlbV9uYW1lOiAnJywgaXRlbV9hbW91bnQ6ICcnfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQgKyAxLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5pdGVtX2NvdW50O1xuICB9LCAgXG4gIGhhbmRsZVJlbW92ZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgdGhpcy5zdGF0ZS5pdGVtcy5zcGxpY2UoLTEsIDEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuaXRlbXMpO1xuICAgIGlmICh0aGlzLnN0YXRlLml0ZW1fY291bnQgPT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLml0ZW1fY291bnQgLS07XG4gICAgfVxuICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3RhdGUuaXRlbV9jb3VudCA+PSAwKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1fY291bnQ6IHRoaXMuc3RhdGUuaXRlbV9jb3VudCxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7ICAgIFxuICAgIHZhciBkYXRhID0gIHtcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIC8vU3RyaXAgcGhvbmUgbnVtYmVyIGlucHV0cy5cbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIucmVwbGFjZSgvIC9nLCAnJyksXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtcyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIsXG4gICAgICBleHBpcnlfZGF0ZV9zZWxlY3RvcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvclxuICAgIH07XG4gICAgXG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5uYW1lKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICBcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbihcIlBPU1RcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyB0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxdWVzdCA9IHNldF9IVFRQX2hlYWRlcihyZXF1ZXN0KTtcbiBcbiBcbiAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFxuICAgIC8vQ2xlYXIgZXZlcnl0aGluZy4uLlxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogMSxcbiAgICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG5cbiAgICB9KTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oa2V5LCBuYW1lLCBhbW91bnQpe1xuICAgIC8vIGNvbnNvbGUubG9nKGtleSwgaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuc3RhdGUuaXRlbXNba2V5XS5hbW91bnQgPSBhbW91bnQ7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICB9LFxuICBoYW5kbGVOYW1lQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZS5uYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lXG4gICAgfSk7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm5hbWUpO1xuICB9LFxuICBoYW5kbGVQaG9uZU5vQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJcbiAgICB9KTtcbiAgfSxcbiAgaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3Rvcik7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnQWRkX1RyYW5zX1BhZ2UnKTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGUuaXRlbV9jb3VudDsgaSsrKSB7XG4gICAgICBpdGVtcy5wdXNoKDxJdGVtIHJlYWN0X2tleT17aX0ga2V5PXtpfSB2YWx1ZXM9e3RoaXMuc3RhdGUuaXRlbXNbaV19XG4gICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+KVxuICAgIH07XG4gICAgcmV0dXJuKFxuICAgICAgPGRpdiBjbGFzcyA9XCJwYWdlXCI+XG4gICAgICA8Zm9ybT5cbiAgICAgIDxoMT5BZGQgbmV3IGxvYW48L2gxPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIG5hbWU9XCJuYW1lXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nTmFtZScgXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubmFtZX0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTmFtZUNoYW5nZX0gXG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGhvbmVfbnVtYmVyXCI+UGhvbmUgbnVtYmVyPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGUgPSd0ZWwnIFxuICAgICAgICAgIG5hbWU9XCJwaG9uZV9udW1iZXJcIiBcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nUGhvbmUgbnVtYmVyJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9IFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVBob25lTm9DaGFuZ2V9XG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZXhwaXJ5X2R1cmF0aW9uX251bWJlclwiPkV4cGlyeSBkYXRlPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgLy9jbGFzc05hbWUgPSAnaGFsZi13aWR0aCdcbiAgICAgICAgICBpZCA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJ1xuICAgICAgICAgIG5hbWUgPSAnZXhwaXJ5X2R1cmF0aW9uX251bWJlcidcbiAgICAgICAgICBwbGFjZWhvbGRlciA9ICcxJ1xuICAgICAgICAgIHZhbHVlID0ge3RoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2V9XG4gICAgICAgICAgbWluID0gXCIxXCJcbiAgICAgICAgICByZXF1aXJlZFxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxzZWxlY3QgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPVwibW9udGhcIiBcbiAgICAgICAgICBuYW1lPVwiZXhwaXJ5X2R1cmF0aW9uX3NlbGVjdG9yXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJkYXlcIj5kYXk8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2Vla1wiPndlZWs8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibW9udGhcIj5tb250aDwvb3B0aW9uPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPEFkZF9JdGVtX0J1dHRvbiBDbGljaz17dGhpcy5oYW5kbGVBZGRDbGlja30vPlxuICAgICAgICA8UmVtb3ZlX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZUNsaWNrfS8+XG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+SXRlbSBuYW1lPC90aD5cbiAgICAgICAgICAgIDx0aD5JdGVtIGFtb3VudDwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nQWRkIGxvYW4nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fT48L2lucHV0PlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG52YXIgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHsgIFxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIC8vQ2FsbHMgdGhlIGZ1bmN0aW9uIG9uQ2hhbmdlIGluIEFkZF9UcmFuc2FjdGlvbl9Gb3JtIHRvIG11dGF0ZSB0aGUgc3RhdGUgaW4gdGhlIHBhcmVudC4gXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnByb3BzLnJlYWN0X2tleSwgdGhpcy5yZWZzLm5hbWUudmFsdWUsXG4gICAgdGhpcy5yZWZzLmFtb3VudC52YWx1ZSk7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIGhlaWdodD1cIjIwcHhcIj5cbiAgICAgIDx0ZD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgdHlwZSA9ICd0ZXh0JyBcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkl0ZW0gbmFtZVwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9IFxuICAgICAgICAgIHJlZj1cIm5hbWVcIlxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgPlxuICAgICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDx0ZD5cbiAgICAgIDxpbnB1dCBcbiAgICAgICAgdHlwZSA9ICdudW1iZXInIFxuICAgICAgICBtaW49IFwiMVwiXG4gICAgICAgIHBsYWNlaG9sZGVyID0gXCJBbW91bnRcIlxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMuYW1vdW50fVxuICAgICAgICByZWY9XCJhbW91bnRcIlxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIHJlcXVpcmVkPlxuICAgICAgPC9pbnB1dD5cbiAgICAgIDwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9uIFZpZXcgRGV0YWlsIHBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKXtcbiAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnKSB7XG4gICAgcmV0dXJuKG51bGwpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5wcm9wcyk7XG4gIHJldHVybihcbiAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxoMT5Mb2FucyB2aWV3IChkZXRhaWwpPC9oMT5cbiAgICAgIDxUcmFuc2FjdGlvbl9EZXRhaWxfVGFibGUgdHJhbnNhY3Rpb249e3RoaXMucHJvcHMudHJhbnNhY3Rpb259Lz5cbiAgICAgIDxSZXR1cm5fSXRlbXNfQnV0dG9uIC8+XG4gICAgICA8UmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgIDwvZGl2PlxuICAgIClcbiAgfSBcbiAgIFxuICB9XG59KTtcblxudmFyIFJldHVybl9JdGVtc19CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJywgJ3JldHVybicpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5SZXR1cm4gaXRlbXM8L2J1dHRvbj5cbiAgKVxuIH0gXG59KTtcblxudmFyIFJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmVuZXcnKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICg8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJlbmV3IGxvYW48L2J1dHRvbj4pXG4gfSBcbn0pXG5cblxudmFyIFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSB0aGlzLnByb3BzLnRyYW5zYWN0aW9uO1xuICAgICAgdmFyIGFsbF9pdGVtcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaXRlbSBpbiB0cmFuc2FjdGlvbi5pdGVtcykge1xuICAgICAgICBhbGxfaXRlbXMucHVzaChcbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5JdGVtIE5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0ubmFtZX08L3RkPlxuICAgICAgICAgIDx0aD5Oby48L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0uYW1vdW50fTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIClcbiAgICAgIH1cbiAgcmV0dXJuIChcbiAgICA8dGFibGUgaWQ9XCJ0cmFuc2FjdGlvbl9kZXRhaWxfdGFibGVcIj5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5EYXRlPC90aD5cbiAgICAgICAgICA8dGQ+e3RyYW5zYWN0aW9uLmRhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZXhwaXJ5X2RhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+UmV0dXJuZWQ8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ucmV0dXJuZWQudG9TdHJpbmcoKX08L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ubmFtZX08L3RkPlxuICAgICAgICA8L3RyPlxuXG4gICAgICAgIHthbGxfaXRlbXN9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBUcmFuc2FjdGlvbnMgVmlldyBQYWdlXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gXCJUcmFuc2FjdGlvbnNfVmlld19QYWdlXCIpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBXaGVuIHRoaXMgcGFnZSBsb2Fkc1xuICAgICAgcmV0dXJuICAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgICA8aDE+IExvYW5zIG92ZXJ2aWV3IGZvciB7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUubmFtZX08L2gxPlxuICAgICAgICA8VHJhbnNhY3Rpb25fVGFibGUgdHJhbnNhY3Rpb25zID0ge3RoaXMucHJvcHMudHJhbnNhY3Rpb25zfSAvPlxuICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX0J1dHRvbiAvPlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn0pXG5cbnZhciBBZGRfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJztcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF90cmFuc2FjdGlvbl9idXR0b25cIlxuICAgICAgb25DbGljaz17IHRoaXMuaGFuZGxlQ2xpY2sgfT5cbiAgICAgIEFkZCBuZXcgbG9hblxuICAgICAgPC9idXR0b24+XG4gICAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5wcm9wcy50cmFuc2FjdGlvbnMpO1xuICAgIHZhciByb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BzLnRyYW5zYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uc1tpXSk7XG4gICAgICByb3dzLnB1c2goPFRhYmxlX1JvdyBrZXk9e2l9IHZhbHVlcz17dGhpcy5wcm9wcy50cmFuc2FjdGlvbnNbaV19Lz4pXG4gICAgfVxuIFxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICA8dGFibGU+XG4gICAgICA8VHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyAvPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAoXG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj5cbiAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgIDx0aD5QaG9uZSBOdW1iZXI8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICApXG4gIH1cbn0pXG5cblxudmFyIFRhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlJztcblxuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHtcbiAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIGZ1bmN0aW9uIGRheXNfdGlsbF9leHBpcnkoZGF0ZSkge1xuICAgICAgdmFyIGVfZCA9IERhdGUucGFyc2UoZGF0ZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QpO1xuICAgICAgLy8gY29uc29sZS5sb2coRGF0ZS5ub3coKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QgLSBEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSlcbiAgICAgIHJldHVybihNYXRoLmNlaWwoKGVfZCAtIERhdGUubm93KCkpLygxMDAwKjYwKjYwKjI0KSkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBwYXJzZV9kYXRlKGRhdGUpe1xuICAgICAgcmV0dXJuKGRhdGUuc3Vic3RyaW5nKDAsMTApKTtcbiAgICB9O1xuICAgdmFyIHN0YXR1cyA9IGRheXNfdGlsbF9leHBpcnkodGhpcy5wcm9wcy52YWx1ZXMuZXhwaXJ5X2RhdGUpO1xuICAgdmFyIHRyX3N0eWxlID0ge1xuICAgIFxuICAgfVxuICAgaWYgKHRoaXMucHJvcHMudmFsdWVzLnJldHVybmVkID09PSB0cnVlKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIHRleHREZWNvcmF0aW9uOiAnbGluZS10aHJvdWdoJyxcbiAgICAgICBjb2xvcjogJ2hzbCgzMCwgNCUsIDc2JSknXG4gICAgIH1cbiAgIH1cbiAgIGVsc2UgaWYgKHN0YXR1cyA8PSAwKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2hzbCgwLCA5NyUsIDY4JSknXG4gICAgIH1cbiAgIH1cbiAgICBlbHNlIGlmIChzdGF0dXMgPD0gMykge1xuICAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDMwLCA3OCUsIDYzJSknICBcbiAgICAgIH1cbiAgICAgfVxuICAgIHJldHVybihcbiAgICAgIDx0ciBzdHlsZT17dHJfc3R5bGV9IG9uQ2xpY2s9IHt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmRhdGUpfTwvdGQ+XG4gICAgICAgIDx0ZD57cGFyc2VfZGF0ZSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5uYW1lfTwvdGQ+XG4gICAgICAgIDx0ZD57dGhpcy5wcm9wcy52YWx1ZXMucGhvbmVfbnVtYmVyfTwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcbiIsIi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIHNldF9IVFRQX2hlYWRlcjp0cnVlKi9cbi8qZXNsaW50IG5vLXVuZGVmOiBcImVycm9yXCIqL1xuLyplc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiovXG4vKmVzbGludC1lbnYgbm9kZSovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgU3RvcmVfTWFuYWdlbWVudF9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8vV2hlbiBjb21wb25lbnQgbW91bnRzLCBzZW5kIGEgR0VUIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBwb3B1bGF0ZVxuICAgICAgLy90aGVzZSBmaWVsZHMgXG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVVc2VycyA9IHRoaXMuaGFuZGxlVXNlcnMuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRwcm9wcykge1xuICAgIGlmIChuZXh0cHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3JlX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICByZXEub3BlbignR0VUJywgYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlLyR7bmV4dHByb3BzLmFjdGl2ZV9zdG9yZS5faWR9L21hbmFnZWApO1xuICAgICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgLy8gRmlyc3QgaXRlbSBpcyB0aGUgc3RvcmUgb2JqZWN0LCBcbiAgICAgICAgICAvLyBzZWNvbmQgdGhlIG93bmVyIG9iamVjdCxcbiAgICAgICAgICAvLyB0aGlyZCBpdGVtIHRoZSBhcnJheSBvZiBjb250cmlidXRvcnNcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICAgIG5hbWU6IHJlc1swXS5uYW1lLFxuICAgICAgICAgICAgY29udHJpYnV0b3JzX2lkczogcmVzWzBdLmNvbnRyaWJ1dG9ycyxcbiAgICAgICAgICAgIG93bmVyOiByZXNbMV0sXG4gICAgICAgICAgICBjb250cmlidXRvcnM6IHJlc1syXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVVc2Vycyh1c2VycywgdXNlcl9pZHMpIHtcbiAgICBjb25zb2xlLmxvZygnaGFuZGxlVXNlcnMgZnVuY3Rpb24gY2FsbGVkJyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250cmlidXRvcnNfaWRzOiB1c2VyX2lkcyxcbiAgICAgIGNvbnRyaWJ1dG9yczogdXNlcnNcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnRyaWJ1dG9ycycpIHtcbiAgICAgICAgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgcmVxLm9wZW4oJ0dFVCcsICcvdXNlci8nICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHNldF9IVFRQX2hlYWRlcihyZXEpLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSxcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9O1xuICAgIG1ha2VfcmVxdWVzdCAoXG4gICAgICAnUFVUJywgXG4gICAgICAoYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlLyR7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkfS9tYW5hZ2VgKSxcbiAgICAgIHNob3dfbWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgZGF0YVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBzaG93X21lc3NhZ2UocmVxdWVzdCl7XG4gICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEgJyA6ICdGYWlsdXJlISAnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIGtleT17YHRyPSR7aX1gfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0ga2V5PXtgbGlzdC0ke2l9YH0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZV9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+Q2hhbmdlIHN0b3JlIGRldGFpbHM8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPHA+T3duZXI6IHt0aGlzLnN0YXRlLm93bmVyLnVzZXJuYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8VXNlcl9TZWFyY2hfV2lkZ2V0IHVzZXJzPXt0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc30gcGFzc1VzZXJzPXt0aGlzLmhhbmRsZVVzZXJzfS8+XG4gICAgICAgICAgXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgXG4gICAgfVxuICB9XG59XG5cbiIsIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBcbiAqIFN0b3JlcyB0YWJsZSBhbmQgcGFnZVxuICogXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgU3RvcmVzX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZXNfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhZ2VcIj5cbiAgICAgICAgPFN0b3Jlc19UYWJsZSAvPlxuICAgICAgICA8QWRkX1N0b3JlX0J1dHRvbiBvbkNsaWNrID0ge3RoaXMuaGFuZGxlQ2xpY2t9Lz5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxudmFyIEFkZF9TdG9yZV9CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnQWRkX1N0b3JlX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYWRkX3N0b3JlX2J1dHRvblwiIFxuICAgICAgICBvbkNsaWNrID0ge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgICAgQWRkIG5ldyBzdG9yZVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKVxuICB9XG59KVxuXG5cbnZhciBTdG9yZXNfVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh7XG4gICAgICBzdG9yZXM6IFtdLFxuICAgICAgdXNlcnM6IFtdXG4gICAgfSk7XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgdmFyIF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG4gICAgdmFyIHJlcXVlc3RfdXJsID0gJy91c2VyLycgKyBfdXNlcl9pZCArICcvc3RvcmUnO1xuXG4gICAgdmFyIGdldCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGdldC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RfdXJsKTtcbiAgICBnZXQgPSBzZXRfSFRUUF9oZWFkZXIoZ2V0KTtcbiAgICBnZXQub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKGdldC5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UoZ2V0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHN0b3JlczogcmVzLnN0b3JlcyxcbiAgICAgICAgICB1c2VyczogcmVzLnVzZXJzXG4gICAgICAgIH0pXG5cbiAgICAgIH1cbiAgICB9XG4gICAgZ2V0LnNlbmQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcm93cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5zdG9yZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbnNbaV0pOyBcbiAgICAgIHZhciB1c2VyID0gdGhpcy5zdGF0ZS51c2Vyc1tpXTtcbiAgICAgIGlmICh1c2VyID09PSB1bmRlZmluZWQpIHsgdXNlciA9IG51bGw7IH1cblxuICAgICAgICByb3dzLnB1c2goXG5cbiAgICAgICAgICA8U3RvcmVzX1RhYmxlX1JvdyBcbiAgICAgICAgICAgIGtleT17aX0gXG4gICAgICAgICAgICBzdG9yZT17dGhpcy5zdGF0ZS5zdG9yZXNbaV19IFxuICAgICAgICAgICAgdXNlcj17dXNlcn1cbiAgICAgICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuICAgIHJldHVybihcbiAgICAgICAgPHRhYmxlPlxuICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgPHRoPlN0b3JlPC90aD5cbiAgICAgICAgICAgICAgPHRoPk93bmVyPC90aD5cbiAgICAgICAgICAgICAgPHRoPkFjdGlvbnM8L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgPC90YWJsZT5cbiAgICAgICAgKVxuICB9XG59KVxuXG52YXIgU3RvcmVzX1RhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0VHJhbnNhY3Rpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHZhciBVUkwgPSAoXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyBcbiAgICAgICAgdGhpcy5wcm9wcy5zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBVUkwpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgLy8gSSBoYXZlIHRvIHBhc3MgdGhpcyBcInJlc1wiIHRvIHRoZSByZWFscGFnZSBvciB0cmFucyB2aWV3IHBhZ2VcbiAgICAgICAgbGV0IGFjdGl2ZV9wYWdlID0gJ1RyYW5zYWN0aW9uc19WaWV3X1BhZ2UnO1xuICAgICAgICByZXMuYWN0aXZlX3N0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycsIChyZXMpKTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9LFxuICBtYW5hZ2VTdG9yZTogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gXCJTdG9yZV9NYW5hZ2VtZW50X1BhZ2VcIjtcbiAgICBsZXQgYWN0aXZlX3N0b3JlID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlLCBhY3RpdmVfc3RvcmU6IGFjdGl2ZV9zdG9yZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDx0cj5cbiAgICAgICAgPHRkPiB7IHRoaXMucHJvcHMuc3RvcmUubmFtZSB9PC90ZD5cbiAgICAgICAgPHRkPiB7IHRoaXMucHJvcHMudXNlci51c2VybmFtZSB9PC90ZD5cbiAgICAgICAgPHRkPjxidXR0b24gb25DbGljayA9IHt0aGlzLmdldFRyYW5zYWN0aW9uc30+VmlldzwvYnV0dG9uPjxidXR0b24gb25DbGljayA9IHt0aGlzLm1hbmFnZVN0b3JlfT5FZGl0PC9idXR0b24+PC90ZD5cbiAgICAgICAgPC90cj5cbiAgICAgICAgKVxuICB9XG59KVxuXG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgVXNlcl9NYW5hZ2VtZW50X1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgLy9XaGVuIGNvbXBvbmVudCBtb3VudHMsIHNlbmQgYSBHRVQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIHBvcHVsYXRlXG4gICAgICAvL3RoZXNlIGZpZWxkcyBcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBfaWQ6ICcnLFxuICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnXG4gICAgfVxuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZygnbW91bnRlZCcpO1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIkdFVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coT2JqZWN0LmtleXMocmVzWzBdKSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc1swXVsndXNlcm5hbWUnXSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHBob25lX251bWJlcjogcmVzWzBdLnBob25lX251bWJlcixcbiAgICAgICAgICBfaWQ6IHJlc1swXS5faWQsXG4gICAgICAgICAgdXNlcm5hbWU6IHJlc1swXS51c2VybmFtZVxuICAgICAgICB9KVxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgIHN0YXRlW2tleV0gPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgfVxuICB9XG4gIFxuICBoYW5kbGVTdWJtaXQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zb2xlLmxvZygnc2VuZGluZyBQVVQgcmVxdWVzdCcpO1xuICAgIC8vU2VuZCBhIFBPU1QgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgLy8gVGhlIHNlcnZlciBuZWVkcyB0byBjaGVjayB0aGF0IHRoaXMgcGhvbmUgbnVtYmVyIGlzbid0IGFscmVhZHkgdXNlZFxuICAgIHZhciBkYXRhID0ge1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlcixcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lXG4gICAgfVxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbihcIlBVVFwiLCBcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzIScgOiAnRmFpbHVyZSEnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgfSk7XG4gICAgICB0aGlzLnByb3BzLm9uVXBkYXRlKHJlcy51c2VyKTtcbiAgICB9ICAgICAgXG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnVXNlcl9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgIHJldHVybihcbiAgICAgICAgPGRpdiBpZD1cImJvZHlcIj5cbiAgICAgICAgPHA+IHt0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlfSA8L3A+XG4gICAgICAgIDxoMT5DaGFuZ2UgdXNlciBkZXRhaWxzPC9oMT5cbiAgICAgICAgPHA+SWYgeW91IGNoYW5nZSB5b3VyIHBob25lIG51bWJlciwgeW91IGNhbiBlZGl0IGl0IGhlcmUuPC9wPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+UGhvbmU6IHt0aGlzLnN0YXRlLnBob25lX251bWJlcn0gPC9wPlxuICAgICAgICA8cD5Vc2VyOiB7dGhpcy5zdGF0ZS51c2VybmFtZX0gPC9wPlxuICAgICAgICBcbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJwaG9uZV9udW1iZXJcIj5QaG9uZSBudW1iZXIgKGxvZ2luIHdpdGggdGhpcyk8L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZXF1aXJlZD0ncmVxdWlyZWQnXG4gICAgICAgICAgdHlwZT0nbnVtYmVyJyBcbiAgICAgICAgICBpZD0ncGhvbmVfbnVtYmVyJyBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgncGhvbmVfbnVtYmVyJylcbiAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPGxhYmVsIGh0bWxGb3I9J3VzZXJfbmFtZSc+TmFtZTogQ2hvb3NlIGFcbiAgICAgICAgbmFtZSB0aGF0IGlzIHVuaXF1ZSBzbyBwZW9wbGUgY2FuIGZpbmQgeW91LjwvbGFiZWw+XG4gICAgICAgIDxpbnB1dCBcbiAgICAgICAgICByZXF1aXJlZD0ncmVxdWlyZWQnXG4gICAgICAgICAgdHlwZT0ndGV4dCcgXG4gICAgICAgICAgaWQ9XCJ1c2VyX25hbWVcIiBcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCd1c2VybmFtZScpfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICB9XG59XG5cbi8vIFJlYWN0RE9NLnJlbmRlciggPFVzZXJfTWFuYWdlbWVudF9QYWdlLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykgKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgSG9tZV9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXI6IHt9LFxuICAgICAgYWN0aXZlX3BhZ2U6ICdIb21lIFBhZ2UnLFxuICAgICAgYWN0aXZlX3N0b3JlOiB7fSxcbiAgICAgIHN0b3JlX3RyYW5zYWN0aW9uczoge30sXG4gICAgICB0cmFuc2FjdGlvbl9zaG93bjoge30sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJycsXG4gICAgfTtcbiAgICB0aGlzLmdvVG8gPSB0aGlzLmdvVG8uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBvbmVudFdpbGxNb3VudCA9IHRoaXMuY29tcG9uZW50V2lsbE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb21wb25lbnREaWRNb3VudCA9IHRoaXMuY29tcG9uZW50RGlkTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnVwZGF0ZVVzZXIgPSB0aGlzLnVwZGF0ZVVzZXIuYmluZCh0aGlzKTtcbiAgICB0aGlzLmxvZ291dCA9IHRoaXMubG9nb3V0LmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgLy8gY29uc29sZS5sb2cobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIGNvbnN0IF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG4gICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcblxuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBsZXQgdXJsID0gJy91c2VyLycgKyBfdXNlcl9pZDtcblxuICAgIC8vIGNvbnNvbGUubG9nKHVybCk7XG5cbiAgICByZXEub3BlbignR0VUJywgdXJsKTtcblxuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICBsZXQgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcblxuICAgICAgICBpZiAocmVzLnN1Y2Nlc3MgPT0gZmFsc2UgKSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzLm1lc3NhZ2UpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IHJlcy5tZXNzYWdlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIHVzZXIgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIHRoaXMuc3RhdGUudXNlciA9IHVzZXJbMF07XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB1c2VyOiB0aGlzLnN0YXRlLnVzZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnVzZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0b2tlbiAhPSBudWxsKSB7XG4gICAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuXG4gICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCdzZW5kX3N0b3JlX3RyYW5zYWN0aW9ucycsIChzdG9yZV90cmFucykgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coc3RvcmVfdHJhbnMpO1xuICAgICAgICAvL0ZpcnN0LCB0YWtlIG91dCB0aGUgXCJhY3RpdmUgc3RvcmVcIlxuICAgICAgdmFyIGFjdGl2ZV9zdG9yZSA9IHN0b3JlX3RyYW5zLmFjdGl2ZV9zdG9yZTtcbiAgICAgIGRlbGV0ZSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICB0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9ucyA9IHN0b3JlX3RyYW5zO1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUgPSBhY3RpdmVfc3RvcmU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBhY3RpdmVfc3RvcmU6IHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlLFxuICAgICAgICBzdG9yZV90cmFuc2FjdGlvbnM6IHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAgIFxuICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcignc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJyxcbiAgICAgICAgKHRyYW5zYWN0aW9uKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93biA9IHRyYW5zYWN0aW9uO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdHJhbnNhY3Rpb25fc2hvd246IHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd25cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdjYWxsZWQnKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3BhdGNoZXIuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24pO1xuICAgICAgICB9KTtcbiAgICAgIFxuICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlX3RyYW5zYWN0aW9uJywgKGFjdGlvbikgPT4ge1xuICAgICAgY29uc3QgX3VzZXJfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKTtcbiAgICAgIHZhciB1cGRhdGUgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bi5faWQpO1xuICAgICAgbGV0IGlkID0gdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bi5faWQ7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgIGxldCB1cmwgPSAnL3VzZXIvJysgX3VzZXJfaWQgKyAnL3N0b3JlLycgKyB0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZS5faWQgKyAnL3RyYW5zLycgKyBpZCArICcvJyArIGFjdGlvbjtcbiAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgIC8vIC90cmFucy9faWQvcmVuZXdcbiAgICAgIHVwZGF0ZS5vcGVuKCdQVVQnLCB1cmwpO1xuXG4gICAgICB1cGRhdGUub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAodXBkYXRlLnJlYWR5U3RhdGUgPT0gNCl7XG4gICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLCBcbiAgICAgICAgICAgIEpTT04ucGFyc2UodXBkYXRlLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgICAgLy8gV2h5IGRvIEkgZXZlbiBuZWVkIHRvIGRpc3BhdGNoIHRoaXMgZXZlbnQgdG8gYmUgaG9uZXN0XG4gICAgICAgICAgICAvLyBJIGNhbiBtdXRhdGUgdGhlIHN0YXRlIHN0cmFpZ2h0IGF3YXkgZnJvbSBoZXJlLiBBaCB3ZWxsXG4gICAgICAgICAgICAvLyBJIHRoaW5rIGl0J3MgY2xlYW5lciB0byBkbyB0aGlzLiBEUlkgYWZ0ZXIgYWxsLi4uXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBzZXRfSFRUUF9oZWFkZXIodXBkYXRlKS5zZW5kKCk7XG4gICAgfSk7XG4gIH1cblxuICBnb1RvKHBhZ2UpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGxldCBhY3RpdmVfcGFnZSA9IHBhZ2U7XG4gICAgICAvL2NvbnNvbGUubG9nKGFjdGl2ZV9wYWdlKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBhY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2VcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbiAgXG4gIHVwZGF0ZVVzZXIodXNlcikge1xuICAgIHRoaXMuc3RhdGUudXNlciA9IHVzZXI7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1c2VyOiB1c2VyXG4gICAgfSk7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgd2luZG93LmxvY2F0aW9uID0gJy9sb2dpbi5odG1sJztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UpO1xuICAgIGlmICh0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlICE9PSAnJykge1xuICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlO1xuICAgICAgZnVuY3Rpb24gY3JlYXRlTWVzc2FnZShtZXNzYWdlKSB7cmV0dXJuIHtfX2h0bWw6IG1lc3NhZ2V9O31cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e2NyZWF0ZU1lc3NhZ2UobWVzc2FnZSl9IC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybihcbiAgICAgICAgPGRpdj5cbiAgICAgICAgPGhlYWRlcj57dGhpcy5zdGF0ZS51c2VyLnVzZXJuYW1lfSA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMubG9nb3V0fT5Mb2dvdXQ8L2J1dHRvbj48L2hlYWRlcj5cbiAgICAgICAgPGgxPnt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfTwvaDE+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5nb1RvKCdVc2VyX01hbmFnZW1lbnRfUGFnZScpfT5FZGl0IHVzZXI8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmdvVG8oJ1N0b3Jlc19QYWdlJyl9PlZpZXcgc3RvcmVzPC9idXR0b24+XG5cbiAgICAgICAgPFN0b3Jlc19QYWdlIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9Lz5cbiAgICAgICAgICA8QWRkX1N0b3JlX1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFN0b3JlX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9zdG9yZT17dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICBhY3RpdmVfcGFnZT17dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgIHRyYW5zYWN0aW9ucz17dGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICAgIDxBZGRfVHJhbnNhY3Rpb25fUGFnZVxuICAgICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgICBhY3RpdmVfc3RvcmUgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFRyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2VcbiAgICAgICAgICAgICAgYWN0aXZlX3BhZ2U9e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICAgIHRyYW5zYWN0aW9uID17dGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDxVc2VyX01hbmFnZW1lbnRfUGFnZSBcbiAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgIG9uVXBkYXRlID0ge3RoaXMudXBkYXRlVXNlcn1cbiAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gIH1cbn1cblxudmFyIGhvbWVQYWdlID0gUmVhY3RET00ucmVuZGVyKCA8SG9tZV9QYWdlLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JykpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
