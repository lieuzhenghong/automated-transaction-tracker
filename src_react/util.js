// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
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
  const token = localStorage.getItem('token');

  if (token) {
    request.setRequestHeader('x-access-token', token);
    return(request);
  }
  else {
    return('Error: token could not be found. Check localStorage');
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
  if (typeof data === 'undefined') { data = null; }
  var req = new XMLHttpRequest();
  req.open(action, uri);
  req.onreadystatechange = () => {
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

function send_data(request, data){
  request.send(JSON.stringify(data));
}
