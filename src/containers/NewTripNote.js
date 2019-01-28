import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

import LoaderButton from "../components/LoaderButton";
import config from "../config/config";
import { validFileSize } from "../libs/validFile"

import "./NewTripNote.css";

export default class NewTripNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      tripNote: ""
    };

    this.firstFile = null
    this.secondFile = null
 
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  validateForm() {
    // maybe add the other checks in here too?
    return this.state.tripNote.length > 0;
  }

  handleTripNoteChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    // seems pulling off the event enough to pass the file?
    const name = event.target.id;
    const file = event.target.files[0];

    console.log(`selected ${event.target.id} as ${event.target.files[0].name}`)

    if (!validFileSize(file)) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
    }

    if (name === "firstFile") {
      this.firstFile = file
    } else {
      this.secondFile = file
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    console.log(this.firstFile)
    console.log(this.secondFile)

    if (!(this.firstFile && this.secondFile)) {
      alert(`Please pick two files to merge`);
      return
    }

    if (!(validFileSize(this.firstFile) & validFileSize(this.secondFile))) {
        alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE/1000000} MB.`);
        return;
    } 
  
    this.setState({ isLoading: true });

    try {

      const firstFileKey = await s3Upload(this.firstFile)
      const secondFileKey = await s3Upload(this.secondFile)
      
      await this.createNote({
        firstFileKey: firstFileKey,
        secondFileKey: secondFileKey,
        tripNote: this.state.tripNote
      });

      this.props.history.push("/");

    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

  render() {
    return (
      <div className="NewTripNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="tripNote">
            <FormControl
              onChange={this.handleTripNoteChange}
              value={this.state.tripNote}
              componentClass="textarea"
            />
          </FormGroup>

          <FormGroup controlId="firstFile">
            <ControlLabel>First File</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>

          <FormGroup controlId="secondFile">
            <ControlLabel>Second File</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>

          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}