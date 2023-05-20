import { PaymentElement } from "@stripe/react-stripe-js";
import React from "react";
export class Operating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        style={{
          display: "flex", //moral anarchism is mimetic
          position: "relative",
          top: "0",
          height: "min-content",
          /*transform: `translateY(${
            this.props.revenueShow || this.props.expenseShow ? "-280px" : "0%"
          })`,*/
          maxWidth: "300px",
          width: "80%",
          transition: ".3s ease-out",
          flexDirection: "column"
        }}
      >
        {this.state.openLinkToStripe && <div></div>}
        <div
          style={{
            display: this.props.scrolled > 280 ? "none" : "flex",
            position: "relative",
            backgroundColor: "rgb(25,35,25)",
            borderBottom: "1px white solid",
            height: "56px",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white"
          }}
        >
          <div
            onMouseEnter={() => {
              this.setState({ hoverWithdrawal: true }, () => {
                clearTimeout(this.hoverWithdrawalTimeout);
                this.hoverWithdrawalTimeout = setTimeout(() => {
                  this.setState({ hoverWithdrawal: false });
                }, 4000);
              });
            }}
            style={{
              marginLeft: "20px",
              textDecoration: this.state.hoverWithdrawal && "underline"
            }}
            onClick={() => {
              this.setState({
                openWithdrawalForm: !this.state.openWithdrawalForm
              });
            }}
          >
            {this.state.openWithdrawalForm
              ? "X"
              : this.state.hoverWithdrawal
              ? "withdrawal"
              : "$" + (this.state.escrow ? this.state.escrow : "_")}
          </div>
          {this.state.openWithdrawalForm ? (
            <form
              style={{
                marginRight: "20px"
              }}
              onSubmit={(e) => {
                e.preventDefault();
                //withdrawalSnipcart
              }}
            >
              <button
                type="submit"
                style={{
                  fontSize: "12px",
                  border: "1px solid",
                  padding: "4px 8px",
                  marginRight: "20px",
                  marginLeft: "10px",
                  backgroundColor: "rgb(25,35,25)",
                  textAlign: "center",
                  color: "white"
                }}
              >
                {"<"}
              </button>
              <input
                placeholder={0}
                required
                onChange={(e) => {
                  this.setState({ withdrawal: e.target.value });
                }} //fee https://snipcart.com/faq#Pricing
                //"This means that if you're selling under $500 a month, you'll be
                //charged a flat $10 to use Snipcart. If you're selling over $500, you'll be charged the 2% fee."
              />
            </form>
          ) : (
            <span style={{ display: "flex", alignItems: "center" }}>
              <h2 style={{ fontSize: this.props.width > 500 ? "" : "20px" }}>
                this year
                {(this.props.revenueShow || this.props.expenseShow) &&
                  `'s ${this.props.expenseShow ? "expenses" : ""}${
                    this.props.revenueShow ? "revenue" : ""
                  }`}
              </h2>

              <div
                onClick={() => {
                  this.props.openExp();
                }}
                style={{
                  fontSize: "12px",
                  border: "1px solid",
                  padding: "4px 8px",
                  marginRight: "20px",
                  marginLeft: "10px",
                  backgroundColor: "rgb(25,35,25)",
                  textAlign: "center",
                  color: "white"
                }}
              >
                \/
              </div>
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: this.props.width > 500 ? "" : "14px",
            display:
              this.props.revenueShow || this.props.expenseShow
                ? "none"
                : "flex",
            position: "relative",
            borderTop: "2px rgb(25,35,25) solid",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white"
          }}
        >
          <b
            onClick={this.props.openRev}
            style={{
              width: "50%",
              display: "flex",
              position: "relative",
              backgroundColor: "white",
              margin: "10px 0px",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px rgb(25,35,25) solid",
              color: "rgb(25,35,25)"
            }}
          >
            revenue
          </b>
          <b
            onClick={() => {
              //console.log("S");
              this.props.openExp();
            }}
            style={{
              zIndex: "1",
              width: "50%",
              display: "flex",
              position: "relative",
              backgroundColor: "white",
              margin: "10px 0px",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px left solid",
              color: "rgb(25,35,25)"
            }}
          >
            expenses
          </b>
        </div>
      </div>
    );
  }
}
export class PaymentAddressThing extends React.Component {
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

export const states = [
  {
    name: "Alabama",
    abbreviation: "AL"
  },
  {
    name: "Alaska",
    abbreviation: "AK"
  },
  {
    name: "American Samoa",
    abbreviation: "AS"
  },
  {
    name: "Arizona",
    abbreviation: "AZ"
  },
  {
    name: "Arkansas",
    abbreviation: "AR"
  },
  {
    name: "California",
    abbreviation: "CA"
  },
  {
    name: "Colorado",
    abbreviation: "CO"
  },
  {
    name: "Connecticut",
    abbreviation: "CT"
  },
  {
    name: "Delaware",
    abbreviation: "DE"
  },
  {
    name: "District Of Columbia",
    abbreviation: "DC"
  },
  {
    name: "Federated States Of Micronesia",
    abbreviation: "FM"
  },
  {
    name: "Florida",
    abbreviation: "FL"
  },
  {
    name: "Georgia",
    abbreviation: "GA"
  },
  {
    name: "Guam",
    abbreviation: "GU"
  },
  {
    name: "Hawaii",
    abbreviation: "HI"
  },
  {
    name: "Idaho",
    abbreviation: "ID"
  },
  {
    name: "Illinois",
    abbreviation: "IL"
  },
  {
    name: "Indiana",
    abbreviation: "IN"
  },
  {
    name: "Iowa",
    abbreviation: "IA"
  },
  {
    name: "Kansas",
    abbreviation: "KS"
  },
  {
    name: "Kentucky",
    abbreviation: "KY"
  },
  {
    name: "Louisiana",
    abbreviation: "LA"
  },
  {
    name: "Maine",
    abbreviation: "ME"
  },
  {
    name: "Marshall Islands",
    abbreviation: "MH"
  },
  {
    name: "Maryland",
    abbreviation: "MD"
  },
  {
    name: "Massachusetts",
    abbreviation: "MA"
  },
  {
    name: "Michigan",
    abbreviation: "MI"
  },
  {
    name: "Minnesota",
    abbreviation: "MN"
  },
  {
    name: "Mississippi",
    abbreviation: "MS"
  },
  {
    name: "Missouri",
    abbreviation: "MO"
  },
  {
    name: "Montana",
    abbreviation: "MT"
  },
  {
    name: "Nebraska",
    abbreviation: "NE"
  },
  {
    name: "Nevada",
    abbreviation: "NV"
  },
  {
    name: "New Hampshire",
    abbreviation: "NH"
  },
  {
    name: "New Jersey",
    abbreviation: "NJ"
  },
  {
    name: "New Mexico",
    abbreviation: "NM"
  },
  {
    name: "New York",
    abbreviation: "NY"
  },
  {
    name: "North Carolina",
    abbreviation: "NC"
  },
  {
    name: "North Dakota",
    abbreviation: "ND"
  },
  {
    name: "Northern Mariana Islands",
    abbreviation: "MP"
  },
  {
    name: "Ohio",
    abbreviation: "OH"
  },
  {
    name: "Oklahoma",
    abbreviation: "OK"
  },
  {
    name: "Oregon",
    abbreviation: "OR"
  },
  {
    name: "Palau",
    abbreviation: "PW"
  },
  {
    name: "Pennsylvania",
    abbreviation: "PA"
  },
  {
    name: "Puerto Rico",
    abbreviation: "PR"
  },
  {
    name: "Rhode Island",
    abbreviation: "RI"
  },
  {
    name: "South Carolina",
    abbreviation: "SC"
  },
  {
    name: "South Dakota",
    abbreviation: "SD"
  },
  {
    name: "Tennessee",
    abbreviation: "TN"
  },
  {
    name: "Texas",
    abbreviation: "TX"
  },
  {
    name: "Utah",
    abbreviation: "UT"
  },
  {
    name: "Vermont",
    abbreviation: "VT"
  },
  {
    name: "Virgin Islands",
    abbreviation: "VI"
  },
  {
    name: "Virginia",
    abbreviation: "VA"
  },
  {
    name: "Washington",
    abbreviation: "WA"
  },
  {
    name: "West Virginia",
    abbreviation: "WV"
  },
  {
    name: "Wisconsin",
    abbreviation: "WI"
  },
  {
    name: "Wyoming",
    abbreviation: "WY"
  }
];
