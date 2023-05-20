import React from "react";
import firebase from ".././init-firebase.js";
import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  getDoc,
  increment
} from "firebase/firestore";
import { standardCatch } from "../FIREBASE_SUDO"; //"you can have tht one brainscan.info don't stuff your shirt saverparty.xyz/jesus"
import UAParser from "ua-parser-js";
import { AddressElement } from "@stripe/react-stripe-js";
import { myStripeAccounts } from "./index.js";
const firestore = getFirestore(firebase);
export default class STRIPE_ADDRESS extends React.Component {
  constructor(props) {
    super(props);

    var parser = new UAParser();
    this.state = {
      country: "US",
      user_agent: parser.getUA()
    };
  }
  render() {
    const { noAccountYetArray } = this.props;
    //https://plaid.com/docs/link/web/
    //https://plaid.com/docs/link/duplicate-items/
    const submitBank = async (IPv4) => {
      //https://stripe.com/docs/api/accounts/update#update_account-settings-payouts
      const name = this.props.first + " " + this.props.last,
        payouts = {
          schedule: {
            interval: "manual" //400 invalid_request_error
            //Cannot provide a delay_days when interval is manual. delay_days is always the minimum for manual payouts.
            //delay_days: "minimum" //"doesn't apply", "2 day rolling basis (US)"
          },
          statement_descriptor: "Vau.money Personal"
        },
        pad = (x) => (String(x).length === 1 ? "0" + String(x) : x),
        today = new Date(),
        now =
          today.getUTCFullYear() +
          "-" +
          pad(today.getUTCMonth()) +
          "-" +
          pad(today.getUTCDate()),
        ip = "100.35.136.125", // IPv4,
        user_agent = this.state.user_agent,
        date = String(Math.floor(new Date(now).getTime() / 1000)); //new Date(now).getTime() / 1000, // - 14400, //4

      //https://stackoverflow.com/questions/35473210/what-should-be-the-value-of-the-tos-acceptancedate-parameter-when-requesting-s

      //return console.log(personal.date);
      //non-dwelling, lodging and encampment
      //var _86relationship = null, querySnapshot =
      //customerResult = (await stripe.createToken("person", _86relationship));
      /*await getDocs(
            query(collection(firestore, "accounts"),
              where("merchantSurnamePrefix", "==", merchantSurnamePrefix)));*/
      /*const surnamePrefixIndex = ((x) =>
                  x
                    .map((doc) => {
                      return doc.exists() ? { id: doc.id, ...doc.data() } : "";
                    })
                    .filter((x) => x !== ""))(querySnapshot.docs).length; */
      //surname[0] && surname[0].mySurnameIndex;

      if (noAccountYetArray.length === 0)
        return (window.location.href = this.props.user.stripe82Link);
      //Not can, is, when to confirm not moral without enumerated right
      //who told me wrestling or lacrosse for nonscholarship recruiting? occupywall.us
      console.log(noAccountYetArray, "stripeID", this.props.user.stripeId);
      (this.props.user.stripeId ||
        window.confirm(
          "Have you read stripe.com/legal/connect-account? Do you consent to everything you can?"
        )) &&
        Promise.all(
          noAccountYetArray.map(
            async (account) =>
              await new Promise(async (r) => {
                const trust = myStripeAccounts.find(
                  (e) => e.account === account
                );
                //customerResult,
                var stripeAccount = "stripe" + trust.account;
                const { first, last, auth } = this.props,
                  custom = null; //standard, or express
                if (this.props.user[stripeAccount]) {
                  const done = JSON.stringify({
                    [trust.account]: this.props.user[stripeAccount]
                  }); //Why do synchronous intrinsic JSON functions need a scope declaration?
                  return r(done);
                }
                const companyName = `Vaumoney ${trust.account} ` + name,
                  ownership_declaration = {
                    date,
                    ip, //IPv4
                    user_agent
                  },
                  //if (!this.props.user.stripeId) {
                  personResult = await this.props.stripe.createToken("person", {
                    relationship: { owner: true },
                    first_name: first,
                    last_name: last,
                    email: auth.email,
                    phone: auth.phoneNumber,
                    address: this.state.address
                  }),
                  companyResult = await this.props.stripe.createToken(
                    "account",
                    {
                      company: {
                        address: this.state.address,
                        name: companyName, //this.state.billing_details.name,
                        structure: "unincorporated_association", //trust // "sole_proprietorship",
                        phone: auth.phoneNumber, //owners are provided after the account.person
                        ownership_declaration,
                        owners_provided: true
                      }
                    }
                  );
                var newAccount = {
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
                        ip
                      }
                    },
                    payouts,
                    //https://stripe.com/docs/connect/statement-descriptors
                    payments: {
                      statement_descriptor:
                        trust.mcc + " " + name.substring(0, 16) //"Vau.money Decanter" //PRE-TAX TRUSTEE DECANTER
                    }
                  },
                  business_type: "company", //email required?
                  default_currency: "usd",
                  tos_acceptance: {
                    ...ownership_declaration,
                    service_agreement: "full"
                  }
                };
                if (!custom) delete newAccount.tos_acceptance;
                //accountResult = await stripe.createToken("account", newAccount);
                //https://stripe.com/docs/api/persons/create

                const address = Object.keys(this.state.address)
                  .map((x) => {
                    //console.log(remaining, event.value.address[next]);
                    return this.state.address[x]
                      ? {
                          [x]: this.state.address[x]
                        }
                      : "";
                  })
                  .filter((x) => x !== "")
                  .reduce(function (result, current) {
                    return Object.assign(result, current);
                  }, {});

                addDoc(collection(firestore, "customers"), {
                  authorId: this.props.auth.uid,
                  mcc: trust.mcc,
                  last,
                  email: newAccount.business_profile.support_email,
                  //address: auth.address,
                  name: first + " " + last,
                  phone: newAccount.business_profile.support_phone,
                  shipping: {
                    address,
                    name: first + " " + last,
                    phone: auth.phoneNumber
                  },
                  address,
                  description: trust.description
                });

                addDoc(collection(firestore, "cardholders"), {
                  authorId: this.props.auth.uid,
                  mcc: trust.mcc,
                  name: first + " " + last,
                  email: auth.email,
                  phone_number: auth.phoneNumber,
                  status: "active",
                  type: "individual",
                  individual: { first_name: first, last_name: last },
                  billing: {
                    address
                  }
                });
                const done = JSON.stringify({
                  newAccount,
                  personResult,
                  companyResult
                });
                done &&
                  r({
                    account: { ...JSON.parse(`${done}`) },
                    merchantSurnamePrefix: ""
                  });
                //}).catch(standardCatch);

                //return console.log("promise resolved boolean-false"); //Why does this not return? Promise == true
                //does process (and what else thread) pause with an if boolean true awaiting promise (defer)?

                //return console.log(matchingSurnames);
              })
          )
        )
          /*async (merchantSurnamePrefixes=[] = (array) =>array.map(e=>e.merchantSurnamePrefix &&
          merchantSurnamePrefixes.push(e.merchantSurnamePrefix)) =>*/
          .then(async (m) => {
            /*{ accounts, merchantSurnamePrefixes } = async (x) =>
                await x.json()*/

            //return console.log("resolved all tokens", accts);
            //return console.log("accounts", accounts);
            console.log("accounts", m ? m : " none");
            await fetch("https://vault-co.in/join", {
              method: "POST",
              headers: {
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
                "Content-Type": "Application/JSON"
              },
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
              body: JSON.stringify({
                merchantSurnamePrefixes: m.map((e) => {
                  const h = [e.account, e.merchantSurnamePrefix];
                  return h[1];
                }),
                deleteThese: [], //acct
                //sinkThese: [], //cus DO NOT USE
                //automated 1099 reporting to users above $20,000 or 200 transactions
                //https://stripe.com/docs/connect/tax-reporting (January 3, 2023)
                //"You cannot accept the Terms of Service on behalf of Standard and Express connected accounts.

                //"You must update your Connect branding settings with icon, brand color in order to create an account link."
                //"You can set the missing fields at https://dashboard.stripe.com/settings/connect"
                accounts: m.map((sV) => {
                  //const sV = JSON.parse(stringVersion);
                  const jsonV = sV.account;
                  return {
                    type: "standard",
                    country: "US",
                    ...(!jsonV.newAccount
                      ? jsonV
                      : {
                          uid: this.props.auth.uid,
                          newAccount: jsonV.newAccount,
                          first: jsonV.first,
                          last: jsonV.last,
                          person: {
                            account_token: jsonV.personResult.token.id
                          },
                          companyAccount: {
                            account_token: jsonV.companyResult.token.id
                          }
                          //customer: jsonV.customerResult
                        })
                  };
                })
              })
            }) //stripe account, not plaid access token payout yet
              .then(async (res) => await res.json())
              .then((result) => {
                if (result.status) return console.log(result);
                if (result.error) return console.log(result);
                if (!result.accounts)
                  return console.log("dev error (Cash)", result);
                //If there is not (accountLink), the new stripe (account.id) stripeId is caught here

                var keyvalue = {};
                result.accounts.forEach((store) => {
                  const digits = String(store.name).substring(0, 2);
                  //customer = `customer${digits}Id`,
                  //cardholder = `cardholder${digits}Id`;
                  keyvalue[`stripe${digits}Link`] = store.accountLink;
                  keyvalue[`stripe${digits}Id`] = store.id;
                  //kv[customer] = store.customerId;
                  //kv[cardholder] = store.cardholderId;
                  //kv.invoice_prefix = store.invoice_prefix;
                  //return kv;
                });
                //RESSEND(res, { statusCode, statusText, error: "before getDoc" });
                getDoc(
                  doc(collection(firestore, "userDatas"), this.props.auth.uid)
                ) /*.then((d) => {return { keyvalue, exists: d.exists() }; })*/
                  .then(
                    //{ keyvalue, exists }
                    (d) => {
                      (d.exists() ? updateDoc : setDoc)(
                        doc(
                          collection(firestore, "userDatas"),
                          this.props.auth.uid
                        ),
                        keyvalue
                      ) //RESSEND(res, { statusText: "successful accountLink"});
                        .then(() => {})
                        // { keyvalue },"firestore store id (then callback)"
                        //plaidLink payouts account.details_submitted;
                        .catch((e) => {});
                    }
                  )
                  .catch((e) => {});
                //{ accs }, "firestore store id (get callback)"
                result.accounts.forEach((x) => {
                  //  store, accountLink, invoice_prefix
                  // result.data ? result.data.stripe_user_id:

                  //this should be the last account
                  if (String(x.name) === "7011") {
                    //8398
                    //6540
                    const answer = window.confirm(
                      "Want to go along to submit details instead of passing " +
                        "them by for later and just hang out instead?"
                    );
                    if (answer) window.location.href = x.accountLink.url;
                  }
                });
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
    /**
     * 
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
     */
    return (
      <AddressElement
        options={this.props.options}
        onChange={(event) => {
          //console.log(event);
          if (event.complete) {
            if (event.value.name) return null;
            // Extract potentially complete address
            const address = Object.keys(event.value.address)
              .map((x) => {
                //console.log(remaining, event.value.address[next]);
                return {
                  [x]: event.value.address[x] ? event.value.address[x] : ""
                };
              })
              .reduce(function (result, current) {
                return Object.assign(result, current);
              }, {});
            //return console.log(address);
            this.props.saveaddress(
              //this.setState(
              {
                address,
                stripe: this.props.stripe
              },
              () => {
                /*fetch("https://geolocation-db.com/json/")
                  .then(async (res) => await res.json())
                  .then((r) => {
                    const IPv4 = r.IPv4;*/
                //console.log(IPv4);
                //this.setState({ IPv4 }, () => {
                //this.stripe.current.click()
                //console.log(this.state.address);
                //});
                //});
                //});}).catch((err) => console.log(err.message));
                // submitBank();
              }
            );
          }
        }}
      />
    );
  }
}
