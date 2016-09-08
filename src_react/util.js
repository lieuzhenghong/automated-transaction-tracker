function set_HTTP_header(request) {
  const token = localStorage.getItem('token');

  if (token) {
    request.setRequestHeader('x-access-token', token);
    return(request);
  }
  else {
    return("Error: token could not be found. Check localStorage");
  }
}
