import React from "react";
import firebase from "../.././init-firebase.js";
import {
  getAuth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  updatePhoneNumber
} from "firebase/auth";
import { parsePhoneNumber } from "react-phone-number-input";

export default class FIREBASE_PHONE extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.phoneAuthProvider = new PhoneAuthProvider(getAuth());
  }
  render() {
    const space = " ";
    return (
      <div
        style={{
          fontFamily: "'Plaster', cursive"
        }}
      >
        <span>
          <span onClick={() => window.alert("Vau.money personal trustee")}>
            NON-CHARITABLE
          </span>
          {space}
          <span
            style={{
              color: "rgba(20,20,150,.3)",
              WebkitTextStroke: ".75px grey",
              fontFamily: "'Plaster', cursive",
              fontWeight: "bold"
            }}
          >
            DECANTER
          </span>
          {space}
          <span
            //https://stackoverflow.com/questions/56841486/how-do-i-update-a-firebaseusers-phone-number-in-firebase-auth
            onClick={async () => {
              const answer = window.prompt("update decanter phone");
              if (answer) {
                //this.phone.current.click();
                const phone = parsePhoneNumber(answer),
                  id = await this.phoneAuthProvider.verifyPhoneNumber(
                    phone,
                    window.recaptchaVerifier
                  ),
                  cred = firebase.auth.PhoneAuthProvider.credential(
                    id,
                    window.prompt("enter the code sent to " + phone)
                  );
                await updatePhoneNumber(this.props.auth, cred);
              }
            }}
            style={{ border: "1px dashed", fontWeight: "bolder" }}
          >
            {this.props.auth.phoneNumber}
          </span>
        </span>
      </div>
    );
  }
}
