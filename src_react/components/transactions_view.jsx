/* -----------------
 *
 * Transactions View Page
 *
 * --------------------- */ 

var Transactions_View_Page = React.createClass({
  render: function () {
    if (this.props.active_page != "Transactions_View_Page") {
      return(null);
    }
    else {
      // When this page loads
      return  (
        <div className="page">
        <h1> Loans overview for {this.props.active_store.name}</h1>
        <Transaction_Table transactions = {this.props.transactions} />
        <Add_Transaction_Button />
        <Back_to_Home_Button />
        </div>
      )
    }
  }
})

var Add_Transaction_Button = React.createClass({
  handleClick: function() {
    let active_page = 'Add_Transaction_Page';
    console.log('clicked');
    homePage.setState({active_page: active_page});
  },
  render: function() {
    return(
      <button className="add_transaction_button"
      onClick={ this.handleClick }>
      Add new loan
      </button>
      )
  }
});

var Transaction_Table = React.createClass({
  render: function() {
    // console.log(this.props.transactions);
    var rows = [];
    for (var i = 0; i < this.props.transactions.length; i++) {
      //console.log(this.state.transactions[i]);
      rows.push(<Table_Row key={i} values={this.props.transactions[i]}/>)
    }
 
    
    return (
      <table>
      <Transaction_Table_Header_Row />
        <tbody>
        {rows}
        </tbody>
      </table>
    )
  }
});

var Transaction_Table_Header_Row = React.createClass({
  render: function(){
    return (
      <thead>
        <tr>
        <th>Date</th>
        <th>Expiry Date</th>
        <th>Name</th>
        <th>Phone Number</th>
        </tr>
      </thead>
    )
  }
})


var Table_Row = React.createClass({
  handleClick: function() {
    let active_page = 'Transaction_View_Detail_Page';

    dispatcher.dispatchEvent('send_transaction_details', this.props.values);
    homePage.setState({
      active_page: active_page
    });
  },
  render: function() {
    
    function days_till_expiry(date) {
      var e_d = Date.parse(date);
      // console.log(e_d);
      // console.log(Date.now());
      // console.log(e_d - Date.now());
      // console.log(Math.ceil((e_d - Date.now())/(1000*60*60*24)))
      return(Math.ceil((e_d - Date.now())/(1000*60*60*24)));
    }
    
    function parse_date(date){
      return(date.substring(0,10));
    };
   var status = days_till_expiry(this.props.values.expiry_date);
   var tr_style = {
    
   }
   if (this.props.values.returned === true) {
     tr_style = {
       textDecoration: 'line-through',
       color: 'hsl(30, 4%, 76%)'
     }
   }
   else if (status <= 0) {
     tr_style = {
       backgroundColor: 'hsl(0, 97%, 68%)'
     }
   }
    else if (status <= 3) {
      tr_style = {
       backgroundColor: 'hsl(30, 78%, 63%)'  
      }
     }
    return(
      <tr style={tr_style} onClick= {this.handleClick}>
        <td>{parse_date(this.props.values.date)}</td>
        <td>{parse_date(this.props.values.expiry_date)}</td>
        <td>{this.props.values.name}</td>
        <td>{this.props.values.phone_number}</td>
      </tr>
    )
  }
})
