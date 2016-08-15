class Add_Store_Form extends React.Component {
  render() {
    return(
        <form>
        <label for='store_name'>Store name</label>
        <input type='text' id='store_name'/>
        
        <input type='submit' value = 'Create store' />
        </form>
        )
  }
}

module.exports = Add_Store_Form;
