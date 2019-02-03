import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth, Amplify } from "aws-amplify";

import config from "../config/config"

import LoaderButton from "../components/LoaderButton"
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        email: "",
        password: ""
      };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    this.setState({ isLoading: true });
  
    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);

      // TODO: would be better to config storage/api after user auths?
      // Amplify.configure({
      //   Storage: {
      //     region: config.s3.REGION,
      //     bucket: config.s3.BUCKET,
      //     identityPoolId: config.cognito.IDENTITY_POOL_ID
      //   },
      //   API: {
      //     endpoints: [
      //       {
      //         name: "notes",
      //         endpoint: config.apiGateway.URL,
      //         region: config.apiGateway.REGION
      //       },
      //     ]
      //   }
      // });

    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in…"
            />
        </form>
      </div>
    );
  }
}