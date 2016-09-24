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
/*global make_request*/
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
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(User_Search_Widget, [{
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

User_Search_Widget.propTypes = {
  owner: React.PropTypes.object.isRequired,
  passUsers: React.PropTypes.func.isRequired
};
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
      owner: {},
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
            React.createElement(User_Search_Widget, { owner: this.state.owner, passUsers: this.handleUsers }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiLCJob21lX2J1dHRvbi5qc3giLCJkaXNwYXRjaGVyLmpzIiwidXNlcl9zZWFyY2hfd2lkZ2V0LmpzeCIsImFkZF9zdG9yZS5qc3giLCJhZGRfdHJhbnNhY3Rpb24uanN4IiwidHJhbnNhY3Rpb25fdmlld19kZXRhaWwuanN4IiwidHJhbnNhY3Rpb25zX3ZpZXcuanN4Iiwic3RvcmVfbWFuYWdlbWVudC5qc3giLCJzdG9yZXNfcGFnZS5qc3giLCJ1c2VyX21hbmFnZW1lbnQuanN4IiwibWFpbi5qc3giXSwibmFtZXMiOlsiZGVib3VuY2UiLCJmdW5jIiwid2FpdCIsImltbWVkaWF0ZSIsInRpbWVvdXQiLCJjb250ZXh0IiwiYXJncyIsImFyZ3VtZW50cyIsImxhdGVyIiwiYXBwbHkiLCJjYWxsTm93IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInNldF9IVFRQX2hlYWRlciIsInJlcXVlc3QiLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRSZXF1ZXN0SGVhZGVyIiwibWFrZV9yZXF1ZXN0IiwiYWN0aW9uIiwidXJpIiwid2hlbl9yZXNwb25zZSIsImRhdGEiLCJyZXEiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic2V0X3JlcXVlc3RfaGVhZGVycyIsInNlbmRfZGF0YSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiQmFja190b19Ib21lX0J1dHRvbiIsIlJlYWN0IiwiY3JlYXRlQ2xhc3MiLCJoYW5kbGVDbGljayIsImV2ZW50IiwiYWN0aXZlX3BhZ2UiLCJob21lUGFnZSIsInNldFN0YXRlIiwicHJldmVudERlZmF1bHQiLCJyZW5kZXIiLCJkaXNwYXRjaGVyIiwiRGlzcGF0Y2hlciIsIkV2ZW50IiwibmFtZSIsImNhbGxiYWNrcyIsInByb3RvdHlwZSIsInJlZ2lzdGVyQ2FsbGJhY2siLCJjYWxsYmFjayIsInB1c2giLCJldmVudHMiLCJyZWdpc3RlckV2ZW50IiwiZXZlbnRfbmFtZSIsImRpc3BhdGNoRXZlbnQiLCJldmVudF9hcmd1bWVudHMiLCJmb3JFYWNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsIlVzZXJfU2VhcmNoX1dpZGdldCIsInByb3BzIiwic3RhdGUiLCJ1c2VycyIsInNlbGVjdGVkX3VzZXJzIiwic2VsZWN0ZWRfdXNlcnNfaWQiLCJiaW5kIiwiaGFuZGxlQ2hhbmdlIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJjbGlja2VkIiwidGFyZ2V0IiwicGFyZW50Tm9kZSIsImlkIiwiaW5kZXhPZiIsIl9pZCIsIm93bmVyIiwicGFzc1VzZXJzIiwia2V5IiwiZ2V0X3VzZXJzIiwicmVzIiwicGFyc2UiLCJyZXNwb25zZVRleHQiLCJ2YWx1ZSIsInJvd3MiLCJjIiwidW5kZWZpbmVkIiwiaSIsImxlbmd0aCIsInVzZXJuYW1lIiwicGhvbmVfbnVtYmVyIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsIkFkZF9TdG9yZV9QYWdlIiwiY29udHJpYnV0b3JzX2lkcyIsImNvbnRyaWJ1dG9ycyIsIm91dHB1dF9jb250ZW50Iiwic3RhdHVzX21lc3NhZ2UiLCJoYW5kbGVTdWJtaXQiLCJjb250cmlidXRvcnNfaWQiLCJfdXNlcl9pZCIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwiZCIsIkFkZF9JdGVtX0J1dHRvbiIsIkNsaWNrIiwiUmVtb3ZlX0l0ZW1fQnV0dG9uIiwiQWRkX1RyYW5zYWN0aW9uX1BhZ2UiLCJnZXRJbml0aWFsU3RhdGUiLCJpdGVtX2NvdW50IiwiaXRlbXMiLCJhbW91bnQiLCJleHBpcnlfZGF0ZV9udW1iZXIiLCJleHBpcnlfZGF0ZV9zZWxlY3RvciIsImhhbmRsZUFkZENsaWNrIiwiaXRlbV9uYW1lIiwiaXRlbV9hbW91bnQiLCJoYW5kbGVSZW1vdmVDbGljayIsInNwbGljZSIsImFzc2VydCIsInJlcGxhY2UiLCJhY3RpdmVfc3RvcmUiLCJoYW5kbGVOYW1lQ2hhbmdlIiwiaGFuZGxlUGhvbmVOb0NoYW5nZSIsImhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2UiLCJoYW5kbGVFeHBpcnlEdXJhdGlvbkNoYW5nZSIsIkl0ZW0iLCJvbkNoYW5nZSIsInJlYWN0X2tleSIsInJlZnMiLCJ2YWx1ZXMiLCJUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlIiwidHJhbnNhY3Rpb24iLCJSZXR1cm5fSXRlbXNfQnV0dG9uIiwiUmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIiwiVHJhbnNhY3Rpb25fRGV0YWlsX1RhYmxlIiwiYWxsX2l0ZW1zIiwiaXRlbSIsImRhdGUiLCJzdWJzdHJpbmciLCJleHBpcnlfZGF0ZSIsInJldHVybmVkIiwidG9TdHJpbmciLCJUcmFuc2FjdGlvbnNfVmlld19QYWdlIiwidHJhbnNhY3Rpb25zIiwiQWRkX1RyYW5zYWN0aW9uX0J1dHRvbiIsIlRyYW5zYWN0aW9uX1RhYmxlIiwiVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyIsIlRhYmxlX1JvdyIsImRheXNfdGlsbF9leHBpcnkiLCJlX2QiLCJEYXRlIiwiTWF0aCIsImNlaWwiLCJub3ciLCJwYXJzZV9kYXRlIiwic3RhdHVzIiwidHJfc3R5bGUiLCJ0ZXh0RGVjb3JhdGlvbiIsImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIiwiU3RvcmVfTWFuYWdlbWVudF9QYWdlIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsImhhbmRsZVVzZXJzIiwibmV4dHByb3BzIiwidXNlcl9pZHMiLCJzaG93X21lc3NhZ2UiLCJTdG9yZXNfUGFnZSIsIkFkZF9TdG9yZV9CdXR0b24iLCJTdG9yZXNfVGFibGUiLCJzdG9yZXMiLCJjb21wb25lbnREaWRNb3VudCIsInJlcXVlc3RfdXJsIiwiZ2V0IiwidXNlciIsIlN0b3Jlc19UYWJsZV9Sb3ciLCJnZXRUcmFuc2FjdGlvbnMiLCJVUkwiLCJzdG9yZSIsIm1hbmFnZVN0b3JlIiwiVXNlcl9NYW5hZ2VtZW50X1BhZ2UiLCJvblVwZGF0ZSIsIkhvbWVfUGFnZSIsInN0b3JlX3RyYW5zYWN0aW9ucyIsInRyYW5zYWN0aW9uX3Nob3duIiwiZ29UbyIsImNvbXBvbmVudFdpbGxNb3VudCIsInVwZGF0ZVVzZXIiLCJsb2dvdXQiLCJ1cmwiLCJzdG9yZV90cmFucyIsInVwZGF0ZSIsInBhZ2UiLCJjbGVhciIsIndpbmRvdyIsImxvY2F0aW9uIiwiY3JlYXRlTWVzc2FnZSIsIl9faHRtbCIsIlJlYWN0RE9NIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTQSxRQUFULENBQWtCQyxJQUFsQixFQUF3QkMsSUFBeEIsRUFBOEJDLFNBQTlCLEVBQXlDO0FBQ3ZDLE1BQUlDLE9BQUo7QUFDQSxTQUFPLFlBQVc7QUFDaEIsUUFBSUMsVUFBVSxJQUFkO0FBQUEsUUFBb0JDLE9BQU9DLFNBQTNCO0FBQ0EsUUFBSUMsUUFBUSxTQUFSQSxLQUFRLEdBQVc7QUFDckJKLGdCQUFVLElBQVY7QUFDQSxVQUFJLENBQUNELFNBQUwsRUFBZ0JGLEtBQUtRLEtBQUwsQ0FBV0osT0FBWCxFQUFvQkMsSUFBcEI7QUFDakIsS0FIRDtBQUlBLFFBQUlJLFVBQVVQLGFBQWEsQ0FBQ0MsT0FBNUI7QUFDQU8saUJBQWFQLE9BQWI7QUFDQUEsY0FBVVEsV0FBV0osS0FBWCxFQUFrQk4sSUFBbEIsQ0FBVjtBQUNBLFFBQUlRLE9BQUosRUFBYVQsS0FBS1EsS0FBTCxDQUFXSixPQUFYLEVBQW9CQyxJQUFwQjtBQUNkLEdBVkQ7QUFXRDs7QUFFRCxTQUFTTyxlQUFULENBQXlCQyxPQUF6QixFQUFrQztBQUNoQyxNQUFNQyxRQUFRQyxhQUFhQyxPQUFiLENBQXFCLE9BQXJCLENBQWQ7O0FBRUEsTUFBSUYsS0FBSixFQUFXO0FBQ1RELFlBQVFJLGdCQUFSLENBQXlCLGdCQUF6QixFQUEyQ0gsS0FBM0M7QUFDQSxXQUFPRCxPQUFQO0FBQ0QsR0FIRCxNQUlLO0FBQ0gsV0FBTyxxREFBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7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ZSxLQUFLdUIsS0FBTCxDQUFXdkI7QUFENUIsVUFQRjtBQVVFLDRCQUFDLHFCQUFEO0FBQ0UsdUJBQWUsS0FBS3VCLEtBQUwsQ0FBV3ZCLFdBRDVCO0FBRUUsd0JBQWdCLEtBQUt1QixLQUFMLENBQVcrRDtBQUY3QixVQVZGO0FBY0UsNEJBQUMsc0JBQUQ7QUFDRSx3QkFBYyxLQUFLL0QsS0FBTCxDQUFXK0QsWUFEM0I7QUFFRSx1QkFBYSxLQUFLL0QsS0FBTCxDQUFXdkIsV0FGMUI7QUFHRSx3QkFBYyxLQUFLdUIsS0FBTCxDQUFXNkg7QUFIM0IsVUFkRjtBQW1CSSw0QkFBQyxvQkFBRDtBQUNFLHVCQUFlLEtBQUs3SCxLQUFMLENBQVd2QixXQUQ1QjtBQUVFLHdCQUFnQixLQUFLdUIsS0FBTCxDQUFXK0Q7QUFGN0IsVUFuQko7QUF1QkksNEJBQUMsNEJBQUQ7QUFDRSx1QkFBYSxLQUFLL0QsS0FBTCxDQUFXdkIsV0FEMUI7QUFFRSx1QkFBYyxLQUFLdUIsS0FBTCxDQUFXOEg7QUFGM0IsVUF2Qko7QUEyQkEsNEJBQUMsb0JBQUQ7QUFDRSx1QkFBZSxLQUFLOUgsS0FBTCxDQUFXdkIsV0FENUI7QUFFRSxvQkFBWSxLQUFLd0o7QUFGbkI7QUEzQkEsT0FESjtBQWtDRDs7OztFQWhMcUI1SixNQUFNeUQ7O0FBbUw5QixJQUFJcEQsV0FBV2tLLFNBQVMvSixNQUFULENBQWlCLG9CQUFDLFNBQUQsT0FBakIsRUFBK0JnSyxTQUFTQyxjQUFULENBQXdCLFNBQXhCLENBQS9CLENBQWYiLCJmaWxlIjoicmVhY3RDb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4vLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpIHtcbiAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcblxuICBpZiAodG9rZW4pIHtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ3gtYWNjZXNzLXRva2VuJywgdG9rZW4pO1xuICAgIHJldHVybihyZXF1ZXN0KTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4oJ0Vycm9yOiB0b2tlbiBjb3VsZCBub3QgYmUgZm91bmQuIENoZWNrIGxvY2FsU3RvcmFnZScpO1xuICB9XG59XG5cbi8qXG4vLyAxXG5yZXEub3BlbignUFVUJywgYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlL2AgK1xudGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkICsgJy9tYW5hZ2UnKTsgXG5cbi8vIDIgKDIgdGhpbmdzKVxucmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuXG4vLyAzXG5yZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4qL1xuXG5mdW5jdGlvbiBtYWtlX3JlcXVlc3QoYWN0aW9uLCB1cmksIHdoZW5fcmVzcG9uc2UsIGRhdGEpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJykgeyBkYXRhID0gbnVsbDsgfVxuICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcS5vcGVuKGFjdGlvbiwgdXJpKTtcbiAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgd2hlbl9yZXNwb25zZShyZXEpO1xuICAgIH0gXG4gIH07XG4gIHNldF9yZXF1ZXN0X2hlYWRlcnMocmVxLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gc2V0X3JlcXVlc3RfaGVhZGVycyhyZXF1ZXN0LCBkYXRhKSB7XG4gIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgc2V0X0hUVFBfaGVhZGVyKHJlcXVlc3QpO1xuICBzZW5kX2RhdGEocmVxdWVzdCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIHNlbmRfZGF0YShyZXF1ZXN0LCBkYXRhKXtcbiAgcmVxdWVzdC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbn1cbiIsInZhciBCYWNrX3RvX0hvbWVfQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdIb21lX1BhZ2UnO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImhvbWVfYnV0dG9uXCIgb25DbGljayA9XG4gICAgICB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgQmFja1xuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIERpc3BhdGNoZXIvIFJlYWN0b3IgcGF0dGVybiBtb2RlbFxuICpcbiAqIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTUzMDgzNzEvY3VzdG9tLWV2ZW50cy1tb2RlbC1cbiAqIHdpdGhvdXQtdXNpbmctZG9tLWV2ZW50cy1pbi1qYXZhc2NyaXB0XG4gKlxuICogSG93IGl0IHdvcmtzOlxuICogLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBSZWdpc3RlciBldmVudHMuIEFuIGV2ZW50IGlzIGJhc2ljYWxseSBhIHJlcG9zaXRvcnkgb2YgY2FsbGJhY2sgZnVuY3Rpb25zLlxuICogQ2FsbCB0aGUgZXZlbnQgdG8gY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zLiBcbiAqIEhvdyB0byBjYWxsIHRoZSBldmVudD8gVXNlIERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudF9uYW1lKVxuICogXG4gKiBBIERpc3BhdGNoZXIgaXMgYSBsaXN0IG9mIEV2ZW50cy4gU28gY2FsbGluZyBEaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnRcbiAqIGJhc2ljYWxseSBmaW5kcyB0aGUgZXZlbnQgaW4gdGhlIERpc3BhdGNoZXIgYW5kIGNhbGxzIGl0XG4gKlxuICogRGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50IC0tPiBjYWxscyB0aGUgRXZlbnQgLS0tPiBjYWxscyB0aGUgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uKHMpIG9mIHRoZSBFdmVudC4gXG4gKlxuICogSG93IGRvIHdlIHNldCB0aGUgY2FsbGJhY2sgZnVuY3Rpb25zIG9mIHRoZSBFdmVudD8gVXNlIGFkZEV2ZW50TGlzdGVuZXIuXG4gKiBhZGRFdmVudExpc3RlbmVyIGlzIHJlYWxseSBhIG1pc25vbWVyLCBpdCBzaG91bGQgYmUgY2FsbGVkIGFkZENhbGxCYWNrLlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxudmFyIGRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG5mdW5jdGlvbiBFdmVudChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuY2FsbGJhY2tzID0gW107XG59O1xuXG5FdmVudC5wcm90b3R5cGUucmVnaXN0ZXJDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG59O1xuXG5mdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICB0aGlzLmV2ZW50cyA9IHt9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlckV2ZW50ID0gZnVuY3Rpb24oZXZlbnRfbmFtZSkge1xuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoZXZlbnRfbmFtZSk7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdID0gZXZlbnQ7XG4gIC8vIGNvbnNvbGUubG9nKHRoaXMuZXZlbnRzKTtcbn1cblxuRGlzcGF0Y2hlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKGV2ZW50X25hbWUsIGV2ZW50X2FyZ3VtZW50cyl7XG4gIHRoaXMuZXZlbnRzW2V2ZW50X25hbWVdLmNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2soZXZlbnRfYXJndW1lbnRzKTtcbiAgICAvLyBjb25zb2xlLmxvZygnZGlzcGF0Y2hlZCcpO1xuICAgIC8vIGNvbnNvbGUubG9nKGNhbGxiYWNrLCBldmVudF9hcmd1bWVudHMpO1xuICB9KTtcbn07XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudF9uYW1lLCBjYWxsYmFjaykge1xuICB0aGlzLmV2ZW50c1tldmVudF9uYW1lXS5yZWdpc3RlckNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgLy8gY29uc29sZS5sb2coY2FsbGJhY2spO1xufTtcblxuLyogLS0tLS0tLS0tLS0tLVxuICogRGlzcGF0Y2hlciBldmVudHNcbiAqIC0tLS0tLS0tLS0tLS0tLS0qL1xuXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycpO1xuLy9TZW5kIFRyYW5zYWN0aW9uIERldGFpbHMgaGFzIGEgbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQgXG4vL3RoYXQgdGFrZXMgaW4gYSBKU09OIG9iamVjdCBhcyBhIHBhcmFtZXRlci4gVGhpcyBKU09OIG9iamVjdCBpcyB0aGUgXG4vL3RyYW5zYWN0aW9uLiBUaGVuIHRoZSBEZXRhaWwgVmlldyBUYWJsZSB3aWxsIHVwZGF0ZS4gXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3VwZGF0ZV90cmFuc2FjdGlvbicpXG5kaXNwYXRjaGVyLnJlZ2lzdGVyRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJyk7XG5cblxuXG4iLCIvKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBtYWtlX3JlcXVlc3QqL1xuLyplc2xpbnQgbm8tdW5kZWY6IFwiZXJyb3JcIiovXG4vKmVzbGludCBuby1jb25zb2xlOiBcIm9mZlwiKi9cbi8qZXNsaW50LWVudiBub2RlKi9cblxuY2xhc3MgVXNlcl9TZWFyY2hfV2lkZ2V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJzOiBbXSxcbiAgICAgIHNlbGVjdGVkX3VzZXJzOiBbXSxcbiAgICAgIHNlbGVjdGVkX3VzZXJzX2lkOiBbXSAgICAgICAgXG4gICAgfTtcbiAgICB0aGlzLmhhbmRsZUNsaWNrID0gdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuICBcbiAgaGFuZGxlQ2xpY2soZSkge1xuICAgIGNvbnNvbGUubG9nKCdjbGlja2VkJyk7XG4gICAgbGV0IGNsaWNrZWQgPSBlLnRhcmdldC5wYXJlbnROb2RlLmlkO1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnNfaWQuaW5kZXhPZih0aGlzLnN0YXRlLnVzZXJzW2NsaWNrZWRdLl9pZCkgIT0gLTEgfHwgXG4gICAgICAgIHRoaXMucHJvcHMub3duZXIuaW5kZXhPZih0aGlzLnN0YXRlLnVzZXJzW2NsaWNrZWRdLl9pZCkgIT0gLTEgKSB7XG4gICAgICBjb25zb2xlLmxvZygnY29udHJpYnV0b3IgYWxyZWFkeSBleGlzdHMnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkX3VzZXJzLnB1c2godGhpcy5zdGF0ZS51c2Vyc1tjbGlja2VkXSk7XG4gICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkX3VzZXJzX2lkLnB1c2godGhpcy5zdGF0ZS51c2Vyc1tjbGlja2VkXS5faWQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHNlbGVjdGVkX3VzZXJzX2lkOiB0aGlzLnN0YXRlLnNlbGVjdGVkX3VzZXJzX2lkLFxuICAgICAgICBzZWxlY3RlZF91c2VyczogdGhpcy5zdGF0ZS5zZWxlY3RlZF91c2Vyc1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMucHJvcHMucGFzc1VzZXJzKHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnMsIHRoaXMuc3RhdGUuc2VsZWN0ZWRfdXNlcnNfaWQpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIGZ1bmN0aW9uIGdldF91c2VycyhyZXEpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHVzZXJzOiByZXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAndXNlcnMnKSB7IC8vIEkgaGF2ZSB0byBkZWJvdW5jZSB0aGlzXG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPSAnJykgeyAvL01ha2Ugc3VyZSBJIGRvbid0IHNlbmQgYSB1c2VsZXNzIGJsYW5rIHJlcXVlc3RcbiAgICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgbWFrZV9yZXF1ZXN0IChcbiAgICAgICAgICAgICdHRVQnLCBcbiAgICAgICAgICAgIGAvdXNlci8ke2UudGFyZ2V0LnZhbHVlfWAsXG4gICAgICAgICAgICBnZXRfdXNlcnMuYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdXNlcnM6IFtdXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIHJlbmRlcigpIHtcbiAgICB2YXIgcm93cyA9IFtdO1xuICAgIGxldCBjID0gdGhpcy5zdGF0ZS51c2VycztcbiAgICBcbiAgICBpZiAoYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4obnVsbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJvd3MucHVzaChcbiAgICAgICAgICAgIDx0clxuICAgICAgICAgICAgaWQ9e2l9XG4gICAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgICAgPHRkPntjW2ldLnBob25lX251bWJlcn08L3RkPlxuICAgICAgICAgICAgPC90cj4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBpZCA9ICdzZWFyY2gnPlxuICAgICAgICA8bGFiZWwgaHRtbEZvciA9J3NlYXJjaF91c2Vycyc+VXNlcnM8L2xhYmVsPlxuXG5cblxuICAgICAgICA8dGFibGUgaWQgPSBcIm91dHB1dF9jb250ZW50XCI+XG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgPHRyPjx0ZD5EaXNwbGF5IG5hbWU8L3RkPjx0ZD5QaG9uZSBudW1iZXI8L3RkPjwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAge3Jvd3N9XG4gICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgaWQgPSAnc2VhcmNoX3VzZXJzJ1xuICAgICAgICAgICAgdHlwZT0nc2VhcmNoJyBcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgndXNlcnMnKX0gXG4gICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICk7XG4gICAgfVxuICB9XG59XG5cblVzZXJfU2VhcmNoX1dpZGdldC5wcm9wVHlwZXMgPSB7XG4gIG93bmVyOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHBhc3NVc2VyczogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxufTsiLCIvKmdsb2JhbCBSZWFjdCovXG4vKmdsb2JhbCBzZXRfSFRUUF9oZWFkZXI6dHJ1ZSovXG4vKmVzbGludCBuby11bmRlZjogXCJlcnJvclwiKi9cbi8qZXNsaW50IG5vLWNvbnNvbGU6IFwib2ZmXCIqL1xuLyplc2xpbnQtZW52IG5vZGUqL1xuJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBBZGRfU3RvcmVfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjogW10sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UgPSB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKTtcbiAgfVxuICBoYW5kbGVDbGljayhlKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrZWQnKTtcbiAgICBsZXQgY2xpY2tlZCA9IGUudGFyZ2V0LnBhcmVudE5vZGUuaWQ7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50W2NsaWNrZWRdKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLmluZGV4T2YodGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpICE9IC0xKSB7XG4gICAgICBjb25zb2xlLmxvZygnY29udHJpYnV0b3IgYWxyZWFkeSBleGlzdHMnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9ycy5wdXNoKHRoaXMuc3RhdGUub3V0cHV0X2NvbnRlbnRbY2xpY2tlZF0pO1xuICAgICAgdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWRzLnB1c2godGhpcy5zdGF0ZS5vdXRwdXRfY29udGVudFtjbGlja2VkXS5faWQpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGNvbnRyaWJ1dG9yc19pZDogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNfaWQsXG4gICAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5jb250cmlidXRvcnMpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVDaGFuZ2Uoa2V5KSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBpZiAoa2V5ID09PSAnY29udHJpYnV0b3JzJykge1xuICAgICAgICAvLyBJIGhhdmUgdG8gZGVib3VuY2UgdGhpc1xuICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT0gJycpIHsgLy9NYWtlIHN1cmUgSSBkb24ndCBzZW5kIGEgdXNlbGVzcyBibGFuayByZXF1ZXN0XG4gICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHJlcS5vcGVuKCdHRVQnLCAnL3VzZXIvJyArIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiByZXNcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBzZXRfSFRUUF9oZWFkZXIocmVxKS5zZW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBvdXRwdXRfY29udGVudDogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgc3RhdGUgPSB7fTtcbiAgICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBPU1QgcmVxdWVzdCcpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgX3VzZXJfaWQ6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpLFxuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lLFxuICAgICAgY29udHJpYnV0b3JzOiB0aGlzLnN0YXRlLmNvbnRyaWJ1dG9yc1xuICAgIH07XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKCdQT1NUJywgICcvdXNlci8nICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyAnL3N0b3JlJyk7XG5cbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgdmFyIHJlcyA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7dGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RhdHVzX21lc3NhZ2U6IChyZXMuc3VjY2VzcyA/ICdTdWNjZXNzISAnIDogJ0ZhaWx1cmUhICcpICsgcmVzLm1lc3NhZ2UgXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTsgICAgICBcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdBZGRfU3RvcmVfUGFnZScpIHtcbiAgICAgIHJldHVybiAobnVsbCk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4oXG4gICAgICAgIDxkaXYgaWQ9XCJib2R5XCI+XG4gICAgICAgIDxoMT5BZGQgc3RvcmU8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8ZGl2IGlkID0gJ3NlYXJjaCc+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yID0nc2VhcmNoX2NvbnRyaWJ1dG9ycyc+Q29udHJpYnV0b3JzPC9sYWJlbD5cblxuICAgICAgICA8dWw+XG4gICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgIDwvdWw+XG5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQgPSAnc2VhcmNoX2NvbnRyaWJ1dG9ycydcbiAgICAgICAgICB0eXBlPSdzZWFyY2gnIFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZSgnY29udHJpYnV0b3JzJyl9IFxuICAgICAgICAvPlxuICAgICAgICBcbiAgICAgICAgPHRhYmxlIGlkID0gXCJvdXRwdXRfY29udGVudFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj48dGQ+RGlzcGxheSBuYW1lPC90ZD48dGQ+UGhvbmUgbnVtYmVyPC90ZD48L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuXG4iLCIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gKlxuICogQWRkIFRyYW5zYWN0aW9uIEZvcm0gUGFnZSBcbiAqIFxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgQWRkX0l0ZW1fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oZXZlbnQpe1xuICAgIHRoaXMucHJvcHMuQ2xpY2soKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF9pdGVtX2J1dHRvblwiIG9uQ2xpY2sgPVxuICAgICAge3RoaXMuaGFuZGxlQ2xpY2t9ID5cbiAgICAgIEFkZCBuZXcgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxudmFyIFJlbW92ZV9JdGVtX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB0aGlzLnByb3BzLkNsaWNrKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyZW1vdmVfaXRlbV9idXR0b25cIiBvbkNsaWNrID1cbiAgICAgIHt0aGlzLmhhbmRsZUNsaWNrfSA+XG4gICAgICBSZW1vdmUgaXRlbVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG59KTtcblxuXG52YXIgQWRkX1RyYW5zYWN0aW9uX1BhZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIHJldHVybiAgKHtcbiAgICBpdGVtX2NvdW50OiAxLFxuICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgbmFtZTogJycsXG4gICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG4gICAgZXhwaXJ5X2RhdGVfc2VsZWN0b3I6ICdtb250aCdcbiAgICB9KVxuICB9LFxuICBoYW5kbGVBZGRDbGljazogZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coXCJjbGlja2VkXCIpO1xuICAgIHRoaXMuc3RhdGUuaXRlbXMucHVzaCh7aXRlbV9uYW1lOiAnJywgaXRlbV9hbW91bnQ6ICcnfSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtX2NvdW50OiB0aGlzLnN0YXRlLml0ZW1fY291bnQgKyAxLFxuICAgICAgaXRlbXM6IHRoaXMuc3RhdGUuaXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5pdGVtX2NvdW50O1xuICB9LCAgXG4gIGhhbmRsZVJlbW92ZUNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyhcImNsaWNrZWRcIik7XG4gICAgdGhpcy5zdGF0ZS5pdGVtcy5zcGxpY2UoLTEsIDEpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuaXRlbXMpO1xuICAgIGlmICh0aGlzLnN0YXRlLml0ZW1fY291bnQgPT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5pdGVtX2NvdW50ID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLml0ZW1fY291bnQgLS07XG4gICAgfVxuICAgIGNvbnNvbGUuYXNzZXJ0KHRoaXMuc3RhdGUuaXRlbV9jb3VudCA+PSAwKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGl0ZW1fY291bnQ6IHRoaXMuc3RhdGUuaXRlbV9jb3VudCxcbiAgICAgIGl0ZW1zOiB0aGlzLnN0YXRlLml0ZW1zXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuaXRlbV9jb3VudDtcbiAgfSxcblxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7ICAgIFxuICAgIHZhciBkYXRhID0gIHtcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIC8vU3RyaXAgcGhvbmUgbnVtYmVyIGlucHV0cy5cbiAgICAgIHBob25lX251bWJlcjogdGhpcy5zdGF0ZS5waG9uZV9udW1iZXIucmVwbGFjZSgvIC9nLCAnJyksXG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtcyxcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXIsXG4gICAgICBleHBpcnlfZGF0ZV9zZWxlY3RvcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvclxuICAgIH07XG4gICAgXG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5uYW1lKTtcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG5cbiAgICBcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbihcIlBPU1RcIiwgXCIvdXNlci9cIiArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpICsgXCIvc3RvcmUvXCIgKyB0aGlzLnByb3BzLmFjdGl2ZV9zdG9yZS5faWQgKyBcIi90cmFuc1wiKTtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgcmVxdWVzdCA9IHNldF9IVFRQX2hlYWRlcihyZXF1ZXN0KTtcbiBcbiBcbiAgICByZXF1ZXN0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFxuICAgIC8vQ2xlYXIgZXZlcnl0aGluZy4uLlxuICAgIFxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXRlbV9jb3VudDogMSxcbiAgICAgIGl0ZW1zOiBbe25hbWU6ICcnLCBhbW91bnQ6ICcnfV0sXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHBob25lX251bWJlcjogJycsXG4gICAgICBleHBpcnlfZGF0ZV9udW1iZXI6IDEsXG5cbiAgICB9KTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0sXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24oa2V5LCBuYW1lLCBhbW91bnQpe1xuICAgIC8vIGNvbnNvbGUubG9nKGtleSwgaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zdGF0ZS5pdGVtc1trZXldLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuc3RhdGUuaXRlbXNba2V5XS5hbW91bnQgPSBhbW91bnQ7XG4gICAgLy8gY29uc29sZS5sb2coaXRlbV9uYW1lLCBpdGVtX2Ftb3VudCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpdGVtczogdGhpcy5zdGF0ZS5pdGVtc1xuICAgIH0pO1xuICB9LFxuICBoYW5kbGVOYW1lQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZS5uYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbmFtZTogdGhpcy5zdGF0ZS5uYW1lXG4gICAgfSk7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLm5hbWUpO1xuICB9LFxuICBoYW5kbGVQaG9uZU5vQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGhvbmVfbnVtYmVyOiB0aGlzLnN0YXRlLnBob25lX251bWJlclxuICAgIH0pO1xuICB9LFxuICBoYW5kbGVFeHBpcnlEYXRlTnVtYmVyQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX251bWJlcjogdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9udW1iZXJcbiAgICB9KTtcbiAgfSxcbiAgaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3RvciA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGV4cGlyeV9kYXRlX3NlbGVjdG9yOiB0aGlzLnN0YXRlLmV4cGlyeV9kYXRlX3NlbGVjdG9yXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5leHBpcnlfZGF0ZV9zZWxlY3Rvcik7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnQWRkX1RyYW5zX1BhZ2UnKTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGUuaXRlbV9jb3VudDsgaSsrKSB7XG4gICAgICBpdGVtcy5wdXNoKDxJdGVtIHJlYWN0X2tleT17aX0ga2V5PXtpfSB2YWx1ZXM9e3RoaXMuc3RhdGUuaXRlbXNbaV19XG4gICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+KVxuICAgIH07XG4gICAgcmV0dXJuKFxuICAgICAgPGRpdiBjbGFzcyA9XCJwYWdlXCI+XG4gICAgICA8Zm9ybT5cbiAgICAgIDxoMT5BZGQgbmV3IGxvYW48L2gxPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5OYW1lPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGU9J3RleHQnIFxuICAgICAgICAgIG5hbWU9XCJuYW1lXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nTmFtZScgXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUubmFtZX0gXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTmFtZUNoYW5nZX0gXG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwicGhvbmVfbnVtYmVyXCI+UGhvbmUgbnVtYmVyPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHR5cGUgPSd0ZWwnIFxuICAgICAgICAgIG5hbWU9XCJwaG9uZV9udW1iZXJcIiBcbiAgICAgICAgICBwbGFjZWhvbGRlcj0nUGhvbmUgbnVtYmVyJyBcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9IFxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVBob25lTm9DaGFuZ2V9XG4gICAgICAgICAgcmVxdWlyZWQ+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPVwiZXhwaXJ5X2R1cmF0aW9uX251bWJlclwiPkV4cGlyeSBkYXRlPC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgLy9jbGFzc05hbWUgPSAnaGFsZi13aWR0aCdcbiAgICAgICAgICBpZCA9ICdoYWxmLXdpZHRoJ1xuICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJ1xuICAgICAgICAgIG5hbWUgPSAnZXhwaXJ5X2R1cmF0aW9uX251bWJlcidcbiAgICAgICAgICBwbGFjZWhvbGRlciA9ICcxJ1xuICAgICAgICAgIHZhbHVlID0ge3RoaXMuc3RhdGUuZXhwaXJ5X2RhdGVfbnVtYmVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUV4cGlyeURhdGVOdW1iZXJDaGFuZ2V9XG4gICAgICAgICAgbWluID0gXCIxXCJcbiAgICAgICAgICByZXF1aXJlZFxuICAgICAgICA+XG4gICAgICAgIDwvaW5wdXQ+XG4gICAgICAgIDxzZWxlY3QgXG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlRXhwaXJ5RHVyYXRpb25DaGFuZ2V9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPVwibW9udGhcIiBcbiAgICAgICAgICBuYW1lPVwiZXhwaXJ5X2R1cmF0aW9uX3NlbGVjdG9yXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJkYXlcIj5kYXk8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2Vla1wiPndlZWs8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwibW9udGhcIj5tb250aDwvb3B0aW9uPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPEFkZF9JdGVtX0J1dHRvbiBDbGljaz17dGhpcy5oYW5kbGVBZGRDbGlja30vPlxuICAgICAgICA8UmVtb3ZlX0l0ZW1fQnV0dG9uIENsaWNrPXt0aGlzLmhhbmRsZVJlbW92ZUNsaWNrfS8+XG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICA8dGg+SXRlbSBuYW1lPC90aD5cbiAgICAgICAgICAgIDx0aD5JdGVtIGFtb3VudDwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgIHtpdGVtc31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nQWRkIGxvYW4nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fT48L2lucHV0PlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgPC9mb3JtPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59KVxuXG52YXIgSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHsgIFxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIC8vQ2FsbHMgdGhlIGZ1bmN0aW9uIG9uQ2hhbmdlIGluIEFkZF9UcmFuc2FjdGlvbl9Gb3JtIHRvIG11dGF0ZSB0aGUgc3RhdGUgaW4gdGhlIHBhcmVudC4gXG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLnByb3BzLnJlYWN0X2tleSwgdGhpcy5yZWZzLm5hbWUudmFsdWUsXG4gICAgdGhpcy5yZWZzLmFtb3VudC52YWx1ZSk7XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCl7XG4gICAgLy9jb25zb2xlLmxvZyh0aGlzLnByb3BzLnZhbHVlcyk7XG4gICAgcmV0dXJuKFxuICAgICAgPHRyIGhlaWdodD1cIjIwcHhcIj5cbiAgICAgIDx0ZD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICAgICAgdHlwZSA9ICd0ZXh0JyBcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkl0ZW0gbmFtZVwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMudmFsdWVzLm5hbWV9IFxuICAgICAgICAgIHJlZj1cIm5hbWVcIlxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX1cbiAgICAgICAgPlxuICAgICAgICA8L2lucHV0PlxuICAgICAgPC90ZD5cbiAgICAgIDx0ZD5cbiAgICAgIDxpbnB1dCBcbiAgICAgICAgdHlwZSA9ICdudW1iZXInIFxuICAgICAgICBtaW49IFwiMVwiXG4gICAgICAgIHBsYWNlaG9sZGVyID0gXCJBbW91bnRcIlxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZXMuYW1vdW50fVxuICAgICAgICByZWY9XCJhbW91bnRcIlxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9XG4gICAgICAgIHJlcXVpcmVkPlxuICAgICAgPC9pbnB1dD5cbiAgICAgIDwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRyYW5zYWN0aW9uIFZpZXcgRGV0YWlsIHBhZ2VcbiAqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG52YXIgVHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKXtcbiAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1RyYW5zYWN0aW9uX1ZpZXdfRGV0YWlsX1BhZ2UnKSB7XG4gICAgcmV0dXJuKG51bGwpO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5wcm9wcyk7XG4gIHJldHVybihcbiAgICA8ZGl2IGNsYXNzID1cInBhZ2VcIj5cbiAgICAgIDxoMT5Mb2FucyB2aWV3IChkZXRhaWwpPC9oMT5cbiAgICAgIDxUcmFuc2FjdGlvbl9EZXRhaWxfVGFibGUgdHJhbnNhY3Rpb249e3RoaXMucHJvcHMudHJhbnNhY3Rpb259Lz5cbiAgICAgIDxSZXR1cm5fSXRlbXNfQnV0dG9uIC8+XG4gICAgICA8UmVuZXdfVHJhbnNhY3Rpb25fQnV0dG9uIC8+XG4gICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgIDwvZGl2PlxuICAgIClcbiAgfSBcbiAgIFxuICB9XG59KTtcblxudmFyIFJldHVybl9JdGVtc19CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgndXBkYXRlX3RyYW5zYWN0aW9uJywgJ3JldHVybicpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5SZXR1cm4gaXRlbXM8L2J1dHRvbj5cbiAgKVxuIH0gXG59KTtcblxudmFyIFJlbmV3X1RyYW5zYWN0aW9uX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2soKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAncmVuZXcnKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICg8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlJlbmV3IGxvYW48L2J1dHRvbj4pXG4gfSBcbn0pXG5cblxudmFyIFRyYW5zYWN0aW9uX0RldGFpbF9UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSB0aGlzLnByb3BzLnRyYW5zYWN0aW9uO1xuICAgICAgdmFyIGFsbF9pdGVtcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaXRlbSBpbiB0cmFuc2FjdGlvbi5pdGVtcykge1xuICAgICAgICBhbGxfaXRlbXMucHVzaChcbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5JdGVtIE5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0ubmFtZX08L3RkPlxuICAgICAgICAgIDx0aD5Oby48L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uaXRlbXNbaXRlbV0uYW1vdW50fTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIClcbiAgICAgIH1cbiAgcmV0dXJuIChcbiAgICA8dGFibGUgaWQ9XCJ0cmFuc2FjdGlvbl9kZXRhaWxfdGFibGVcIj5cbiAgICAgIDx0Ym9keT5cbiAgICAgICAgPHRyPlxuICAgICAgICAgIDx0aD5EYXRlPC90aD5cbiAgICAgICAgICA8dGQ+e3RyYW5zYWN0aW9uLmRhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24uZXhwaXJ5X2RhdGUuc3Vic3RyaW5nKDAsMTApfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGg+UmV0dXJuZWQ8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ucmV0dXJuZWQudG9TdHJpbmcoKX08L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRoPk5hbWU8L3RoPlxuICAgICAgICAgIDx0ZD57dHJhbnNhY3Rpb24ubmFtZX08L3RkPlxuICAgICAgICA8L3RyPlxuXG4gICAgICAgIHthbGxfaXRlbXN9XG4gICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gIClcbiAgfVxufSlcblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS1cbiAqXG4gKiBUcmFuc2FjdGlvbnMgVmlldyBQYWdlXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovIFxuXG52YXIgVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gXCJUcmFuc2FjdGlvbnNfVmlld19QYWdlXCIpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBXaGVuIHRoaXMgcGFnZSBsb2Fkc1xuICAgICAgcmV0dXJuICAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgICA8aDE+IExvYW5zIG92ZXJ2aWV3IGZvciB7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUubmFtZX08L2gxPlxuICAgICAgICA8VHJhbnNhY3Rpb25fVGFibGUgdHJhbnNhY3Rpb25zID0ge3RoaXMucHJvcHMudHJhbnNhY3Rpb25zfSAvPlxuICAgICAgICA8QWRkX1RyYW5zYWN0aW9uX0J1dHRvbiAvPlxuICAgICAgICA8QmFja190b19Ib21lX0J1dHRvbiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cbn0pXG5cbnZhciBBZGRfVHJhbnNhY3Rpb25fQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBoYW5kbGVDbGljazogZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZV9wYWdlID0gJ0FkZF9UcmFuc2FjdGlvbl9QYWdlJztcbiAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2V9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImFkZF90cmFuc2FjdGlvbl9idXR0b25cIlxuICAgICAgb25DbGljaz17IHRoaXMuaGFuZGxlQ2xpY2sgfT5cbiAgICAgIEFkZCBuZXcgbG9hblxuICAgICAgPC9idXR0b24+XG4gICAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5wcm9wcy50cmFuc2FjdGlvbnMpO1xuICAgIHZhciByb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BzLnRyYW5zYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uc1tpXSk7XG4gICAgICByb3dzLnB1c2goPFRhYmxlX1JvdyBrZXk9e2l9IHZhbHVlcz17dGhpcy5wcm9wcy50cmFuc2FjdGlvbnNbaV19Lz4pXG4gICAgfVxuIFxuICAgIFxuICAgIHJldHVybiAoXG4gICAgICA8dGFibGU+XG4gICAgICA8VHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyAvPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgIHtyb3dzfVxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICApXG4gIH1cbn0pO1xuXG52YXIgVHJhbnNhY3Rpb25fVGFibGVfSGVhZGVyX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiAoXG4gICAgICA8dGhlYWQ+XG4gICAgICAgIDx0cj5cbiAgICAgICAgPHRoPkRhdGU8L3RoPlxuICAgICAgICA8dGg+RXhwaXJ5IERhdGU8L3RoPlxuICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgIDx0aD5QaG9uZSBOdW1iZXI8L3RoPlxuICAgICAgICA8L3RyPlxuICAgICAgPC90aGVhZD5cbiAgICApXG4gIH1cbn0pXG5cblxudmFyIFRhYmxlX1JvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdUcmFuc2FjdGlvbl9WaWV3X0RldGFpbF9QYWdlJztcblxuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudCgnc2VuZF90cmFuc2FjdGlvbl9kZXRhaWxzJywgdGhpcy5wcm9wcy52YWx1ZXMpO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHtcbiAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIGZ1bmN0aW9uIGRheXNfdGlsbF9leHBpcnkoZGF0ZSkge1xuICAgICAgdmFyIGVfZCA9IERhdGUucGFyc2UoZGF0ZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QpO1xuICAgICAgLy8gY29uc29sZS5sb2coRGF0ZS5ub3coKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhlX2QgLSBEYXRlLm5vdygpKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKE1hdGguY2VpbCgoZV9kIC0gRGF0ZS5ub3coKSkvKDEwMDAqNjAqNjAqMjQpKSlcbiAgICAgIHJldHVybihNYXRoLmNlaWwoKGVfZCAtIERhdGUubm93KCkpLygxMDAwKjYwKjYwKjI0KSkpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBwYXJzZV9kYXRlKGRhdGUpe1xuICAgICAgcmV0dXJuKGRhdGUuc3Vic3RyaW5nKDAsMTApKTtcbiAgICB9O1xuICAgdmFyIHN0YXR1cyA9IGRheXNfdGlsbF9leHBpcnkodGhpcy5wcm9wcy52YWx1ZXMuZXhwaXJ5X2RhdGUpO1xuICAgdmFyIHRyX3N0eWxlID0ge1xuICAgIFxuICAgfVxuICAgaWYgKHRoaXMucHJvcHMudmFsdWVzLnJldHVybmVkID09PSB0cnVlKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIHRleHREZWNvcmF0aW9uOiAnbGluZS10aHJvdWdoJyxcbiAgICAgICBjb2xvcjogJ2hzbCgzMCwgNCUsIDc2JSknXG4gICAgIH1cbiAgIH1cbiAgIGVsc2UgaWYgKHN0YXR1cyA8PSAwKSB7XG4gICAgIHRyX3N0eWxlID0ge1xuICAgICAgIGJhY2tncm91bmRDb2xvcjogJ2hzbCgwLCA5NyUsIDY4JSknXG4gICAgIH1cbiAgIH1cbiAgICBlbHNlIGlmIChzdGF0dXMgPD0gMykge1xuICAgICAgdHJfc3R5bGUgPSB7XG4gICAgICAgYmFja2dyb3VuZENvbG9yOiAnaHNsKDMwLCA3OCUsIDYzJSknICBcbiAgICAgIH1cbiAgICAgfVxuICAgIHJldHVybihcbiAgICAgIDx0ciBzdHlsZT17dHJfc3R5bGV9IG9uQ2xpY2s9IHt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgPHRkPntwYXJzZV9kYXRlKHRoaXMucHJvcHMudmFsdWVzLmRhdGUpfTwvdGQ+XG4gICAgICAgIDx0ZD57cGFyc2VfZGF0ZSh0aGlzLnByb3BzLnZhbHVlcy5leHBpcnlfZGF0ZSl9PC90ZD5cbiAgICAgICAgPHRkPnt0aGlzLnByb3BzLnZhbHVlcy5uYW1lfTwvdGQ+XG4gICAgICAgIDx0ZD57dGhpcy5wcm9wcy52YWx1ZXMucGhvbmVfbnVtYmVyfTwvdGQ+XG4gICAgICA8L3RyPlxuICAgIClcbiAgfVxufSlcbiIsIi8qZ2xvYmFsIFJlYWN0Ki9cbi8qZ2xvYmFsIHNldF9IVFRQX2hlYWRlcjp0cnVlKi9cbi8qZXNsaW50IG5vLXVuZGVmOiBcImVycm9yXCIqL1xuLyplc2xpbnQgbm8tY29uc29sZTogXCJvZmZcIiovXG4vKmVzbGludC1lbnYgbm9kZSovXG5cbid1c2Ugc3RyaWN0JztcblxuY2xhc3MgU3RvcmVfTWFuYWdlbWVudF9QYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8vV2hlbiBjb21wb25lbnQgbW91bnRzLCBzZW5kIGEgR0VUIHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBwb3B1bGF0ZVxuICAgICAgLy90aGVzZSBmaWVsZHMgXG4gICAgICBfaWQ6ICcnLFxuICAgICAgbmFtZTogJycsXG4gICAgICBvd25lcjoge30sXG4gICAgICBjb250cmlidXRvcnNfaWRzOiBbXSxcbiAgICAgIGNvbnRyaWJ1dG9yczogW10sXG4gICAgICBvdXRwdXRfY29udGVudDogW10sXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9O1xuICAgIHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyA9IHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVN1Ym1pdCA9IHRoaXMuaGFuZGxlU3VibWl0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVVc2VycyA9IHRoaXMuaGFuZGxlVXNlcnMuYmluZCh0aGlzKTtcbiAgfVxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRwcm9wcykge1xuICAgIGlmIChuZXh0cHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3JlX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICByZXEub3BlbignR0VUJywgYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlLyR7bmV4dHByb3BzLmFjdGl2ZV9zdG9yZS5faWR9L21hbmFnZWApO1xuICAgICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgLy8gRmlyc3QgaXRlbSBpcyB0aGUgc3RvcmUgb2JqZWN0LCBcbiAgICAgICAgICAvLyBzZWNvbmQgdGhlIG93bmVyIG9iamVjdCxcbiAgICAgICAgICAvLyB0aGlyZCBpdGVtIHRoZSBhcnJheSBvZiBjb250cmlidXRvcnNcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICAgIG5hbWU6IHJlc1swXS5uYW1lLFxuICAgICAgICAgICAgY29udHJpYnV0b3JzX2lkczogcmVzWzBdLmNvbnRyaWJ1dG9ycyxcbiAgICAgICAgICAgIG93bmVyOiByZXNbMV0sXG4gICAgICAgICAgICBjb250cmlidXRvcnM6IHJlc1syXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmVxLnNlbmQoKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVVc2Vycyh1c2VycywgdXNlcl9pZHMpIHtcbiAgICBjb25zb2xlLmxvZygnaGFuZGxlVXNlcnMgZnVuY3Rpb24gY2FsbGVkJyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjb250cmlidXRvcnNfaWRzOiB1c2VyX2lkcyxcbiAgICAgIGNvbnRyaWJ1dG9yczogdXNlcnNcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGtleSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgaWYgKGtleSA9PT0gJ2NvbnRyaWJ1dG9ycycpIHtcbiAgICAgICAgLy8gSSBoYXZlIHRvIGRlYm91bmNlIHRoaXNcbiAgICAgICAgaWYgKGUudGFyZ2V0LnZhbHVlICE9ICcnKSB7IC8vTWFrZSBzdXJlIEkgZG9uJ3Qgc2VuZCBhIHVzZWxlc3MgYmxhbmsgcmVxdWVzdFxuICAgICAgICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgcmVxLm9wZW4oJ0dFVCcsICcvdXNlci8nICsgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2NvbnRlbnQ6IHJlc1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHNldF9IVFRQX2hlYWRlcihyZXEpLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG91dHB1dF9jb250ZW50OiBbXVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgICBzdGF0ZVtrZXldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaGFuZGxlU3VibWl0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc29sZS5sb2coJ3NlbmRpbmcgUFVUIHJlcXVlc3QnKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIF91c2VyX2lkOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSxcbiAgICAgIG5hbWU6IHRoaXMuc3RhdGUubmFtZSxcbiAgICAgIGNvbnRyaWJ1dG9yczogdGhpcy5zdGF0ZS5jb250cmlidXRvcnNcbiAgICB9O1xuICAgIG1ha2VfcmVxdWVzdCAoXG4gICAgICAnUFVUJywgXG4gICAgICAoYC91c2VyLyR7bG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJyl9L3N0b3JlLyR7dGhpcy5wcm9wcy5hY3RpdmVfc3RvcmUuX2lkfS9tYW5hZ2VgKSxcbiAgICAgIHNob3dfbWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgZGF0YVxuICAgICk7XG5cbiAgICBmdW5jdGlvbiBzaG93X21lc3NhZ2UocmVxdWVzdCl7XG4gICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHN0YXR1c19tZXNzYWdlOiAocmVzLnN1Y2Nlc3MgPyAnU3VjY2VzcyEgJyA6ICdGYWlsdXJlISAnKSArIHJlcy5tZXNzYWdlIFxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgbGV0IGMgPSB0aGlzLnN0YXRlLm91dHB1dF9jb250ZW50O1xuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYy5sZW5ndGg7IGkrKykge1xuICAgICAgcm93cy5wdXNoKFxuICAgICAgICAgIDx0clxuICAgICAgICAgIGlkPXtpfVxuICAgICAgICAgIGtleT17YHRyPSR7aX1gfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICAgIDx0ZD57Y1tpXS51c2VybmFtZX08L3RkPlxuICAgICAgICAgIDx0ZD57Y1tpXS5waG9uZV9udW1iZXJ9PC90ZD5cbiAgICAgICAgICA8L3RyPik7XG4gICAgfVxuXG4gICAgdmFyIGNvbnRyaWJ1dG9ycyA9IFtdO1xuICAgIGxldCBkID0gdGhpcy5zdGF0ZS5jb250cmlidXRvcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnRyaWJ1dG9ycy5wdXNoKFxuICAgICAgICAgIDxsaSBpZD17aX0ga2V5PXtgbGlzdC0ke2l9YH0+XG4gICAgICAgICAgICB7ZFtpXS51c2VybmFtZX1cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdTdG9yZV9NYW5hZ2VtZW50X1BhZ2UnKSB7XG4gICAgICByZXR1cm4gKG51bGwpO1xuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8aDE+Q2hhbmdlIHN0b3JlIGRldGFpbHM8L2gxPlxuICAgICAgICA8Zm9ybT5cbiAgICAgICAgPHA+e3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9PC9wPlxuICAgICAgICA8cD5TdG9yZSBuYW1lOiB7dGhpcy5zdGF0ZS5uYW1lfTwvcD5cbiAgICAgICAgPHA+T3duZXI6IHt0aGlzLnN0YXRlLm93bmVyLnVzZXJuYW1lfTwvcD5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBDb250cmlidXRvcnM6XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgIHtjb250cmlidXRvcnN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cIm5hbWVcIj5TdG9yZSBuYW1lPC9sYWJlbD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD0nbmFtZScgXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnN0YXRlLm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCduYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8VXNlcl9TZWFyY2hfV2lkZ2V0IG93bmVyPXt0aGlzLnN0YXRlLm93bmVyfSBwYXNzVXNlcnM9e3RoaXMuaGFuZGxlVXNlcnN9Lz5cbiAgICAgICAgICBcbiAgICAgICAgPGlucHV0IHR5cGU9J3N1Ym1pdCcgdmFsdWU9J1NhdmUgY2hhbmdlcycgb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXR9Lz5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICBcbiAgICB9XG4gIH1cbn1cblxuIiwiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFxuICogU3RvcmVzIHRhYmxlIGFuZCBwYWdlXG4gKiBcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbnZhciBTdG9yZXNfUGFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuYWN0aXZlX3BhZ2UgIT0gJ1N0b3Jlc19QYWdlJykge1xuICAgICAgcmV0dXJuKG51bGwpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZVwiPlxuICAgICAgICA8U3RvcmVzX1RhYmxlIC8+XG4gICAgICAgIDxBZGRfU3RvcmVfQnV0dG9uIG9uQ2xpY2sgPSB7dGhpcy5oYW5kbGVDbGlja30vPlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgQWRkX1N0b3JlX0J1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIGxldCBhY3RpdmVfcGFnZSA9ICdBZGRfU3RvcmVfUGFnZSc7XG4gICAgaG9tZVBhZ2Uuc2V0U3RhdGUoe2FjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZX0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhZGRfc3RvcmVfYnV0dG9uXCIgXG4gICAgICAgIG9uQ2xpY2sgPSB7dGhpcy5oYW5kbGVDbGlja30gPlxuICAgICAgICBBZGQgbmV3IHN0b3JlXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApXG4gIH1cbn0pXG5cblxudmFyIFN0b3Jlc19UYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKHtcbiAgICAgIHN0b3JlczogW10sXG4gICAgICB1c2VyczogW11cbiAgICB9KTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpKTtcbiAgICB2YXIgX3VzZXJfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKTtcbiAgICB2YXIgcmVxdWVzdF91cmwgPSAnL3VzZXIvJyArIF91c2VyX2lkICsgJy9zdG9yZSc7XG5cbiAgICB2YXIgZ2V0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgZ2V0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdF91cmwpO1xuICAgIGdldCA9IHNldF9IVFRQX2hlYWRlcihnZXQpO1xuICAgIGdldC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBpZiAoZ2V0LnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB2YXIgcmVzID0gSlNPTi5wYXJzZShnZXQucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgc3RvcmVzOiByZXMuc3RvcmVzLFxuICAgICAgICAgIHVzZXJzOiByZXMudXNlcnNcbiAgICAgICAgfSlcblxuICAgICAgfVxuICAgIH1cbiAgICBnZXQuc2VuZCgpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByb3dzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YXRlLnN0b3Jlcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uc1tpXSk7IFxuICAgICAgdmFyIHVzZXIgPSB0aGlzLnN0YXRlLnVzZXJzW2ldO1xuICAgICAgaWYgKHVzZXIgPT09IHVuZGVmaW5lZCkgeyB1c2VyID0gbnVsbDsgfVxuXG4gICAgICAgIHJvd3MucHVzaChcblxuICAgICAgICAgIDxTdG9yZXNfVGFibGVfUm93IFxuICAgICAgICAgICAga2V5PXtpfSBcbiAgICAgICAgICAgIHN0b3JlPXt0aGlzLnN0YXRlLnN0b3Jlc1tpXX0gXG4gICAgICAgICAgICB1c2VyPXt1c2VyfVxuICAgICAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuKFxuICAgICAgICA8dGFibGU+XG4gICAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICA8dGg+U3RvcmU8L3RoPlxuICAgICAgICAgICAgICA8dGg+T3duZXI8L3RoPlxuICAgICAgICAgICAgICA8dGg+QWN0aW9uczwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICB7cm93c31cbiAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICApXG4gIH1cbn0pXG5cbnZhciBTdG9yZXNfVGFibGVfUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRUcmFuc2FjdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgdmFyIFVSTCA9IChcIi91c2VyL1wiICsgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ191c2VyX2lkJykgKyBcIi9zdG9yZS9cIiArIFxuICAgICAgICB0aGlzLnByb3BzLnN0b3JlLl9pZCArIFwiL3RyYW5zXCIpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIFVSTCk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAvLyBJIGhhdmUgdG8gcGFzcyB0aGlzIFwicmVzXCIgdG8gdGhlIHJlYWxwYWdlIG9yIHRyYW5zIHZpZXcgcGFnZVxuICAgICAgICBsZXQgYWN0aXZlX3BhZ2UgPSAnVHJhbnNhY3Rpb25zX1ZpZXdfUGFnZSc7XG4gICAgICAgIHJlcy5hY3RpdmVfc3RvcmUgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJywgKHJlcykpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICBob21lUGFnZS5zZXRTdGF0ZSh7YWN0aXZlX3BhZ2U6IGFjdGl2ZV9wYWdlfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlcS5zZW5kKCk7XG4gIH0sXG4gIG1hbmFnZVN0b3JlOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlX3BhZ2UgPSBcIlN0b3JlX01hbmFnZW1lbnRfUGFnZVwiO1xuICAgIGxldCBhY3RpdmVfc3RvcmUgPSB0aGlzLnByb3BzLnN0b3JlO1xuICAgIGhvbWVQYWdlLnNldFN0YXRlKHthY3RpdmVfcGFnZTogYWN0aXZlX3BhZ2UsIGFjdGl2ZV9zdG9yZTogYWN0aXZlX3N0b3JlfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPHRyPlxuICAgICAgICA8dGQ+IHsgdGhpcy5wcm9wcy5zdG9yZS5uYW1lIH08L3RkPlxuICAgICAgICA8dGQ+IHsgdGhpcy5wcm9wcy51c2VyLnVzZXJuYW1lIH08L3RkPlxuICAgICAgICA8dGQ+PGJ1dHRvbiBvbkNsaWNrID0ge3RoaXMuZ2V0VHJhbnNhY3Rpb25zfT5WaWV3IGxvYW5zPC9idXR0b24+PGJ1dHRvbiBvbkNsaWNrID0ge3RoaXMubWFuYWdlU3RvcmV9PkVkaXQ8L2J1dHRvbj48L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICApXG4gIH1cbn0pXG5cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBVc2VyX01hbmFnZW1lbnRfUGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvL1doZW4gY29tcG9uZW50IG1vdW50cywgc2VuZCBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gcG9wdWxhdGVcbiAgICAgIC8vdGhlc2UgZmllbGRzIFxuICAgICAgcGhvbmVfbnVtYmVyOiAnJyxcbiAgICAgIF9pZDogJycsXG4gICAgICB1c2VybmFtZTogJycsXG4gICAgICBzdGF0dXNfbWVzc2FnZTogJydcbiAgICB9XG4gICAgdGhpcy5jb21wb25lbnREaWRNb3VudCA9IHRoaXMuY29tcG9uZW50RGlkTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZSA9IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVTdWJtaXQgPSB0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpO1xuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnNvbGUubG9nKCdtb3VudGVkJyk7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiR0VUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxID0gc2V0X0hUVFBfaGVhZGVyKHJlcSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhyZXNbMF0pKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzWzBdWyd1c2VybmFtZSddKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcGhvbmVfbnVtYmVyOiByZXNbMF0ucGhvbmVfbnVtYmVyLFxuICAgICAgICAgIF9pZDogcmVzWzBdLl9pZCxcbiAgICAgICAgICB1c2VybmFtZTogcmVzWzBdLnVzZXJuYW1lXG4gICAgICAgIH0pXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG4gIGhhbmRsZUNoYW5nZShrZXkpIHtcbiAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgIHZhciBzdGF0ZSA9IHt9O1xuICAgICAgc3RhdGVba2V5XSA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICB9XG4gIH1cbiAgXG4gIGhhbmRsZVN1Ym1pdChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nIFBVVCByZXF1ZXN0Jyk7XG4gICAgLy9TZW5kIGEgUE9TVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAvLyBUaGUgc2VydmVyIG5lZWRzIHRvIGNoZWNrIHRoYXQgdGhpcyBwaG9uZSBudW1iZXIgaXNuJ3QgYWxyZWFkeSB1c2VkXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBwaG9uZV9udW1iZXI6IHRoaXMuc3RhdGUucGhvbmVfbnVtYmVyLFxuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWVcbiAgICB9XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKFwiUFVUXCIsIFwiL3VzZXIvXCIgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIHZhciByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBzdGF0dXNfbWVzc2FnZTogKHJlcy5zdWNjZXNzID8gJ1N1Y2Nlc3MhJyA6ICdGYWlsdXJlIScpICsgcmVzLm1lc3NhZ2UgXG4gICAgICB9KTtcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGUocmVzLnVzZXIpO1xuICAgIH0gICAgICBcbiAgICByZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICByZXEgPSBzZXRfSFRUUF9oZWFkZXIocmVxKTtcbiAgICByZXEuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmFjdGl2ZV9wYWdlICE9ICdVc2VyX01hbmFnZW1lbnRfUGFnZScpIHtcbiAgICAgIHJldHVybihudWxsKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2IGlkPVwiYm9keVwiPlxuICAgICAgICA8cD4ge3RoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2V9IDwvcD5cbiAgICAgICAgPGgxPkNoYW5nZSB1c2VyIGRldGFpbHM8L2gxPlxuICAgICAgICA8cD5JZiB5b3UgY2hhbmdlIHlvdXIgcGhvbmUgbnVtYmVyLCB5b3UgY2FuIGVkaXQgaXQgaGVyZS48L3A+XG4gICAgICAgIDxmb3JtPlxuICAgICAgICA8cD5QaG9uZToge3RoaXMuc3RhdGUucGhvbmVfbnVtYmVyfSA8L3A+XG4gICAgICAgIDxwPlVzZXI6IHt0aGlzLnN0YXRlLnVzZXJuYW1lfSA8L3A+XG4gICAgICAgIFxuICAgICAgICA8bGFiZWwgaHRtbEZvcj1cInBob25lX251bWJlclwiPlBob25lIG51bWJlciAobG9naW4gd2l0aCB0aGlzKTwvbGFiZWw+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSdudW1iZXInIFxuICAgICAgICAgIGlkPSdwaG9uZV9udW1iZXInIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS5waG9uZV9udW1iZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlKCdwaG9uZV9udW1iZXInKVxuICAgICAgICAgIH1cbiAgICAgICAgICAvPlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj0ndXNlcl9uYW1lJz5OYW1lOiBDaG9vc2UgYVxuICAgICAgICBuYW1lIHRoYXQgaXMgdW5pcXVlIHNvIHBlb3BsZSBjYW4gZmluZCB5b3UuPC9sYWJlbD5cbiAgICAgICAgPGlucHV0IFxuICAgICAgICAgIHJlcXVpcmVkPSdyZXF1aXJlZCdcbiAgICAgICAgICB0eXBlPSd0ZXh0JyBcbiAgICAgICAgICBpZD1cInVzZXJfbmFtZVwiIFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UoJ3VzZXJuYW1lJyl9XG4gICAgICAgICAgLz5cblxuICAgICAgICA8aW5wdXQgdHlwZT0nc3VibWl0JyB2YWx1ZT0nU2F2ZSBjaGFuZ2VzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdH0vPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gIH1cbn1cblxuLy8gUmVhY3RET00ucmVuZGVyKCA8VXNlcl9NYW5hZ2VtZW50X1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSApO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBIb21lX1BhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlcjoge30sXG4gICAgICBhY3RpdmVfcGFnZTogJ0hvbWUgUGFnZScsXG4gICAgICBhY3RpdmVfc3RvcmU6IHt9LFxuICAgICAgc3RvcmVfdHJhbnNhY3Rpb25zOiB7fSxcbiAgICAgIHRyYW5zYWN0aW9uX3Nob3duOiB7fSxcbiAgICAgIHN0YXR1c19tZXNzYWdlOiAnJyxcbiAgICB9O1xuICAgIHRoaXMuZ29UbyA9IHRoaXMuZ29Uby5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29tcG9uZW50V2lsbE1vdW50ID0gdGhpcy5jb21wb25lbnRXaWxsTW91bnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBvbmVudERpZE1vdW50ID0gdGhpcy5jb21wb25lbnREaWRNb3VudC5iaW5kKHRoaXMpO1xuICAgIHRoaXMudXBkYXRlVXNlciA9IHRoaXMudXBkYXRlVXNlci5iaW5kKHRoaXMpO1xuICAgIHRoaXMubG9nb3V0ID0gdGhpcy5sb2dvdXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKSk7XG4gICAgY29uc3QgX3VzZXJfaWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnX3VzZXJfaWQnKTtcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xuXG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGxldCB1cmwgPSAnL3VzZXIvJyArIF91c2VyX2lkO1xuXG4gICAgLy8gY29uc29sZS5sb2codXJsKTtcblxuICAgIHJlcS5vcGVuKCdHRVQnLCB1cmwpO1xuXG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmIChyZXEucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgIGxldCByZXMgPSBKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgIGlmIChyZXMuc3VjY2VzcyA9PSBmYWxzZSApIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMubWVzc2FnZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzdGF0dXNfbWVzc2FnZTogcmVzLm1lc3NhZ2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnN0YXR1c19tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgdXNlciA9IEpTT04ucGFyc2UocmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlclswXTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHVzZXI6IHRoaXMuc3RhdGUudXNlclxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUudXNlcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRva2VuICE9IG51bGwpIHtcbiAgICAgIHJlcSA9IHNldF9IVFRQX2hlYWRlcihyZXEpO1xuICAgIH1cbiAgICByZXEuc2VuZCgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG5cbiAgICBkaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3NlbmRfc3RvcmVfdHJhbnNhY3Rpb25zJywgKHN0b3JlX3RyYW5zKSA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhzdG9yZV90cmFucyk7XG4gICAgICAgIC8vRmlyc3QsIHRha2Ugb3V0IHRoZSBcImFjdGl2ZSBzdG9yZVwiXG4gICAgICB2YXIgYWN0aXZlX3N0b3JlID0gc3RvcmVfdHJhbnMuYWN0aXZlX3N0b3JlO1xuICAgICAgZGVsZXRlIHN0b3JlX3RyYW5zLmFjdGl2ZV9zdG9yZTtcbiAgICAgIHRoaXMuc3RhdGUuc3RvcmVfdHJhbnNhY3Rpb25zID0gc3RvcmVfdHJhbnM7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZSA9IGFjdGl2ZV9zdG9yZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGFjdGl2ZV9zdG9yZTogdGhpcy5zdGF0ZS5hY3RpdmVfc3RvcmUsXG4gICAgICAgIHN0b3JlX3RyYW5zYWN0aW9uczogdGhpcy5zdGF0ZS5zdG9yZV90cmFuc2FjdGlvbnNcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgICAgXG4gICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCdzZW5kX3RyYW5zYWN0aW9uX2RldGFpbHMnLFxuICAgICAgICAodHJhbnNhY3Rpb24pID0+IHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duID0gdHJhbnNhY3Rpb247XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbl9zaG93bjogdGhpcy5zdGF0ZS50cmFuc2FjdGlvbl9zaG93blxuICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NhbGxlZCcpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGlzcGF0Y2hlci5zdGF0ZS50cmFuc2FjdGlvbl9zaG93bik7XG4gICAgICAgIH0pO1xuICAgICAgXG4gICAgZGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVfdHJhbnNhY3Rpb24nLCAoYWN0aW9uKSA9PiB7XG4gICAgICBjb25zdCBfdXNlcl9pZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdfdXNlcl9pZCcpO1xuICAgICAgdmFyIHVwZGF0ZSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duLl9pZCk7XG4gICAgICBsZXQgaWQgPSB0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3duLl9pZDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaWQpO1xuICAgICAgbGV0IHVybCA9ICcvdXNlci8nKyBfdXNlcl9pZCArICcvc3RvcmUvJyArIHRoaXMuc3RhdGUuYWN0aXZlX3N0b3JlLl9pZCArICcvdHJhbnMvJyArIGlkICsgJy8nICsgYWN0aW9uO1xuICAgICAgY29uc29sZS5sb2codXJsKTtcbiAgICAgICAgLy8gL3RyYW5zL19pZC9yZW5ld1xuICAgICAgdXBkYXRlLm9wZW4oJ1BVVCcsIHVybCk7XG5cbiAgICAgIHVwZGF0ZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIGlmICh1cGRhdGUucmVhZHlTdGF0ZSA9PSA0KXtcbiAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoJ3NlbmRfdHJhbnNhY3Rpb25fZGV0YWlscycsIFxuICAgICAgICAgICAgSlNPTi5wYXJzZSh1cGRhdGUucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICAvLyBXaHkgZG8gSSBldmVuIG5lZWQgdG8gZGlzcGF0Y2ggdGhpcyBldmVudCB0byBiZSBob25lc3RcbiAgICAgICAgICAgIC8vIEkgY2FuIG11dGF0ZSB0aGUgc3RhdGUgc3RyYWlnaHQgYXdheSBmcm9tIGhlcmUuIEFoIHdlbGxcbiAgICAgICAgICAgIC8vIEkgdGhpbmsgaXQncyBjbGVhbmVyIHRvIGRvIHRoaXMuIERSWSBhZnRlciBhbGwuLi5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHNldF9IVFRQX2hlYWRlcih1cGRhdGUpLnNlbmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdvVG8ocGFnZSkge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgbGV0IGFjdGl2ZV9wYWdlID0gcGFnZTtcbiAgICAgIC8vY29uc29sZS5sb2coYWN0aXZlX3BhZ2UpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGFjdGl2ZV9wYWdlOiBhY3RpdmVfcGFnZVxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuICBcbiAgdXBkYXRlVXNlcih1c2VyKSB7XG4gICAgdGhpcy5zdGF0ZS51c2VyID0gdXNlcjtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXI6IHVzZXJcbiAgICB9KTtcbiAgfVxuXG4gIGxvZ291dCgpIHtcbiAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICB3aW5kb3cubG9jYXRpb24gPSAnL2xvZ2luLmh0bWwnO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZS5zdGF0dXNfbWVzc2FnZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2UgIT09ICcnKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuc3RhdGUuc3RhdHVzX21lc3NhZ2U7XG4gICAgICBmdW5jdGlvbiBjcmVhdGVNZXNzYWdlKG1lc3NhZ2UpIHtyZXR1cm4ge19faHRtbDogbWVzc2FnZX07fVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17Y3JlYXRlTWVzc2FnZShtZXNzYWdlKX0gLz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuKFxuICAgICAgICA8ZGl2PlxuICAgICAgICA8aGVhZGVyPnt0aGlzLnN0YXRlLnVzZXIudXNlcm5hbWV9IDxidXR0b24gb25DbGljaz17dGhpcy5sb2dvdXR9PkxvZ291dDwvYnV0dG9uPjwvaGVhZGVyPlxuICAgICAgICA8aDE+e3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9PC9oMT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmdvVG8oJ1VzZXJfTWFuYWdlbWVudF9QYWdlJyl9PkVkaXQgdXNlcjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuZ29UbygnU3RvcmVzX1BhZ2UnKX0+VmlldyBzdG9yZXM8L2J1dHRvbj5cblxuICAgICAgICA8U3RvcmVzX1BhZ2UgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX0vPlxuICAgICAgICAgIDxBZGRfU3RvcmVfUGFnZSBcbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8U3RvcmVfTWFuYWdlbWVudF9QYWdlIFxuICAgICAgICAgICAgYWN0aXZlX3BhZ2UgPSB7dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgIGFjdGl2ZV9zdG9yZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUcmFuc2FjdGlvbnNfVmlld19QYWdlIFxuICAgICAgICAgICAgYWN0aXZlX3N0b3JlPXt0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZX1cbiAgICAgICAgICAgIGFjdGl2ZV9wYWdlPXt0aGlzLnN0YXRlLmFjdGl2ZV9wYWdlfVxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zPXt0aGlzLnN0YXRlLnN0b3JlX3RyYW5zYWN0aW9uc31cbiAgICAgICAgICAvPlxuICAgICAgICAgICAgPEFkZF9UcmFuc2FjdGlvbl9QYWdlXG4gICAgICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgICAgIGFjdGl2ZV9zdG9yZSA9IHt0aGlzLnN0YXRlLmFjdGl2ZV9zdG9yZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VHJhbnNhY3Rpb25fVmlld19EZXRhaWxfUGFnZVxuICAgICAgICAgICAgICBhY3RpdmVfcGFnZT17dGhpcy5zdGF0ZS5hY3RpdmVfcGFnZX1cbiAgICAgICAgICAgICAgdHJhbnNhY3Rpb24gPXt0aGlzLnN0YXRlLnRyYW5zYWN0aW9uX3Nob3dufVxuICAgICAgICAgICAgLz5cbiAgICAgICAgPFVzZXJfTWFuYWdlbWVudF9QYWdlIFxuICAgICAgICAgIGFjdGl2ZV9wYWdlID0ge3RoaXMuc3RhdGUuYWN0aXZlX3BhZ2V9XG4gICAgICAgICAgb25VcGRhdGUgPSB7dGhpcy51cGRhdGVVc2VyfVxuICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgfVxufVxuXG52YXIgaG9tZVBhZ2UgPSBSZWFjdERPTS5yZW5kZXIoIDxIb21lX1BhZ2UvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
