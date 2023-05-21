import {
  Elements,
  ElementsConsumer, //Recipient => props[stripe,elements]
  PaymentElement //PaymentThing
} from "@stripe/react-stripe-js";
import React from "react";
import MicroVerify from "./MicroVerify";
class PaymentThing extends React.Component {
  render() {
    const { stripe } = this.props;
    return (
      <PaymentElement
        options={this.props.options}
        onChange={(event) => {
          console.log(event);
          if (event.complete) {
            if (event.value.name) return null;
            // Extract potentially complete address
            this.setState(
              {
                address: {
                  ...Object.keys(event.value.address).reduce(
                    (remaining, next) => {
                      //console.log(remaining, event.value.address[next]);
                      return Object.assign(remaining, {
                        [next]: event.value.address[next]
                          ? event.value.address[next]
                          : ""
                      });
                    },
                    event.value.address
                  )
                }
              },
              () => {}
            );
          }
        }}
      />
    );
  }
}
export default class Recipient extends React.Component {
  state = {};
  render() {
    const { recipient, user, stripePromise } = this.props;
    const changeBankInput = (e) =>
        this.setState({
          submitBank: false,
          shipping_details: {
            ...this.state.shipping_details,
            [e.target.id]: e.target.value
          }
        }),
      already =
        this.props.chosenRecipient &&
        this.props.chosenRecipient.id === recipient.id;
    const custom =
      user &&
      user[`stripecustom${this.props.shorter(this.props.selectThisOne)}Id`];
    const filler = custom ? "custom" : "";
    return (
      <div
        key={recipient.username}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: "rgb(25,35,25)",
            borderBottom: "1px white solid",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: "10px 0px"
          }}
        >
          <div
            style={{
              cursor: "pointer",
              textDecoration: already ? "underline" : "none"
            }}
            onClick={() => {
              const answer =
                already ||
                window.confirm(
                  `Send money to ${recipient.username}` +
                    (already ? "." : "?") +
                    recipient.id
                );
              //console.log(already);
              if (answer)
                this.props.setEmail({
                  chosenRecipient: already ? null : recipient
                });
            }}
          >
            {recipient.username}
          </div>
        </div>

        <MicroVerify
          user={user}
          linksure={this.props.linksure}
          shorter={this.props.shorter}
          show={
            user &&
            user[
              `stripe${filler + this.props.shorter(this.state.selectThisOne)}Id`
            ]
          }
          selectThisOne={this.state.selectThisOne}
          stripePromise={stripePromise}
          list={this.props.list}
          setEmail={this.props.setEmail}
          chosenRecipient={this.props.chosenRecipient}
          payoutType={this.props.payoutType}
        />
        {
          true
            ? null
            : null /*user.banks &&
          user.banks.length > 0 &&
          !this.state.newBank ? (
          <div style={{ display: "block" }}>
            <div onClick={() => this.setState({ newBank: true })}>
              another issuer
            </div>
            {user.banks.map((x) => {
              const getBank = () => {
                return {};
              };
              const bank = getBank(x);
              return <div>{bank.name}</div>;
            })}
          </div>
        ) : (
          <div>
            {/*<form
                      onSubmit={(e) => {
                        e.preventDefault();
                        //transferSnipcart
                        this.setState({ submitBank: true });
                      }}
                      style={{ width: "100%", display: "flex" }}
                    >
                      <input
                        style={{ width: "50%" }}
                        required={true}
                        value={this.state.shipping_details["first"]}
                        onChange={changeBankInput}
                        id="first"
                        placeholder="first"
                      />
                      <input
                        style={{ width: "50%" }}
                        required={true}
                        value={this.state.shipping_details["last"]}
                        onChange={changeBankInput}
                        id="last"
                        placeholder="last"
                      />
                    </form>* /}
            {this.state.submitBank && (
              //tokenize stripe customer
              //tokenize ach direct debit payment method
              //person token as customer?
              //react bank token? //https://stripe.com/docs/api/tokens/create_account
              //https://stripe.com/docs/stripe-js/react
              <Elements stripe={stripePromise} options={null}>
                <ElementsConsumer>
                  {async ({ stripe, elements } = (props) => props) => {
                    const { error } = await stripe.confirmSetup({
                      elements,
                      confirmParams: {
                        return_url: `https://${window.location.url}/${recipient.username}/thanks`
                      }
                    });

                    if (error) {
                      // handle error
                      console.log(error);
                    }
                    const { first, last } = this.state.shipping_details;
                    return (
                      !error && (
                        <PaymentThing
                          stripe={stripe}
                          auth={this.props.auth}
                          user={user}
                          options={{
                            defaultValues: {
                              billingDetails: {
                                name: first + " " + last,
                                phone: this.props.auth.phoneNumber,
                                //https://stripe.com/docs/payments/link/save-and-reuse?platform=web&link-integration-type=before-payment#prefill-customer-data
                                email: this.props.auth.email
                                //https://stripe.com/docs/payments/link/save-and-reuse?platform=web&link-integration-type=at-payment#prefill-customer-data
                                /*address: { postal_code: "10001", country: "US"}* /
                              }
                            }
                          }}
                        />
                      )
                    );
                  }}
                </ElementsConsumer>
              </Elements>
              /*The LinkAuthenticationElement component renders an email address input. 
                      When Link matches a customer email with an existing Link account, it sends 
                      the customer a secure, one-time code to their phone to authenticate. If the 
                      customer successfully authenticates, Stripe displays their 
                      Link-saved addresses and payment methods automatically for them to use.*/
          /*<LinkAuthenticationElement
                      // Optional prop for prefilling customer information
                          options={{
                            defaultValues: {
                              email: 'foo@bar.com',
                            },
                          }}
                      />* /
                        )}
          </div>
                        )*/
        }
      </div>
    );
  }
}
