import MuxPlayer from "@mux/mux-player-react";
import FIREBASE_MULTI from "./FIREBASE_MULTI";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  getFirestore,
  getDoc
} from "firebase/firestore";
import { standardCatch } from "../FIREBASE_SUDO";
import {
  Elements,
  ElementsConsumer,
  PaymentElement
} from "@stripe/react-stripe-js";
import STRIPE_ADDRESS from "./STRIPE_ADDRESS.js";
import {
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from "firebase/auth";
import React from "react";
import firebase from "../init-firebase";
import { countries } from "./countries";
import { Operating, states } from "./utils";
import Recipient from "./Recipient";

export const specialFormatting = (x, numbersOk) =>
  x
    .toLowerCase()
    //replace or regex a-z or A-Z includes space whitespace
    .replace(!numbersOk ? /[^a-zA-Z,']+/g : /[^a-zA-Z0-9,']+/g, " ")
    .split(" '")
    .map((word) => {
      var end = word.substring(1);
      var resword = word.charAt(0).toUpperCase() + end;
      return resword;
    })
    .join(" '")
    .split(" ")
    .map((word) => {
      var end = word.substring(1);
      /*if (word.includes("'")) {
        var withapos = word.lastIndexOf("'");
        var beginning = word.substring(1, withapos);
        //if (beginning.length === 1) {
        end =
          beginning +
          "'" +
          word.charAt(withapos + 1).toUpperCase() +
          word.substring(withapos + 2);
        // }
      }*/
      var resword = word.charAt(0).toUpperCase() + end;
      resword.replaceAll("Of", "of");
      resword.replaceAll("And", "and");
      resword.replaceAll("The", "the");
      //console.log(resword);["Of", "And", "The"].includes(resword); resword.toLowerCase()
      return resword; //arrayMessage(resword).join(" ");
    })
    .join(" ");
const firestore = getFirestore(firebase);

class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      payoutType: "send cash",
      lastPayoutType: "send cash",
      userQuery: "",
      users: [],
      banks: [],
      openEmail:
        props.auth !== undefined && props.auth.email ? props.auth.email : "",
      balance: 0,
      currency: "USD",
      billing_details: {
        first: "",
        last: "",
        city: "",
        line1: "",
        line2: "",
        state: "",
        postal_code: "",
        country: "US"
      }
    };
    this.FIREBASE_EMAIL = React.createRef();
  }
  componentDidUpdate = async (prevProps) => {
    if (this.props.auth !== prevProps.auth) {
      this.setState({
        openEmail:
          this.props.auth !== undefined && this.props.auth.email
            ? this.props.auth.email
            : ""
      });
    }
    if (this.props.openPaymentSecure !== prevProps.openPaymentSecure) {
      this.setState({
        openFormSecure: false
      });
    }
    /*if (
      this.props.user !== prevProps.user ||
      //this.props.selectThisOne !== this.state.lastSelectThisOne
      this.state.payoutType !== this.state.lastPayoutType
    ) {
      this.setState({ lastPayoutType: this.state.payoutType }, async () => {
        if (this.state.payoutType !== "send cash") this.list();
      });
    }*/
  };
  list = async (bankcard, customerId) => {
    console.log("list ", bankcard, customerId);
    await fetch("https://vault-co.in/list", {
      method: "POST",
      headers: {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
        "Content-Type": "Application/JSON"
      },
      body: JSON.stringify({
        bankcard: bankcard
          ? bankcard
          : this.state.payoutType === "Bank"
          ? "us_bank_account"
          : "card",
        customerId: customerId
          ? customerId
          : this.props.user[
              `customer${this.props.shorter(this.props.selectThisOne)}Id`
            ]
      })
    }) //stripe account, not plaid access token payout yet
      .then(async (res) => await res.json())
      .then(async (result) => {
        if (result.status) return console.log(result);
        if (result.error) return console.log(result);
        if (!result.paymentMethods)
          return console.log("dev error (Cash)", result);
        console.log("paymentMethods", result.paymentMethods);
        this.setState({ list: result.paymentMethods });
      })
      .catch(standardCatch);
  };
  render() {
    const { shorter } = this.props;
    const emailCallback = () => {
      //Have some interspective
      //Zelenskyy says Russia kill before probate

      //if (this.state.plaidAccessToken) return null;
      if (!this.state.openFormSecure) {
        console.log("email ok", this.props.auth.email);

        //return console.log(noAccountYetArray);
        this.setState({
          emailAuth: true,
          openFormSecure: true
        });
        this.props.setCash({ openPaymentSecure: false });
      }
      /*const missing = Object.keys(
        this.state.billing_details
      ).filter(
        (x) => this.state.billing_details[x] === "" && x !== "line2"
      );
      if (missing.length > 0)
        return window.alert("missing " + missing);*/
      fetch("https://geolocation-db.com/json/")
        .then(async (res) => await res.json())
        .then((r) => {
          const IPv4 = r.IPv4;
          //console.log(IPv4);
          this.setState({ IPv4 }, () => {
            //this.stripe.current.click()
            return this.state.dev
              ? window.alert("Please await this feature (3/14/2023)")
              : this.setState({ submitStripe: true });
            //submitBank();
          });
        })
        .catch((err) => console.log(err.message));
    };
    const space = " ",
      { user, stripePromise, getUserInfo } = this.props;
    const inputStyle = {
      border: "0px dotted grey",
      borderRadius: "0px",
      width: "100%"
    };
    const codify = (e, entry) => {
      const output = (e.target.id === "country" ? countries : states).find(
        (x) => x.name.toUpperCase() === entry.toUpperCase()
      );
      return output
        ? output[e.target.id === "country" ? "alpha_2" : "abbreviation"]
        : entry;
    };
    const changePayoutInput = (e) => {
      const entry = e.target.value;
      this.setState({
        submitStripe: false,
        billing_details: {
          ...this.state.billing_details,
          [e.target.id]: !["country", "state"].includes(e.target.id)
            ? specialFormatting(
                entry,
                ["line1", "line2", "postal_code"].includes(e.target.id)
              )
            : codify(e, entry)
        }
      });
    };
    const custom =
      user && user[`stripecustom${shorter(this.props.selectThisOne)}Id`];
    const filler = custom ? "custom" : "";
    return (
      <div>
        <div
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: this.state.openFormSecure
              ? "rgb(7,29,48)"
              : "rgb(200,200,200)",
            transition: ".3s ease-in",
            borderBottom: "1px white solid",
            height: "56px",
            width: "100%",
            top: "0px",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            transform: "translateY(0%)"
          }}
        >
          <div
            onClick={
              this.state.openFormSecure
                ? () => this.setState({ openFormSecure: false })
                : this.state.revenueShow || this.state.expenseShow
                ? () =>
                    this.setState({ revenueShow: false, expenseShow: false })
                : this.state.userQuery.length > 0 && this.state.userQuery !== ""
                ? () => this.setState({ userQuery: "" })
                : () => this.setState({ openIssuers: !this.state.openIssuers }) //this.props.emulateRoot // this.props.closeVaumoney
            }
            style={{
              margin: "10px",
              display: "flex",
              position: "absolute",
              width: "36px",
              top: "0",
              left: "0",
              borderRadius: "50px",
              height: "36px",
              border: "1px rgb(25,35,25) solid",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              color: "rgb(25,35,25)",
              zIndex: "3",
              transition: ".3s ease-in",
              transform: `rotate(${this.state.openIssuers ? "-90" : "0"}deg)`
            }}
          >
            {"<"}
          </div>
          {this.state.openIssuers ? (
            <span>issuers{space}payout</span>
          ) : !this.state.openFormSecure ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              style={{
                height: "33px",
                width: "calc(100%)",
                fontSize: "15px"
              }}
            >
              <input
                placeholder={
                  `username ` +
                  (this.props.prepared ? "or routing number" : "search")
                }
                style={{
                  height: "33px",
                  width: "calc(100% - 112px)",
                  fontSize: "15px"
                }}
                minLength={/[\d]+/.test(this.state.userQuery) ? 4 : null}
                maxLength="9"
                value={this.state.userQuery}
                onChange={(e) => {
                  var q = e.target.value;
                  //console.log("isnumber");
                  this.setState(
                    {
                      amount: q === "" ? "" : this.state.amount,
                      receiverRoutingNumber: /[\d]+/.test(q)
                        ? q
                        : !this.state.receiverRoutingNumber,
                      askIfRouting: /[\d]+/.test(q),
                      userQuery: q
                    },
                    () => {
                      clearTimeout(this.FETCHUSERS);
                      this.FETCHUSERS = setTimeout(async () => {
                        onSnapshot(
                          query(
                            collection(firestore, "users"),
                            where(
                              "usernameAsArray",
                              "array-contains",
                              this.state.userQuery
                            ),
                            orderBy("username", "desc"),
                            //startAt(new Date().getTime() / 1000 - 86400 * 30),
                            limit(10)
                          ),
                          (docs) =>
                            docs.forEach((doc) => {
                              //const l = query(collection(),where())
                              if (doc.exists()) {
                                var foo = doc.data();
                                foo.id = doc.id;
                                this.setState({
                                  users: [
                                    ...this.state.users.filter(
                                      (e) => e.id !== foo.id
                                    ),
                                    foo
                                  ]
                                });
                              }
                            }),
                          standardCatch
                        );
                      }, 6000);
                    }
                  );
                }}
              />
            </form>
          ) : (
            <span>
              <a
                style={{ color: "rgb(207,226,243)" }}
                href="https://stripe.com/legal/connect-account"
              >
                Stripe Connect
              </a>
              <br />
              business<span>&bull;</span>
              mailing
            </span>
          )}
          {!this.state.openIssuers &&
            (this.state.publicToken ? (
              this.state.balance ? (
                "payout (taxable)"
              ) : (
                "delete"
              )
            ) : (
              <div
                onClick={async () => {
                  /*if (!this.state.account)
              return this.setState({ openLinkToStripe: true },()=>{
                
              });*/
                  const { email } = this.props.auth;
                  console.log(this.props.auth);
                  if (
                    !email ||
                    !this.props.auth.emailVerified ||
                    email !== this.state.openEmail
                  )
                    return this.FIREBASE_EMAIL.current.click();

                  if (this.state.emailAuth) return emailCallback();

                  fetchSignInMethodsForEmail(getAuth(), email)
                    .then((signInMethods) => {
                      if (
                        signInMethods.indexOf(
                          EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
                        ) > -1
                      )
                        return emailCallback();

                      const canSignLinkEmail = isSignInWithEmailLink(
                        getAuth(),
                        window.location.href
                      ); //console.log("getAuth() a.k.a. auth ", getAuth());
                      console.log(
                        `can${canSignLinkEmail ? "" : "'t"} sign in with ` +
                          email
                      );
                      if (canSignLinkEmail)
                        return signInWithEmailLink(
                          getAuth(),
                          email,
                          window.location.href
                        )
                          .then(() => {
                            window.alert(email + " added!");
                            this.props.navigate("/");
                          })
                          .catch((e) => {
                            console.log(e.message);
                            if (e.message === "INVALID_OOB_CODE") {
                              window.alert(
                                `The ${email}-confirmation link was already either used or is just expired.`
                              );
                              this.props.navigate("/login");
                            }
                          });
                      const cb = (success) =>
                        this.setState({
                          humanCodeCredential: !success
                        }); //reauth then //if (this.state.humanCodeCredential === 2)
                      sendSignInLinkToEmail(getAuth(), this.props.auth.email, {
                        handleCodeInApp: true,
                        url: window.location.href
                      })
                        .then(() => {
                          window.alert("visit your email");
                          cb(true);
                        })
                        .catch(() => cb()); //this would invalidate phone auth?
                      //https://firebase.google.com/docs/auth/flutter/email-link-auth
                    })
                    .catch(standardCatch);
                }}
                //src={""}
                style={{
                  display: "flex",
                  position: "absolute",
                  right: "0px",
                  margin: "10px",
                  width: "36px",
                  top: "0px",
                  border: "1px solid",
                  height: "36px",
                  backgroundColor:
                    !this.state.submitStripe && this.state.openFormSecure
                      ? "rgb(255,217,102)" //"rgb(146,184,218)"
                      : "rgb(25,35,25)",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: "1",
                  color:
                    !this.state.submitStripe && this.state.openFormSecure
                      ? "navy" //"rgb(207,226,243)" // "rgb(207,226,243)" //"rgb(146,184,218)"
                      : "white"
                }}
                //alt="err"
              >
                +
              </div>
            ))}
        </div>
        <FIREBASE_MULTI
          ref={{
            current: {
              FIREBASE_MULTI: this.props.FIREBASE_MULTI,
              FIREBASE_EMAIL: this.FIREBASE_EMAIL,
              FIREBASE_PHONE_recaptcha: this.props.FIREBASE_PHONE_recaptcha
            }
          }}
          hide={
            this.state.openFormSecure ||
            this.props.selectThisOne ||
            this.state.chosenRecipient ||
            this.state.userQuery !== ""
          }
          getUserInfo={getUserInfo}
          auth={this.props.auth}
          user={user}
          setEmail={(e) => this.setState(e)}
          openEmail={this.state.openEmail}
          logoutofapp={this.props.logoutofapp}
        />
        {this.state.openStream && (
          <MuxPlayer
            streamType="ll-live" //"live"
            playbackId="{PLAYBACK_ID}"
            metadata={{
              video_id: "video-id-54321",
              video_title: "Test video title",
              viewer_user_id: "user-id-007"
            }}
          />
        )}
        <div
          style={{
            width: "100%",
            //minWidth: "300px",
            //maxWidth: this.props.width,
            backgroundColor: "white",
            color: "rgb(25,35,25)",
            transition: ".3s ease-in",
            flexDirection: "column"
          }}
        >
          {this.state.userQuery !== "" && this.state.users.length === 0 ? (
            <img
              style={{ width: "40px", height: "auto" }}
              src="https://www.dropbox.com/s/le41i6li4svaz0q/802%20%282%29.gif?raw=1"
              alt="error"
            />
          ) : (
            this.state.users
              .filter((x) => x.id !== this.props.auth.uid)
              .map((recipient) => {
                return (
                  <Recipient
                    key={recipient.id + "recipient"}
                    chosenRecipient={this.state.chosenRecipient}
                    recipient={recipient}
                    user={user}
                    setEmail={(e) => this.setState(e)}
                    stripePromise={stripePromise}
                    auth={this.props.auth}
                    linksure={this.props.linksure}
                    shorter={shorter}
                    payoutType={this.state.payoutType}
                  />
                );
              })
          )}
        </div>
        {!this.state.chosenRecipient
          ? null
          : this.state.list.length === 0
          ? "add a payment method"
          : this.state.list.map((x) => {
              const brand =
                x[this.props.payoutType === "Bank" ? "us_bank_account" : "card"]
                  .brand;
              return (
                <div>
                  <input
                    required
                    placeholder="amount to send"
                    //type="number"
                    value={this.state.amount}
                    onChange={(e) =>
                      this.setState({
                        amount: e.target.value
                      })
                    }
                    style={{
                      display: "flex",
                      position: "relative",
                      backgroundColor: "rgb(25,35,25)",
                      borderBottom: "1px white solid",
                      height: "56px",
                      width: "50px",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}
                  />
                  <div
                    onClick={async () => {
                      //give
                      const sht = shorter(this.props.selectThisOne);
                      await fetch("https://vault-co.in/pay", {
                        method: "POST",
                        headers: {
                          "Access-Control-Request-Method": "POST",
                          "Access-Control-Request-Headers": [
                            "Origin",
                            "Content-Type"
                          ], //allow referer
                          "Content-Type": "Application/JSON"
                        },
                        body: JSON.stringify({
                          paymentMethod: x.id,
                          customerId: user[`customer${sht}Id`],
                          storeId: this.state.chosenRecipient[`stripe83Id`],
                          currency: "usd",
                          total: this.state.amount
                        })
                      }) //stripe account, not plaid access token payout yet
                        .then(async (res) => await res.json())
                        .then(async (result) => {
                          if (result.status) return console.log(result);
                          if (result.error) return console.log(result);
                          if (!result.data)
                            return console.log("dev error (Cash)", result);
                          console.log(result.data);
                        })
                        .catch(standardCatch);
                      /*await fetch("https://vault-co.in/default", {
                        method: "POST",
                        headers: {
                          "Access-Control-Request-Method": "POST",
                          "Access-Control-Request-Headers": [
                            "Origin",
                            "Content-Type"
                          ], //allow referer
                          "Content-Type": "Application/JSON"
                        },
                        body: JSON.stringify({
                          customerId:
                            user[
                              `customer${shorter(
                                selectThisOne
                              )}Id`
                            ],
                          default_source: x.id
                          //get the customer
                          //make this payment method id default
                          //default_source & invoice_settings.default_payment_method
                        })
                      }) //stripe account, not plaid access token payout yet
                        .then(async (res) => await res.json())
                        .then(async (result) => {
                          if (result.status) return console.log(result);
                          if (result.error) return console.log(result);
                          if (!result.data)
                            return console.log(
                              "dev error (Cash)",
                              result
                            );
                          console.log(result.data);
                        })
                        .catch(standardCatch);*/
                    }}
                  >
                    {brand}
                  </div>
                </div>
              );
            })}
        {!this.state.chosenRecipient ? null : !user ||
          !user[`stripe${filler + shorter(this.props.selectThisOne)}Id`] ? (
          "choose an account"
        ) : (
          <div style={{ display: "flex" }}>
            <select
              //value={this.state.payoutType}
              onChange={(e) => {
                if (
                  this.state.amount &&
                  this.state.payoutType !== e.target.value
                )
                  this.setState({ payoutType: e.target.value }, () => {
                    //if ("" === e.target.value) return null;

                    this.list(
                      e.target.value === "bank" ? "us_bank_account" : "card",
                      user[`customer${shorter(this.props.selectThisOne)}Id`]
                    );
                  });
              }}
            >
              {["send cash", "bank", "card"].map((x) => {
                return <option key={x + "payout"}>{x}</option>;
              })}
            </select>
            <div
              style={{ padding: "5px" }}
              onClick={() =>
                this.setState({
                  chosenRecipient: null
                })
              }
            >
              &times;
            </div>
          </div>
        )}
        {
          /*this.state.openIssuers ? (
          this.state.banks.map((x) => {
            return <div></div>;
          })
        ) : */
          //this.props.selectThisOne ? null :
          this.state.openFormSecure && (
            <div>
              <form
                onSubmit={
                  (e) => {
                    e.preventDefault();
                    /*fetch("https://geolocation-db.com/json/")
            .then(async (res) => await res.json())
            .then((r) => {
              const IPv4 = r.IPv4;
              //console.log(IPv4);
              this.setState({ IPv4 }, () => {*/
                    this.setState({ submitStripe: true });
                  }
                  //submitBank()
                  //});}).catch((err) => console.log(err.message))
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: this.state.openFormSecure ? "" : "0px"
                }}
              >
                <div
                  style={{
                    fontSize: "0px",
                    overflow: "hidden",
                    height: "0px",
                    position: "relative"
                  }}
                >
                  <div style={{ position: "absolute" }}>
                    {this.state.submitStripe && (
                      <Elements stripe={stripePromise} options={null}>
                        <ElementsConsumer>
                          {(props) => {
                            const { stripe, elements } = props;

                            return (
                              <STRIPE_ADDRESS
                                saveaddress={(e) =>
                                  this.props.setCash({
                                    ...e,
                                    last: this.state.billing_details.last,
                                    first: this.state.billing_details.first
                                  })
                                }
                                noAccountYetArray={this.props.noAccountYetArray}
                                stripe={stripe}
                                auth={this.props.auth}
                                user={user}
                                first={this.state.billing_details.first}
                                last={this.state.billing_details.last}
                                options={{
                                  mode: "shipping",
                                  fields: {
                                    //name: "never",
                                    //firstName: "always",
                                    //lastName: "always"
                                  },
                                  display: {
                                    name: "split"
                                  },
                                  defaultValues: {
                                    firstName: this.state.billing_details.first,
                                    lastName: this.state.billing_details.last,
                                    /*name: this.state.billing_details.first +
                          " " +
                          this.state.billing_details.last,*/
                                    address: {
                                      line1: this.state.billing_details.line1,
                                      line2: this.state.billing_details.line2,
                                      city: this.state.billing_details.city,
                                      state: this.state.billing_details.state,
                                      postal_code: this.state.billing_details
                                        .postal_code,
                                      country: this.state.billing_details
                                        .country
                                    }
                                  }
                                  //If you want to use Payment Element, it is required to pass in the clientSecret.
                                  // passing the client secret obtained from the server
                                  //clientSecret: "{{CLIENT_SECRET}}"
                                  //https://stripe.com/docs/stripe-js/react
                                  //https://stripe.com/docs/elements/address-element/collect-addresses?platform=web&client=react
                                }}
                              />
                            );
                          }}
                        </ElementsConsumer>
                      </Elements>
                    )}
                  </div>
                </div>
                <table>
                  <thead></thead>
                  <tbody>
                    <tr
                      style={{
                        width: "calc(100% - 4px)",
                        display: "flex"
                      }}
                    >
                      <td
                        style={{
                          width: "calc(50% - 4px)",
                          paddingRight: "6px"
                        }}
                        //<div style={{ width: "100%", display: "flex" }}>
                      >
                        <input
                          style={inputStyle}
                          required={true}
                          value={this.state.billing_details["first"]}
                          onChange={changePayoutInput}
                          id="first"
                          placeholder="first"
                        />
                      </td>
                      <td style={{ width: "calc(50% - 4px)" }}>
                        {space}
                        <input
                          style={inputStyle}
                          required={true}
                          value={this.state.billing_details["last"]}
                          onChange={changePayoutInput}
                          id="last"
                          placeholder="last"
                        />
                      </td>
                    </tr>
                    <tr
                      style={{
                        width: "calc(100% - 4px)",
                        display: "flex"
                      }}
                    >
                      <td style={{ width: "100%" }}>
                        <input
                          style={inputStyle}
                          required={true}
                          value={this.state.billing_details["line1"]}
                          onChange={changePayoutInput}
                          id="line1"
                          placeholder="address"
                        />
                      </td>
                    </tr>
                    <tr
                      style={{
                        width: "calc(100% - 4px)",
                        display: "flex"
                      }}
                    >
                      <td style={{ width: "100%" }}>
                        <input
                          style={inputStyle}
                          value={this.state.billing_details["line2"]}
                          onChange={changePayoutInput}
                          id="line2"
                          placeholder="p.o. box or unit number"
                        />
                      </td>
                    </tr>
                    <tr
                      style={{
                        width: "calc(100% - 4px)",
                        display: "flex"
                      }}
                    >
                      <td style={{ width: "100%" }}>
                        <input
                          style={inputStyle}
                          required={true}
                          value={this.state.billing_details["city"]}
                          onChange={changePayoutInput}
                          id="city"
                          placeholder="city"
                        />
                      </td>
                    </tr>
                    <tr
                      style={{
                        width: "calc(100% - 4px)",
                        display: "flex"
                      }}
                    >
                      <td style={{ width: "100%" }}>
                        <input
                          style={inputStyle}
                          //maxLength={2}
                          //https://stripe.com/docs/tax/customer-locations#us-postal-codes
                          required={true}
                          value={this.state.billing_details["state"]}
                          onChange={changePayoutInput}
                          id="state"
                          placeholder="state"
                        />
                      </td>
                    </tr>
                    <tr
                      style={{
                        width: "calc(100% - 4px)",
                        display: "flex"
                      }}
                    >
                      <td style={{ width: "100%" }}>
                        <input
                          style={inputStyle}
                          maxLength={5}
                          required={true}
                          value={this.state.billing_details["postal_code"]}
                          onChange={changePayoutInput}
                          id="postal_code"
                          placeholder="ZIP"
                        />
                      </td>
                    </tr>
                    <tr
                      style={{
                        width: "calc(100% - 4px)",
                        display: "flex"
                      }}
                    >
                      <td style={{ width: "100%" }}>
                        <input
                          style={inputStyle}
                          //maxLength={2}
                          required={true}
                          value={this.state.billing_details["country"]}
                          onChange={changePayoutInput}
                          id="country"
                          placeholder="Country"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </div>
          )
        }

        {!this.props.selectThisOne &&
          !this.state.chosenRecipient &&
          this.state.userQuery === "" && (
            <Operating
              scrollTop={this.props.scrollTop}
              scrolling={this.props.scrolling}
              displacements={this.state.displacements}
              businesses={this.state.businesses}
              showtimeheader={this.state.showtimeheader}
              revenueShow={this.state.revenueShow}
              expenseShow={this.state.expenseShow}
              openRev={() =>
                this.setState({
                  revenueShow: !this.state.revenueShow,
                  expenseShow: false
                })
              }
              openExp={() => {
                //console.log("s");
                this.setState({
                  expenseShow: !this.state.expenseShow,
                  revenueShow: false
                });
              }}
            />
          )}
        {/*user !== undefined && this.props.openListedTransations && (
          <div
            style={{
              flexDirection: "column",
              display: "flex",
              maxWidth: "100vw",
              minWidth: "200px",
              transition: ".3s ease-out",
              backgroundColor: "white"
            }}
          >
            {this.props.transations && this.props.transations.length > 0 ? (
              this.props.transations.map((x) => {
                return (
                  <div>
                    {x.amount.value}&nbsp;{x.amount.currency}
                    <br />
                    {x.metadata.note}
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  marginTop: "20px",
                  borderRadius: "6px",
                  border: "1px solid"
                }}
              >
                no transactions
              </div>
            )}
          </div>
        )*/}
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Email {...props} {...ref.current} />
));
