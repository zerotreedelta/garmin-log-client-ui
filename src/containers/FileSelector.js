import React, { Component } from 'react'

import './FileSelector.css'

class FileSelector extends React.Component {
    constructor(props) {
      super(props)
  
      this.state = {
        fileName: null
      }
  
      this.handleFileSelected = this.handleFileSelected.bind(this)
  
      // files are different... require this Ref object vs state object
      this.file = React.createRef()
    }
  
    handleFileSelected = event => {
      event.preventDefault()
  
      // why do we need to have the const? event gets reused... that fast?
      const target = event.target;
      const name = event.target.name;
      const files = target.files;
  
      console.log("handleFileSelected...")
      console.log(`selected ${name} as ${files[0].name}`)
  
      // this.file should be autoset based on ref attrib on the input
      // setting state is async
      this.setState(() => ({
        fileName: files[0].name
      }))
  
      // passing the file ref... could just pull off the event and simplify? 
      this.props.onFileSelected(event, this.props.name, this.file);
    }
  
    // since parent maintains state, could probably simplify this class down to just a function
    render() {
        <FormGroup controlId={this.props.name}>
        <ControlLabel>{this.props.name}</ControlLabel>
        <FormControl onChange={this.handleFileChange} type="file" ref={this.file}/>
      </FormGroup>
      
    }
  
  }