import React from 'react'

class AutoComplete extends React.Component{
 
    constructor(props){
        super(props)
        this.state = {
              searchInput: ""
        }
    }

    render(){
        const { 
           state: {
             searchInput
            }
       } = this;
       
       return (
           <>
             <input
               type="text"
               value={searchInput}
             />
           </>
       )
    }
}

export default AutoComplete;