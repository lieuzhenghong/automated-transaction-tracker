/* --------------------------------- 
 *
 * Add Transaction Form Page 
 * 
 * --------------------------------- */ 

var Add_Item_Button = React.createClass({
  handleClick: function(event){
    this.props.Click();
    event.preventDefault();
  },
  render: function() {
    return (
      <button className="add_item_button" onClick =
      {this.handleClick} >
      Add new item
      </button>
    )
  }
});

var Remove_Item_Button = React.createClass({
  handleClick: function(event){
    this.props.Click();
    event.preventDefault();
  },
  render: function() {
    return (
      <button className="remove_item_button" onClick =
      {this.handleClick} >
      Remove item
      </button>
    )
  }
});


var Add_Transaction_Page = React.createClass({
  getInitialState: function() {
  return  ({
    item_count: 1,
    items: [{name: '', amount: ''}],
    name: '',
    phone_number: '',
    expiry_date_number: 1,
    expiry_date_selector: 'month'
    })
  },
  handleAddClick: function() {
    console.log("clicked");
    this.state.items.push({item_name: '', item_amount: ''});
    this.setState({
      item_count: this.state.item_count + 1,
      items: this.state.items
    });
    return this.state.item_count;
  },  
  handleRemoveClick: function() {
    console.log("clicked");
    this.state.items.splice(-1, 1);
    console.log(this.state.items);
    if (this.state.item_count == 0) {
      this.state.item_count = 0;
    }
    else {
      this.state.item_count --;
    }
    console.assert(this.state.item_count >= 0);
    this.setState({
      item_count: this.state.item_count,
      items: this.state.items
    });
    return this.state.item_count;
  },

  handleSubmit: function(event) {    
    var data =  {
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
      items: [{name: '', amount: ''}],
      name: '',
      phone_number: '',
      expiry_date_number: 1,

    });

    event.preventDefault();
  },
  handleChange: function(key, name, amount){
    // console.log(key, item_name, item_amount);
    this.state.items[key].name = name;
    this.state.items[key].amount = amount;
    // console.log(item_name, item_amount);
    this.setState({
      items: this.state.items
    });
  },
  handleNameChange: function(event) {
    console.log(event.target.value);
    this.state.name = event.target.value;
    this.setState({
      name: this.state.name
    });
    //console.log(this.state.name);
  },
  handlePhoneNoChange: function(event) {
    this.state.phone_number = event.target.value;
    this.setState({
      phone_number: this.state.phone_number
    });
  },
  handleExpiryDateNumberChange: function(event) {
    this.state.expiry_date_number = event.target.value;
    console.log(this.state.expiry_date_number);
    this.setState({
      expiry_date_number: this.state.expiry_date_number
    });
  },
  handleExpiryDurationChange: function(event) {
    this.state.expiry_date_selector = event.target.value;
    this.setState({
      expiry_date_selector: this.state.expiry_date_selector
    });
    console.log(this.state.expiry_date_selector);
  },
  
  render: function(){
    if (this.props.active_page != 'Add_Transaction_Page') {
      return(null);
    }
    console.log('Add_Trans_Page');
    var items = [];
    for (let i = 0; i < this.state.item_count; i++) {
      items.push(<Item react_key={i} key={i} values={this.state.items[i]}
      onChange={this.handleChange} />)
    };
    return(
      <div class ="page">
      <form>
      <h1>Add new loan</h1>
        <label htmlFor="name">Name</label>
        <input 
          type='text' 
          name="name"
          placeholder='Name' 
          value={this.state.name} 
          onChange={this.handleNameChange} 
          required>
        </input>
        <label htmlFor="phone_number">Phone number</label>
        <input 
          type ='tel' 
          name="phone_number" 
          placeholder='Phone number' 
          value={this.state.phone_number} 
          onChange={this.handlePhoneNoChange}
          required>
        </input>
        <label htmlFor="expiry_duration_number">Expiry date</label>
        <input
          //className = 'half-width'
          id = 'half-width'
          type = 'number'
          name = 'expiry_duration_number'
          placeholder = '1'
          value = {this.state.expiry_date_number}
          onChange={this.handleExpiryDateNumberChange}
          min = "1"
          required
        >
        </input>
        <select 
          onChange={this.handleExpiryDurationChange}
          defaultValue="month" 
          name="expiry_duration_selector"
        >
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
        </select>
        <Add_Item_Button Click={this.handleAddClick}/>
        <Remove_Item_Button Click={this.handleRemoveClick}/>
        <table>
          <thead>
            <tr>
            <th>Item name</th>
            <th>Item amount</th>
            </tr>
          </thead>
          <tbody>
          {items}
          </tbody>
        </table>
        <input type='submit' value='Add loan' onClick={this.handleSubmit}></input>
        <Back_to_Home_Button />
      </form>
      </div>
    )
  }
})

var Item = React.createClass({  
  handleChange: function() {
    //Calls the function onChange in Add_Transaction_Form to mutate the state in the parent. 
    this.props.onChange(this.props.react_key, this.refs.name.value,
    this.refs.amount.value);
  },
  
  render: function(){
    //console.log(this.props.values);
    return(
      <tr height="20px">
      <td>
        <input 
          required
          type = 'text' 
          placeholder="Item name"
          value={this.props.values.name} 
          ref="name"
          onChange={this.handleChange}
        >
        </input>
      </td>
      <td>
      <input 
        type = 'number' 
        min= "1"
        placeholder = "Amount"
        value={this.props.values.amount}
        ref="amount"
        onChange={this.handleChange}
        required>
      </input>
      </td>
      </tr>
    )
  }
})

