import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { API, Storage } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";

import LoaderButton from "../components/LoaderButton";
import config from "../config/config";
import { validFileSize } from "../libs/validFile"
import "./Notes.css";

export default class Notes extends Component {
  constructor(props) {
    super(props);

    this.firstFile = null;
    this.secondFile = null;

    this.state = {
        isLoading: null,
        isDeleting: null,
        note: null,
        tripNote: "",
        firstFileURL: null,
        secondFileURL: null
      };
  }

  async componentDidMount() {
    try {
      let firstFileURL
      let secondFileURL

      console.log("Notes componentDidMount")

      const note = await this.getNote();
      const { tripNote, firstFileKey, secondFileKey } = note;

      console.log(note)
      console.log(firstFileKey)
      console.log(secondFileKey)
      console.log(tripNote)

      if (firstFileKey) {
        firstFileURL = await Storage.vault.get(firstFileKey);
      }

      if (secondFileKey) {
        secondFileURL = await Storage.vault.get(secondFileKey);
      }

      console.log(firstFileURL)
      console.log(secondFileURL)

      this.setState({
        note,
        tripNote,
        firstFileURL,
        secondFileURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getNote() {
    return API.get("notes", `/notes/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.tripNote.length > 0;
  }
  
  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleFileChange = event => {
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
  
  saveNote(note) {
    return API.put("notes", `/notes/${this.props.match.params.id}`, {
      body: note
    });
  }
  
  handleSubmit = async event => {

    event.preventDefault();
  
    // this logic needs to be updated... as they may have picked one of the files, not the other...

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
  
      await this.saveNote({
        tripNote: this.state.tripNote,
        firstFileKey: firstFileKey,
        secondFileKey: secondFileKey
      });

      this.props.history.push("/");

    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  
  deleteNote() {
    return API.del("notes", `/notes/${this.props.match.params.id}`);
  }
  
  handleDelete = async event => {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    this.setState({ isDeleting: true });
  
    try {
      await this.deleteNote();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }
  
  render() {
    return (
      <div className="Notes">
        {this.state.note &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="tripNote">
              <FormControl
                onChange={this.handleChange}
                value={this.state.tripNote}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.note.firstFileKey &&
              <FormGroup>
                <ControlLabel>First File</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.firstFileURL}
                  >
                    {this.formatFilename(this.state.note.firstFileKey)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
              {this.state.note.secondFileKey &&
              <FormGroup>
                <ControlLabel>Second File</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.secondFileURL}
                  >
                    {this.formatFilename(this.state.note.secondFileKey)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="firstFile">
              {!this.state.note.firstFile &&
                <ControlLabel>First File</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <FormGroup controlId="secondFile">
              {!this.state.note.secondFile &&
                <ControlLabel>Second File</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}