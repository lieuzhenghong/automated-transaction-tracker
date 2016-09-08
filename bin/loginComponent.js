'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login_Page = function (_React$Component) {
  _inherits(Login_Page, _React$Component);

  function Login_Page(props) {
    _classCallCheck(this, Login_Page);

    var _this = _possibleConstructorReturn(this, (Login_Page.__proto__ || Object.getPrototypeOf(Login_Page)).call(this, props));

    _this.state = {
      username: '',
      password: '',
      phone_number: '',
      status_message: ''
    };
    // Functions must be manually bound with ES6 classes
    // If don't bind, then "this" at time of function invocation is the JSX
    // input element. Right?
    // Just guessing -- need to ask Mark
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(Login_Page, [{
    key: 'handleChange',
    value: function handleChange(key) {
      var _this2 = this;

      // This is a higher-order function (a function that returns a function)
      // It has to return a function because it needs to take in the event as a
      // parameter 
      return function (e) {
        var state = {};
        state[key] = e.target.value;
        _this2.setState(state);
        console.log(_this2.state);
      };
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(key) {
      var _this3 = this;

      return function (event) {
        event.preventDefault();
        console.log('called');

        var data = {
          phone_number: _this3.state.phone_number.trim(),
          password: _this3.state.password.trim(),
          username: _this3.state.username.trim()
        };

        var req = new XMLHttpRequest();
        req.open("POST", '/auth' + key);
        req.setRequestHeader('Content-type', 'application/json');
        //console.log(JSON.stringify(data));
        req.send(JSON.stringify(data));

        req.onreadystatechange = function () {
          if (req.readyState == 4) {
            var res = JSON.parse(req.responseText);
            console.log(res);

            if (key === '/sign_up') {
              _this3.setState({ status_message: (res.success ? 'Success! ' : 'Failure! ') + res.message });
            } else if (key === '/authenticate') {
              console.log(res.token);
              _this3.setState({
                status_message: (res.success ? 'Success! ' : 'Failure! ') + res.message + 'Your token: ' + res.token + 'Your id: ' + res._user_id
              });

              if (res.success) {
                //Save JWT in localStorage
                localStorage.clear();
                localStorage.setItem('token', res.token);
                localStorage.setItem('_user_id', res._user_id);
                console.log(localStorage.getItem('token'));
                console.log(localStorage.getItem('_user_id'));
                window.location = "/index.html";
              }
            }
          }
        };
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'body' },
        React.createElement(
          'h1',
          null,
          ' Automated transaction tracker '
        ),
        React.createElement(
          'h1',
          null,
          ' Login or sign up '
        ),
        React.createElement(
          'div',
          { id: 'message' },
          React.createElement(
            'p',
            null,
            this.state.status_message
          )
        ),
        React.createElement(
          'label',
          { htmlFor: 'phone_number' },
          'Phone number. Must be unique.'
        ),
        React.createElement('input', {
          required: true,
          type: 'text',
          value: this.state.phone_number,
          id: 'phone_number',
          onChange: this.handleChange('phone_number')
        }),
        React.createElement(
          'label',
          { htmlFor: 'username' },
          'Username. For others to find you.'
        ),
        React.createElement('input', {
          type: 'text',
          value: this.state.username,
          id: 'username',
          onChange: this.handleChange('username')
        }),
        React.createElement(
          'label',
          { htmlFor: 'password' },
          'Password (optional--but good to have!)'
        ),
        React.createElement('input', {
          type: 'password',
          value: this.state.password,
          id: 'password',
          onChange: this.handleChange('password')
        }),
        React.createElement('input', {
          type: 'submit',
          value: 'Sign up',
          onClick: this.handleSubmit('/sign_up')
        }),
        React.createElement('input', {
          type: 'submit',
          value: 'Login',
          onClick: this.handleSubmit('/authenticate')
        })
      );
    }
  }]);

  return Login_Page;
}(React.Component);

ReactDOM.render(React.createElement(Login_Page, null), document.getElementById('content'));