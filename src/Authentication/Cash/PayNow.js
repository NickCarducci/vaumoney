import React from "react";
import { render } from "react-dom";
import { countries } from "./countries";
import { specialFormatting } from "./Email";
import { states } from "./utils";

export default class PayNow extends React.Component {
  state = {
    billing_details: {
      city: "",
      line1: "",
      line2: "",
      state: "",
      postal_code: "",
      country: "US"
    },
    number: "4242424242424242",
    expiry: "12/34",
    cvc: "000",
    account_holder_type: "individual",
    account_number: "000123456789",
    routing_number: "110000000",
    savings: "checking"
  };
  render() {
    const textu = (e, name, exp) => {
      const value = e.target.value;
      this.setState({
        [name]:
          value +
          (exp ? value.substring(0, 2) + "/" + value.substring(2, 4) : "")
      });
    };
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
    return (
      <form
        style={{
          display: this.props.hide ? "none" : "block"
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          this.props.submit();
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            required={true}
            placeholder="amount to send"
            //type="number"
            value={this.props.amount}
            onChange={(e) =>
              this.props.setAmount({
                amount: e.target.value
              })
            }
            style={{
              display: "flex",
              position: "relative",
              backgroundColor: "rgb(25,35,25)",
              borderBottom: "1px white solid",
              height: "36px",
              width: "50px",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          />
          <button type="submit">Pay Now</button>
        </div>
        From:
        <div
          style={{
            display: "flex",
            width: "100%"
          }}
        >
          <input
            required={true}
            placeholder="First"
            value={this.state.first}
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
            required={true}
            placeholder="Last"
            value={this.state.last}
            style={{ width: "33%" }}
          />
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
        <select
          //value={this.state.payoutType}
          onChange={(e) => {
            if (this.state.payoutType !== e.target.value)
              this.setState({ payoutType: e.target.value });
          }}
        >
          {["send cash", "bank", "card"].map((x) => {
            return <option key={x + "payout"}>{x}</option>;
          })}
        </select>
        {this.state.payoutType !== "bank" ? (
          /*<div id="card-number" />
                                    <div id="card-exp" />
                                  <div id="card-cvc" />*/
          <div>
            <input
              //id="card-number"
              required={true}
              placeholder="primary"
              value={this.state.number}
              onChange={(e) => textu(e, "number")}
            />
            <input
              required={true}
              placeholder="expiry"
              value={this.state.expiry}
              onChange={(e) => textu(e, "expiry", true)}
            />
            <input
              required={true}
              placeholder="cvc"
              value={this.state.cvc}
              onChange={(e) => textu(e, "cvc")}
            />
          </div>
        ) : (
          <div
          /*onSubmit={(e) => {
                                  e.preventDefault();
                                  submitBankCard("bank");
                                }}*/
          >
            {/*<input
                required={true}
                placeholder="company"
                value={this.state.account_holder_type}
                onChange={(e) => textu(e, "account_holder_type")}
              />*/}
            <select
              onChange={(e) =>
                this.setState({ account_holder_type: e.target.value })
              }
            >
              {["individual", "company"].map((x) => {
                return <option>{x}</option>;
              })}
            </select>
            <input
              required={true}
              placeholder="account"
              value={this.state.account_number}
              onChange={(e) => textu(e, "account_number")}
            />
            <select
              onChange={(e) => this.setState({ savings: e.target.value })}
            >
              {["checking", "savings"].map((x) => {
                return <option>{x}</option>;
              })}
            </select>
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
              onChange={(e) => textu(e, "routing_number")}
            />
          </div>
        )}
      </form>
    );
  }
}
