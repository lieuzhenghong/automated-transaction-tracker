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
      if (this.state.selected_users_id.indexOf(this.state.users[clicked]._id) != -1 || this.props.owner.indexOf(this.state.users[clicked]._id) != -1) {
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
            React.createElement(User_Search_Widget, { owner: this.state.owner, users: this.state.contributors, passUsers: this.handleUsers }),
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
          'View loans'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwidXNlcl9zZWFyY2hfd2lkZ2V0LmpzeCIsImFkZF9zdG9yZS5qc3giLCJhZGRfdHJhbnNhY3Rpb24uanN4IiwidHJhbnNhY3Rpb25fdmlld19kZXRhaWwuanN4IiwidHJhbnNhY3Rpb25zX3ZpZXcuanN4Iiwic3RvcmVfbWFuYWdlbWVudC5qc3giLCJzdG9yZXNfcGFnZS5qc3giLCJ1c2VyX21hbmFnZW1lbnQuanN4IiwibWFpbi5qc3giXSwibmFtZXMiOlsiZGVib3VuY2UiLCJmdW5jIiwid2FpdCIsImltbWVkaWF0ZSIsInRpbWVvdXQiLCJjb250ZXh0IiwiYXJncyIsImFyZ3VtZW50cyIsImxhdGVyIiwiYXBwbHkiLCJjYWxsTm93IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInNldF9IVFRQX2hlYWRlciIsInJlcXVlc3QiLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRSZXF1ZXN0SGVhZGVyIiwibWFrZV9yZXF1ZXN0IiwiYWN0aW9uIiwidXJpIiwid2hlbl9yZXNwb25zZSIsImRhdGEiLCJyZXEiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic2V0X3JlcXVlc3RfaGVhZGVycyIsInNlbmRfZGF0YSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiQmFja190b19Ib21lX0J1dHRvbiIsIlJlYWN0IiwiY3JlYXRlQ2xhc3MiLCJoYW5kbGVDbGljayIsImV2ZW50IiwiYWN0aXZlX3BhZ2UiLCJob21lUGFnZSIsInNldFN0YXRlIiwicHJldmVudERlZmF1bHQiLCJyZW5kZXIiLCJkaXNwYXRjaGVyIiwiRGlzcGF0Y2hlciIsIkV2ZW50IiwibmFtZSIsImNhbGxiYWNrcyIsInByb3RvdHlwZSIsInJlZ2lzdGVyQ2FsbGJhY2siLCJjYWxsYmFjayIsInB1c2giLCJldmVudHMiLCJyZWdpc3RlckV2ZW50IiwiZXZlbnRfbmFtZSIsImRpc3BhdGNoRXZlbnQiLCJldmVudF9hcmd1bWVudHMiLCJmb3JFYWNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsIlVzZXJfU2VhcmNoX1dpZGdldCIsInByb3BzIiwic3RhdGUiLCJ1c2VycyIsInNlbGVjdGVkX3VzZXJzIiwic2VsZWN0ZWRfdXNlcnNfaWQiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwiYmluZCIsImhhbmRsZUNoYW5nZSIsIm5leHRQcm9wcyIsImUiLCJjb25zb2xlIiwibG9nIiwiY2xpY2tlZCIsInRhcmdldCIsInBhcmVudE5vZGUiLCJpZCIsImluZGV4T2YiLCJfaWQiLCJvd25lciIsInBhc3NVc2VycyIsImtleSIsImdldF91c2VycyIsInJlcyIsInBhcnNlIiwicmVzcG9uc2VUZXh0IiwidmFsdWUiLCJyb3dzIiwiYyIsInVuZGVmaW5lZCIsImkiLCJsZW5ndGgiLCJ1c2VybmFtZSIsInBob25lX251bWJlciIsIkNvbXBvbmVudCIsIkFkZF9TdG9yZV9QYWdlIiwiY29udHJpYnV0b3JzX2lkcyIsImNvbnRyaWJ1dG9ycyIsIm91dHB1dF9jb250ZW50Iiwic3RhdHVzX21lc3NhZ2UiLCJoYW5kbGVTdWJtaXQiLCJjb250cmlidXRvcnNfaWQiLCJfdXNlcl9pZCIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwiZCIsIkFkZF9JdGVtX0J1dHRvbiIsIkNsaWNrIiwiUmVtb3ZlX0l0ZW1fQnV0dG9uIiwiQWRkX1RyYW5zYWN0aW9uX1BhZ2UiLCJnZXRJbml0aWFsU3RhdGUiLCJpdGVtX2NvdW50IiwiaXRlbXMiLCJhbW91bnQiLCJleHBpcnlfZGF0ZV9udW1iZXIiLCJleHBpcnlfZGF0ZV9zZWxlY3RvciIsImhhbmRsZUFkZENsaWNrIiwiaXRlbV9uYW1lIiwiaXRlbV9hbW91bnQiLCJoYW5kbGVSZW1vdmVDbGljayIsInNwbGljZSIsImFzc2VydCIsInJlcGxhY2UiLCJhY3RpdmVfc3RvcmUiLCJoYW5kbGVOYW1lQ2hhbmdlIiwiaGFuZGxlUGhvbmVOb0NoYW5nZSIsImhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2UiLCJoYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZSIsIkl0ZW0iLCJvbkNoYW5nZSIsInJlYWN0X2tleSIsInJlZnMiLCJ2YWx1ZXMiLCJUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlIiwidHJhbnNhY3Rpb24iLCJSZXR1cm5fSXRlbXNfQnV0dG9uIiwiUmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIiwiVHJhbnNhY3Rpb25fRGV0YWlsX1RhYmxlIiwiYWxsX2l0ZW1zIiwiaXRlbSIsImRhdGUiLCJzdWJzdHJpbmciLCJleHBpcnlfZGF0ZSIsInJldHVybmVkIiwidG9TdHJpbmciLCJUcmFuc2FjdGlvbnNfVmlld19QYWdlIiwidHJhbnNhY3Rpb25zIiwiQWRkX1RyYW5zYWN0aW9uX0J1dHRvbiIsIlRyYW5zYWN0aW9uX1RhYmxlIiwiVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyIsIlRhYmxlX1JvdyIsImRheXNfdGlsbF9leHBpcnkiLCJlX2QiLCJEYXRlIiwiTWF0aCIsImNlaWwiLCJub3ciLCJwYXJzZV9kYXRlIiwic3RhdHVzIiwidHJfc3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiU3RvcmVfTWFuYWdlbWVudF9QYWdlIiwiaGFuZGxlVXNlcnMiLCJuZXh0cHJvcHMiLCJ1c2VyX2lkcyIsInNob3dfbWVzc2FnZSIsIlN0b3Jlc19QYWdlIiwiQWRkX1N0b3JlX0J1dHRvbiIsIlN0b3Jlc19UYWJsZSIsInN0b3JlcyIsImNvbXBvbmVudERpZE1vdW50IiwicmVxdWVzdF91cmwiLCJnZXQiLCJ1c2VyIiwiU3RvcmVzX1RhYmxlX1JvdyIsImdldFRyYW5zYWN0aW9ucyIsIlVSTCIsInN0b3JlIiwibWFuYWdlU3RvcmUiLCJVc2VyX01hbmFnZW1lbnRfUGFnZSIsIm9uVXBkYXRlIiwiSG9tZV9QYWdlIiwic3RvcmVfdHJhbnNhY3Rpb25zIiwidHJhbnNhY3Rpb25fc2hvd24iLCJnb1RvIiwiY29tcG9uZW50V2lsbE1vdW50IiwidXBkYXRlVXNlciIsImxvZ291dCIsInVybCIsInN0b3JlX3RyYW5zIiwidXBkYXRlIiwicGFnZSIsImNsZWFyIiwid2luZG93IiwibG9jYXRpb24iLCJjcmVhdGVNZXNzYWdlIiwiX19odG1sIiwiUmVhY3RET00iLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVNBLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCQyxJQUF4QixFQUE4QkMsU0FBOUIsRUFBeUM7QUFDdkMsTUFBSUMsT0FBSjtBQUNBLFNBQU8sWUFBVztBQUNoQixRQUFJQyxVQUFVLElBQWQ7QUFBQSxRQUFvQkMsT0FBT0MsU0FBM0I7QUFDQSxRQUFJQyxRQUFRLFNBQVJBLEtBQVEsR0FBVztBQUNyQkosZ0JBQVUsSUFBVjtBQUNBLFVBQUksQ0FBQ0QsU0FBTCxFQUFnQkYsS0FBS1EsS0FBTCxDQUFXSixPQUFYLEVBQW9CQyxJQUFwQjtBQUNqQixLQUhEO0FBSUEsUUFBSUksVUFBVVAsYUFBYSxDQUFDQyxPQUE1QjtBQUNBTyxpQkFBYVAsT0FBYjtBQUNBQSxjQUFVUSxXQUFXSixLQUFYLEVBQWtCTixJQUFsQixDQUFWO0FBQ0EsUUFBSVEsT0FBSixFQUFhVCxLQUFLUSxLQUFMLENBQVdKLE9BQVgsRUFBb0JDLElBQXBCO0FBQ2QsR0FWRDtBQVdEOztBQUVELFNBQVNPLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQWtDO0FBQ2hDLE1BQU1DLFFBQVFDLGFBQWFDLE9BQWIsQ0FBcUIsT0FBckIsQ0FBZDs7QUFFQSxNQUFJRixLQUFKLEVBQVc7QUFDVEQsWUFBUUksZ0JBQVIsQ0FBeUIsZ0JBQXpCLEVBQTJDSCxLQUEzQztBQUNBLFdBQU9ELE9BQVA7QUFDRCxHQUhELE1BSUs7QUFDSCxXQUFPLHFEQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7Ozs7OztBQWFBLFNBQVNLLFlBQVQsQ0FBc0JDLE1BQXRCLEVB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VUFQRjtBQVVFLDRCQUFDLHFCQUFEO0FBQ0UsdUJBQWUsS0FBS3VCLEtBQUwsQ0FBV3ZCLFdBRDVCO0FBRUUsd0JBQWdCLEtBQUt1QixLQUFMLENBQVc2RDtBQUY3QixVQVZGO0FBY0UsNEJBQUMsc0JBQUQ7QUFDRSx3QkFBYyxLQUFLN0QsS0FBTCxDQUFXNkQsWUFEM0I7QUFFRSx1QkFBYSxLQUFLN0QsS0FBTCxDQUFXdkIsV0FGMUI7QUFHRSx3QkFBYyxLQUFLdUIsS0FBTCxDQUFXMEg7QUFIM0IsVUFkRjtBQW1CSSw0QkFBQyxvQkFBRDtBQUNFLHVCQUFlLEtBQUsxSCxLQUFMLENBQVd2QixXQUQ1QjtBQUVFLHdCQUFnQixLQUFLdUIsS0FBTCxDQUFXNkQ7QUFGN0IsVUFuQko7QUF1QkksNEJBQUMsNEJBQUQ7QUFDRSx1QkFBYSxLQUFLN0QsS0FBTCxDQUFXdkIsV0FEMUI7QUFFRSx1QkFBYyxLQUFLdUIsS0FBTCxDQUFXMkg7QUFGM0IsVUF2Qko7QUEyQkEsNEJBQUMsb0JBQUQ7QUFDRSx1QkFBZSxLQUFLM0gsS0FBTCxDQUFXdkIsV0FENUI7QUFFRSxvQkFBWSxLQUFLcUo7QUFGbkI7QUEzQkEsT0FESjtBQWtDRDs7OztFQWhMcUJ6SixNQUFNMkQ7O0FBbUw5QixJQUFJdEQsV0FBVytKLFNBQVM1SixNQUFULENBQWlCLG9CQUFDLFNBQUQsT0FBakIsRUFBK0I2SixTQUFTQyxjQUFULENBQXdCLFNBQXhCLENBQS9CLENBQWYiLCJmaWxlIjoicmVhY3RDb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4vLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpIHtcbiAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcblxuICBpZiAodG9rZW4pIHtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ3gtYWNjZXNzLXRva2VuJywgdG9rZW4pO1xuICAgIHJldHVybihyZXF1ZXN0KTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4oJ0Vycm9yOiB0b2tlbiBjb3VsZCBub3QgYmUgZm91bmQuIENoZWNrIGxvY2FsU3RvcmFnZScpO1xuICB9XG59XG5cbi8qXG4vLyAxXG5yZXEub3BlbignUFVUJywgYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlL2AgK1xudGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkICsgJy9tYW5hZ2UnKTsgXG5cbi8vIDIgKDIgdGhpbmdzKVxucmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuXG4vLyAzXG5yZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4qL1xuXG5mdW5jdGlvbiBtYWtlX3JlcXVlc3QoYWN0aW9uLCB1cmksIHdoZW5fcmVzcG9uc2UsIGRhdGEpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJykgeyBkYXRhID0gbnVsbDsgfVxuICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcS5vcGVuKGFjdGlvbiwgdXJpKTtcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgd2hlbl9yZXNwb25zZShyZXEpO1xuICAgIH0gXG4gIH07XG4gIHNldF9yZXF1ZXN0X2hlYWRlcnMocmVxLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gc2V0X3JlcXVlc3RfaGVhZGVycyhyZXF1ZXN0LCBkYXRhKSB7XG4gIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuICBzZW5kX2RhdGEocmVxdWVzdCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRfZGF0YShyZXF1ZXN0LCBkYXRhKXtcbiAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cbiIsInZhciBCYWNrX3RvX0hvbWVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdIb21lX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImhvbWVfYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgQmFja1xuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIERpc3BhdGNoZXIvIFJlYWN0b3IgcGF0dGVybiBtb2RlbFxuICpcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTUzMDgzNzEvY3VzdG9tLWV2ZW50cy1tb2RlbC1cbiAqIHdpdGhvdXQtdXNpbmctZG9tLWV2ZW50cy1pbi1qYXZhc2NyaXB0XG4gKlxuICogSG93IGl0IHdvcmtzOlxuICogLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSZWdpc3RlciBldmVudHMuIEFuIGV2ZW50IGlzIGJhc2ljYWxseSBhIHJlcG9zaXRvcnkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICogQ2FsbCB0aGUgZXZlbnQgdG8gY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zLiBcbiAqIEhvdyB0byBjYWxsIHRoZSBldmVudD8gVXNlIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudF9uYW1lKVxuICogXG4gKiBBIERpc3BhdGNoZXIgaXMgYSBsaXN0IG9mIEV2ZW50cy4gU28gY2FsbGluZyBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnRcbiAqIGJhc2ljYWxseSBmaW5kcyB0aGUgZXZlbnQgaW4gdGhlIERpc3BhdGNoZXIgYW5kIGNhbGxzIGl0XG4gKlxuICogRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50IC0tPiBjYWxscyB0aGUgRXZlbnQgLS0tPiBjYWxscyB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHMpIG9mIHRoZSBFdmVudC4gXG4gKlxuICogSG93IGRvIHdlIHNldCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zIG9mIHRoZSBFdmVudD8gVXNlIGFkZEV2ZW50TGlzdGVuZXIuXG4gKiBhZGRFdmVudExpc3RlbmVyIGlzIHJlYWxseSBhIG1pc25vbWVyLCBpdCBzaG91bGQgYmUgY2FsbGVkIGFkZENhbGxCYWNrLlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIGRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5mdW5jdGlvbiBFdmVudChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuY2FsbGJhY2tzID0gW107XG59O1xuXG5FdmVudC5wcm90b3R5cGUucmVnaXN0ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG59O1xuXG5mdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICB0aGlzLmV2ZW50cyA9IHt9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSkge1xuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnRfbmFtZSk7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdID0gZXZlbnQ7XG4gIC8vIGNvbnNvbGUubG9nKHRoaXMuZXZlbnRzKTtcbn1cblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGV2ZW50X2FyZ3VtZW50cyl7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2soZXZlbnRfYXJndW1lbnRzKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZGlzcGF0Y2hlZCcpO1xuICAgIC8vIGNvbnNvbGUubG9nKGNhbGxiYWNrLCBldmVudF9hcmd1bWVudHMpO1xuICB9KTtcbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudF9uYW1lLCBjYWxsYmFjaykge1xuICB0aGlzLmV2ZW50c1tldmVudF9uYW1lXS5yZWdpc3RlckNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgLy8gY29uc29sZS5sb2coY2FsbGJhY2spO1xufTtcblxuLyogLS0tLS0tLS0tLS0tLVxuICogRGlzcGF0Y2hlciBldmVudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0qL1xuXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycpO1xuLy9TZW5kIFRyYW5zYWN0aW9uIERldGFpbHMgaGFzIGEgbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQgXG4vL3RoYXQgdGFrZXMgaW4gYSBKU09OIG9iamVjdCBhcyBhIHBhcmFtZXRlci4gVGhpcyBKU09OIG9iamVjdCBpcyB0aGUgXG4vL3RyYW5zYWN0aW9uLiBUaGVuIHRoZSBEZXRhaWwgVmlldyBUYWJsZSB3aWxsIHVwZGF0ZS4gXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicpXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJyk7XG5cblxuXG4iLCIvKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBzZXRfSFRUUF9oZWFkZXI6dHJ1ZSovXG4vKmVzbGludCBuby11bmRlZjogXCJlcnJvclwiKi9cbi8qZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIqL1xuLyplc2xpbnQtZW52IG5vZGUqL1xuXG5jbGFzcyBVc2VyX1NlYXJjaF9XaWRnZXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlcnMgOiBbXSxcbiAgICAgIHNlbGVjdGVkX3VzZXJzOiBbXSxcbiAgICAgIHNlbGVjdGVkX3VzZXJzX2lkOiBbXSAgICAgICAgXG4gICAgfTtcbiAgICB0aGlzLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgPSB0aGlzLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuICBcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcblxuICB9XG4gIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGxldCBjbGlja2VkID0gZS50YXJnZXQucGFyZW50Tm9kZS5pZDtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkX3VzZXJzX2lkLmluZGV4T2YodGhpcy5zdGF0ZS51c2Vyc1tjbGlja2VkXS5faWQpICE9IC0xIHx8IFxuICAgICAgICB0aGlzLnByb3BzLm93bmVyLmluZGV4T2YodGhpcy5zdGF0ZS51c2Vyc1tjbGlja2VkXS5faWQpICE9IC0xICkge1xuICAgICAgY29uc29sZS5sb2coJ2NvbnRyaWJ1dG9yIGFscmVhZHkgZXhpc3RzJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZF91c2Vycy5wdXNoKHRoaXMuc3RhdGUudXNlcnNbY2xpY2tlZF0pO1xuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZF91c2Vyc19pZC5wdXNoKHRoaXMuc3RhdGUudXNlcnNbY2xpY2tlZF0uX2lkKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzZWxlY3RlZF91c2Vyc19pZDogdGhpcy5zdGF0ZS5zZWxlY3RlZF91c2Vyc19pZCxcbiAgICAgICAgc2VsZWN0ZWRfdXNlcnM6IHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnNcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLnBhc3NVc2Vycyh0aGlzLnN0YXRlLnNlbGVjdGVkX3VzZXJzLCB0aGlzLnN0YXRlLnNlbGVjdGVkX3VzZXJzX2lkKTtcbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBmdW5jdGlvbiBnZXRfdXNlcnMocmVxKSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICB1c2VyczogcmVzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3VzZXJzJykgeyAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgY29uc29sZS5sb2coZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIG1ha2VfcmVxdWVzdCAoXG4gICAgICAgICAgICAnR0VUJywgXG4gICAgICAgICAgICBgL3VzZXIvJHtlLnRhcmdldC52YWx1ZX1gLFxuICAgICAgICAgICAgZ2V0X3VzZXJzLmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHVzZXJzOiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBsZXQgYyA9IHRoaXMuc3RhdGUudXNlcnM7XG5cbiAgICBpZiAoYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmxvZyhgdGhpcy5zdGF0ZS51c2VycyBpcyAke3RoaXMuc3RhdGUudXNlcnN9YCk7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvd3MucHVzaChcbiAgICAgICAgICAgICAgPHRyXG4gICAgICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgICAgICA8dGQ+e2NbaV0udXNlcm5hbWV9PC90ZD5cbiAgICAgICAgICAgICAgPHRkPntjW2ldLnBob25lX251bWJlcn08L3RkPlxuICAgICAgICAgICAgICA8L3RyPik7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICAgIDxkaXYgaWQgPSAnc2VhcmNoJz5cbiAgICAgICAgICA8bGFiZWwgaHRtbEZvciA9J3NlYXJjaF91c2Vycyc+VXNlcnM8L2xhYmVsPlxuXG5cblxuICAgICAgICAgIDx0YWJsZSBpZCA9IFwib3V0cHV0X2NvbnRlbnRcIj5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgPHRyPjx0ZD5EaXNwbGF5IG5hbWU8L3RkPjx0ZD5QaG9uZSBudW1iZXI8L3RkPjwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICBpZCA9ICdzZWFyY2hfdXNlcnMnXG4gICAgICAgICAgICAgIHR5cGU9J3NlYXJjaCcgXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgndXNlcnMnKX0gXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iLCIvKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBzZXRfSFRUUF9oZWFkZXI6dHJ1ZSovXG4vKmVzbGludCBuby11bmRlZjogXCJlcnJvclwiKi9cbi8qZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIqL1xuLyplc2xpbnQtZW52IG5vZGUqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBBZGRfU3RvcmVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLmluZGV4T2YodGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpICE9IC0xKSB7XG4gICAgICBjb25zb2xlLmxvZygnY29udHJpYnV0b3IgYWxyZWFkeSBleGlzdHMnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnY29udHJpYnV0b3JzJykge1xuICAgICAgICAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKCdHRVQnLCAnL3VzZXIvJyArIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiByZXNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBPU1QgcmVxdWVzdCcpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgX3VzZXJfaWQ6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH07XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKCdQT1NUJywgICcvdXNlci8nICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyAnL3N0b3JlJyk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7dGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzISAnIDogJ0ZhaWx1cmUhICcpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTsgICAgICBcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdBZGRfU3RvcmVfUGFnZScpIHtcbiAgICAgIHJldHVybiAobnVsbCk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxoMT5BZGQgc3RvcmU8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj48dGQ+RGlzcGxheSBuYW1lPC90ZD48dGQ+UGhvbmUgbnVtYmVyPC90ZD48L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gKlxuICogQWRkIFRyYW5zYWN0aW9uIEZvcm0gUGFnZSBcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgQWRkX0l0ZW1fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIHRoaXMucHJvcHMuQ2xpY2soKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9pdGVtX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIEFkZCBuZXcgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxudmFyIFJlbW92ZV9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyZW1vdmVfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBSZW1vdmUgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxuXG52YXIgQWRkX1RyYW5zYWN0aW9uX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIHJldHVybiAgKHtcbiAgICBpdGVtX2NvdW50OiAxLFxuICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgbmFtZTogJycsXG4gICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG4gICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6ICdtb250aCdcbiAgICB9KVxuICB9LFxuICBoYW5kbGVBZGRDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMucHVzaCh7aXRlbV9uYW1lOiAnJywgaXRlbV9hbW91bnQ6ICcnfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQgKyAxLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5pdGVtX2NvdW50O1xuICB9LCAgXG4gIGhhbmRsZVJlbW92ZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgdGhpcy5zdGF0ZS5pdGVtcy5zcGxpY2UoLTEsIDEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuaXRlbXMpO1xuICAgIGlmICh0aGlzLnN0YXRlLml0ZW1fY291bnQgPT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLml0ZW1fY291bnQgLS07XG4gICAgfVxuICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3RhdGUuaXRlbV9jb3VudCA+PSAwKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1fY291bnQ6IHRoaXMuc3RhdGUuaXRlbV9jb3VudCxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7ICAgIFxuICAgIHZhciBkYXRhID0gIHtcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIC8vU3RyaXAgcGhvbmUgbnVtYmVyIGlucHV0cy5cbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIucmVwbGFjZSgvIC9nLCAnJyksXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtcyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIsXG4gICAgICBleHBpcnlfZGF0ZV9zZWxlY3RvcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvclxuICAgIH07XG4gICAgXG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5uYW1lKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICBcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbihcIlBPU1RcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyB0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxdWVzdCA9IHNldF9IVFRQX2hlYWRlcihyZXF1ZXN0KTtcbiBcbiBcbiAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFxuICAgIC8vQ2xlYXIgZXZlcnl0aGluZy4uLlxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogMSxcbiAgICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG5cbiAgICB9KTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oa2V5LCBuYW1lLCBhbW91bnQpe1xuICAgIC8vIGNvbnNvbGUubG9nKGtleSwgaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuc3RhdGUuaXRlbXNba2V5XS5hbW91bnQgPSBhbW91bnQ7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICB9LFxuICBoYW5kbGVOYW1lQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZS5uYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lXG4gICAgfSk7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm5hbWUpO1xuICB9LFxuICBoYW5kbGVQaG9uZU5vQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJcbiAgICB9KTtcbiAgfSxcbiAgaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3Rvcik7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnQWRkX1RyYW5zX1BhZ2UnKTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGUuaXRlbV9jb3VudDsgaSsrKSB7XG4gICAgICBpdGVtcy5wdXNoKDxJdGVtIHJlYWN0X2tleT17aX0ga2V5PXtpfSB2YWx1ZXM9e3RoaXMuc3RhdGUuaXRlbXNbaV19XG4gICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+KVxuICAgIH07XG4gICAgcmV0dXJuKFxuICAgICAgPGRpdiBjbGFzcyA9XCJwYWdlXCI+XG4gICAgICA8Zm9ybT5cbiAgICAgIDxoMT5BZGQgbmV3IGxvYW48L2gxPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIG5hbWU9XCJuYW1lXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nTmFtZScgXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubmFtZX0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTmFtZUNoYW5nZX0gXG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGhvbmVfbnVtYmVyXCI+UGhvbmUgbnVtYmVyPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGUgPSd0ZWwnIFxuICAgICAgICAgIG5hbWU9XCJwaG9uZV9udW1iZXJcIiBcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nUGhvbmUgbnVtYmVyJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9IFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVBob25lTm9DaGFuZ2V9XG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZXhwaXJ5X2R1cmF0aW9uX251bWJlclwiPkV4cGlyeSBkYXRlPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgLy9jbGFzc05hbWUgPSAnaGFsZi13aWR0aCdcbiAgICAgICAgICBpZCA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJ1xuICAgICAgICAgIG5hbWUgPSAnZXhwaXJ5X2R1cmF0aW9uX251bWJlcidcbiAgICAgICAgICBwbGFjZWhvbGRlciA9ICcxJ1xuICAgICAgICAgIHZhbHVlID0ge3RoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2V9XG4gICAgICAgICAgbWluID0gXCIxXCJcbiAgICAgICAgICByZXF1aXJlZFxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxzZWxlY3QgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPVwibW9udGhcIiBcbiAgICAgICAgICBuYW1lPVwiZXhwaXJ5X2R1cmF0aW9uX3NlbGVjdG9yXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJkYXlcIj5kYXk8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2Vla1wiPndlZWs8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibW9udGhcIj5tb250aDwvb3B0aW9uPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPEFkZF9JdGVtX0J1dHRvbiBDbGljaz17dGhpcy5oYW5kbGVBZGRDbGlja30vPlxuICAgICAgICA8UmVtb3ZlX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZUNsaWNrfS8+XG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+SXRlbSBuYW1lPC90aD5cbiAgICAgICAgICAgIDx0aD5JdGVtIGFtb3VudDwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nQWRkIGxvYW4nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fT48L2lucHV0PlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG52YXIgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHsgIFxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIC8vQ2FsbHMgdGhlIGZ1bmN0aW9uIG9uQ2hhbmdlIGluIEFkZF9UcmFuc2FjdGlvbl9Gb3JtIHRvIG11dGF0ZSB0aGUgc3RhdGUgaW4gdGhlIHBhcmVudC4gXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnByb3BzLnJlYWN0X2tleSwgdGhpcy5yZWZzLm5hbWUudmFsdWUsXG4gICAgdGhpcy5yZWZzLmFtb3VudC52YWx1ZSk7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIGhlaWdodD1cIjIwcHhcIj5cbiAgICAgIDx0ZD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgdHlwZSA9ICd0ZXh0JyBcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkl0ZW0gbmFtZVwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9IFxuICAgICAgICAgIHJlZj1cIm5hbWVcIlxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgPlxuICAgICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDx0ZD5cbiAgICAgIDxpbnB1dCBcbiAgICAgICAgdHlwZSA9ICdudW1iZXInIFxuICAgICAgICBtaW49IFwiMVwiXG4gICAgICAgIHBsYWNlaG9sZGVyID0gXCJBbW91bnRcIlxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMuYW1vdW50fVxuICAgICAgICByZWY9XCJhbW91bnRcIlxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIHJlcXVpcmVkPlxuICAgICAgPC9pbnB1dD5cbiAgICAgIDwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9uIFZpZXcgRGV0YWlsIHBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKXtcbiAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnKSB7XG4gICAgcmV0dXJuKG51bGwpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5wcm9wcyk7XG4gIHJldHVybihcbiAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxoMT5Mb2FucyB2aWV3IChkZXRhaWwpPC9oMT5cbiAgICAgIDxUcmFuc2FjdGlvbl9EZXRhaWxfVGFibGUgdHJhbnNhY3Rpb249e3RoaXMucHJvcHMudHJhbnNhY3Rpb259Lz5cbiAgICAgIDxSZXR1cm5fSXRlbXNfQnV0dG9uIC8+XG4gICAgICA8UmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgIDwvZGl2PlxuICAgIClcbiAgfSBcbiAgIFxuICB9XG59KTtcblxudmFyIFJldHVybl9JdGVtc19CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJywgJ3JldHVybicpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5SZXR1cm4gaXRlbXM8L2J1dHRvbj5cbiAgKVxuIH0gXG59KTtcblxudmFyIFJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmVuZXcnKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICg8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJlbmV3IGxvYW48L2J1dHRvbj4pXG4gfSBcbn0pXG5cblxudmFyIFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSB0aGlzLnByb3BzLnRyYW5zYWN0aW9uO1xuICAgICAgdmFyIGFsbF9pdGVtcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaXRlbSBpbiB0cmFuc2FjdGlvbi5pdGVtcykge1xuICAgICAgICBhbGxfaXRlbXMucHVzaChcbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5JdGVtIE5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0ubmFtZX08L3RkPlxuICAgICAgICAgIDx0aD5Oby48L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0uYW1vdW50fTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIClcbiAgICAgIH1cbiAgcmV0dXJuIChcbiAgICA8dGFibGUgaWQ9XCJ0cmFuc2FjdGlvbl9kZXRhaWxfdGFibGVcIj5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5EYXRlPC90aD5cbiAgICAgICAgICA8dGQ+e3RyYW5zYWN0aW9uLmRhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZXhwaXJ5X2RhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+UmV0dXJuZWQ8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ucmV0dXJuZWQudG9TdHJpbmcoKX08L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ubmFtZX08L3RkPlxuICAgICAgICA8L3RyPlxuXG4gICAgICAgIHthbGxfaXRlbXN9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBUcmFuc2FjdGlvbnMgVmlldyBQYWdlXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gXCJUcmFuc2FjdGlvbnNfVmlld19QYWdlXCIpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBXaGVuIHRoaXMgcGFnZSBsb2Fkc1xuICAgICAgcmV0dXJuICAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgICA8aDE+IExvYW5zIG92ZXJ2aWV3IGZvciB7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUubmFtZX08L2gxPlxuICAgICAgICA8VHJhbnNhY3Rpb25fVGFibGUgdHJhbnNhY3Rpb25zID0ge3RoaXMucHJvcHMudHJhbnNhY3Rpb25zfSAvPlxuICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX0J1dHRvbiAvPlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn0pXG5cbnZhciBBZGRfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJztcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF90cmFuc2FjdGlvbl9idXR0b25cIlxuICAgICAgb25DbGljaz17IHRoaXMuaGFuZGxlQ2xpY2sgfT5cbiAgICAgIEFkZCBuZXcgbG9hblxuICAgICAgPC9idXR0b24+XG4gICAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5wcm9wcy50cmFuc2FjdGlvbnMpO1xuICAgIHZhciByb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BzLnRyYW5zYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uc1tpXSk7XG4gICAgICByb3dzLnB1c2goPFRhYmxlX1JvdyBrZXk9e2l9IHZhbHVlcz17dGhpcy5wcm9wcy50cmFuc2FjdGlvbnNbaV19Lz4pXG4gICAgfVxuIFxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICA8dGFibGU+XG4gICAgICA8VHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyAvPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAoXG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj5cbiAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgIDx0aD5QaG9uZSBOdW1iZXI8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICApXG4gIH1cbn0pXG5cblxudmFyIFRhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlJztcblxuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHtcbiAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIGZ1bmN0aW9uIGRheXNfdGlsbF9leHBpcnkoZGF0ZSkge1xuICAgICAgdmFyIGVfZCA9IERhdGUucGFyc2UoZGF0ZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QpO1xuICAgICAgLy8gY29uc29sZS5sb2coRGF0ZS5ub3coKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QgLSBEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSlcbiAgICAgIHJldHVybihNYXRoLmNlaWwoKGVfZCAtIERhdGUubm93KCkpLygxMDAwKjYwKjYwKjI0KSkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBwYXJzZV9kYXRlKGRhdGUpe1xuICAgICAgcmV0dXJuKGRhdGUuc3Vic3RyaW5nKDAsMTApKTtcbiAgICB9O1xuICAgdmFyIHN0YXR1cyA9IGRheXNfdGlsbF9leHBpcnkodGhpcy5wcm9wcy52YWx1ZXMuZXhwaXJ5X2RhdGUpO1xuICAgdmFyIHRyX3N0eWxlID0ge1xuICAgIFxuICAgfVxuICAgaWYgKHRoaXMucHJvcHMudmFsdWVzLnJldHVybmVkID09PSB0cnVlKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIHRleHREZWNvcmF0aW9uOiAnbGluZS10aHJvdWdoJyxcbiAgICAgICBjb2xvcjogJ2hzbCgzMCwgNCUsIDc2JSknXG4gICAgIH1cbiAgIH1cbiAgIGVsc2UgaWYgKHN0YXR1cyA8PSAwKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2hzbCgwLCA5NyUsIDY4JSknXG4gICAgIH1cbiAgIH1cbiAgICBlbHNlIGlmIChzdGF0dXMgPD0gMykge1xuICAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDMwLCA3OCUsIDYzJSknICBcbiAgICAgIH1cbiAgICAgfVxuICAgIHJldHVybihcbiAgICAgIDx0ciBzdHlsZT17dHJfc3R5bGV9IG9uQ2xpY2s9IHt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmRhdGUpfTwvdGQ+XG4gICAgICAgIDx0ZD57cGFyc2VfZGF0ZSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5uYW1lfTwvdGQ+XG4gICAgICAgIDx0ZD57dGhpcy5wcm9wcy52YWx1ZXMucGhvbmVfbnVtYmVyfTwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcbiIsIi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIHNldF9IVFRQX2hlYWRlcjp0cnVlKi9cbi8qZXNsaW50IG5vLXVuZGVmOiBcImVycm9yXCIqL1xuLyplc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiovXG4vKmVzbGludC1lbnYgbm9kZSovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgU3RvcmVfTWFuYWdlbWVudF9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8vV2hlbiBjb21wb25lbnQgbW91bnRzLCBzZW5kIGEgR0VUIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBwb3B1bGF0ZVxuICAgICAgLy90aGVzZSBmaWVsZHMgXG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVVc2VycyA9IHRoaXMuaGFuZGxlVXNlcnMuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRwcm9wcykge1xuICAgIGlmIChuZXh0cHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3JlX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICByZXEub3BlbignR0VUJywgYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlLyR7bmV4dHByb3BzLmFjdGl2ZV9zdG9yZS5faWR9L21hbmFnZWApO1xuICAgICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgLy8gRmlyc3QgaXRlbSBpcyB0aGUgc3RvcmUgb2JqZWN0LCBcbiAgICAgICAgICAvLyBzZWNvbmQgdGhlIG93bmVyIG9iamVjdCxcbiAgICAgICAgICAvLyB0aGlyZCBpdGVtIHRoZSBhcnJheSBvZiBjb250cmlidXRvcnNcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICAgIG5hbWU6IHJlc1swXS5uYW1lLFxuICAgICAgICAgICAgY29udHJpYnV0b3JzX2lkczogcmVzWzBdLmNvbnRyaWJ1dG9ycyxcbiAgICAgICAgICAgIG93bmVyOiByZXNbMV0sXG4gICAgICAgICAgICBjb250cmlidXRvcnM6IHJlc1syXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVVc2Vycyh1c2VycywgdXNlcl9pZHMpIHtcbiAgICBjb25zb2xlLmxvZygnaGFuZGxlVXNlcnMgZnVuY3Rpb24gY2FsbGVkJyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250cmlidXRvcnNfaWRzOiB1c2VyX2lkcyxcbiAgICAgIGNvbnRyaWJ1dG9yczogdXNlcnNcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnRyaWJ1dG9ycycpIHtcbiAgICAgICAgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgcmVxLm9wZW4oJ0dFVCcsICcvdXNlci8nICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHNldF9IVFRQX2hlYWRlcihyZXEpLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSxcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9O1xuICAgIG1ha2VfcmVxdWVzdCAoXG4gICAgICAnUFVUJywgXG4gICAgICAoYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlLyR7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkfS9tYW5hZ2VgKSxcbiAgICAgIHNob3dfbWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgZGF0YVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBzaG93X21lc3NhZ2UocmVxdWVzdCl7XG4gICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEgJyA6ICdGYWlsdXJlISAnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIGtleT17YHRyPSR7aX1gfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0ga2V5PXtgbGlzdC0ke2l9YH0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZV9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+Q2hhbmdlIHN0b3JlIGRldGFpbHM8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPHA+T3duZXI6IHt0aGlzLnN0YXRlLm93bmVyLnVzZXJuYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8VXNlcl9TZWFyY2hfV2lkZ2V0IG93bmVyPXt0aGlzLnN0YXRlLm93bmVyfSB1c2Vycz17dGhpcy5zdGF0ZS5jb250cmlidXRvcnN9IHBhc3NVc2Vycz17dGhpcy5oYW5kbGVVc2Vyc30vPlxuICAgICAgICAgIFxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIFxuICAgIH1cbiAgfVxufVxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogXG4gKiBTdG9yZXMgdGFibGUgYW5kIHBhZ2VcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIFN0b3Jlc19QYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hY3RpdmVfcGFnZSAhPSAnU3RvcmVzX1BhZ2UnKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYWdlXCI+XG4gICAgICAgIDxTdG9yZXNfVGFibGUgLz5cbiAgICAgICAgPEFkZF9TdG9yZV9CdXR0b24gb25DbGljayA9IHt0aGlzLmhhbmRsZUNsaWNrfS8+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbnZhciBBZGRfU3RvcmVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9TdG9yZV9QYWdlJztcbiAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9zdG9yZV9idXR0b25cIiBcbiAgICAgICAgb25DbGljayA9IHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICAgIEFkZCBuZXcgc3RvcmVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIClcbiAgfVxufSlcblxuXG52YXIgU3RvcmVzX1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoe1xuICAgICAgc3RvcmVzOiBbXSxcbiAgICAgIHVzZXJzOiBbXVxuICAgIH0pO1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2cobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykpO1xuICAgIHZhciBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgIHZhciByZXF1ZXN0X3VybCA9ICcvdXNlci8nICsgX3VzZXJfaWQgKyAnL3N0b3JlJztcblxuICAgIHZhciBnZXQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBnZXQub3BlbihcIkdFVFwiLCByZXF1ZXN0X3VybCk7XG4gICAgZ2V0ID0gc2V0X0hUVFBfaGVhZGVyKGdldCk7XG4gICAgZ2V0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChnZXQucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKGdldC5yZXNwb25zZVRleHQpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBzdG9yZXM6IHJlcy5zdG9yZXMsXG4gICAgICAgICAgdXNlcnM6IHJlcy51c2Vyc1xuICAgICAgICB9KVxuXG4gICAgICB9XG4gICAgfVxuICAgIGdldC5zZW5kKCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJvd3MgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUuc3RvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25zW2ldKTsgXG4gICAgICB2YXIgdXNlciA9IHRoaXMuc3RhdGUudXNlcnNbaV07XG4gICAgICBpZiAodXNlciA9PT0gdW5kZWZpbmVkKSB7IHVzZXIgPSBudWxsOyB9XG5cbiAgICAgICAgcm93cy5wdXNoKFxuXG4gICAgICAgICAgPFN0b3Jlc19UYWJsZV9Sb3cgXG4gICAgICAgICAgICBrZXk9e2l9IFxuICAgICAgICAgICAgc3RvcmU9e3RoaXMuc3RhdGUuc3RvcmVzW2ldfSBcbiAgICAgICAgICAgIHVzZXI9e3VzZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4oXG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgIDx0aD5TdG9yZTwvdGg+XG4gICAgICAgICAgICAgIDx0aD5Pd25lcjwvdGg+XG4gICAgICAgICAgICAgIDx0aD5BY3Rpb25zPC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIClcbiAgfVxufSlcblxudmFyIFN0b3Jlc19UYWJsZV9Sb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldFRyYW5zYWN0aW9uczogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB2YXIgVVJMID0gKFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSArIFwiL3N0b3JlL1wiICsgXG4gICAgICAgIHRoaXMucHJvcHMuc3RvcmUuX2lkICsgXCIvdHJhbnNcIik7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgVVJMKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIC8vIEkgaGF2ZSB0byBwYXNzIHRoaXMgXCJyZXNcIiB0byB0aGUgcmVhbHBhZ2Ugb3IgdHJhbnMgdmlldyBwYWdlXG4gICAgICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbnNfVmlld19QYWdlJztcbiAgICAgICAgcmVzLmFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnLCAocmVzKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVxLnNlbmQoKTtcbiAgfSxcbiAgbWFuYWdlU3RvcmU6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9IFwiU3RvcmVfTWFuYWdlbWVudF9QYWdlXCI7XG4gICAgbGV0IGFjdGl2ZV9zdG9yZSA9IHRoaXMucHJvcHMuc3RvcmU7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZSwgYWN0aXZlX3N0b3JlOiBhY3RpdmVfc3RvcmV9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgICA8dHI+XG4gICAgICAgIDx0ZD4geyB0aGlzLnByb3BzLnN0b3JlLm5hbWUgfTwvdGQ+XG4gICAgICAgIDx0ZD4geyB0aGlzLnByb3BzLnVzZXIudXNlcm5hbWUgfTwvdGQ+XG4gICAgICAgIDx0ZD48YnV0dG9uIG9uQ2xpY2sgPSB7dGhpcy5nZXRUcmFuc2FjdGlvbnN9PlZpZXcgbG9hbnM8L2J1dHRvbj48YnV0dG9uIG9uQ2xpY2sgPSB7dGhpcy5tYW5hZ2VTdG9yZX0+RWRpdDwvYnV0dG9uPjwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIClcbiAgfVxufSlcblxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIFVzZXJfTWFuYWdlbWVudF9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8vV2hlbiBjb21wb25lbnQgbW91bnRzLCBzZW5kIGEgR0VUIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBwb3B1bGF0ZVxuICAgICAgLy90aGVzZSBmaWVsZHMgXG4gICAgICBwaG9uZV9udW1iZXI6ICcnLFxuICAgICAgX2lkOiAnJyxcbiAgICAgIHVzZXJuYW1lOiAnJyxcbiAgICAgIHN0YXR1c19tZXNzYWdlOiAnJ1xuICAgIH1cbiAgICB0aGlzLmNvbXBvbmVudERpZE1vdW50ID0gdGhpcy5jb21wb25lbnREaWRNb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc29sZS5sb2coJ21vdW50ZWQnKTtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJHRVRcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKHJlc1swXSkpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNbMF1bJ3VzZXJuYW1lJ10pO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBwaG9uZV9udW1iZXI6IHJlc1swXS5waG9uZV9udW1iZXIsXG4gICAgICAgICAgX2lkOiByZXNbMF0uX2lkLFxuICAgICAgICAgIHVzZXJuYW1lOiByZXNbMF0udXNlcm5hbWVcbiAgICAgICAgfSlcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlcS5zZW5kKCk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgdmFyIHN0YXRlID0ge307XG4gICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgIH1cbiAgfVxuICBcbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICAvL1NlbmQgYSBQT1NUIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgIC8vIFRoZSBzZXJ2ZXIgbmVlZHMgdG8gY2hlY2sgdGhhdCB0aGlzIHBob25lIG51bWJlciBpc24ndCBhbHJlYWR5IHVzZWRcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIsXG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZVxuICAgIH1cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxLm9wZW4oXCJQVVRcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEnIDogJ0ZhaWx1cmUhJykgKyByZXMubWVzc2FnZSBcbiAgICAgIH0pO1xuICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZShyZXMudXNlcik7XG4gICAgfSAgICAgIFxuICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIHJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1VzZXJfTWFuYWdlbWVudF9QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxwPiB7dGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZX0gPC9wPlxuICAgICAgICA8aDE+Q2hhbmdlIHVzZXIgZGV0YWlsczwvaDE+XG4gICAgICAgIDxwPklmIHlvdSBjaGFuZ2UgeW91ciBwaG9uZSBudW1iZXIsIHlvdSBjYW4gZWRpdCBpdCBoZXJlLjwvcD5cbiAgICAgICAgPGZvcm0+XG4gICAgICAgIDxwPlBob25lOiB7dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9IDwvcD5cbiAgICAgICAgPHA+VXNlcjoge3RoaXMuc3RhdGUudXNlcm5hbWV9IDwvcD5cbiAgICAgICAgXG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGhvbmVfbnVtYmVyXCI+UGhvbmUgbnVtYmVyIChsb2dpbiB3aXRoIHRoaXMpPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgcmVxdWlyZWQ9J3JlcXVpcmVkJ1xuICAgICAgICAgIHR5cGU9J251bWJlcicgXG4gICAgICAgICAgaWQ9J3Bob25lX251bWJlcicgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnBob25lX251bWJlcn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ3Bob25lX251bWJlcicpXG4gICAgICAgICAgfVxuICAgICAgICAgIC8+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPSd1c2VyX25hbWUnPk5hbWU6IENob29zZSBhXG4gICAgICAgIG5hbWUgdGhhdCBpcyB1bmlxdWUgc28gcGVvcGxlIGNhbiBmaW5kIHlvdS48L2xhYmVsPlxuICAgICAgICA8aW5wdXQgXG4gICAgICAgICAgcmVxdWlyZWQ9J3JlcXVpcmVkJ1xuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIGlkPVwidXNlcl9uYW1lXCIgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLnVzZXJuYW1lfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgndXNlcm5hbWUnKX1cbiAgICAgICAgICAvPlxuXG4gICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdTYXZlIGNoYW5nZXMnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fS8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgfVxufVxuXG4vLyBSZWFjdERPTS5yZW5kZXIoIDxVc2VyX01hbmFnZW1lbnRfUGFnZS8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpICk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNsYXNzIEhvbWVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VyOiB7fSxcbiAgICAgIGFjdGl2ZV9wYWdlOiAnSG9tZSBQYWdlJyxcbiAgICAgIGFjdGl2ZV9zdG9yZToge30sXG4gICAgICBzdG9yZV90cmFuc2FjdGlvbnM6IHt9LFxuICAgICAgdHJhbnNhY3Rpb25fc2hvd246IHt9LFxuICAgICAgc3RhdHVzX21lc3NhZ2U6ICcnLFxuICAgIH07XG4gICAgdGhpcy5nb1RvID0gdGhpcy5nb1RvLmJpbmQodGhpcyk7XG4gICAgdGhpcy5jb21wb25lbnRXaWxsTW91bnQgPSB0aGlzLmNvbXBvbmVudFdpbGxNb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50RGlkTW91bnQgPSB0aGlzLmNvbXBvbmVudERpZE1vdW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy51cGRhdGVVc2VyID0gdGhpcy51cGRhdGVVc2VyLmJpbmQodGhpcyk7XG4gICAgdGhpcy5sb2dvdXQgPSB0aGlzLmxvZ291dC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgIC8vIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XG5cbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgbGV0IHVybCA9ICcvdXNlci8nICsgX3VzZXJfaWQ7XG5cbiAgICAvLyBjb25zb2xlLmxvZyh1cmwpO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHVybCk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgbGV0IHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgaWYgKHJlcy5zdWNjZXNzID09IGZhbHNlICkge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcy5tZXNzYWdlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHN0YXR1c19tZXNzYWdlOiByZXMubWVzc2FnZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHZhciB1c2VyID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICB0aGlzLnN0YXRlLnVzZXIgPSB1c2VyWzBdO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdXNlcjogdGhpcy5zdGF0ZS51c2VyXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodG9rZW4gIT0gbnVsbCkge1xuICAgICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgfVxuICAgIHJlcS5zZW5kKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcblxuICAgIGRpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcignc2VuZF9zdG9yZV90cmFuc2FjdGlvbnMnLCAoc3RvcmVfdHJhbnMpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHN0b3JlX3RyYW5zKTtcbiAgICAgICAgLy9GaXJzdCwgdGFrZSBvdXQgdGhlIFwiYWN0aXZlIHN0b3JlXCJcbiAgICAgIHZhciBhY3RpdmVfc3RvcmUgPSBzdG9yZV90cmFucy5hY3RpdmVfc3RvcmU7XG4gICAgICBkZWxldGUgc3RvcmVfdHJhbnMuYWN0aXZlX3N0b3JlO1xuICAgICAgdGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnMgPSBzdG9yZV90cmFucztcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlID0gYWN0aXZlX3N0b3JlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9ucyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYWN0aXZlX3N0b3JlOiB0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZSxcbiAgICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9uc1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgICBcbiAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycsXG4gICAgICAgICh0cmFuc2FjdGlvbikgPT4ge1xuICAgICAgICAgIHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24gPSB0cmFuc2FjdGlvbjtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2FsbGVkJyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24pO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhkaXNwYXRjaGVyLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duKTtcbiAgICAgICAgfSk7XG4gICAgICBcbiAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZV90cmFuc2FjdGlvbicsIChhY3Rpb24pID0+IHtcbiAgICAgIGNvbnN0IF91c2VyX2lkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyk7XG4gICAgICB2YXIgdXBkYXRlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24uX2lkKTtcbiAgICAgIGxldCBpZCA9IHRoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd24uX2lkO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpZCk7XG4gICAgICBsZXQgdXJsID0gJy91c2VyLycrIF91c2VyX2lkICsgJy9zdG9yZS8nICsgdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUuX2lkICsgJy90cmFucy8nICsgaWQgKyAnLycgKyBhY3Rpb247XG4gICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICAvLyAvdHJhbnMvX2lkL3JlbmV3XG4gICAgICB1cGRhdGUub3BlbignUFVUJywgdXJsKTtcblxuICAgICAgdXBkYXRlLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKHVwZGF0ZS5yZWFkeVN0YXRlID09IDQpe1xuICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJywgXG4gICAgICAgICAgICBKU09OLnBhcnNlKHVwZGF0ZS5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICAgIC8vIFdoeSBkbyBJIGV2ZW4gbmVlZCB0byBkaXNwYXRjaCB0aGlzIGV2ZW50IHRvIGJlIGhvbmVzdFxuICAgICAgICAgICAgLy8gSSBjYW4gbXV0YXRlIHRoZSBzdGF0ZSBzdHJhaWdodCBhd2F5IGZyb20gaGVyZS4gQWggd2VsbFxuICAgICAgICAgICAgLy8gSSB0aGluayBpdCdzIGNsZWFuZXIgdG8gZG8gdGhpcy4gRFJZIGFmdGVyIGFsbC4uLlxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgc2V0X0hUVFBfaGVhZGVyKHVwZGF0ZSkuc2VuZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ29UbyhwYWdlKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBsZXQgYWN0aXZlX3BhZ2UgPSBwYWdlO1xuICAgICAgLy9jb25zb2xlLmxvZyhhY3RpdmVfcGFnZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlXG4gICAgICB9KTtcbiAgICB9O1xuICB9XG4gIFxuICB1cGRhdGVVc2VyKHVzZXIpIHtcbiAgICB0aGlzLnN0YXRlLnVzZXIgPSB1c2VyO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXNlcjogdXNlclxuICAgIH0pO1xuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHdpbmRvdy5sb2NhdGlvbiA9ICcvbG9naW4uaHRtbCc7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSAhPT0gJycpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZU1lc3NhZ2UobWVzc2FnZSkge3JldHVybiB7X19odG1sOiBtZXNzYWdlfTt9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpfSAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4oXG4gICAgICAgIDxkaXY+XG4gICAgICAgIDxoZWFkZXI+e3RoaXMuc3RhdGUudXNlci51c2VybmFtZX0gPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmxvZ291dH0+TG9nb3V0PC9idXR0b24+PC9oZWFkZXI+XG4gICAgICAgIDxoMT57dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX08L2gxPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuZ29UbygnVXNlcl9NYW5hZ2VtZW50X1BhZ2UnKX0+RWRpdCB1c2VyPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5nb1RvKCdTdG9yZXNfUGFnZScpfT5WaWV3IHN0b3JlczwvYnV0dG9uPlxuXG4gICAgICAgIDxTdG9yZXNfUGFnZSBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfS8+XG4gICAgICAgICAgPEFkZF9TdG9yZV9QYWdlIFxuICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxTdG9yZV9NYW5hZ2VtZW50X1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfcGFnZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgYWN0aXZlX3N0b3JlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRyYW5zYWN0aW9uc19WaWV3X1BhZ2UgXG4gICAgICAgICAgICBhY3RpdmVfc3RvcmU9e3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgICAgYWN0aXZlX3BhZ2U9e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM9e3RoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX1BhZ2VcbiAgICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgICAgYWN0aXZlX3N0b3JlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3N0b3JlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlXG4gICAgICAgICAgICAgIGFjdGl2ZV9wYWdlPXt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgICB0cmFuc2FjdGlvbiA9e3RoaXMuc3RhdGUudHJhbnNhY3Rpb25fc2hvd259XG4gICAgICAgICAgICAvPlxuICAgICAgICA8VXNlcl9NYW5hZ2VtZW50X1BhZ2UgXG4gICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICBvblVwZGF0ZSA9IHt0aGlzLnVwZGF0ZVVzZXJ9XG4gICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICB9XG59XG5cbnZhciBob21lUGFnZSA9IFJlYWN0RE9NLnJlbmRlciggPEhvbWVfUGFnZS8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
