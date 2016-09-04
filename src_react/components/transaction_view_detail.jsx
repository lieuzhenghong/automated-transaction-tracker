/* -------------------
 *
 * Transaction View Detail page
 *
 * ----------------------- */

var Transaction_View_Detail_Page = React.createClass({
  render: function (){
  if (this.props.active_page != 'Transaction_View_Detail_Page') {
    return(null);
  }
  else {
    //console.log(this.props);
  return(
    <div class ="page">
      <h1>Loans view (detail)</h1>
      <Transaction_Detail_Table transaction={this.props.transaction}/>
      <Return_Items_Button />
      <Renew_Transaction_Button />
      <Back_to_Home_Button />
    </div>
    )
  } 
   
  }
});

var Return_Items_Button = React.createClass({
  handleClick() {
    dispatcher.dispatchEvent('update_transaction', 'return');
  },
  render: function () {
    return (
      <button onClick={this.handleClick}>Return items</button>
  )
 } 
});

var Renew_Transaction_Button = React.createClass({
  handleClick() {
    dispatcher.dispatchEvent('update_transaction', 'renew');
  },

  render: function () {
  return (<button onClick={this.handleClick}>Renew loan</button>)
 } 
})


var Transaction_Detail_Table = React.createClass({
  render: function() {
    let transaction = this.props.transaction;
      var all_items = [];
      for (var item in transaction.items) {
        all_items.push(
        <tr>
          <th>Item Name</th>
          <td>{transaction.items[item].name}</td>
          <th>No.</th>
          <td>{transaction.items[item].amount}</td>
        </tr>
        )
      }
  return (
    <table id="transaction_detail_table">
      <tbody>
        <tr>
          <th>Date</th>
          <td>{transaction.date.substring(0,10)}</td>
        </tr>
        <tr>
          <th>Expiry Date</th>
          <td>{transaction.expiry_date.substring(0,10)}</td>
        </tr>
        <tr>
          <th>Returned</th>
          <td>{transaction.returned.toString()}</td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{transaction.name}</td>
        </tr>

        {all_items}
      </tbody>
    </table>
  )
  }
})

