import React from "react";
import FIREBASE_PHONE from "./FIREBASE_PHONE.js";

class FIREBASE_EMAIL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const space = " ";
    return (
      <div
        style={{
          lineHeight: !this.props.hide ? "20px" : "0px",
          transition: ".3s ease-in",
          fontSize: !this.props.hide ? "12px" : "0px",
          width: "calc(100% - 6px)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          backgroundColor: !this.props.hide
            ? "rgb(207,226,243)"
            : "rgb(146,184,218)",
          //: "rgb(170,220,250)",
          borderTop: "1px solid",
          color: "grey",
          padding: !this.props.hide && "3px"
        }}
      >
        {/*
          <div
            style={{
              display:
                this.props.humanCodeCredential &&
                this.props.humanCodeCredential !== 1
                  ? "flex"
                  : "none"
            }}
            ref={this.props.recaptcha}
          />*/}
        {this.props.auth !== undefined &&
          this.props.auth.email &&
          this.props.user !== undefined &&
          !this.state.openIssuers && (
            <div style={{ textAlign: "left" }}>
              <FIREBASE_PHONE auth={this.props.auth} />
              <div
                style={{
                  display: "inline-block"
                }}
              >
                <span
                  style={{
                    border: "1px solid",
                    padding: !this.props.hide && "0px 6px"
                  }}
                  onClick={async () => {
                    const answer = window.confirm(
                      "Do you want to delete this email?"
                    );

                    if (answer)
                      await fetch(`https://vault-co.in/deleteemail`, {
                        method: "POST",
                        //credentials: "include",
                        headers: {
                          "Content-Type": "Application/JSON",
                          "Access-Control-Request-Method": "POST",
                          "Access-Control-Request-Headers": [
                            "Origin",
                            "Content-Type"
                          ] //allow referer
                        },
                        body: JSON.stringify(this.props.auth), //getAuth().currentUser
                        maxAge: 3600
                        //"mode": "cors",
                      })
                        .then(async (response) => await response.json())
                        .then((body) => {
                          window.alert(body);
                        })
                        .catch((err) => console.log(err));
                  }}
                >
                  &times;
                </span>
                &nbsp;
                <span
                  style={{
                    fontFamily: "'Plaster', cursive",
                    fontWeight: "normal"
                  }}
                >
                  <span
                    onClick={() => {
                      const answer = window.prompt("update decanter email");
                      if (answer && this.props.isEmail(answer)) {
                        this.props.handleUpdateEmail(answer);
                      }
                    }}
                    style={{ border: "1px dotted", fontWeight: "bolder" }}
                  >
                    {this.props.auth.emailVerified
                      ? "recovery email"
                      : "verification required"}
                  </span>
                  {space}
                  <span
                    style={{
                      transition: ".3s ease-in",
                      color: this.props.user.emailAuth ? "white" : "",
                      backgroundColor: this.props.user.emailAuth
                        ? "cornflowerblue"
                        : ""
                    }}
                    //onClick={() => window.alert("Vau.money personal trustee")}
                  >
                    {this.props.auth.email}
                  </span>
                </span>
              </div>
            </div>
          )}
      </div>
    );
  }
}
export default FIREBASE_EMAIL;
/*

  handleError = (err) =>
    window.confirm(
      `${
        err
          ? err.message
          : `you'll need to use the special emailed link to verify your email`
      }. Resend verification email to ${this.props.openEmail}?`
    )
      ? this.handleUpdateEmail(this.props.openEmail)
      : console.log(
          err
            ? err.message
            : `you'll need to use the emailed link to verify ${this.props.openEmail}`
        );
*/
//reauthenticateWithCredential === linkWithCredential + updateEmail ?

// if (this.emailAuthProvider.credentialWithLink instanceof Function)

//https://github.com/firebase/firebase-js-sdk/issues/6868
/*sendSignInLinkToEmail(getAuth(), openEmail, {
      url: window.location.href
    });*/
//"Cannot read properties of undefined (reading '_errorFactory')"
//https://stackoverflow.com/questions/70519291/typeerror-cannot-read-properties-of-undefined-reading-create-firebase-authe
//signInWithEmailLink()
/*.then((usercred) => {
        console.log("sendSignInLinkToEmail", usercred);
        databaseemail();
      })
      .catch((error) => {
        // Some error occurred.
        console.log("sendSignInLinkToEmail", openEmail, error);
      });*/
/**
       * 
       * 
class Defaultable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0
    };
  }
  componentWillUnmount = () => {
    clearInterval(this.int);
  };
  pauser = () => {
    this.setState({ pause: true });
    this.int = setInterval(
      () => this.setState({ timer: this.state.timer + 1 }),
      1000
    );
    setTimeout(() => {
      clearInterval(this.int);
      this.setState({ pause: false, timer: 0 });
    }, 10000);
  };
  unlinkPayoutAndDelete = async () => {
    const account = await this.stripe.payouts.create({
      id: "po_1HnrSaH0kRElZnOzCEyXENRs",
      object: "payout",
      amount: 1100,
      arrival_date: 1605484800,
      automatic: true,
      balance_transaction: "txn_1HnrSZ2eZvKYlo2CqQ0ajog5",
      created: 1605470668,
      currency: "usd",
      description: "STRIPE PAYOUT",
      destination: "ba_1HnrSaH0kRElZnOzly9fiE4o",
      failure_balance_transaction: null,
      failure_code: null,
      failure_message: null,
      livemode: false,
      metadata: {},
      method: "standard",
      original_payout: null,
      reversed_by: null,
      source_type: "card",
      statement_descriptor: null,
      status: "in_transit",
      type: "bank_account"
    });
    if (account) this.finishDelete(this.props.auth, "successful payout");
  };
  withBalance = (currentUser, email) =>
    !this.stripe.user.defaultBank
      ? window.alert(
          `you have ${this.stripe.user.balance} in your account, and no default bank. ` +
            `You must register a default bank to payout - then you may delete ` +
            `your account with us when your balance is 0`
        )
      : window.confirm(
          `are you sure you want to withdrawal ${this.stripe.user.balance}` +
            ` to ${this.stripe.user.defaultBank},` +
            ` delete your account, and delete your email?  You'll be logged out`
        ) && this.unlinkPayoutAndDelete(currentUser, email);

  finishDelete = async (email) =>
    window.confirm(
      `continue with ${
        this.props.user.banked ? "bank" : "email"
      } account deletion?`
    ) &&
    (await fetch(`https://vault-co.in/deleteemail`, {
      method: "POST",
      //credentials: "include",
      headers: {
        "Content-Type": "Application/JSON",
        "Access-Control-Request-Method": "POST"
      },
      body: JSON.stringify(this.props.auth), //getAuth().currentUser
      maxAge: 3600
      //"mode": "cors",
    })
      .then(async (response) => await response.text())
      .then((body) => {
        window.alert(body);
        updateDoc(doc(firestore, "userDatas", this.props.auth.uid), {
          defaultEmail: null,
          confirmedEmails: arrayRemove(email)
        })
          .then(() => {
            if (this.props.user.banked) {
              this.props.deleteStripe();
            }
            window.location.reload();
            //this.pauser();
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message)));

  deleteLastOne = (user, email) =>
    !user.banked
      ? updateDoc(doc(firestore, "userDatas", this.props.auth.uid), {
          defaultEmail: null
        })
          .then(() => {
            var answer = window.confirm(`delete email? you will be logged out`);
            if (answer) {
              this.finishDelete(email);
            }
            this.pauser();
          })
          .catch((err) => console.log(err.message))
      : this.stripe.user.balance === 0
      ? this.finishDelete(email)
      : this.withBalance(this.props.auth, email);

  deleteOneOfMany = async (email) => {
    var answer = window.confirm(`delete ${email}?`);
    if (answer) {
      var update = {
        confirmedEmails:
          this.props.user.defaultEmail === email
            ? arrayRemove(email)
            : arrayUnion(email)
      };
      if (this.props.user.defaultEmail === email)
        update.defaultEmail = this.props.user.confirmedEmails.find(
          (e) => e !== email
        );
      updateDoc(doc(firestore, "userDatas", this.props.auth.uid), update);
      if (this.props.user.banked) {
      }
    }
  };
  updateStripeEmail = (email) => {
    //edit email in stripe
    /*const account = await this.stripe.accounts.update({
    type: "custom",
    country: "US",
    email: x,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  });* /
  };
  render() {
    const { x, i, user } = this.props;
    return (
      <div
        onMouseEnter={() => this.setState({ hoverEmail: true })}
        onMouseLeave={() => this.setState({ hoverEmail: false })}
        style={{ display: "flex" }}
      >
        <div
          key={i}
          style={{
            display: "flex",
            fontSize: "12px",
            color: "grey",
            padding: "3px",
            margin: "1px",
            textDecoration: user.defaultEmail === x ? "underline" : "none"
          }}
          onClick={() => {
            if (this.state.timer === 0) {
              if (user.defaultEmail === x) {
                if (this.props.user.confirmedEmails.length === 1) {
                  this.deleteLastOne(user, null);
                } else {
                  updateDoc(doc(firestore, "userDatas", this.props.auth.uid), {
                    defaultEmail: null
                  }).catch((err) => console.log(err.message));
                }
              } else {
                console.log("making default");
                updateDoc(doc(firestore, "userDatas", this.props.auth.uid), {
                  defaultEmail: x
                })
                  .then(() => {
                    if (user.banked) {
                      this.updateStripeEmail(x);
                    }
                    this.pauser();
                  })
                  .catch((err) => console.log(err.message));
              }
            } else {
              window.alert(`just wait ${this.state.timer} seconds`);
            }
          }}
        >
          {this.state.timer !== 0 && (
            <div>
              <div
                style={{
                  marginRight: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px",
                  width: "15px",
                  height: "15px",
                  position: "absolute"
                }}
              >
                {this.state.timer}
              </div>
              <div
                style={{
                  marginRight: "5px",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50px",
                  borderBottom: "1px solid",
                  transform: `rotate(${(this.state.timer / 10) * 360}deg)`,
                  transition: `${this.state.timer / 10}s ease-in`
                }}
              />
            </div>
          )}
          {x}{" "}
        </div>
        {(this.props.user.defaultEmail === x || this.state.hoverEmail) && (
          <div
            onClick={() =>
              user.confirmedEmails.length > 1
                ? this.deleteOneOfMany(x)
                : this.deleteLastOne(user, x)
            }
            style={{
              textDecoration: "none",
              fontSize: "10px",
              color: "grey",
              border:
                user.defaultEmail === x || this.state.hoverEmail
                  ? "1px solid"
                  : "none",
              padding: "3px",
              margin: "1px",
              borderRadius: "4px"
            }}
          >
            {this.state.hoverEmail
              ? "delete"
              : user.defaultEmail === x
              ? "default"
              : null}
          </div>
        )}
      </div>
    );
  }
}
       */
