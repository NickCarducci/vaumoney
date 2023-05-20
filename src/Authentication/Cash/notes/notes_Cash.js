import React from "react";
import firebase from "../.././init-firebase.js";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  getDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  arrayRemove
} from "firebase/firestore";
import { standardCatch } from "../../Sudo";
import { PlaidLink, usePlaidLink } from "react-plaid-link";
import UAParser from "ua-parser-js";
import {
  getAuth,
  PhoneAuthProvider,
  reauthenticateWithCredential,
  RecaptchaVerifier,
  sendEmailVerification,
  updateEmail,
  EmailAuthProvider,
  linkWithCredential,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  fetchSignInMethodsForEmail,
  isSignInWithEmailLink,
  updatePhoneNumber
} from "firebase/auth";
import { parsePhoneNumber } from "react-phone-number-input";
import {
  AddressElement,
  Elements,
  ElementsConsumer
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
//"stripePromise"
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51MTtNXGVa6IKUDzpbVag2vdLVm7bU8lfz3sCH0DmMLF9eAhqAJDNyxXxJLzZ2i0YyCkFRCcrjr0qMKD5eIEkLClB00GGdnmtDm"
);
export const myStripeAccounts = [
  {
    mcc: "6540",
    account: "Trustee",
    description: `2503(e) and 280a fixed durable value and essential trust decanter`
  },
  {
    mcc: "1520",
    account: "Infrastructure", // ~or after-tax remaining retirement~ worked in ~retreats final good~
    description: `280a durable, outright, and worked-in encampment or retreat fixed value trust`
  }, //business that the market isn't available for.
  //taxableincome in-kind in trustis what the market isn't available (minimum deductible spending)
  {
    mcc: "8099",
    account: "Medical",
    description: `2503(e) out-of-pocket healthcare provider trust`
  },
  {
    mcc: "8299",
    account: "Educational",
    description: `2503(e) accredited institution or trade school tuition trust`
  }
];
const firestore = getFirestore(firebase);
class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.phoneAuthProvider = new PhoneAuthProvider(getAuth());
    this.recaptcha = React.createRef();
    this.newphonecaptcha = React.createRef();
  }
  handleUpdateEmail = (openEmail) => {
    const gotAuth = getAuth().currentUser,
      databaseemail = () => {
        /*getDoc(doc(firestore, "userDatas", this.props.auth.uid))
          .then((doc) =>
            (doc.exists() ? updateDoc : setDoc)(
              doc(firestore, "userDatas", this.props.auth.uid),
              {
                email: openEmail
              }
            )
              .then(() =>
                window.alert(
                  `great, please click the link in the email` +
                    ` from Google sent to ${openEmail}` +
                    ` in order to add bank accounts`
                )
              )
              .catch(standardCatch)
          )
          .catch(standardCatch);*/
      },
      login = (err) => {
        console.log(err.code);
        console.log(err.message);
        if (err.code !== "auth/requires-recent-login") return null;
        console.log("reauthenticating...", this.props.auth.phoneNumber); //handleReauth
        this.props.setApp({ humanCodeCredential: true });
      },
      verify = () =>
        sendEmailVerification(gotAuth)
          .then(databaseemail)
          .catch((err) => console.log(err.message));
    updateEmail(gotAuth, openEmail).then(verify).catch(login);
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.humanCodeCredential !== prevProps.humanCodeCredential) {
      if (this.props.humanCodeCredential === true) {
        console.log("launchRecaptcha");
        window.captcha = new RecaptchaVerifier(
          this.recaptcha.current,
          {
            size: "normal",
            callback: (response) => {
              this.props.setApp({ humanCodeCredential: 1 });
              console.log("RecaptchaVerifier", response);
              return response;
            },
            "expired-callback": (err) => {
              this.props.setApp({ humanCodeCredential: true });
              window.captcha.clear();
              console.log(err.message);
              return err;
            }
          },
          getAuth()
        );
        window.captcha.render();
      }
      if (this.props.humanCodeCredential === 1)
        this.phoneAuthProvider
          .verifyPhoneNumber(this.props.auth.phoneNumber, window.captcha)
          .then((verificationId) => {
            console.log("credential", verificationId);
            const code = window.prompt("Enter your code");
            if (!code) return this.props.setApp({ humanCodeCredential: false });
            const credential = PhoneAuthProvider.credential(
              verificationId,
              code
            );
            return reauthenticateWithCredential(
              getAuth().currentUser,
              credential
            );
          })
          .then((userCredential) => {
            console.log("login", userCredential);
            this.handleUpdateEmail(this.props.openEmail);
            // User successfully reauthenticated.
            this.props.setApp({ humanCodeCredential: false });
          })
          .catch((err) => console.log(err.message));
    }
  };

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

  render() {
    const space = " ";
    return (
      <div
        style={{
          lineHeight: !this.props.openFormSecure ? "20px" : "0px",
          transition: ".3s ease-in",
          fontSize: !this.props.openFormSecure ? "12px" : "0px",
          width: "calc(100% - 6px)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          backgroundColor: !this.props.openFormSecure
            ? "rgb(207,226,243)"
            : "rgb(146,184,218)",
          //: "rgb(170,220,250)",
          borderTop: "1px solid",
          color: "grey",
          padding: !this.props.openFormSecure && "3px"
        }}
      >
        <div
          style={{
            display:
              this.props.humanCodeCredential &&
              this.state.humanCodeCredential !== 1
                ? "flex"
                : "none"
          }}
          ref={this.recaptcha}
        />
        {this.props.auth.email && (
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontFamily: "'Plaster', cursive"
              }}
            >
              <span>
                <span
                  onClick={() => window.alert("Vau.money personal trustee")}
                >
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
                      const verifier = new RecaptchaVerifier(
                          this.newphonecaptcha.current,
                          {
                            callback: (response) =>
                              console.log("callback", response),
                            size: "invisible"
                          }
                        ),
                        phone = parsePhoneNumber(answer),
                        id = await this.phoneAuthProvider.verifyPhoneNumber(
                          phone,
                          verifier
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
            <div ref={this.newphonecaptcha} />
            <div
              style={{
                display: "inline-block"
              }}
            >
              <span
                style={{
                  border: "1px solid",
                  padding: !this.props.openFormSecure && "0px 6px"
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
                      this.handleUpdateEmail(answer);
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

class Operating extends React.Component {
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
          width: "400px",
          maxWidth: "100%",
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
              <h2>
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
          <h3
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
          </h3>
          <h3
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
          </h3>
        </div>
      </div>
    );
  }
}
class AddressThing extends React.Component {
  constructor(props) {
    super(props);

    var parser = new UAParser();
    this.state = {
      user_agent: parser.getUA()
    };
  }
  render() {
    const { stripe } = this.props;
    const submitBank = async (IPv4) => {
      //https://plaid.com/docs/link/web/
      //https://plaid.com/docs/link/duplicate-items/
      let answer = this.props.user.stripeId;
      console.log("submitBank stripeID", answer);
      if (!answer)
        answer = window.confirm(
          "Have you read stripe.com/legal/connect-account? Do you consent to everything you can?"
        );
      if (!answer) return null;
      const name = this.props.first + " " + this.props.last,
        //https://stripe.com/docs/api/accounts/update#update_account-settings-payouts
        payouts = {
          schedule: {
            interval: "manual" //400 invalid_request_error
            //Cannot provide a delay_days when interval is manual. delay_days is always the minimum for manual payouts.
            //delay_days: "minimum" //"doesn't apply", "2 day rolling basis (US)"
          },
          statement_descriptor: "Vau.money Personal"
        },
        /*address = {
          line1: this.state.billing_details.line1,
          line2: this.state.billing_details.line2,
          city: this.state.billing_details.city,
          state: this.state.billing_details.state,
          postal_code: this.state.billing_details.postal_code
        },*/
        pad = (x) => (String(x).length === 1 ? "0" + String(x) : x),
        today = new Date(),
        now =
          today.getUTCFullYear() +
          "-" +
          pad(today.getUTCMonth()) +
          "-" +
          pad(today.getUTCDate()),
        ip = "100.35.136.125",
        user_agent = this.state.user_agent,
        date = String(Math.floor(new Date(now).getTime() / 1000)); //new Date(now).getTime() / 1000, // - 14400, //4

      //https://stackoverflow.com/questions/35473210/what-should-be-the-value-of-the-tos-acceptancedate-parameter-when-requesting-s

      //return console.log(personal.date);
      //non-dwelling, lodging and encampment
      Promise.all(
        myStripeAccounts.map(async (trust) => {
          var done = null,
            personResult,
            companyResult,
            stripeAccount = "stripe" + trust.account;
          if (!this.props.user[stripeAccount]) {
            const companyName = `Vaumoney ${trust.account} ` + name;
            const ownership_declaration = {
              date,
              ip, //IPv4
              user_agent
            };
            var newAccount = null;

            //if (!this.props.user.stripeId) {
            newAccount = {
              //tos_shown_and_accepted: true,
              //Are express, standard or custom Stripe Connect account addresses tokenizable?
              //How are React developers supposed to create tokenized Stripe Standard accounts if the tos_shown_and_accepted field is required?

              //delete this in firestore + stripe dashboard,
              //to retry business_profile.{} (test mode; any "company" account type)

              business_profile: {
                mcc: trust.mcc, //"7276", //"8931", value === "POI Funding Transactions"
                name: companyName,
                //Stripe "custom and express" only
                product_description: "U.S. Code 26 § " + trust.description,
                support_email: this.props.auth.email,
                support_phone: this.props.auth.phoneNumber,
                support_url: `https://vau.money/${this.props.user.username}`,
                url: `https://vau.money/${this.props.user.username}`
              }, //support, mcc, url
              settings: {
                /*payouts_enabled: true,
                      controller: {
                        type: "application",
                        is_controller: true
                      },*/ //https://stripe.com/docs/connect/platform-controls-for-standard-accounts
                //why are the above on the doc-spec account object but not "create" iteration
                card_issuing: {
                  tos_acceptance: {
                    user_agent,
                    date,
                    IPv4: ip
                  }
                },
                payouts,
                //https://stripe.com/docs/connect/statement-descriptors
                payments: {
                  statement_descriptor: trust.mcc + " " + name //"Vau.money Decanter" //PRE-TAX TRUSTEE DECANTER
                }
              },
              business_type: "company", //email required?
              default_currency: "usd",
              tos_acceptance: {
                ...ownership_declaration,
                service_agreement: "full"
              }
            };
            const { first, last, auth } = this.props,
              custom = null; //standard, or express
            if (!custom) delete newAccount.tos_acceptance;
            //accountResult = await stripe.createToken("account", newAccount);
            //https://stripe.com/docs/api/persons/create
            personResult = await stripe.createToken("person", {
              relationship: { owner: true },
              first_name: first,
              last_name: last,
              email: auth.email,
              phone: auth.phoneNumber,
              address: this.state.address
            });
            companyResult = await stripe.createToken("account", {
              company: {
                address: this.state.address,
                name: companyName, //this.state.billing_details.name,
                structure: "unincorporated_association", //trust // "sole_proprietorship",
                phone: auth.phoneNumber, //owners are provided after the account.person
                ownership_declaration,
                owners_provided: true
              }
            });
          }
          done = JSON.stringify(
            this.props.user[stripeAccount]
              ? {
                  [trust.account]: this.props.user[stripeAccount]
                }
              : {
                  newAccount,
                  personResult,
                  companyResult
                }
          );
          return await new Promise((r) => r(done));
          /*  return {
          } else {
            return {
              stripeId: this.props.user.stripeId
            };
          }*/
        })
      )
        //.then(async (res) => await res.json())
        .then(async (accts) => {
          //return console.log("resolved all tokens", accts);

          const accounts = accts.map((b) => {
            const a = JSON.parse(b);
            return {
              //https://stripe.com/docs/connect/account-capabilities
              //“From your seller/service provider’s dedicated page within your platform’s website or app”
              //"You can start by completing the platform profile to understand which capabilities might be appropriate for your platform."
              //"Both your platform’s and the seller/service provider’s name"
              /*capabilities: {
            //"You must request one or more of the following capabilities: card_payments, transfers."
            card_payments: { requested: true },
            transfers: { requested: true }//us_bank_account_ach_payments "available by default"
            //"You cannot create Standard connected accounts with capabilities via API."
            //https://www.dropbox.com/s/h3d13z7mj2h7bf2/stripe%20standard.png?dl=0
          },*/
              type: "standard", //automated 1099 reporting to users above $20,000 or 200 transactions
              //https://stripe.com/docs/connect/tax-reporting (January 3, 2023)
              //"You cannot accept the Terms of Service on behalf of Standard and Express connected accounts.

              //"You must update your Connect branding settings with icon, brand color in order to create an account link."
              //"You can set the missing fields at https://dashboard.stripe.com/settings/connect"
              country: "US",
              ...(!a.newAccount
                ? a
                : {
                    newAccount: a.newAccount,
                    first: a.first,
                    last: a.last,
                    person: {
                      account_token: a.personResult.token.id
                    },
                    companyAccount: {
                      account_token: a.companyResult.token.id
                    }
                  })
            };
          });
          await fetch("https://vault-co.in/join", {
            method: "POST",
            headers: {
              "Content-Type": "Application/JSON",
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": ["Origin", "Content-Type"] //allow referer
            },
            body: JSON.stringify({ accounts })
          }) //stripe account, not plaid access token payout yet
            .then(async (res) => await res.json())
            .then((result) => {
              if (result.error) return console.log(result);
              if (!result.newLink)
                return console.log("dev error (Cash)", result);
              //If there is not (accountLink), the new stripe (account.id) stripeId is caught here
              const { account, accountLink } = result.newLink;
              // result.data ? result.data.stripe_user_id:
              const upsertDoc = this.props.user.userDatas ? updateDoc : setDoc;
              upsertDoc(doc(firestore, "userDatas", this.props.auth.uid), {
                stripeId: account
              })
                .then(() => {
                  window.location.href = accountLink.url;
                })
                .catch(standardCatch); //plaidLink payouts account.details_submitted
            })
            .catch(standardCatch);
          const time_left =
            (new Date(
              new Date().getFullYear() +
                "-" +
                pad(new Date().getMonth()) +
                "-" +
                pad(new Date().getDate())
            ).getTime() -
              new Date().getTime()) /
            (84600 * 30);
          // You have ${time_left} months to
          window.alert(
            `When getting to 'shortened descriptor', use "Vau.money" or "Decanter"; before that, you` +
              ` will enter your DOB and SSN to Stripe. You can accept transfers, but even to spend funds pre-tax` +
              ` not payout taxable funds as it goes, you'll need to continue with ownership declarations for each` +
              ` non-charitable account, the first, of course, being your` +
              ` stored value (6540) trust (1520 advanced, 8099 out-of-pocket, 8299 tuition).`
          ); //immediate (1) value, (2) business, (3) medical, (4) educational account creation
          //so spending can be attributed, signed, already
          //(don't spend from value, even non-issued, lest shortened suffix be automated not for geohash).
          //Just startsWith(MCC)
        })
        .catch(standardCatch);
    };
    return (
      <AddressElement
        options={this.props.options}
        onChange={(event) => {
          if (event.complete) {
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
              () => {
                /*fetch("https://geolocation-db.com/json/")
              .then(async (res) => await res.json())
              .then((r) => {
                const IPv4 = r.IPv4;
                //console.log(IPv4);
                this.setState({ IPv4 }, () => {*/
                //this.stripe.current.click()
                //console.log(this.state.address);
                submitBank();
              }
            );
            //});}).catch((err) => console.log(err.message));
          }
        }}
      />
    );
  }
}
//what if business cycles are from shareholder loans carried forward
class Cash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEmail: props.auth && props.auth.email ? props.auth.email : "",
      balance: 0,
      userQuery: "",
      currency: "USD",
      users: [],
      billing_details: {
        first: "Nicholas",
        last: "Carducci",
        city: "Fair Haven",
        line1: "26 Battin Road",
        line2: "",
        state: "NJ",
        postal_code: "07704",
        country: "US"
      },
      //business_type: "company", //bank_account_type, retail
      openBankType: "login",
      bank_address: {
        bankName: "",
        city: "",
        line1: "",
        line2: "",
        state: ""
      }
    };

    this.stinker = React.createRef();
    this.emailAuthProvider = new EmailAuthProvider(getAuth());
  }
  render() {
    const changeInput = (e) =>
      this.setState({
        billing_details: {
          ...this.state.billing_details,
          [e.target.id]: e.target.value
        }
      });
    const isEmail = (email) =>
      email !== "" && email.split("@")[1] && email.split("@")[1].split(".")[1];
    return (
      <div
        style={{
          width: "300px",
          backgroundColor: "white",
          //height: "100%",
          color: "rgb(25,35,25)",
          transition: `.3s ease-in`,
          flexDirection: "column"
        }}
        onScroll={(e) => {
          this.setState({
            showtimeheader:
              this.stinker.current.scrollTop <= 224 && this.state.showtimeheader
                ? false
                : this.stinker.current.scrollTop > 224 &&
                  !this.state.showtimeheader
          });
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            //onSnapshot(doc(firestore, "users", e), (doc) => {
            onSnapshot(
              query(
                collection(firestore, "userDatas"),
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
                        ...this.state.users.filter((e) => e.id !== foo.id),
                        foo
                      ]
                    });
                  }
                }),
              standardCatch
            );
          }}
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
                : () => this.setState({ allBanks: !this.state.allBanks }) //this.props.emulateRoot // this.props.closeVaumoney
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
              transform: `rotate(${this.state.allBanks ? "-90" : "0"}deg)`
            }}
          >
            {"<"}
          </div>
          {this.state.allBanks ? (
            "links"
          ) : !this.state.openFormSecure ? (
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
                var query = e.target.value;
                //console.log("isnumber");
                this.setState({
                  amount: query === "" ? "" : this.state.amount,
                  receiverRoutingNumber: /[\d]+/.test(query)
                    ? query
                    : !this.state.receiverRoutingNumber,
                  askIfRouting: /[\d]+/.test(query),
                  userQuery: query
                });
              }}
            />
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
          {!this.state.allBanks &&
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
                  if (
                    !this.props.auth.email ||
                    (!this.props.auth.emailVerified &&
                      window.confirm("resend email?"))
                  ) {
                    const email = window.prompt(
                      "your decanter email (you will enter this again while visiting the confirmation path)"
                    );
                    if (!email) return null;
                    if (isEmail(email)) {
                      return this.setState({ openEmail: email }, () => {
                        return fetchSignInMethodsForEmail(getAuth(), email)
                          .then((signInMethods) => {
                            if (
                              signInMethods.indexOf(
                                EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
                              ) > -1
                            ) {
                              console.log("email ok", email);
                            } else {
                              //if (FirebaseAuth.instance.isSignInWithEmailLink(emailLink)) {signInWithEmailLink

                              //var url = window.location.href;
                              /*, mode="",actionCode:""
                            if (url.includes("&mode=") && url.includes("&oobCode=")) {
                               mode = url.split("&mode=")[1].split("&")[0];
                               actionCode = url.split("&oobCode=")[1].split("&")[0];
                            } if (mode === "verifyEmail")firebase.auth().applyActionCode(actionCode).then(() => {*/

                              if (
                                !isSignInWithEmailLink(
                                  getAuth(),
                                  window.location.href
                                )
                              ) {
                                // User can sign in with email/link.
                                sendSignInLinkToEmail(getAuth(), email, {
                                  handleCodeInApp: true,
                                  url: window.location.href
                                }).catch(() => {
                                  console.log("humanCodeCredential");
                                  this.props.setApp({
                                    humanCodeCredential: true
                                  });
                                }); //this would invalidate phone auth?
                                //https://firebase.google.com/docs/auth/flutter/email-link-auth
                              } else
                                signInWithEmailLink(
                                  getAuth(),
                                  email,
                                  window.location.href
                                ).then(() => {
                                  window.alert(email + " added!");
                                });
                            }
                          })
                          .catch(standardCatch);
                      });
                    } else
                      return window.alert(`${email} is not an email format`);
                  }

                  if (this.state.plaidAccessToken) return null;
                  if (!this.state.openFormSecure)
                    return this.setState({ openFormSecure: true });
                  /*const missing = Object.keys(
                    this.state.billing_details
                  ).filter(
                    (x) => this.state.billing_details[x] === "" && x !== "line2"
                  );
                  if (missing.length > 0)
                    return window.alert("missing " + missing);*/
                  if (this.state.openBankType === "login") {
                    /*fetch("https://geolocation-db.com/json/")
                      .then(async (res) => await res.json())
                      .then((r) => {
                        const IPv4 = r.IPv4;
                        //console.log(IPv4);
                        this.setState({ IPv4 }, () => {*/
                    //this.stripe.current.click()
                    this.setState({ submitStripe: true });
                    //submitBank();
                    //});}).catch((err) => console.log(err.message));
                  }
                }}
                //src={""}
                style={{
                  display: "flex",
                  position: "absolute",
                  right: "0px",
                  margin: "10px",
                  width: "36px",
                  top: "0px",
                  height: "36px",
                  backgroundColor: this.state.openFormSecure
                    ? "rgb(255,217,102)" //"rgb(146,184,218)"
                    : "rgb(25,35,25)",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: "1",
                  color: this.state.openFormSecure
                    ? "navy" //"rgb(207,226,243)" // "rgb(207,226,243)" //"rgb(146,184,218)"
                    : "white"
                }}
                //alt="err"
              >
                {!this.state.plaidAccessToken ? (
                  "+"
                ) : (
                  <PlaidLink //usePlaidLink to payout (not here & now; email, account)
                    plaidAccessToken={this.state.plaidAccessToken}
                    onSuccess={(public_token, metadata) => {
                      updateDoc(
                        doc(firestore, "userDatas", this.props.auth.uid),
                        {
                          plaidLink: public_token
                        }
                      );
                      this.setState({
                        openFormSecure: false,
                        billing_details: {
                          first: "",
                          last: "",
                          line1: "",
                          line2: "",
                          city: "",
                          state: "",
                          postal_code: "",
                          country: ""
                        }
                      });
                    }}
                    onExit={async (err, metadata) => {}}
                    onEvent={(eventName, metadata) => {}}
                    //console.log(this.state.users);
                  >
                    +
                  </PlaidLink>
                )}
              </div>
            ))}
        </form>
        <Email
          isEmail={isEmail}
          openFormSecure={this.state.openFormSecure}
          setApp={this.props.setApp}
          setCash={(e) => this.setState(e)}
          humanCodeCredential={this.props.humanCodeCredential}
          openEmail={this.state.openEmail}
          auth={this.props.auth}
          user={this.props.user}
          deleteStripe={() => {
            /*const account = await this.stripe.customers.delete(
                  this.stripe.user.id
                );*/
            updateDoc(doc(firestore, "users", this.props.auth.uid), {
              banked: false
            });
          }}
        />
        <div
          style={{
            backgroundColor: "white",
            color: "rgb(25,35,25)",
            transition: ".3s ease-in",
            flexDirection: "column"
          }}
        >
          {this.state.users.map((x) => {
            return (
              <form
                key={x.username}
                onSubmit={(e) => {
                  e.preventDefault();
                  //transferSnipcart
                }}
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
                    height: "56px",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      backgroundColor: "rgb(25,35,25)",
                      borderBottom: "1px white solid",
                      height: "56px",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}
                  >
                    {x.username}
                  </div>
                  <select
                    required
                    //defaultChecked={this.state.currency}
                    value={this.state.currency}
                    onChange={(e) =>
                      this.setState({ currency: e.target.value })
                    }
                  >
                    <option id="USD">USD</option>
                  </select>
                  <input
                    required
                    placeholder="amount to send"
                    //type="number"
                    value={this.state.amount}
                    onChange={(e) =>
                      this.setState({
                        amount: e.target.value,
                        usingUserAsRecipient: x.id
                      })
                    }
                    style={{
                      display: "flex",
                      position: "relative",
                      backgroundColor: "rgb(25,35,25)",
                      borderBottom: "1px white solid",
                      height: "56px",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}
                  />
                </div>
              </form>
            );
          })}
        </div>
        {this.state.allBanks ? (
          this.state.banks.map((x) => {
            return <div></div>;
          })
        ) : this.state.openFormSecure ? (
          <div>
            <form
              onSubmit={
                () =>
                  /*fetch("https://geolocation-db.com/json/")
                  .then(async (res) => await res.json())
                  .then((r) => {
                    const IPv4 = r.IPv4;
                    //console.log(IPv4);
                    this.setState({ IPv4 }, () => {*/
                  this.setState({ submitStripe: true })
                //submitBank()
                //});}).catch((err) => console.log(err.message))
              }
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: this.state.openFormSecure ? "" : "0px"
              }}
            >
              <div style={{ width: "100%", display: "flex" }}>
                <input
                  style={{ width: "50%" }}
                  required={true}
                  value={this.state.billing_details["first"]}
                  onChange={changeInput}
                  id="first"
                  placeholder="first"
                />
                <input
                  style={{ width: "50%" }}
                  required={true}
                  value={this.state.billing_details["last"]}
                  onChange={changeInput}
                  id="last"
                  placeholder="last"
                />
              </div>
              <div style={{ fontSize: "0px" }}>
                {this.state.submitStripe && (
                  <Elements
                    stripe={stripePromise}
                    options={
                      null
                      //If you want to use Payment Element, it is required to pass in the clientSecret.
                      // passing the client secret obtained from the server
                      //clientSecret: "{{CLIENT_SECRET}}"
                      //https://stripe.com/docs/stripe-js/react
                      //https://stripe.com/docs/elements/address-element/collect-addresses?platform=web&client=react
                    }
                  >
                    <ElementsConsumer>
                      {(props) => {
                        const { stripe, elements } = props;
                        return (
                          <AddressThing
                            stripe={stripe}
                            auth={this.props.auth}
                            user={this.props.user}
                            first={this.state.billing_details.first}
                            last={this.state.billing_details.last}
                            options={{
                              mode: "shipping",
                              fields: {
                                name: "never",
                                firstName: "always",
                                lastName: "always"
                              },
                              display: {
                                name: "split"
                              },
                              defaultValues: {
                                firstName: this.state.billing_details.first,
                                lastName: this.state.billing_details.last,
                                /*name:
                            this.state.billing_details.first +
                            " " +
                            this.state.billing_details.last,*/
                                address: {
                                  line1: this.state.billing_details.line1,
                                  line2: this.state.billing_details.line2,
                                  city: this.state.billing_details.city,
                                  state: this.state.billing_details.state,
                                  postal_code: this.state.billing_details
                                    .postal_code,
                                  country: this.state.billing_details.country
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
              <input
                required={true}
                value={this.state.billing_details["line1"]}
                onChange={changeInput}
                id="line1"
                placeholder="address"
              />
              <input
                value={this.state.billing_details["line2"]}
                onChange={changeInput}
                id="line2"
                placeholder=""
              />
              <input
                required={true}
                value={this.state.billing_details["city"]}
                onChange={changeInput}
                id="city"
                placeholder="city"
              />
              <input
                maxLength={2}
                required={true}
                value={this.state.billing_details["state"]}
                onChange={changeInput}
                id="state"
                placeholder="state"
              />
              <input
                required={true}
                value={this.state.billing_details["postal_code"]}
                onChange={changeInput}
                id="postal_code"
                placeholder="ZIP"
              />
              <input
                required={true}
                value={this.state.billing_details["country"]}
                onChange={changeInput}
                id="country"
                placeholder="Country"
              />
              <div style={{ padding: "6px 0px", backgroundColor: "cadetblue" }}>
                <a
                  style={{ color: "linen" }}
                  href="https://stripe.com/legal/issuing/celtic/spend-card-terms-and-disclosures"
                >
                  Celtic Bank member FDIC Issuance
                </a>
              </div>
            </form>
            <div
              style={{
                display: "none",
                justifyContent: "center"
              }}
            >
              <div
                onClick={(e) => {
                  this.setState({ openBankType: "login" });
                }}
                style={{
                  width: "min-content",
                  border: "1px solid black",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  margin: "4px 10px"
                }}
              >
                Login
              </div>
              <div
                onClick={(e) => {
                  this.setState({ openBankType: "ach" });
                }}
                style={{
                  width: "min-content",
                  border: "1px solid black",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  margin: "4px 10px"
                }}
              >
                ACH
              </div>
              <div
                onClick={(e) => {
                  this.setState({ openBankType: "iban" });
                }}
                style={{
                  width: "min-content",
                  border: "1px solid black",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  margin: "4px 10px"
                }}
              >
                IBAN
              </div>
            </div>
            {this.state.openBankType === "login" ? null : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: this.state.openFormSecure ? "" : "0px"
                }}
              >
                {this.state.openBankType === "iban" ? (
                  <input
                    required={true}
                    onSubmit={(e) => e.preventDefault()}
                    id="iban"
                    placeholder="iban"
                  />
                ) : (
                  <div>
                    <input
                      required={true}
                      onSubmit={(e) => e.preventDefault()}
                      id="accounting_number"
                      placeholder="accounting_number"
                    />
                    <input
                      required={true}
                      onSubmit={(e) => e.preventDefault()}
                      id="routing_number"
                      placeholder="routing_number"
                    />
                  </div>
                )}
                <b>bank</b>
                <input
                  required={true}
                  onSubmit={(e) => e.preventDefault()}
                  id="bankName"
                  placeholder="bankName"
                />
                <input
                  required={true}
                  onSubmit={(e) => e.preventDefault()}
                  id="city"
                  placeholder="city"
                />
                <input
                  required={true}
                  onSubmit={(e) => e.preventDefault()}
                  id="country"
                  placeholder="country"
                />
                <input
                  required={true}
                  onSubmit={(e) => e.preventDefault()}
                  id="line1"
                  placeholder="line1"
                />
                <input
                  required={true}
                  onSubmit={(e) => e.preventDefault()}
                  id="line2"
                  placeholder="line2"
                />
                <input
                  required={true}
                  onSubmit={(e) => e.preventDefault()}
                  id="state"
                  placeholder="state"
                />
              </div>
            )}
          </div>
        ) : (
          <Operating
            scrollTop={this.props.scrollTop}
            scrolling={this.props.scrolling}
            displacements={this.state.displacements}
            businesses={this.state.businesses}
            scrolled={this.stinker.current && this.stinker.current.scrollTop}
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
        {this.props.user !== undefined && this.props.openListedTransations && (
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
        )}
      </div>
    );
  }
}
export default Cash;
/*const userCredential = await signInWithEmailLink(
                      auth,
                      this.props.user.email,
                      ""
                      //emailLink
                    );
                    return (
                      userCredential &&
                      linkWithCredential(
                        this.props.auth,
                        this.emailAuthProvider.credentialWithLink(
                          this.props.user.email,
                          window.location.href
                        )
                      )
                        .then((usercred) => {*/
/*getDoc(doc(firestore, "userDatas", this.props.auth.uid))
                      .then((doc) =>
                        (doc.exists() ? updateDoc : setDoc)(
                          doc(firestore, "userDatas", this.props.auth.uid),
                          {
                            confirmedEmail: this.props.user.email
                          }
                        )
                          .then(() =>
                            window.alert(
                              "email updated to " + this.props.user.email
                            )
                          )
                          .catch(standardCatch)
                      )
                      .catch(standardCatch);*/
/*<hr />
        <h3
          style={{
            display:
              this.props.revenueShow || this.props.expenseShow
                ? "none"
                : "flex",
            position: "relative",
            backgroundColor: "white",
            margin: "10px 0px",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            color: "rgb(25,35,25)"
          }}
        >
          transactions only include ACH within vau.money
        </h3>*/
/*this.state.business_type === "business" ? (
                //Why shouldn't we be able produce our own and/or others' tax deferred displaced escrow in merchant accounts without a license?
                <b>business</b>
              ) : (
                <b style={{ textDecoration: "line-through" }}>personal</b>
              )*/
//curiosity killed the cat not the glutton
//border, (public shame), deeds need to be electric outside safety boxes too for Islam
//must compete with the plaintiff payable tax-collectors
//i'll take the gay and frugal victor d'Hupay "change big tech hand in hand china" anna paulina luna
//thumbprint.us
//nsf broke entrepreneurship, disability -86 liberal require of technical-stagflation thru
//utility use to benefit, fire and plaintiff

//ugh I'm saver
//if you want to investigate, stomp thier neck 12.1.5 Cfr nick@vaults.biz
//lmao $tbt money
//repo service and let loitering go

//$15,000 per customer a year discount or damage

//Gains in utility would imply deflation or use to benefit which is productivity as the deomination of life product cost
//congrats can't get cash flow without tbills
//huh what investment to make money. oh data servers

//just in time for party and camp client convenience truncatedwholesaletax.com
//safety deposit box private EVM
//robbery tho

//i will get oil return and rights to drill per dollar to boot
//the treasury banking system won't alow you to not invest in
//we work more than older people did and we seek damages.
//11/1 m2 to deeds of blm
/*if (
              x.username.includes(this.state.userQuery) &&
              (this.state.amount === "" ||
                x.id === this.state.usingUserAsRecipient)
            ) {*/
//why do you want to keep jobs if they aren't inflationary by their unemployment?
//nor deflationary by their employment
/*this.props.user === undefined && (
          <div
            style={{
              zIndex: this.props.openNewBank ? "9999" : "0",
              flexDirection: "column",
              display: "flex",
              position: "fixed",
              width: "100vw",
              height: "100%",
              transform: `translateX(${
                this.props.openNewBank ? "0%" : "100%"
              })`,
              transition: "1s ease-out",
              backgroundColor: "white"
            }}
          >
            <Login
              pleaseClose={() => this.setState({ openNewBank: false })}
              users={this.props.users}
              user={this.props.user}
              auth={this.props.auth}
            />
          </div>
          )*/
// "business"
//lmao they have nothing to repossess (industry payday by degree payable to bonds)
/*<select
              value={this.state.business_type}
              onChange={(e) => {
                this.setState({ business_type: e.target.value });
              }}
            >
              {["company", "non_profit", "government_entity"].map((x) => (
                <option>{x}</option>
              ))}
            </select>*/
/*this.state.amount && !this.state.askIfRouting && (
                  <select
                    value={this.state.senderFundingID}
                    onChange={(e) => {
                      this.setState({
                        senderFundingID: this.state.fundingSources[
                          e.target.id[0]
                        ]._embedded["funding-sources"][e.target.id[1]].id
                      });
                    }}
                  >
                    {this.state.fundingSources.map((x, i) => {
                      return x._embedded["funding-sources"].map((x, p) => {
                        return (
                          <option
                            id={[i, p]}
                            style={{
                              display: "flex",
                              position: "relative",
                              backgroundColor: "rgb(25,35,25)",
                              borderBottom: "1px white solid",
                              height: "56px",
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white"
                            }}
                          >
                            .{x.type}/{x.bankName}
                          </option>
                        );
                      });
                    })}
                  </select>
                  )*/
/*
    const totalbanklistsize = this.props.displacements.length;
    const circleradius = Math.sqrt(totalbanklistsize * 100) / 3.14;
    const handleScollImgError = (e) => {
      if (e.message) {
        console.log(e.message);
        this.setState({ serviceCancelingImages: true });
      }
    };
    let arrayOfnumbers = 0;
    const scrollnum = () => {
      arrayOfnumbers = arrayOfnumbers + 1; //arrayOfnumbers[arrayOfnumbers.length - 1] + 1;
      //arrayOfnumbers.push(num);
      //console.log(arrayOfnumbers)
      return arrayOfnumbers;
    };
    const space = " ";

  componentDidMount = async () => {
    clearInterval(this.loading);
    if (this.state.loading)
      this.loading = setInterval(() =>
        this.setState({
          phase: !this.state.phase
        })
      );
    /*if(this.props.user&&this.props.user.plaidtokens){
        this.props.user.plaidtokens.forEach(async x=>{
          await plaidClient.linkTokenGet(request);
        })
      } /
      if (this.props.user && this.props.user.banks) {
        this.setState({
          banks: Promise.all(
            this.props.user.banks.map(async (x) => {
              return await fetch("https://vault-co.in/bank", {
                "Content-Type": "Application/JSON",
                Accept: "Application/JSON",
                body: JSON.stringify({ bank_id: x })
              });
            })
          )
        });
      }
    };


else {
                  var payload = {
                    bank_address: {
                      bankName: this.state.bank_address.bankName,
                      city: this.state.bank_address.city,
                      country: this.state.bank_address.country,
                      line1: this.state.bank_address.line1,
                      line2: this.state.bank_address.line2,
                      state: this.state.bank_address.state
                    },
                    billing_details: {
                      first: this.state.billing_details.first,
                      last: this.state.billing_details.last,
                      city: this.state.billing_details.city,
                      line1: this.state.billing_details.line1,
                      line2: this.state.billing_details.line2,
                      state: this.state.billing_details.state,
                      postal_code: this.state.billing_details.postal_code
                    }
                  };
                  if (this.state.openBankType === "ach") {
                    payload.accounting_number = this.state.accounting_number;
                    payload.routing_number = this.state.routing_number;
                  } else {
                    payload.iban = this.state.iban;
                  }
                  fetch("https://vault-co.in/secure", {
                    "Content-Type": "Application/JSON",
                    Accept: "Application/JSON",
                    body: JSON.stringify({
                      accounting_number: this.state.accounting_number,
                      routing_number: this.state.routing_number
                    })
                  })
                    .then(async (res) => await res.json())
                    .then((result) => {
                      updateDoc(doc(firestore, "users", this.props.auth.uid), {
                        banks: arrayUnion(result.id)
                        //desist free content invokes usufructuary rights / responsibilities
                      }); //.catch(standardCatch);

                      this.setState({
                        iban: "",
                        accounting_number: "",
                        routing_number: "",
                        openFormSecure: false,
                        billing_details: {
                          first:"",
                          last:"",
                          city: "",
                          line1: "",
                          line2: "",
                          state: "",
                          postal_code: ""
                        },
                        bank_address: {
                          bankName: "",
                          city: "",
                          country: "",
                          line1: "",
                          line2: "",
                          state: ""
                        }
                      });
                    })
                    .catch(standardCatch);
                }*/
//https://stripe.com/docs/connect/oauth-reference
//accountLink.url redirect from node has data property; payouts "access_token" for PlaidLink
/*if (result.data) {
              console.log("submitBank", result);
              this.setState({ plaidAccessToken: result.data.access_token });
            } else if (result.error) {
              return console.log(result.error);
            }*/
//,plaidAccessToken = this.state.access_token, //'GENERATED_LINK_TOKEN',
//required for OAuth; if not using OAuth, set to null or omit:
//receivedRedirectUri = window.location.href;
/*await fetch(
              "https://us-central1-vaumoney.cloudfunctions.net/searchCustomersVaumoney",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Allow: "*",
                  Accept: "application/json"
                },
                body: JSON.stringify({
                  userQuery: this.state.userQuery
                })
              }
            )
              .then(async (res) => await res.json())
              .then((result) => this.setState({ predictions: result }))
              .catch((err) => console.log(err.message));*/
/*tryDelete = async (x) => {
        var thereisone = this.props.transactions.find(
          (x) => x.status === "pending"
        );
        if (!thereisone) {
          await fetch(
            "https://us-central1-vaumoney.cloudfunctions.net/deleteFundingVaumoney",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              },
              body: JSON.stringify({
                fundingSource: x.id
              })
            }
          )
            .then(async (res) => await res.json())
            .then((result) => {
              this.setState({ deleteTries: 0 });
              console.log(result);
              window.location.reload();
            });
        } else {
          setTimeout(() => {
            this.state.deleteTries < 4 && tryDelete();
            this.setState({ deleteTries: this.state.deleteTries + 1 });
          }, 5000);
        }*/
/*const withdrawalSnipcart = (e) => {
  e.preventDefault();

  //fetch("https://vault-co.in").catch(standardCatch);
  //if (!this.state.withdrawal) return window.alert("withdrawal amount required");
  if (!window.Snipcart) return console.log(window.Snipcart);
  const { cart } = window.Snipcart.api;
  //const user = customer.signin(); console.log("user: ", user);
  //console.log("cart: ", cart); //window.Snipcart.api.items.add({}).then(() => window.Snipcart.api.cart.get());
  this.setState({ cart /*, currency: cart.currency()* / }, () =>
    cart.items
      //https://docs.snipcart.com/v3/api-reference/products?ss360Offset=11#example-response-1
      .add({
        //Is greenhouse gas sticky?
        id: "WITHDRAWAL",
        name: `Withdrawal $${this.state.withdrawal}`,
        description: "withdrawal escrow",
        url:
          window.location.href !== "https://jwi5k.csb.app/"
            ? "/"
            : "https://jwi5k.csb.app/",
        price: 0.1,
        links: {
          refunds:
            window.location.href +
            "/withdrawals/" +
            this.state.withdrawalID
        },
        quantity: 1,
        stackable: true,
        categories: [
          "transfer",
          "credit",
          "marketplace",
          "compulsory" //accrual quality consumer will
        ],
        customFields: [
          /*
                                {
                                  name: "Transfer",
                                  options: "30|80[+50.00]",
                                  value: "30",
                                  required: true
                                }* /
        ],
        metadata: {
          //key:"value",
          withdrawal: this.state.withdrawal
        }
      })
      .then((x) => {})
      .catch(standardCatch)
  ); //https://nonvoters.quora.com/Do-anarchists-vote-If-not-shouldn-t-we-count-their-protest-vote-for-budget-reconciliation-at-least
}*/
/**
 * 
          //const config = {};
          //const { open, exit, ready, destroy } = usePlaidLink(config);
          // Open Link
          //if (ready) this.setState({ unmountPlaid: destroy }, () => open());
        /*if (err)
          await fetch("https://vault-co.in/deleteaccess", {
            Accept: "Application/JSON"
          })
            .then(async (res) => await res.json())
            .then(() => {})
            .catch(standardCatch);* /
        <div
          ref={this.stinker}
          style={{
            //"nyc home brits loyalists 2/3" "freedom over tyranny"
            //why single men no dependents
            display: "flex",
            position:
              (this.stinker.current && this.stinker.current.scrollTop) > 224 ||
              this.state.expenseShow ||
              this.state.revenueShow
                ? "fixed"
                : "relative",
            backgroundColor: "white",
            top: !vaumoneyOpen || this.state.userQuery ? "56px" : "0px",
            bottom: "56px",
            color: "rgb(25,35,25)",
            zIndex:
              !vaumoneyOpen || this.state.userQuery
                ? "-1"
                : (this.stinker.current && this.stinker.current.scrollTop) >
                    224 ||
                  this.state.expenseShow ||
                  this.state.revenueShow
                ? "1"
                : "",
            transition: ".3s ease-in",
            flexDirection: "column",
            overflowY:
              (this.stinker.current && this.stinker.current.scrollTop) > 224 ||
              this.state.expenseShow ||
              this.state.revenueShow
                ? "auto"
                : "",
            overflowX:
              (this.stinker.current && this.stinker.current.scrollTop) > 224 ||
              this.state.expenseShow ||
              this.state.revenueShow
                ? "hidden"
                : ""
          }}
        >
          <div
            style={{
              width: "100%",
              height: "56px",
              top:
                this.state.showtimeheader ||
                this.state.expenseShow ||
                this.state.revenueShow
                  ? "0px"
                  : "-56px",
              display: "flex",
              position: "fixed",
              backgroundColor: "rgb(25,35,25)",
              borderBottom: "1px white solid",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              zIndex: "2"
            }}
          >
 */

/**
  * 
  * 
    const onSuccess = (public_token, metadata) => {
        /*fetch("https://vault-co.in/secure", {
          headers: {
            "Content-Type": "Application/JSON",
            Accept: "Application/JSON",
            "Access-Control-Request-Headers": [
              "Access-Control-Allow-Origin",
              "Origin"
            ]
          },
          method: "POST",
          body: JSON.stringify({
            stripeId: this.props.user.stripeId,
            phone: this.props.auth.phoneNumber,
            address,
            first: this.state.billing_details.first,
            last: this.state.billing_details.last,
            //access_token: this.state.plaidAccessToken, //result.data.access_token,
            plaid_processor_token: public_token,
            business_type: this.state.business_type
            /*billing_details: {
              first: this.state.billing_details.first,
              last: this.state.billing_details.last,
              city: this.state.billing_details.city,
              line1: this.state.billing_details.line1,
              line2: this.state.billing_details.line2,
              state: this.state.billing_details.state,
              postal_code: this.state.billing_details.postal_code
            }* /
          })
        })
          .then(async (res) => await res.json())
          .then((result) => {* /
            updateDoc(doc(firestore, "userDatas", this.props.auth.uid), {
              //stripeId: result.newLink.account.id,
              plaidLink: public_token // result.newLink.account.details_submitted
            }); //.catch(standardCatch);
            /*updateDoc(doc(firestore, "users", this.props.auth.uid), {
                  banks: arrayUnion("ach" + result.id)
                  //desist free content invokes usufructuary rights / responsibilities
                });* / this.setState(
              {
                business_type: "company",
                openFormSecure: false,
                billing_details: {
                  first: "",
                  last: "",
                  city: "",
                  line1: "",
                  line2: "",
                  state: "",
                  postal_code: ""
                }
              }
            );
            //}).catch(standardCatch);
            /*updateDoc(doc(firestore, "users", this.props.auth.uid), {
                      plaidtokens: arrayUnion(public_token)
                      //desist free content invokes usufructuary rights / responsibilities
                    });* / //.catch(standardCatch);
          },
  */

/*const transferSnipcart = (e) =>{
  e.preventDefault()

  /*if (!x.mastercardId)
if (this.state.currency && this.state.amount) {
  return window.alert(
    `${x.name} ${x.surname}@${x.username}hasn't added a funding source yet and cannot ` +
      `receive payments.  We will notify them now, but give them a nudge to add a bank`
  );
} else return console.log("currency or amount");
console.log(
this.state.currency,
this.state.amount,
x.mastercardId
);
if (this.state.receiverAccountNumber) return null; // query askIfRouting
*/
/*if (
!window.confirm(
  `send ${this.state.amount} to ${x.username}? THIS CANNOT BE UNDONE`
)
) return null;* /
if (!window.Snipcart) return console.log(window.Snipcart);
const { cart } = window.Snipcart.api;
//const user = customer.signin(); console.log("user: ", user);
//console.log("cart: ", cart); //window.Snipcart.api.items.add({}).then(() => window.Snipcart.api.cart.get());
this.setState({ cart /*, currency: cart.currency()* / }, () =>
cart.items
  //https://docs.snipcart.com/v3/api-reference/products?ss360Offset=11#example-response-1
  .add({
    //Is greenhouse gas sticky?
    id: "TRANSFER",
    name: `Transfer $${this.state.amount}`,
    description: "transfer to escrow",
    url:
      window.location.href !== "https://jwi5k.csb.app/"
        ? "/"
        : "https://jwi5k.csb.app/",
    price: this.state.amount,
    //https://support.snipcart.com/t/debug-refunds-for-custom-payment-gateway/1478
    links: {
      refunds:
        window.location.href +
        "/transfers/" +
        this.state.transferID
    },
    quantity: 1,
    stackable: true,
    categories: [
      "transfer",
      "credit",
      "marketplace",
      "compulsory" //accrual quality consumer will
    ],
    customFields: [
      /*
            {
              name: "Transfer",
              options: "30|80[+50.00]",
              value: "30",
              required: true
            }* /
    ],
    metadata: {
      key: "value"
    }
  })
  .then((x) => {
    //console.log(x);
    /*
      uniqueId: "5bf3e3bb-7fd1-4566-9a6b-8967d2dbf998"
      plaidAccessToken: ""
      id: "TRANSFER"
      name: "Transfer"
      price: 10
      description: "transfer to escrow"
      hasTaxesIncluded: false
      categories: Array(4)
      url: "https://jwi5k.csb.app/"
      fileGuid: null
      image: ""
      quantity: 3
      quantityStep: 1
      minQuantity: null
      maxQuantity: null
      stackable: "auto"
      shippable: true
      taxable: true
      taxes: Array(0)
      customFields: Array(0)
      duplicatable: false
      downloadLink: ""
      metadata: Object
      alternatePrices: Object
      unitPrice: 10
      totalPrice: 30
      totalPriceWithoutTaxes: 30
      totalPriceWithoutDiscountsAndTaxes: 30
      totalPriceWithoutDiscountsAndTaxesLegacy: 30
      addedOn: 1668583816
      initialData: ""
      modificationDate: 1668584597
      pausingAction: "None"
      cancellationAction: "None"
      isRecurring: false
      isRecurringV2: false
      isRecurringV3: false
      availablePlans: Array(0)
      selectedPlanId: ""
      paymentGatewayId: ""
    * /
  })
  .catch(standardCatch)
);*/
/*annual displacement funds{/**final meals 100% * /}
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              width: "100%",
              height: "min-content",
              minHeight: circleradius * 30,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {this.props.displacements.map((x, i) => {
              return (
                <span
                  key={"displacement" + i}
                  style={{
                    width: "80px",
                    position: "absolute",

                    borderRadius: "10px",
                    //border: "1px solid black",
                    transform: `rotate(${
                      (i / totalbanklistsize) * 360 -
                      (1 / totalbanklistsize) * 360
                    }deg) translate(${
                      -(totalbanklistsize / 2 - i / totalbanklistsize) * 0
                    }px,${
                      (totalbanklistsize / 2 - i / totalbanklistsize) *
                      (circleradius * 5)
                    }px)`
                  }}
                >
                  {[
                    "personal",
                    "house rent allowance",
                    "529",
                    "meal security escrow",
                    "health reimbursement arrangement"
                  ].includes(x.name) ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <Cable
                        style={{
                          width: "40px",
                          boxShadow: "",
                          minWidth: "40px"
                        }}
                        onError={handleScollImgError}
                        img={true}
                        src={
                          this.state.noyout
                            ? ""
                            : x.name === "personal"
                            ? "https://www.dropbox.com/s/3ij99sjgzr5lnql/personal%20displacement.png?raw=1"
                            : x.name === "house rent allowance"
                            ? "https://www.dropbox.com/s/c45w3w7iugeos5p/house%20rent%20displacement.png?raw=1"
                            : x.name === "meal security escrow"
                            ? "https://www.dropbox.com/s/j96zkq01ske06i5/meals%20displacement.png?raw=1"
                            : x.name === "health reimbursement arrangement"
                            ? "https://www.dropbox.com/s/0du6mgm7wedcv9g/medical%20health%20displacement%20%281%29.png?raw=1"
                            : x.name === "529"
                            ? "https://www.dropbox.com/s/rd9pp33ntpbz6o3/education%20tuition%20displacement.png?raw=1"
                            : "https://www.dropbox.com/s/rd9pp33ntpbz6o3/education%20tuition%20displacement.png?raw=1"
                        }
                        float={null}
                        title="Capitalist https://youtu.be/7Jy9JyrukCY?t=142"
                        scrolling={this.props.scrolling}
                        fwd={this["scrollImg" + scrollnum()]}
                        scrollTopAndHeight={
                          this.props.scrollTop + window.innerHeight
                        }
                        scrollTop={this.props.scrollTop}
                      />
                      <span
                        style={{
                          hyphens: "auto",
                          wordBreak: "break-word"
                        }}
                      >
                        {x.name === "personal"
                          ? "personal"
                          : x.name === "house rent allowance"
                          ? "home"
                          : x.name === "529"
                          ? "educational"
                          : x.name === "meal security escrow"
                          ? "meal"
                          : x.name === "health reimbursement arrangement"
                          ? "medical"
                          : "meal"}
                      </span>
                    </div>
                  ) : (
                    <span
                      style={
                        {
                          //transform: `scale(1,1)`
                        }
                      }
                    >
                      {x.name}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <div
            style={{
              width: "100%",
              height: "min-content",
              minHeight: circleradius * 30,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            {this.props.businesses.map((x, i) => {
              return (
                <span
                  style={{
                    width: "100px",
                    position: "absolute",
                    height: "50px",
                    borderRadius: "20px",
                    border: "1px solid black",
                    transform: `rotate(${
                      (i / totalbanklistsize) * 360 -
                      (0.8 / totalbanklistsize) * 360
                    }deg) translate(${
                      -(totalbanklistsize / 2 - i / totalbanklistsize) * 0
                    }px,${
                      (totalbanklistsize / 2 - i / totalbanklistsize) *
                      (circleradius * 4)
                    }px)`
                  }}
                >
                  <span
                    style={
                      {
                        //transform: `scale(1,1)`
                      }
                    }
                  >
                    {x.name}
                  </span>
                </span>
              );
            })}
          </div>
          </div>*/

/*{this.props.user !== undefined && (
            <NewBank
              transactions={this.props.transactions}
              tryDelete={tryDelete}
              getTheGoods={this.props.getTheGoods}
              fundingSources={this.state.fundingSources}
              closebusinesses={() => this.setState({ openBusinesses: false })}
              closebanks={() => this.setState({ openBanks: false })}
              openBanks={this.props.openBanks}
              openBusinesses={this.state.openBusinesses}
              toggleBanks={() =>
                this.setState({
                  openBanks: !this.props.openBanks
                })
              }
              toggleBusinesses={() =>
                this.setState({
                  openBusinesses: !this.state.openBusinesses
                })
              }
              getDwollaToken={async () => {
                this.setState({ loading: true }, async () => {
                  this.props.setApp({ access_token: {} });
                  const client_id =
                    "OrFxbaqmtJzKhZVlWAM58yc4GZkXKYHFtLwpm5DG426IREJffi";
                  const client_secret =
                    "PutLuNs2sksYmOiSdwldnUcjCPlD2UgQX7PCzhALbBTrZOmgId";
                  //const scopes = "Send Funding Transactions ManageCustomers";
                  //https://cors-anywhere.herokuapp.com/
                  await fetch(
                    `https://cors-anywhere.herokuapp.com/https://api-sandbox.dwolla.com/plaidAccessToken`,
                    {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded"
                        //Authorization: `Basic Base64(${client_id}:${client_secret})`
                      },
                      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}` //&scopes=${scopes}
                    }
                  )
                    .then(async (response) => await response.json())
                    .then(async (body) => {
                      console.log("auth");
                      console.log(body);
                      this.props.setPouchToken(body.access_token);
                      this.setState({ loading: false });
                    })
                    .catch((err) => {
                      console.log("auth error");
                      console.log(err.message);
                      if (err.message !== "Failed to fetch")
                        this.props.deletePouchToken();
                      this.setState({ loading: false });
                    });
                });
              }}
              dwollaLoadedUser={this.props.dwollaLoadedUser}
              users={this.props.users}
              user={this.props.user}
              auth={this.props.auth}
              close={() => this.setState({ openNewBank: false })}
              openNewBank={this.props.openNewBank}
              businessCodes={this.state.businessCodes}
              getBizCodes={() =>
                !this.state.businessCodes &&
                this.setState({ loading: true }, async () => {
                  console.log(this.props.access_token);
                  await fetch(
                    "https://cors-anywhere.herokuapp.com/https://api-sandbox.dwolla.com/business-classifications",
                    {
                      headers: {
                        "content-type": "application/json",
                        Accept: "application/vnd.dwolla.v1.hal+json",
                        Authorization: `Bearer ${this.props.access_token}`
                      }
                    }
                  )
                    .then(async (res) => await res.json())
                    .then((result) => {
                      console.log("biz codes");
                      console.log(result);
                      if (
                        ["ExpiredAccessToken", "InvalidAccessToken"].includes(
                          result.code
                        ) //"InvalidCredentials"
                      ) {
                        this.props.deletePouchToken();
                        this.getDwollaToken();
                      } else {
                        this.setState({
                          businessCodes:
                            result._embedded["business-classifications"]
                        });
                        this.setState({ loading: false });
                      }
                    })
                    .catch((err) => {
                      console.log("biz codes error");
                      console.log(err.message);
                      if (err.code === "ExpiredAccessToken") {
                        this.props.deletePouchToken();
                        this.getDwollaToken();
                      }
                      this.setState({ loading: false });
                    });
                })
              }
            />
          )}*/
/*this.state.askIfRouting && this.state.receiverAccountNumber && (
            <div>
              {!this.state.amount && (
                <select
                  value={this.state.senderFundingID}
                  onChange={(e) => {
                    return this.state.fundingSources.map((x) => {
                      return x._embedded["funding-sources"].map((x) => {
                        if (e.target.value === `.${x.type}/${x.bankName}`) {
                          return this.setState({ senderFundingID: x.id });
                        } else return null;
                      });
                    });
                  }}
                >
                  {this.state.fundingSources.map((x) => {
                    return x._embedded["funding-sources"].map((x) => {
                      return (
                        <option
                          style={{
                            display: "flex",
                            position: "relative",
                            backgroundColor: "rgb(25,35,25)",
                            borderBottom: "1px white solid",
                            height: "56px",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white"
                          }}
                        >
                          .{x.type}/{x.bankName}
                        </option>
                      );
                    });
                  })}
                </select>
              )}
              <input
                required
                placeholder="amount to send"
                type="number"
                value={this.state.receiverAmount}
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ receiverAmount: e.target.value });
                }}
                style={{
                  display: "flex",
                  position: "relative",
                  backgroundColor: "rgb(25,35,25)",
                  borderBottom: "1px white solid",
                  height: "56px",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}
              />
              <input
                placeholder="account number"
                value={this.state.receiverAccountNumber}
                onChange={(e) => {
                  var receiverAccountNumber = e.target.value;
                  this.setState({
                    receiverAmount:
                      receiverAccountNumber === ""
                        ? ""
                        : this.state.receiverAmount,
                    receiverAccountNumber,
                    amount: ""
                  });
                }}
                type="number"
                minLength="4"
                maxLength="12"
                className="input"
                style={{
                  display: "flex",
                  position: "relative",
                  backgroundColor: "rgb(25,35,25)",
                  borderBottom: "1px white solid",
                  height: "56px",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}
              />
            </div>
              )*/
/*<div ref={this.stinker}>
          <h2>
            this year
            {(this.state.revenueShow || this.state.expenseShow) &&
              `'s ${this.state.expenseShow ? "expenses" : ""}${
                this.state.revenueShow ? "revenue" : ""
              }`}
          </h2>
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: "20px",
              width: "36px",
              height: "36px",
              backgroundColor: "rgb(25,35,25)",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          >
            \/
          </div>
          </div>
          
          //pasted
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <div
              onClick={() => {
                fetch("https://vault-co.in/banks");
              }}
              style={{
                width: "min-content",
                border: "1px solid black",
                borderRadius: "8px",
                padding: "4px 10px",
                margin: "4px 10px"
              }}
            >
              Banks
            </div>

            {this.state.banks.map((x) => {
              return <div>{x.name}</div>;
            })}
          </div>
          {/*<div
            style={{
              flexDirection: "column",
              display:
                this.state.revenueShow || this.state.expenseShow
                  ? "none"
                  : "flex",
              position: "relative",
              backgroundColor: "rgb(25,35,25)",
              width: "100%",
              height: "56px",
              bottom: "0",
              left: "0",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          >
            <div
              onMouseEnter={() => this.setState({ footerhighlight: "cards" })}
              onMouseLeave={() => this.setState({ footerhighlight: false })}
              style={{
                display: "flex",
                position: "relative",
                backgroundColor:
                  this.state.footerhighlight === "cards"
                    ? "rgb(0,155,200)"
                    : "rgb(0,15,20)",
                borderBottom: "1px white solid",
                height: "56px",
                width: "100%", //give everyone an opportunity that able people cannot?
                alignItems: "center", //disabiities arts just people who can fill out forms not sell tickets
                justifyContent: "center",
                color: "rgb(100,225,255)"
              }}
            >
              <h3>Get / Renew Card</h3>
            </div>
            </div>
          <div
            onClick={() =>
              this.setState({ openNewBank: false }, () =>
                this.props.setApp({ openListedTransations: false })
              )
            }
            style={{
              backgroundColor: "rgba(20,20,20,.6)",
              width: "calc(100% - 200px)",
              display: "flex",
              position: "fixed",
              right: "0px",
              zIndex:
                this.props.openNewBank || this.props.openListedTransations
                  ? "1"
                  : "0"
            }}
          >
            {this.state.loading && (
              <div
                style={{
                  display: "flex",
                  top: this.state.phase ? "40%" : "60%",
                  width: "24px",
                  height: "24px",
                  margin: "8px",
                  borderRadius: "50%",
                  background: "rgb(200,200,190)",
                  animation:
                    "lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite",
                  marginBottom: "75px",
                  transition: "top 2.4s ease-in-out"
                }}
              />
            )}
          </div>
          */
