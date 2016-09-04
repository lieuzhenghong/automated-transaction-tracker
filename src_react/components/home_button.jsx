var Back_to_Home_Button = React.createClass({
  handleClick: function(event){
    let active_page = 'Home_Page';
    homePage.setState({active_page: active_page});
    event.preventDefault();
  },
  render: function() {
    return (
      <button className="home_button" onClick =
      {this.handleClick} >
      Back
      </button>
    )
  }
});
