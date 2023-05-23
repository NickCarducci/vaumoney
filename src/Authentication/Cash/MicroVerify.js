import {
  Elements,
  ElementsConsumer,
  PaymentElement
} from "@stripe/react-stripe-js";
import { collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import React from "react";
import { standardCatch } from "../FIREBASE_SUDO";
import firebase from "../init-firebase";
const firestore = getFirestore(firebase);
class MicroVerify extends React.Component {
  state = {};
  render() {
    const {
      user,
      shorter,
      linksure,
      selectThisOne,
      stripePromise
    } = this.props;
    const textu = (e, name, exp) => {
      const value = e.target.value;
      this.setState({
        [name]:
          value +
          (exp ? value.substring(0, 2) + "/" + value.substring(2, 4) : "")
      });
    };
    const space = " ";
    const custom = user && user[`stripecustom${shorter(selectThisOne)}Id`];
    const filler = custom ? "custom" : "";
    return (
      selectThisOne &&
      user &&
      user[`stripe${filler + shorter(selectThisOne)}Id`] &&
      !linksure(selectThisOne) && (
        <div>
          {user[`customer${shorter(selectThisOne)}Id`] &&
            user[`cardholder${shorter(selectThisOne)}Id`] && (
              <div>
                <h2
                  style={{
                    display: this.props.chosenRecipient ? "none" : "block"
                  }}
                >
                  <select
                    onChange={async (e) => {
                      this.props.setEmail({ payoutType: e.target.value });
                      if (this.props.payoutType !== e.target.value) {
                        this.setState({ clientSecret: null });
                        if (this.props.payoutType !== "setup") {
                          const bankcard =
                            this.props.payoutType === "Bank"
                              ? "us_bank_account"
                              : "card";
                          await fetch("https://vault-co.in/add", {
                            method: "POST",
                            headers: {
                              "Content-Type": "Application/JSON",
                              "Access-Control-Request-Method": "POST",
                              "Access-Control-Request-Headers": [
                                "Origin",
                                "Content-Type"
                              ] //allow referer
                            },
                            body: JSON.stringify({
                              bankcard
                            })
                          })
                            .then(async (res) => await res.json())
                            .then(async (res) => {
                              const clientSecret =
                                res.setupIntent.client_secret;
                              if (clientSecret) this.setState({ clientSecret });
                              /*const { stripe, elements } = this.state;
                              var token = null;
                              const bank = this.props.payoutType;
                              //var card = this.state[`submitStripe${bank ? "Bank" : "Card"}`];
                              const { address: addr } = user;
                              if (!addr) return getUserInfo();

                              if (bank) {
                                card = {
                                  country: user.address.country,
                                  currency: "USD",
                                  account_holder_name:
                                    user.first + this.state.middle + user.last,
                                  account_holder_type: this.state
                                    .account_holder_type,
                                  account_number: this.state.account_number,
                                  //account_type: this.state.account_type,
                                  routing_number: this.state.routing_number
                                };
                              }
                              token = await stripe.tokens.create({
                                [bank ? "bank_account" : "card"]: card,
                                customer:
                                  user[
                                    `customer${shorter(
                                      selectThisOne
                                    )}Id`
                                  ]
                              });*/
                            })
                            .catch(standardCatch);
                        }
                      }
                    }}
                  >
                    {["setup", "Card", "Bank"].map((x) => {
                      return <option key={x + "payout"}>{x}</option>;
                    })}
                  </select>
                </h2>
                {user &&
                  user[`micro${filler + shorter(selectThisOne)}Link`] && (
                    <a
                      href={user[`micro${filler + shorter(selectThisOne)}Link`]}
                    >
                      Verify
                    </a>
                  )}
                {this.state.clientSecret && this.props.payoutType !== "setup" && (
                  //Are Stripe Bank and Card Elements being deprecated for sources' deprecation?
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret: this.state.clientSecret
                      //mode: "setup", //https://stripe.com/docs/js/elements_object/update#elements_update-options-mode
                      //currency: "usd"
                      //paymentMethodTypes
                    }}
                  >
                    <ElementsConsumer>
                      {(props) => {
                        const { stripe, elements } = props;
                        this.state.stripe !== stripe &&
                          this.setState({
                            stripe,
                            elements
                          });
                        return (
                          this.props.payoutType !== "setup" &&
                          stripe &&
                          (() => {
                            // Retrieve the "setup_intent_client_secret" query parameter appended to
                            // your return_url by Stripe.js
                            //var paymentElement = elements.create("payment");
                            return (
                              /*<CardElement
                            `  options={{
                                style: {
                                  base: {
                                    fontFamily: "Space Mono, monospace",
                                    color: "black"
                                  }
                                }
                              }}
                              onChange={async (event) => {
                                //console.log(event);
                                if (event.complete) {
                                  if (event.value.name) return null;
                                }
                              }}
                            />*/
                              //paymen`tElement()
                              <form
                                onSubmit={async (event) => {
                                  event.preventDefault();
                                  if (!stripe || !elements) return null; //https://stripe.com/docs/payments/save-and-reuse#web-create-setup-intent
                                  /*
                                In order to create a payment element, you must pass a clientSecret or mode when creating the Elements group.

                                  e.g. stripe.elements({clientSecret: "{{CLIENT_SECRET}}"})
                                */

                                  elements.submit();
                                  const { error } = await stripe.confirmSetup({
                                    clientSecret: this.state.clientSecret,
                                    //`Elements` instance that was used to create the Payment Element
                                    elements,
                                    confirmParams: {
                                      return_url: `https://${window.location.hostname}/thanks`
                                    }
                                  });
                                  if (error) return console.log(error);
                                  return console.log("ok confirmed setup");
                                  const address = this.state.address
                                    ? this.state.address
                                    : user.address;
                                  const bank = this.props.payoutType === "Bank";
                                  /*const number = elements.create(
                                "cardNumber"
                              );
                              number.mount("#card-number");
                              const expiry = elements.create(
                                "cardExpiry"
                              );
                              expiry.mount("#card-expiry");
                              const cvc = elements.create("cardCvc");
                              cvc.mount("#card-cvc");*/
                                  //const element = elements.getElement("card");
                                  //return console.log("elements", elements);
                                  const expiry = this.state.expiry.split("/");
                                  (!bank
                                    ? stripe.confirmCardSetup(
                                        this.state.clientSecret,
                                        {
                                          payment_method: {
                                            card: {
                                              number: this.state.number,
                                              exp_month: expiry[0],
                                              exp_year: expiry[1],
                                              cvc: this.state.cvc
                                            }, //cardElement
                                            billing_details: {
                                              address,
                                              phone: this.props.auth
                                                .phoneNumber,
                                              name:
                                                user.first +
                                                this.state.middle +
                                                user.last,
                                              email: this.props.auth.email
                                            }
                                          },
                                          return_url: window.location.href
                                        }
                                      )
                                    : stripe.confirmUsBankAccountSetup(
                                        this.state.clientSecret, //"{SETUP_INTENT_CLIENT_SECRET}",
                                        {
                                          payment_method: {
                                            us_bank_account: {
                                              //country: user.address.country,
                                              //currency: "USD",
                                              account_holder_type: this.state
                                                .account_holder_type,
                                              account_number: this.state
                                                .account_number,
                                              //account_type: this.state.account_type,
                                              routing_number: this.state
                                                .routing_number
                                            },
                                            billing_details: {
                                              address,
                                              phone: this.props.auth
                                                .phoneNumber,
                                              name:
                                                user.first +
                                                this.state.middle +
                                                user.last,
                                              email: this.props.auth.email
                                            }
                                          }
                                        }
                                      )
                                  ).then((result) => {
                                    if (result.error) {
                                      // Inform the customer that there was an error.
                                      console.log(result.error.message);
                                    } else {
                                      // Handle next step based on SetupIntent's status.
                                      const { status, id } = result.setupIntent;
                                      if (status === "requires_action")
                                        stripe
                                          .handleNextAction({
                                            clientSecret: this.state
                                              .clientSecret
                                          })
                                          .then((result) => {
                                            // Handle result.error or result.paymentIntent
                                            if (result.error)
                                              return console.log(
                                                "error require action setup intent",
                                                result
                                              );
                                            console.log(
                                              "success payment intent handle action",
                                              result.setupIntent
                                            );
                                            const microlink =
                                              result.setupIntent.next_action
                                                .verify_with_microdeposits
                                                .hosted_verification_url;
                                            updateDoc(
                                              doc(
                                                collection(
                                                  firestore,
                                                  "userDatas"
                                                ),
                                                this.props.auth.uid
                                              ),
                                              {
                                                [`micro${shorter(
                                                  selectThisOne
                                                )}Link`]: microlink
                                              }
                                            )
                                              .then(() => {})
                                              .catch((e) => standardCatch(e));

                                            window.location.href = microlink;
                                          });
                                    }
                                  });

                                  /*
                                https://stripe.com/docs/js/setup_intents/confirm_us_bank_account_setup
                                const result = await this.state.stripe.confirmPayment(
                                  {
                                    //`Elements` instance that was used to create the Payment Element
                                    elements,
                                    confirmParams: {
                                      return_url: `https://${window.location.url}/${this.props.user.username}/thanks`
                                    }
                                  }
                                );*/
                                }}
                              >
                                <PaymentElement />

                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      width: "100%"
                                    }}
                                  >
                                    <input
                                      placeholder="First"
                                      value={user.first}
                                      style={{ width: "33%" }}
                                    />
                                    <input
                                      placeholder="Middle"
                                      value={this.state.middle}
                                      onChange={(e) => {
                                        this.setState({
                                          middle: e.target.value
                                        });
                                      }}
                                      style={{ width: "33%" }}
                                    />
                                    <input
                                      placeholder="Last"
                                      value={user.last}
                                      style={{ width: "33%" }}
                                    />
                                  </div>
                                  {
                                    this.props.payoutType !== "Bank" ? (
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                        }}
                                      >
                                        {/*<div id="card-number" />
                                    <div id="card-exp" />
                                  <div id="card-cvc" />*/}
                                        {/*<input
                                      //id="card-number"
                                      required={true}
                                      placeholder="primary"
                                      value={this.state.number}
                                      onChange={(e) =>
                                        textu(e, "number")
                                      }
                                    />
                                    <input
                                      required={true}
                                      placeholder="expiry"
                                      value={this.state.expiry}
                                      onChange={(e) =>
                                        textu(e, "expiry", true)
                                      }
                                    />
                                    <input
                                      required={true}
                                      placeholder="cvc"
                                      value={this.state.cvc}
                                      onChange={(e) => textu(e, "cvc")}
                                    />*/}
                                      </form>
                                    ) : (
                                      <div
                                      /*onSubmit={(e) => {
                                  e.preventDefault();
                                  submitBankCard("bank");
                                }}*/
                                      >
                                        <input
                                          required={true}
                                          placeholder="company"
                                          value={this.state.account_holder_type}
                                          onChange={(e) =>
                                            textu(e, "account_holder_type")
                                          }
                                        />
                                        <input
                                          required={true}
                                          placeholder="account"
                                          value={this.state.account_number}
                                          onChange={(e) =>
                                            textu(e, "account_number")
                                          }
                                        />
                                        {/*<input
                                  required={true}
                                  placeholder="checking"
                                  value={this.state.account_type}
                                  onChange={(e) => textu(e, "account_type")}
                                />*/}
                                        <input
                                          required={true}
                                          placeholder="routing"
                                          value={this.state.routing_number}
                                          onChange={(e) =>
                                            textu(e, "routing_number")
                                          }
                                        />
                                      </div>
                                    )

                                    /*<hr />
                          <input onChange={(e) => textu(e, "address")} />
                          <input
                            placeholder="email"
                            value={this.props.auth.email}
                            //value={this.state.email}
                            onChange={(e) => textu(e, "email")}
                          />
                          <input
                            placeholder="phone"
                            value={this.props.auth.phoneNumber}
                            onChange={(e) => textu(e, "phone")}
                          />
                          <input onChange={(e) => textu(e, "name")} />*/
                                  }
                                </div>
                                <button disabled={!stripe}>Submit</button>
                              </form>
                            );
                          })()
                        );
                      }}
                    </ElementsConsumer>
                  </Elements>
                )}
              </div>
            )}
          <div style={{ fontSize: "12px" }}>
            spending {user[`stripe${filler + shorter(selectThisOne)}Id`]}
          </div>
        </div>
      )
    );
  }
}

export default MicroVerify;
