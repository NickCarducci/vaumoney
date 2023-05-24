import React from "react";
import firebase from ".././init-firebase.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
  deleteField,
  FieldValue
} from "firebase/firestore";
import { specialFormatting, standardCatch } from "../FIREBASE_SUDO";
import Email from "./Email";
import {
  Elements,
  ElementsConsumer,
  PaymentElement
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MicroVerify from "./MicroVerify.js";
import { countries } from "./countries.js";
import { states } from "./utils.js";
import PayNow from "./PayNow.js";
//"stripePromise"
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

export const myStripeAccounts = [
  {
    mcc: "7011", //"6513", //"5046", //"we can't be doing this; language near a kid" truancy! commie.dev/liberal, /work
    account: "Home", // "Loans", //["commercial_equipment", 5046],
    description: "Real property management operations development."
    //"Shareholder Loans 382 and Interest 136" //7520, 1212 (capital)
  },
  {
    mcc: "8099",
    account: "Patient", //"Medical",
    description: `Direct 2503(e) out-of-pocket healthcare provider.`
  },
  {
    mcc: "8299",
    account: "Student", //"Educational",
    description: `2503(e) direct school tuition.`
  }, //business that the market isn't available for. //taxableincome in-kind in trustis what the market isn't available (minimum deductible spending)
  /*{
    mcc: "1520", //primary residence; consumable, improved
    account: "Infrastructure", // ~or after-tax remaining retirement~ worked in ~retreats final good~
    description: `Custom-issuable complex-trust for Non-Sale 1031 advances and Allowed 274/280a retreats or a durable, outright, and worked-in encampment`
  },
  {
    mcc: "7999", //  ["miscellaneous_recreation_services", 7999],
    account: "Taxable",
    description: `Ordinary Recreational and Leisure Activities`
  },*/
  {
    mcc: "8398", //6540
    account: "Foundation", //"charitable" Decanter Trustee
    description: "Customer-grantor non-present beneficiary trust."
    //Can private or public foundations donate tax-free?
    //"Stored value unincorporated association for real property primary residence and " +
    //"Non-Reportable gift-discount customer-grantor non-present beneficiaries."
  } //`Stored-trust decanter for customer-grantor-beneficiary 2503(b), Direct essential 2503(e), and business Advanced non-sale 1031 and Allowed durable 274/280a fixed values`
  //"Custom-issuable complex-trust for Non-Reportable 2503(b) customer-grantor, non-present beneficiaries"
]; //if account is Decanter by 12/31, choose by customer or claim income after deductions 1125-a, Schedule C of remaining balance
//
//"Is this a business expense? Make it a shareholder loan and deduct your excess income over costs of goods or services sold by 80% of this purchase"

export const shorter = (mcc) => String(mcc).substring(0, 2);
//what if business cycles are from shareholder loans carried forward
const firestore = getFirestore(firebase);
class Cash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: false,
      list: [],
      number: "4242424242424242",
      expiry: "12/34",
      cvc: "000",
      account_holder_type: "individual",
      account_number: "", //000123456789
      routing_number: "", //110000000
      savings: "checking",
      //dev: true,
      lastPayoutType: "send cash"
      //business_type: "company", //bank_account_type, retail
    };
    this.stripeemailaddress = React.createRef();
  }
  componentDidUpdate = async (prevProps) => {
    if (
      this.props.pathname !== prevProps.pathname ||
      window.stripe !== this.state.stripe
    ) {
      this.setState({ stripe: window.stripe });
      this.findURL();
    }
  };
  componentDidMount = () => {
    this.findURL();
  };
  findCustomURL = () => {
    if (this.props.auth === undefined) return null;
    const url = new URL(window.location.href);
    const stripeId = url.searchParams.get("stripecustom");
    const mcc = url.searchParams.get("mcc");
    const redo = url.searchParams.get("redo");
    //console.log(url);
    if (stripeId && mcc) {
      const digits = String(mcc).substring(0, 2);
      if (!redo) {
        //return null;
        //customer = `customer${digits}Id`,
        //cardholder = `cardholder${digits}Id`;
        //kv[customer] = store.customerId;
        //kv[cardholder] = store.cardholderId;
        //kv.invoice_prefix = store.invoice_prefix;
        //return kv;

        //RESSEND(res, { statusCode, statusText, error: "before getDoc" });
        getDoc(
          doc(firestore, "userDatas", this.props.auth.uid)
        ) /*.then((d) => {return { keyvalue, exists: d.exists() }; })*/
          .then(
            //{ keyvalue, exists }
            (d) => {
              (d.exists() ? updateDoc : setDoc)(
                doc(firestore, "userDatas", this.props.auth.uid),
                {
                  [`stripecustom${digits}Link`]: deleteField()
                }
              ) //RESSEND(res, { statusText: "successful accountLink"});
                .then(() => {
                  updateDoc(doc(firestore, "users", this.props.auth.uid), {
                    [`stripecustom${digits}Id`]: stripeId
                  });
                  this.props.navigate("/");
                });
            }
          );
      } else {
        getDoc(
          doc(firestore, "userDatas", this.props.auth.uid)
        ) /*.then((d) => {return { keyvalue, exists: d.exists() }; })*/
          .then(
            //{ keyvalue, exists }
            (d) => {
              (d.exists() ? updateDoc : setDoc)(
                doc(firestore, "userDatas", this.props.auth.uid),
                {
                  [`stripecustom${digits}Link`]: deleteField()
                }
              ) //RESSEND(res, { statusText: "successful accountLink"});
                .then(async () => {
                  updateDoc(doc(firestore, "users", this.props.auth.uid), {
                    [`stripecustom${digits}Id`]: deleteField()
                  });
                  this.deleteThese([stripeId]);
                  this.props.navigate("/");
                });
            }
          );
      }
    }
  };
  findURL = async () => {
    this.findCustomURL();
    if (this.props.auth === undefined) return null;
    const url = new URL(window.location.href);
    const stripeId = url.searchParams.get("stripe");
    const mcc = url.searchParams.get("mcc");
    const redo = url.searchParams.get("redo");
    //console.log(url);
    if (stripeId && mcc) {
      const digits = String(mcc).substring(0, 2);
      if (!redo) {
        //return null;
        //customer = `customer${digits}Id`,
        //cardholder = `cardholder${digits}Id`;
        //kv[customer] = store.customerId;
        //kv[cardholder] = store.cardholderId;
        //kv.invoice_prefix = store.invoice_prefix;
        //return kv;

        //RESSEND(res, { statusCode, statusText, error: "before getDoc" });
        getDoc(
          doc(firestore, "userDatas", this.props.auth.uid)
        ) /*.then((d) => {return { keyvalue, exists: d.exists() }; })*/
          .then(
            //{ keyvalue, exists }
            (d) => {
              (d.exists() ? updateDoc : setDoc)(
                doc(firestore, "userDatas", this.props.auth.uid),
                {
                  [`stripe${digits}Link`]: deleteField()
                }
              ) //RESSEND(res, { statusText: "successful accountLink"});
                .then(() => {
                  updateDoc(doc(firestore, "users", this.props.auth.uid), {
                    [`stripe${digits}Id`]: stripeId
                  });
                  this.props.navigate("/");
                });
            }
          );
      } else {
        getDoc(
          doc(firestore, "userDatas", this.props.auth.uid)
        ) /*.then((d) => {return { keyvalue, exists: d.exists() }; })*/
          .then(
            //{ keyvalue, exists }
            (d) => {
              (d.exists() ? updateDoc : setDoc)(
                doc(firestore, "userDatas", this.props.auth.uid),
                {
                  [`stripe${digits}Link`]: deleteField()
                }
              ) //RESSEND(res, { statusText: "successful accountLink"});
                .then(async () => {
                  updateDoc(doc(firestore, "users", this.props.auth.uid), {
                    [`stripe${digits}Id`]: deleteField()
                  });
                  this.deleteThese([stripeId]);
                  this.props.navigate("/");
                });
            }
          );
      }
    }
    const clientSec = new URLSearchParams(window.location.search).get(
      "setup_intent_client_secret"
    );
    if (clientSec) {
      console.log("clientSec", clientSec);
      await fetch("https://vault-co.in/confirm", {
        method: "POST",
        headers: {
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
          "Content-Type": "Application/JSON"
        },
        body: JSON.stringify({
          seti: clientSec
        })
      }) //stripe account, not plaid access token payout yet
        .then(async (res) => await res.json())
        .then(async (result) => {
          if (result.status) return console.log(result);
          if (result.error) return console.log(result);
          if (!result.setupIntent)
            return console.log("dev error (Cash)", result);
          console.log(result.setupIntent);
          this.props.navigate("/");
        })
        .catch(standardCatch);
    }
    // Retrieve the SetupIntent
    clientSec &&
      this.state.stripe &&
      this.state.stripe
        .retrieveSetupIntent(clientSec)
        .then(({ setupIntent }) => {
          // Inspect the SetupIntent `status` to indicate the status of the payment
          // to your customer.
          //
          // Some payment methods will [immediately succeed or fail][0] upon
          // confirmation, while others will first enter a `processing` state.
          //
          // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
          switch (setupIntent.status) {
            default:
              break;
            case "succeeded":
              console.log("Success! Your payment method has been saved.");
              break;

            case "processing":
              console.log(
                "Processing payment details. We'll update you when processing is complete."
              );
              break;

            case "requires_payment_method":
              // Redirect your user back to your payment page to attempt collecting
              // payment again
              console.log(
                "Failed to process payment details. Please try another payment method."
              );
              break;
          }
          this.props.navigate("/");
        });
  };
  deleteThese = async (deleteThese = [], sinkThese = []) => {
    await fetch("https://vault-co.in/delete", {
      method: "POST",
      headers: {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
        "Content-Type": "Application/JSON"
      },
      body: JSON.stringify({
        sinkThese,
        deleteThese
      })
    }) //stripe account, not plaid access token payout yet
      .then(async (res) => await res.json())
      .then(async (result) => {
        if (result.status) return console.log(result);
        if (result.error) return console.log(result);
        if (!result.data) return console.log("dev error (Cash)", result);
        console.log(result.data);
      })
      .catch(standardCatch);
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
          : this.props.user[`customer${shorter(this.state.selectThisOne)}Id`]
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
    const arrayMessage = (message) =>
      message
        .toLowerCase()
        //capture or, excluding set, match 2 or more of the preceding token
        .replace(/((\r\n|\r|\n)+[^a-zA-Z#]+_+[ ]{2,})+/g, " ")
        .split(" ");
    const space = " ";
    const { user } = this.props;
    //console.log(user);
    const noAccountYetArray = myStripeAccounts.filter((x) => {
      if (
        user &&
        user[`stripe${shorter(x.mcc)}Id`] &&
        !user[`stripe${shorter(x.mcc)}Link`]
      ) {
        //this.setState({ ...account });
        return null;
      } else return true;
    });
    //console.log(linksure(this.state.selectThisOne));
    //console.log(this.props.user);
    const getUserInfo = () => {
      this.props.getUserInfo();
      /*if (this.props.auth === undefined || !user) {
        console.log("getUserInfo called Cash/index.js");
        if (!this.state.giveUp) {
          this.setState({ giveUp: true });
        } else return window.location.reload();
        return this.props.getUserInfo();
      }*/
    };
    /*const submitBankCard = async (bank = (payout) => payout === "bank") => {
      if (!user.address && !this.state.address)
        //no need emailCallback? while user[`stripeId`]&&!user[`stripeLink`]
        return this.setState({ openFormSecure: true }); //open to yet address
      const addr = this.state.openFormSecure
        ? this.state.address
        : user.address;
      var token = null;
      var card = {
        currency: "USD",
        name: user.first + this.state.middle + user.last,
        number: this.state.number,
        exp_month: this.state.exp_month,
        exp_year: this.state.exp_year,
        security: this.state.security,
        ...Object.keys(addr).map((key) => {
          const value = addr[key];
          return { [`address_${key === "postal_code" ? "zip" : key}`]: value };
        })
      };

      if (bank) {
        card = {
          country: user.account.country,
          currency: "USD",
          account_holder_name: user.first + this.state.middle + user.last,
          account_holder_type: this.state.account_holder_type,
          account_number: this.state.account_number,
          //account_type: this.state.account_type,
          routing_number: this.state.routing_number
        };
      } else {
      }
      this.setState({ [`submitStripe${bank ? "Bank" : "Card"}`]: card });
    };*/
    const linksure = (x, custom) => {
      const status =
        user && user[`stripe${(custom ? "custom" : "") + shorter(x)}Link`];
      //user && console.log(user[`stripe${shorter(x)}Link`]);
      return status;
    };
    //console.log(linksure(this.state.selectThisOne));
    //console.log(this.props.user);
    const { paymentItems } = this.state;
    const purchase = async (x, custom) => {
      console.log("purchase");
      //customerResult,
      /*var stripeAccount = "stripe" + trust.account;
        const { first, last, auth } = this.props,
          custom = null; //standard, or express
        if (this.props.user[stripeAccount]) {
          const done = JSON.stringify({
            [trust.account]: this.props.user[stripeAccount]
          }); //Why do synchronous intrinsic JSON functions need a scope declaration?
          return r(done);
        }*/
      const payouts = {
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
        date = String(Math.floor(new Date(now).getTime() / 1000)); //new Date(now).getTime() / 1000, // - 14400, //
      // return console.log("name", name);
      const trust = myStripeAccounts.find((e) => e.mcc === x.mcc),
        first =
          paymentItems.first !== ""
            ? paymentItems.first
            : user.first
            ? user.first
            : this.state.first,
        last =
          paymentItems.last !== ""
            ? paymentItems.last
            : user.last
            ? user.last
            : this.state.last,
        name = first + " " + last,
        companyName = `Vaumoney ${trust.account} ` + name,
        ownership_declaration = {
          date,
          ip, //IPv4
          user_agent
        };
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
          }, //"custom"
          payouts,
          //https://stripe.com/docs/connect/statement-descriptors
          payments: {
            statement_descriptor: trust.mcc + " " + name.substring(0, 17) //"Vau.money Decanter" //PRE-TAX TRUSTEE DECANTER
          }
        },
        capabilities: {
          card_payments: {
            requested: true
          },
          transfers: {
            requested: true
          },
          card_issuing: {
            requested: true
          },
          us_bank_account_ach_payments: {
            requested: true
          }
        },
        business_type: "company", //email required?
        default_currency: "usd",
        tos_acceptance: {
          ...ownership_declaration,
          service_agreement: "full"
        }
      };
      //var custom = true;
      if (!custom) {
        delete newAccount.tos_acceptance;
        delete newAccount.capabilities; //.card_issuing;
        //delete newAccount.capabilities.us_bank_account_ach_payments;
        delete newAccount.settings.card_issuing;
      }
      //accountResult = await stripe.createToken("account", newAccount);
      //https://stripe.com/docs/api/persons/create
      //return console.log(first, last);
      await fetch("https://vault-co.in/purchase", {
        method: "POST",
        headers: {
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
          "Content-Type": "Application/JSON"
        },
        body: JSON.stringify({
          type: custom ? "custom" : "standard", //standard
          country: "US",
          uid: this.props.auth.uid,
          newAccount: newAccount,
          first,
          last
        })
      }) //stripe account, not plaid access token payout yet
        .then(async (res) => await res.json())
        .then(async (result) => {
          if (result.status) return console.log(result);
          if (result.error) return console.log(result);
          if (!result.account) return console.log("dev error (Cash)", result);
          //If there is not (accountLink), the new stripe (account.id) stripeId is caught here

          const { address: addr } = this.state,
            address = Object.keys(paymentItems.billing_details).every(
              (key) =>
                paymentItems.billing_details[key] !== "" ||
                ["line2"].includes(key)
            )
              ? paymentItems.billing_details
              : addr;
          //if (!this.props.user.stripeId) {
          const personResult = await this.state.stripe.createToken("person", {
              relationship: { owner: true },
              first_name: first,

              last_name: last,
              email: this.props.auth.email,
              phone: this.props.auth.phoneNumber,
              address
            }),
            companyResult = await this.state.stripe.createToken("account", {
              company: {
                address,
                name: companyName, //this.state.billing_details.name,
                structure: "unincorporated_association", //trust // "sole_proprietorship",
                phone: this.props.auth.phoneNumber, //owners are provided after the account.person
                ownership_declaration,
                owners_provided: true
              }
            });

          await fetch("https://vault-co.in/beneficiary", {
            method: "POST",
            headers: {
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
              "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
              type: custom ? "custom" : "standard", //standard
              mcc: trust.mcc,
              accountId: result.account.id,
              person: {
                account_token: personResult.token.id
              },
              companyAccount: {
                account_token: companyResult.token.id
              }
            })
          }) //stripe account, not plaid access token payout yet
            .then(async (res) => await res.json())
            .then((result) => {
              if (result.status) return console.log(result);
              if (result.error) return console.log(result);
              if (!result.account)
                return console.log("dev error (Cash)", result);
              var keyvalue = {};

              getDoc(
                doc(firestore, "userDatas", this.props.auth.uid)
              ) /*.then((d) => {return { keyvalue, exists: d.exists() }; })*/
                .then(
                  //{ keyvalue, exists }
                  (d) => {
                    (d.exists() ? updateDoc : setDoc)(
                      doc(firestore, "userDatas", this.props.auth.uid),
                      {
                        address,
                        first,
                        last,
                        /*
                          don't add id by return_url because it might notbe finished
                          [`stripe${shorter(
                            trust.mcc
                          )}Id`]: result.account.id,
                          delete link upon refresh account id search query get("stripeId")
                          */
                        [`stripe${
                          (custom ? "custom" : "") + shorter(trust.mcc)
                        }Link`]: result.account.accountLink.url,
                        [`person${
                          (custom ? "custom" : "") + shorter(trust.mcc)
                        }Id`]: result.account.person.id
                      }
                    ) //RESSEND(res, { statusText: "successful accountLink"});
                      .then(() => {
                        //8398
                        //6540
                        const answer = window.confirm(
                          "Want to go along to submit details instead of passing " +
                            "them by for later and just hang out instead?"
                        );
                        if (answer)
                          window.location.href = result.account.accountLink.url;
                      });
                  }
                );
            })
            .catch((x) => standardCatch(x, "/beneficiary"));
        })
        .catch((x) => standardCatch(x, "/purchase"));
    };
    const makeAccount = async (x) => {
      const deleteThese = [],
        sinkThese = [];
      if (deleteThese.length !== 0 || sinkThese.length !== 0)
        return this.deleteThese(deleteThese, sinkThese);
      if (this.state.selectThisOne !== x.mcc)
        return this.setState({ selectThisOne: x.mcc, balance: false });

      const trust = myStripeAccounts.find((e) => e.mcc === x.mcc),
        { address: addr } = user; //this address was
      console.log("o address", this.state.address);
      if (!addr && !this.state.address) return getUserInfo();

      if (
        user[`stripe${shorter(trust.mcc)}Id`] &&
        !user[`stripe${shorter(trust.mcc)}Link`]
      ) {
        /*if (user[`customer${shorter(trust.mcc)}Id`]) {
          if (!user[`cardholder${shorter(trust.mcc)}Id`])
          return console.log("dev error (no card)");

          return window.alert(
            "This is your " +
              trust.account +
              " settlement-checking account with us."
          );
          //submitBankCard();
        }*/
        if (!this.state.stripe) return this.stripeemailaddress.current.click();
        if (!user[`customer${shorter(this.state.selectThisOne)}Id`]) {
          //const { openPaymentSecure: trust } = this.state;
          const { address: addr, first, last } = user;
          //return console.log("name", first + last);
          if (
            user[`stripecustom${shorter(trust.mcc)}Id`] &&
            user[`stripecustom${shorter(trust.mcc)}Link`]
          )
            return console.log("must authorize stripecustom"); //open to yet address

          if (!user[`stripecustom${shorter(trust.mcc)}Id`]) {
            const payments = true;
            purchase(trust, payments);
            var issuing = false;
            if (issuing)
              return console.log("again to issue or else customer-regular");
          }
          /*if (!addr)
    //no need emailCallback? while user[`stripeId`]&&!user[`stripeLink`]
    return this.setState({ openFormSecure: true });*/

          const address = Object.keys(addr)
            .map((x) => {
              //console.log(remaining, event.value.address[next]);
              return addr[x]
                ? {
                    [x]: addr[x]
                  }
                : "";
            })
            .filter((x) => x !== "")
            .reduce(function (result, current) {
              return Object.assign(result, current);
            }, {});

          var edit = {
            //authorId: this.props.auth.uid,
            mcc: trust.mcc,
            last,
            email: this.props.auth.email,
            //address: auth.address,
            name: first + " " + last,
            phone: this.props.auth.phoneNumber,
            shipping: {
              address,
              name: first + " " + last,
              phone: this.props.auth.phoneNumber
            },
            address,
            description: trust.description
          };
          const merchantSurnamePrefix =
            user.address.country +
            String(this.state.selectThisOne).substring(0, 2) +
            edit.last.substring(0, 3).toLocaleUpperCase();
          const totalMerchantSurnames = await getDoc(
            doc(
              collection(firestore, "merchantSurnames"),
              merchantSurnamePrefix
            )
          )
            .then((dx) => {
              (dx.exists() ? updateDoc : setDoc)(
                doc(
                  collection(firestore, "merchantSurnames"),
                  merchantSurnamePrefix
                ),
                { count: increment(1) }
              );
              return { ...dx.data(), id: dx.id }.count + 1;
            })
            .catch((err) => {
              console.log("surname update,set, or get failure: ", err.message);
              return err;
            });
          if (
            !totalMerchantSurnames ||
            totalMerchantSurnames.constructor !== Number
          )
            return window.alert(
              "dev error (no document can be made): ",
              totalMerchantSurnames
            );
          const invoice_prefix = merchantSurnamePrefix + totalMerchantSurnames;
          delete edit.authorId;
          delete edit.mcc;
          delete edit.last;
          await fetch("https://vault-co.in/customer", {
            method: "POST",
            headers: {
              "Content-Type": "Application/JSON",
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": ["Origin", "Content-Type"] //allow referer
            },
            body: JSON.stringify({
              customer: {
                ...edit,
                invoice_prefix
                //type: "physical"
              }
            })
          })
            .then(async (res) => await res.json())
            .then(async (result) => {
              getDoc(
                doc(collection(firestore, "userDatas"), this.props.auth.uid)
              )
                .then((d) => {
                  const digits = String(trust.mcc).substring(0, 2);
                  //kv.invoice_prefix = store.invoice_prefix;
                  (d.exists() ? updateDoc : setDoc)(
                    doc(
                      collection(firestore, "userDatas"),
                      this.props.auth.uid
                    ),
                    {
                      [`customer${digits}Id`]: result.customer.id
                    }
                  )
                    .then(() => {})
                    .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
                })
                .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
            });
        }

        const answer = window.confirm(
          "Would you like a card? YOU WILL BE CHARGED $2.99 this month and monthly until you cancel" +
            (user[`customer${shorter(trust.mcc)}Id`]
              ? " This time we will enable your account for issuing."
              : "")
          //(addr ? "" : " Please provide an address")
        ); //this answer was already purchased
        //if (!answer && !addr) return null;
        return this.setState({ openPaymentSecure: answer ? trust : null });
      }
      if (!this.state.address)
        return window.alert(
          `Add your name and address first to make the ${x.account} account.`
        );
      if (!this.state.address) return null;
      const answer = window.confirm(
        "Have you read stripe.com/legal/connect-account? Do you consent to everything you can?"
      );
      if (answer) purchase(x);
    };
    //console.log("stripe", this.state.stripe);
    //console.log("paymentItems", paymentItems);
    //console.log("balance", this.state.balance);
    return (
      <div
        style={{
          maxWidth: "300px",
          width: "80%",
          backgroundColor: "white",
          //height: "100%",
          color: "rgb(25,35,25)",
          transition: `.3s ease-in`,
          flexDirection: "column"
        }}
      >
        <Email
          pathname={this.props.pathname}
          address={this.state.address}
          stripe={this.state.stripe}
          stripePromise={this.props.stripePromise}
          ref={{
            current: {
              stripeemailaddress: this.stripeemailaddress,
              FIREBASE_MULTI: this.props.FIREBASE_MULTI
            }
          }}
          scrollTop={this.props.scrollTop}
          scrolling={this.props.scrolling}
          getUserInfo={getUserInfo}
          user={user}
          auth={this.props.auth}
          noAccountYetArray={noAccountYetArray}
          width={this.props.width}
          openPaymentSecure={this.state.openPaymentSecure}
          openListedTransations={this.props.openListedTransations}
          transactions={this.props.transactions}
          setCash={(e) => this.setState(e)}
          logoutofapp={this.props.logoutofapp}
          navigate={this.props.navigate}
          selectThisOne={this.state.selectThisOne}
          linksure={linksure}
          shorter={shorter}
        />
        <div
          style={{
            padding: "4px 0px",
            display: this.state.openPaymentSecure ? "flex" : "none",
            width: "100%",
            justifyContent: "space-between"
          }}
        >
          $2.99/mo
          <div
            onClick={() => {
              this.setState({
                openPaymentSecure: false
              });
            }}
          >
            &times;
          </div>
        </div>
        {user && user[`cardholder${shorter(this.state.selectThisOne)}Id`] ? (
          //" Don't delete customers"
          <div>
            <div
              onClick={async () => {
                const answer = window.confirm(
                  "Are you sure? All outbound card payments will be stopped."
                );
                if (answer) {
                  this.deleteThese(
                    [
                      user[`stripecustom${shorter(this.state.selectThisOne)}Id`]
                    ],
                    [user[`customer${shorter(this.state.selectThisOne)}Id`]]
                  );
                  updateDoc(doc(firestore, "userDatas", this.props.auth.uid), {
                    [`cardholder${shorter(
                      this.state.selectThisOne
                    )}Id`]: deleteField(),
                    [`customer${shorter(
                      this.state.selectThisOne
                    )}Id`]: deleteField(),
                    [`subscription${shorter(
                      this.state.selectThisOne
                    )}Id`]: deleteField()
                  }).then(() => {
                    updateDoc(doc(firestore, "users", this.props.auth.uid), {
                      [`stripecustom${shorter(
                        this.state.selectThisOne
                      )}Id`]: deleteField()
                    }).then(() => {
                      window.location.reload();
                    });
                  });
                }
              }}
            >
              Cancel $2.99/mo subscription
            </div>
            <div
              onClick={async () => {
                const { address: addr } = user;
                const address = Object.keys(addr)
                  .map((x) => {
                    //console.log(remaining, event.value.address[next]);
                    return addr[x]
                      ? {
                          [x]: addr[x]
                        }
                      : "";
                  })
                  .filter((x) => x !== "")
                  .reduce(function (result, current) {
                    return Object.assign(result, current);
                  }, {});
                await fetch("https://vault-co.in/issue", {
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
                    cardholderId:
                      user[`cardholder${shorter(this.state.selectThisOne)}Id`],
                    type: "physical",
                    name: user.first + " " + user.last,
                    address
                  })
                }) //stripe account, not plaid access token payout yet
                  .then(async (res) => await res.json())
                  .then(async (result) => {
                    if (result.status) return console.log(result);
                    if (result.error) return console.log(result);
                    if (!result.cardId)
                      return console.log("dev error (Cash)", result);
                    console.log(result.cardId);
                  })
                  .catch(standardCatch);
              }}
            >
              Issue card
            </div>
          </div>
        ) : (
          <PayNow
            stripePromise={this.props.stripePromise}
            paymentType={this.state.paymentType}
            setPayoutType={(e) => this.setState({ paymentType: e })}
            setPaymentItems={(e) => this.setState({ paymentItems: e })}
            paymentItems={this.state.paymentItems}
            hide={!this.state.openPaymentSecure}
            amount={2.99}
            setAmount={() => {}}
            submit={async (cardResult, cb) => {
              const { openPaymentSecure: trust } = this.state;
              const { address: addr, first, last } = user;
              if (
                user[`stripecustom${shorter(trust.mcc)}Id`] &&
                user[`stripecustom${shorter(trust.mcc)}Link`]
              )
                return console.log("must authorize stripecustom"); //open to yet address

              if (!user[`stripecustom${shorter(trust.mcc)}Id`]) {
                const payments = true;
                purchase(trust, payments);
              }
              /*if (!addr)
          //no need emailCallback? while user[`stripeId`]&&!user[`stripeLink`]
          return this.setState({ openFormSecure: true });*/

              const address = Object.keys(addr)
                .map((x) => {
                  //console.log(remaining, event.value.address[next]);
                  return addr[x]
                    ? {
                        [x]: addr[x]
                      }
                    : "";
                })
                .filter((x) => x !== "")
                .reduce(function (result, current) {
                  return Object.assign(result, current);
                }, {});

              /*setDoc(
          doc(
            collection(firestore, "customers"),
            trust.mcc + this.props.auth.uid
          ),
          edit
        ).then(() => {*/
              var cardholder = {
                //cardholderId:user[`cardholderId${shorter(trust.mcc)}Id`],
                //authorId: this.props.auth.uid,
                mcc: trust.mcc,
                name: first + " " + last,
                email: this.props.auth.email,
                phone_number: this.props.auth.phoneNumber,
                status: "active",
                type: "individual",
                individual: {
                  first_name: first,
                  last_name: last
                },
                billing: {
                  address
                }
              };
              /*setDoc(
            doc(
              collection(firestore, "cardholders"),
              trust.mcc + this.props.auth.uid
            ),
            cardholder
          ).then(async (docRef) => {*/
              //no need to get ref.id
              //neither for prefix count
              //nor customer + cardholder
              //try and userDatas update

              delete cardholder.authorId;
              delete cardholder.mcc;

              const { paymentItems } = this.state;
              const expiry = paymentItems.expiry.split("/");
              const addressToPay = Object.keys(paymentItems.billing_details)
                .map((x) => {
                  //console.log(remaining, event.value.address[next]);
                  return paymentItems.billing_details[x]
                    ? {
                        [x]: paymentItems.billing_details[x]
                      }
                    : "";
                })
                .filter((x) => x !== "")
                .reduce(function (result, current) {
                  return Object.assign(result, current);
                }, {});
              const personal = {
                address: addressToPay,
                phone: this.props.auth.phoneNumber,
                name:
                  paymentItems.first + paymentItems.middle + paymentItems.last,
                email: this.props.auth.email
              };
              const bankcard =
                this.state.payoutType !== "bank"
                  ? {
                      primary: paymentItems.number,
                      exp_month: expiry[0],
                      exp_year: expiry[1],
                      cvc: paymentItems.cvc,
                      //cardElement
                      ...personal
                    }
                  : {
                      //country: user.address.country,
                      //currency: "USD",
                      company: paymentItems.account_holder_type,
                      account: paymentItems.account_number,
                      //account_type: this.state.account_type,
                      routing: paymentItems.routing_number,
                      savings: paymentItems.savings,

                      ...personal
                    };
              const body = {
                type:
                  this.state.paymentType === "bank"
                    ? "us_bank_account"
                    : "card",
                customerId:
                  user[`customer${shorter(this.state.selectThisOne)}Id`],
                cardholder,
                ...bankcard
              };
              //return console.log(body)
              const issuing = async (cardholder) => {
                return await fetch("https://vault-co.in/cardholder", {
                  method: "POST",
                  headers: {
                    "Content-Type": "Application/JSON",
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": ["Origin", "Content-Type"] //allow referer
                  },
                  body: JSON.stringify(cardholder)
                })
                  .then(async (res) => await res.json())
                  .then((res) => {
                    if (!res.customer)
                      return console.log(
                        "no customerId from vault-co.in/customer",
                        res
                      );
                    getDoc(
                      doc(
                        collection(firestore, "userDatas"),
                        this.props.auth.uid
                      )
                    )
                      .then((d) => {
                        const digits = String(trust.mcc).substring(0, 2);
                        //kv.invoice_prefix = store.invoice_prefix;
                        (d.exists() ? updateDoc : setDoc)(
                          doc(
                            collection(firestore, "userDatas"),
                            this.props.auth.uid
                          ),
                          {
                            [`cardholder${digits}Id`]: res.customer.id
                          }
                        )
                          .then(() => {})
                          .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
                      })
                      .catch((e) => standardCatch(e));
                  });
              };

              if (user[`customer${shorter(trust.mcc)}Id`])
                return issuing(cardholder);
              const noissuing = async (res, customer) => {
                console.log(
                  "no customerId+cardholerId from vault-co.in/buy",
                  res
                );

                if (
                  res.error.raw.message ===
                  "Issuing is only available in testmode for this account."
                ) {
                  window.alert(
                    "This service is unavailable at the moment. Request that Vaumoney issue cards at support@stripe.com"
                  );
                  return await fetch("https://vault-co.in/customer", {
                    method: "POST",
                    headers: {
                      "Content-Type": "Application/JSON",
                      "Access-Control-Request-Method": "POST",
                      "Access-Control-Request-Headers": [
                        "Origin",
                        "Content-Type"
                      ] //allow referer
                    },
                    body: JSON.stringify(body)
                  })
                    .then(async (res) => await res.json())
                    .then((res) => {
                      if (!res.customer)
                        return console.log(
                          "no customerId from vault-co.in/customer",
                          res
                        );
                      getDoc(
                        doc(
                          collection(firestore, "userDatas"),
                          this.props.auth.uid
                        )
                      )
                        .then((d) => {
                          const digits = String(trust.mcc).substring(0, 2);
                          //kv.invoice_prefix = store.invoice_prefix;
                          (d.exists() ? updateDoc : setDoc)(
                            doc(
                              collection(firestore, "userDatas"),
                              this.props.auth.uid
                            ),
                            {
                              [`customer${digits}Id`]: res.customer.id
                            }
                          )
                            .then(() => {})
                            .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
                        })
                        .catch((e) => standardCatch(e));
                    });
                }
              };
              var bypass = false;
              if (bypass)
                return noissuing(
                  {
                    error: {
                      raw: {
                        message:
                          "Issuing is only available in testmode for this account."
                      }
                    }
                  },
                  body.customer
                );
              return await fetch("https://vault-co.in/buy", {
                method: "POST",
                headers: {
                  "Content-Type": "Application/JSON",
                  "Access-Control-Request-Method": "POST",
                  "Access-Control-Request-Headers": ["Origin", "Content-Type"] //allow referer
                },
                body: JSON.stringify(body)
              })
                .then(async (res) => await res.json())
                .then(async (res) => {
                  if (!res.cardholder) {
                    return noissuing(res, body.customer);
                  }
                  getDoc(
                    doc(collection(firestore, "userDatas"), this.props.auth.uid)
                  )
                    .then((d) => {
                      const digits = String(trust.mcc).substring(0, 2);
                      //kv.invoice_prefix = store.invoice_prefix;
                      (d.exists() ? updateDoc : setDoc)(
                        doc(
                          collection(firestore, "userDatas"),
                          this.props.auth.uid
                        ),
                        {
                          [`cardholder${digits}Id`]: res.cardholder.id,
                          [`subscription${digits}Id`]: res.subscription.id
                        }
                      )
                        .then(() => {})
                        .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
                    })
                    .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
                });
              // { keyvalue },"firestore store id (then callback)"
              //plaidLink payouts account.details_submitted;
            }}
          />
        )}

        {this.state.selectThisOne && linksure(this.state.selectThisOne) && (
          <a href={linksure(this.state.selectThisOne)}>Reset link</a>
        )}
        {this.state.selectThisOne &&
          linksure(this.state.selectThisOne, "custom") && (
            <a href={linksure(this.state.selectThisOne, "custom")}>
              Reset link
            </a>
          )}

        <div
          style={{
            fontSize: "12px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {myStripeAccounts.map((x) => {
            const custom = user && user[`stripecustom${shorter(x.mcc)}Id`];
            const filler = this.state.usecustom ? "custom" : "";
            /* cardholderId: user[`cardholder${shtr}Id`],
            accountId: user[`stripe${shtr}Id`],
            link: user[`stripe${shtr}Link`]*/
            //console.log(tru, x.mcc, this.state);
            const tru = user && user[`stripe${filler + shorter(x.mcc)}Id`];

            const color =
              x.mcc === "7999"
                ? "firebrick"
                : x.mcc === "5046"
                ? "black"
                : x.mcc === "1520"
                ? "dodgerblue"
                : x.mcc === "8398" //6540
                ? "darkorchid"
                : x.mcc === "8099"
                ? tru
                  ? "yellowgreen"
                  : "forestgreen"
                : x.mcc === "8299"
                ? tru
                  ? "rgb(220,210,110)"
                  : "chocolate"
                : "black";
            //const issuing = x.capabilities && x.capabilities.card_issuing;
            const issuing = user && user[`cardholder${shorter(x.mcc)}Id`];
            return (x.mcc === "8398" ||
              (user && user[`stripe${filler}83Id`] && x.mcc === "7011") ||
              (user &&
                user[`stripe${filler}83Id`] &&
                user[`stripe${filler}70Id`] &&
                ["8099", "8299"].includes(
                  x.mcc
                ))) /*||
              (user &&
                user[`stripe83Id`] &&
                user[`stripe70Id`] &&
                user[`stripe82Id`] &&
                x.mcc === "8099")*/ &&
              ((!this.state.selectThisOne && !this.state.requestBuyer) ||
                this.state.selectThisOne === x.mcc ||
                this.state.requestBuyer === x.mcc) ? (
              <div
                key={x.mcc + "account"}
                style={{
                  height: "min-content",
                  opacity: tru ? 1 : 0.7,
                  transition: ".3s ease-in",
                  fontWeight: tru ? "bolder" : "",
                  color: tru ? "white" : color,
                  backgroundColor: tru && color,
                  margin: "2px",
                  padding: tru && "4px 6px",
                  border:
                    "1px " +
                    (!tru || this.state.requestBuyer === x.mcc
                      ? "dotted "
                      : "solid ") +
                    (user && user[`customer${shorter(x.mcc)}Id`]
                      ? "black"
                      : color)
                }}
              >
                {custom && (
                  <select
                    onChange={(e) =>
                      this.setState({
                        usecustom: e.target.value === "issuing",
                        balance: false
                      })
                    }
                  >
                    {["standard", "issuing"].map((x) => (
                      <option>{x}</option>
                    ))}
                  </select>
                )}

                <div onClick={() => makeAccount(x)}>
                  {(x.mcc === "5046" ? "-80% " : "") +
                    x.account +
                    space +
                    `(${x.mcc})`}
                  <span
                    role="img"
                    aria-label="card"
                    style={{
                      display: issuing ? "block" : "none",
                      opacity: issuing === "pending" ? 0.5 : 1
                    }}
                  >
                    💳
                  </span>
                </div>
                <div style={{ display: "flex" }}>
                  {this.state.selectThisOne && tru && (
                    <div>
                      <div
                        style={{
                          margin: "10px",
                          padding: "6px",
                          color: !tru ? "white" : color,
                          textDecoration: "underline",
                          backgroundColor: "white"
                        }}
                        onClick={async () => {
                          await fetch("https://vault-co.in/balance", {
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
                              storeId:
                                user[`stripe${filler + shorter(x.mcc)}Id`]
                            })
                          }) //stripe account, not plaid access token payout yet
                            .then(async (res) => await res.json())
                            .then(async (result) => {
                              if (result.status) return console.log(result);
                              if (result.error) return console.log(result);
                              if (!result.balance)
                                return console.log("dev error (Cash)", result);
                              console.log(result.balance.available[0].amount);
                              //[`balance${filler + shorter(x.mcc)}`]
                              this.setState({
                                balance: result.balance.available[0].amount
                              });
                            })
                            .catch(standardCatch);
                        }}
                      >
                        View Balance{space}-{space}
                        {this.state.balance}
                      </div>
                      <div
                        style={{
                          display:
                            this.state.balance.constructor === Number
                              ? "flex"
                              : "none",
                          width: "100%",
                          justifyContent: "space-between"
                        }}
                      >
                        <div
                          style={{
                            marginBottom: "10px"
                          }}
                          onClick={async () => {
                            await fetch("https://vault-co.in/payout", {
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
                                total: this.state.balance,
                                storeId:
                                  user[`stripe${filler + shorter(x.mcc)}Id`]
                              })
                            }) //stripe account, not plaid access token payout yet
                              .then(async (res) => await res.json())
                              .then(async (result) => {
                                if (result.status) return console.log(result);
                                if (result.error) return console.log(result);
                                if (!result.payout)
                                  return console.log(
                                    "dev error (Cash)",
                                    result
                                  );
                                console.log("payout", result.payout);
                                window.alert(
                                  "You'll receive your funds in your external account within a business week."
                                );
                              })
                              .catch(standardCatch);
                          }}
                        >
                          payout
                        </div>
                        {this.state.list.length === 0
                          ? "none"
                          : this.state.list.length}
                        {user &&
                          user[
                            `micro${
                              filler + shorter(this.state.selectThisOne)
                            }Link`
                          ] && (
                            <a
                              style={{ color: "white" }}
                              href={
                                user[
                                  `micro${
                                    filler + shorter(this.state.selectThisOne)
                                  }Link`
                                ]
                              }
                            >
                              Verify
                            </a>
                          )}
                      </div>
                      {this.state.balance.constructor === Number && (
                        <div>
                          <select
                            //value={this.state.payoutType}
                            onChange={(e) => {
                              if (this.state.payoutType !== e.target.value)
                                this.setState(
                                  { payoutType: e.target.value },
                                  () => {
                                    //if ("" === e.target.value) return null;

                                    this.list(
                                      e.target.value === "bank"
                                        ? "us_bank_account"
                                        : "card",
                                      user[
                                        `customer${shorter(
                                          this.props.selectThisOne
                                        )}Id`
                                      ]
                                    );
                                  }
                                );
                            }}
                          >
                            {["list my accounts", "bank", "card"].map((x) => {
                              return <option key={x + "payout"}>{x}</option>;
                            })}
                          </select>
                          {this.state.list.map((x) => {
                            const brand =
                              x[
                                this.state.payoutType === "Bank"
                                  ? "us_bank_account"
                                  : "card"
                              ].brand;
                            return <div>{brand}</div>;
                          })}
                        </div>
                      )}

                      {this.state.balance.constructor === Number && (
                        <div
                          style={{ backgroundColor: "white", color: "black" }}
                        >
                          {this.state.clientSecret && (
                            <div>
                              <Elements
                                stripe={this.props.stripePromise}
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
                                    /*this.state.stripe !== stripe &&
                                      this.setState({
                                        stripe,
                                        elements
                                      });*/
                                    return (
                                      stripe &&
                                      (() => {
                                        return (
                                          <form
                                            onSubmit={async (e) => {
                                              e.preventDefault();
                                              e.stopPropagation();

                                              if (!stripe || !elements)
                                                return null;

                                              //elements.submit();
                                              /*const cardResult = await stripe.tokens.create({
                                                card: {
                                                  number: "4242424242424242",
                                                  exp_month: 5,
                                                  exp_year: 2024,
                                                  cvc: "314"
                                                }
                                              });*/
                                              const payment_method = {
                                                us_bank_account: {
                                                  //country: user.address.country,
                                                  //currency: "USD",
                                                  account_holder_type: this
                                                    .state.account_holder_type,
                                                  account_number: this.state
                                                    .account_number,
                                                  //account_type: this.state.account_type,
                                                  routing_number: this.state
                                                    .routing_number
                                                },
                                                billing_details: {
                                                  address: user.address,
                                                  phone: this.props.auth
                                                    .phoneNumber,
                                                  name:
                                                    user.first +
                                                    this.state.middle +
                                                    user.last,
                                                  email: this.props.auth.email
                                                }
                                              };

                                              stripe //collectBankAccountForSetup
                                                .confirmUsBankAccountSetup(
                                                  /*{
                                                    clientSecret: this.state
                                                      .clientSecret,

                                                    params: {
                                                      payment_method_type:
                                                        "us_bank_account",
                                                      payment_method_data: {
                                                        billing_details: {
                                                          name:
                                                            user.first +
                                                            " " +
                                                            user.last,
                                                          email: this.props.auth
                                                            .email
                                                        }
                                                      }
                                                    },
                                                    expand: ["payment_method"]
                                                  }*/
                                                  this.state.clientSecret, //"{SETUP_INTENT_CLIENT_SECRET}",
                                                  {
                                                    payment_method
                                                  }
                                                  //https://stripe.com/docs/js/setup_intents/confirm_us_bank_account_setup#stripe_confirm_us_bank_account_setup-attached_payment_method
                                                )
                                                .then(async (result) => {
                                                  if (result.error) {
                                                    // Inform the customer that there was an error.
                                                    console.log(
                                                      result.error.message
                                                    );
                                                  } else {
                                                    // Handle next step based on SetupIntent's status.
                                                    const {
                                                      status,
                                                      id
                                                    } = result.setupIntent;
                                                    if (
                                                      status ===
                                                      "requires_action"
                                                    ) {
                                                      console.log(
                                                        "status",
                                                        status
                                                      );
                                                      stripe
                                                        .handleNextAction({
                                                          clientSecret: this
                                                            .state.clientSecret
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
                                                            result.setupIntent
                                                              .next_action
                                                              .verify_with_microdeposits
                                                              .hosted_verification_url;
                                                          updateDoc(
                                                            doc(
                                                              collection(
                                                                firestore,
                                                                "userDatas"
                                                              ),
                                                              this.props.auth
                                                                .uid
                                                            ),
                                                            {
                                                              [`micro${shorter(
                                                                this.state
                                                                  .selectThisOne
                                                              )}Link`]: microlink
                                                            }
                                                          )
                                                            .then(async () => {
                                                              await fetch(
                                                                "https://vault-co.in/attach",
                                                                {
                                                                  method:
                                                                    "POST",
                                                                  headers: {
                                                                    "Content-Type":
                                                                      "Application/JSON",
                                                                    "Access-Control-Request-Method":
                                                                      "POST",
                                                                    "Access-Control-Request-Headers": [
                                                                      "Origin",
                                                                      "Content-Type"
                                                                    ] //allow referer
                                                                  },
                                                                  body: JSON.stringify(
                                                                    {
                                                                      ...payment_method,
                                                                      customerId:
                                                                        user[
                                                                          `customer${shorter(
                                                                            this
                                                                              .state
                                                                              .selectThisOne
                                                                          )}Id`
                                                                        ]
                                                                    }
                                                                  )
                                                                }
                                                              )
                                                                .then(
                                                                  async (res) =>
                                                                    await res.json()
                                                                )
                                                                .then(
                                                                  async (
                                                                    res
                                                                  ) => {
                                                                    if (
                                                                      !res.setupIntent
                                                                    )
                                                                      return console.log(
                                                                        "dev error ",
                                                                        res
                                                                      );
                                                                    const clientSecret =
                                                                      res
                                                                        .setupIntent
                                                                        .client_secret;
                                                                    if (
                                                                      clientSecret
                                                                    )
                                                                      this.setState(
                                                                        {
                                                                          clientSecret
                                                                        }
                                                                      );
                                                                  }
                                                                );
                                                            })
                                                            .catch((e) =>
                                                              standardCatch(e)
                                                            );

                                                          window.location.href = microlink;
                                                        });
                                                    } else {
                                                      console.log(
                                                        "ok confirmed setup"
                                                      );
                                                      if (
                                                        status ===
                                                        "requires_payment_method"
                                                      ) {
                                                        // Customer canceled the hosted verification modal. Present them with other
                                                        // payment method type options.
                                                      } else if (
                                                        status ===
                                                        "requires_confirmation"
                                                      ) {
                                                        // We collected an account - possibly instantly verified, but possibly
                                                        // manually-entered. Display payment method details and mandate text
                                                        // to the customer and confirm the intent once they accept
                                                        // the mandate.
                                                        window.alert(
                                                          "confirming setup"
                                                        );

                                                        const {
                                                          error
                                                        } = await stripe.confirmSetup(
                                                          {
                                                            clientSecret: this
                                                              .state
                                                              .clientSecret,
                                                            //`Elements` instance that was used to create the Payment Element
                                                            elements,
                                                            confirmParams: {
                                                              return_url: `https://${window.location.hostname}`
                                                            }
                                                          }
                                                        );
                                                        if (error)
                                                          return console.log(
                                                            "confirm Setup",
                                                            error
                                                          );
                                                      }
                                                    }
                                                  }
                                                });
                                              /*var cardElement = elements.getElement(
                                                "card"
                                              );
                                              const cardResult = await stripe.createToken(
                                                cardElement
                                              );
                                              cardResult &&
                                                this.props.submit(
                                                  cardResult,
                                                  async (clientSecret) => {
                                                    const {
                                                      error
                                                    } = await stripe.confirmPayment(
                                                      {
                                                        clientSecret,
                                                        //`Elements` instance that was used to create the Payment Element
                                                        elements,
                                                        confirmParams: {
                                                          return_url: `https://${window.location.hostname}/thanks`
                                                        }
                                                      }
                                                    );
                                                    if (error)
                                                      return console.log(error);
                                                    window.alert(
                                                      "You've paid " +
                                                        this.state.amount +
                                                        " to "
                                                    );
                                                  }
                                                );*/
                                            }}
                                          >
                                            <PaymentElement />
                                            <button type="submit">
                                              Submit
                                            </button>
                                          </form>
                                        );
                                      })()
                                    );
                                  }}
                                </ElementsConsumer>
                              </Elements>
                            </div>
                          )}
                          {user[
                            `customer${shorter(this.state.selectThisOne)}Id`
                          ] && (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
                                    bankcard: "us_bank_account",
                                    customerId:
                                      user[
                                        `customer${shorter(
                                          this.state.selectThisOne
                                        )}Id`
                                      ]
                                  })
                                })
                                  .then(async (res) => await res.json())
                                  .then(async (res) => {
                                    if (!res.setupIntent)
                                      return console.log("dev error ", res);
                                    const clientSecret =
                                      res.setupIntent.client_secret;
                                    if (clientSecret)
                                      this.setState({ clientSecret });
                                  });
                              }}
                              style={{
                                margin: "4px"
                              }}
                            >
                              <select
                                onChange={(e) =>
                                  this.setState({
                                    account_holder_type: e.target.value
                                  })
                                }
                              >
                                {["individual", "company"].map((x) => {
                                  return <option>{x}</option>;
                                })}
                              </select>
                              <input
                                style={{
                                  width: "140px"
                                }}
                                required={true}
                                placeholder="account"
                                value={this.state.account_number}
                                onChange={(e) =>
                                  this.setState({
                                    account_number: e.target.value
                                  })
                                }
                              />
                              <select
                                onChange={(e) =>
                                  this.setState({
                                    savings: e.target.value
                                  })
                                }
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
                                style={{
                                  width: "100px"
                                }}
                                required={true}
                                placeholder="routing"
                                value={this.state.routing_number}
                                onChange={(e) =>
                                  this.setState({
                                    routing_number: e.target.value
                                  })
                                }
                              />
                              <button type="submit">add bank</button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {this.state.balance.constructor === Number &&
                    user &&
                    user[`stripe${shorter(this.state.selectThisOne)}Id`] && (
                      <div
                        onClick={async () => {
                          if (this.state.balance > 0)
                            return window.alert(
                              "Please payout your balance before deleting your account."
                            );
                          const answer = window.confirm(
                            "Are you sure? You'll have to remake the account."
                          );
                          if (answer)
                            this.deleteThese(
                              [
                                user[
                                  `customer${shorter(
                                    this.state.selectThisOne
                                  )}Id`
                                ]
                              ],
                              [
                                user[
                                  `stripe${
                                    filler + shorter(this.state.selectThisOne)
                                  }Id`
                                ]
                              ]
                            );
                          updateDoc(
                            doc(firestore, "users", this.props.auth.uid),
                            {
                              [`cardholder${shorter(
                                this.state.selectThisOne
                              )}Id`]: deleteField(),
                              [`customer${shorter(
                                this.state.selectThisOne
                              )}Id`]: deleteField(),
                              [`subscription${shorter(
                                this.state.selectThisOne
                              )}Id`]: deleteField(),
                              [`stripe${
                                filler + shorter(this.state.selectThisOne)
                              }Id`]: deleteField()
                            }
                          ).then(() => {
                            window.location.reload();
                          });
                        }}
                      >
                        &times;
                      </div>
                    )}
                </div>
              </div>
            ) : null;
          })}
        </div>
        <div id="card-number" />
        <div id="card-expiry" />
        <div id="card-cvc" />
        {noAccountYetArray && (
          <span
            onClick={() =>
              this.setState({
                selectThisOne: null,
                requestBuyer: null,
                balance: false
              })
            }
            style={{
              textDecoration: this.state.selectThisOne ? "underline" : "none",
              fontSize: "12px",
              color:
                noAccountYetArray.length > 3
                  ? "black"
                  : noAccountYetArray.length > 2
                  ? "darkslateblue"
                  : noAccountYetArray.length > 1
                  ? "grey"
                  : "lightgray"
            }}
          >
            {this.state.selectThisOne && "<"}
            {noAccountYetArray.length + space}to make
            {/*space}
            <span
              style={{
                border: "1px solid grey",
                padding: "2px",
                borderRadius: "6px" //Click for details
              }}
            >
              Stored Value
            </span>
            {space +
              (myStripeAccounts.length - noAccountYetArray.length) +
              space}
            made*/}
          </span>
        )}
        {this.state.chosenAccountDetail &&
          this.state[this.state.chosenAccountDetail]}
        <div style={{ padding: "6px 0px", backgroundColor: "cadetblue" }}>
          <a
            style={{ color: "linen" }}
            href="https://stripe.com/legal/issuing/celtic/spend-card-terms-and-disclosures"
          >
            Celtic Bank member FDIC Issuance
          </a>
        </div>
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Cash {...props} {...ref.current} />
));

/**
 * 
            submit={async (cardResult, cb) => {
              const { openPaymentSecure: trust } = this.state;
              const { address: addr, first, last } = user;
              if (
                user[`stripecustom${shorter(trust.mcc)}Id`] &&
                user[`stripecustom${shorter(trust.mcc)}Link`]
              )
                return console.log("must authorize stripecustom"); //open to yet address

              const address = Object.keys(paymentItems.billing_details)
                .map((x) => {
                  //console.log(remaining, event.value.address[next]);
                  return paymentItems.billing_details[x]
                    ? {
                        [x]: paymentItems.billing_details[x]
                      }
                    : "";
                })
                .filter((x) => x !== "")
                .reduce(function (result, current) {
                  return Object.assign(result, current);
                }, {});
              const personal = {
                address,
                phone: this.props.auth.phoneNumber,
                name:
                  paymentItems.first + paymentItems.middle + paymentItems.last,
                email: this.props.auth.email
              };
              await fetch("https://vault-co.in/paynow", {
                method: "POST",
                headers: {
                  "Access-Control-Request-Method": "POST",
                  "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
                  "Content-Type": "Application/JSON"
                },
                body: JSON.stringify({
                  card: {
                    payment_token: cardResult.token.id
                  },
                  storeId: "acct_1NAchIGbvxLpUMRX",
                  type:
                    this.state.payoutType === "bank" ? "bank_account" : "card",
                  //paymentMethod: x.id,
                  //customerId: user[`customer${sht}Id`],
                  //storeId: this.state.chosenRecipient[`stripe83Id`],
                  currency: "usd",
                  total: 2.99 + "00",
                  //...bankcard
                  ...personal
                })
              }) //stripe account, not plaid access token payout yet
                .then(async (res) => await res.json())
                .then(async (result) => {
                  const clientSecret = result.paymentIntent.client_secret;
                  if (!clientSecret) return console.log(`dev error`, result);
                  if (!user[`stripecustom${shorter(trust.mcc)}Id`]) {
                    const payments = true;
                    purchase(trust, payments);
                  }
                  /*if (!addr)
          //no need emailCallback? while user[`stripeId`]&&!user[`stripeLink`]
          return this.setState({ openFormSecure: true });* /

          const address = Object.keys(addr)
          .map((x) => {
            //console.log(remaining, event.value.address[next]);
            return addr[x]
              ? {
                  [x]: addr[x]
                }
              : "";
          })
          .filter((x) => x !== "")
          .reduce(function (result, current) {
            return Object.assign(result, current);
          }, {});

        var edit = {
          //authorId: this.props.auth.uid,
          mcc: trust.mcc,
          last,
          email: this.props.auth.email,
          //address: auth.address,
          name: first + " " + last,
          phone: this.props.auth.phoneNumber,
          shipping: {
            address,
            name: first + " " + last,
            phone: this.props.auth.phoneNumber
          },
          address,
          description: trust.description
        };
        /*setDoc(
doc(
  collection(firestore, "customers"),
  trust.mcc + this.props.auth.uid
),
edit
).then(() => {* /
var cardholder = {
  //cardholderId:user[`cardholderId${shorter(trust.mcc)}Id`],
  //authorId: this.props.auth.uid,
  mcc: trust.mcc,
  name: first + " " + last,
  email: this.props.auth.email,
  phone_number: this.props.auth.phoneNumber,
  status: "active",
  type: "individual",
  individual: {
    first_name: first,
    last_name: last
  },
  billing: {
    address
  }
};
/*setDoc(
  doc(
    collection(firestore, "cardholders"),
    trust.mcc + this.props.auth.uid
  ),
  cardholder
).then(async (docRef) => {* /
        //no need to get ref.id
        //neither for prefix count
        //nor customer + cardholder
        //try and userDatas update
        const merchantSurnamePrefix =
          user.address.country +
          String(this.state.selectThisOne).substring(0, 2) +
          edit.last.substring(0, 3).toLocaleUpperCase();
        const totalMerchantSurnames = await getDoc(
          doc(
            collection(firestore, "merchantSurnames"),
            merchantSurnamePrefix
          )
        )
          .then((dx) => {
            (dx.exists() ? updateDoc : setDoc)(
              doc(
                collection(firestore, "merchantSurnames"),
                merchantSurnamePrefix
              ),
              { count: increment(1) }
            );
            return { ...dx.data(), id: dx.id }.count + 1;
          })
          .catch((err) => {
            console.log(
              "surname update,set, or get failure: ",
              err.message
            );
            return err;
          });
        if (
          !totalMerchantSurnames ||
          totalMerchantSurnames.constructor !== Number
        )
          return window.alert(
            "dev error (no document can be made): ",
            totalMerchantSurnames
          );
        const invoice_prefix =
          merchantSurnamePrefix + totalMerchantSurnames;
        delete edit.authorId;
        delete edit.mcc;
        delete edit.last;

        delete cardholder.authorId;
        delete cardholder.mcc;

        const { paymentItems } = this.state;
        const expiry = paymentItems.expiry.split("/");
        const addressToPay = Object.keys(paymentItems.billing_details)
          .map((x) => {
            //console.log(remaining, event.value.address[next]);
            return paymentItems.billing_details[x]
              ? {
                  [x]: paymentItems.billing_details[x]
                }
              : "";
          })
          .filter((x) => x !== "")
          .reduce(function (result, current) {
            return Object.assign(result, current);
          }, {});
        const personal = {
          address: addressToPay,
          phone: this.props.auth.phoneNumber,
          name:
            paymentItems.first +
            paymentItems.middle +
            paymentItems.last,
          email: this.props.auth.email
        };
        const bankcard =
          this.state.payoutType !== "bank"
            ? {
                primary: paymentItems.number,
                exp_month: expiry[0],
                exp_year: expiry[1],
                cvc: paymentItems.cvc,
                //cardElement
                ...personal
              }
            : {
                //country: user.address.country,
                //currency: "USD",
                company: paymentItems.account_holder_type,
                account: paymentItems.account_number,
                //account_type: this.state.account_type,
                routing: paymentItems.routing_number,
                savings: paymentItems.savings,

                ...personal
              };
        const body = {
          type:
            this.state.payoutType === "bank"
              ? "us_bank_account"
              : "card",
          customer: {
            ...edit,
            invoice_prefix
            //type: "physical"
          },
          cardholder,
          ...bankcard
        };
        //return console.log(body)
        const issuing = async (cardholder) => {
          return await fetch("https://vault-co.in/cardholder", {
            method: "POST",
            headers: {
              "Content-Type": "Application/JSON",
              "Access-Control-Request-Method": "POST",
              "Access-Control-Request-Headers": [
                "Origin",
                "Content-Type"
              ] //allow referer
            },
            body: JSON.stringify(cardholder)
          })
            .then(async (res) => await res.json())
            .then((res) => {
              if (!res.customer)
                return console.log(
                  "no customerId from vault-co.in/customer",
                  res
                );
              getDoc(
                doc(
                  collection(firestore, "userDatas"),
                  this.props.auth.uid
                )
              )
                .then((d) => {
                  const digits = String(trust.mcc).substring(0, 2);
                  //kv.invoice_prefix = store.invoice_prefix;
                  (d.exists() ? updateDoc : setDoc)(
                    doc(
                      collection(firestore, "userDatas"),
                      this.props.auth.uid
                    ),
                    {
                      [`cardholder${digits}Id`]: res.customer.id
                    }
                  )
                    .then(() => {})
                    .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
                })
                .catch((e) => standardCatch(e));
            });
        };

        if (user[`customer${shorter(trust.mcc)}Id`])
          return issuing(cardholder);
        const noissuing = async (res, customer) => {
          console.log(
            "no customerId+cardholerId from vault-co.in/buy",
            res
          );

          if (
            res.error.raw.message ===
            "Issuing is only available in testmode for this account."
          )
            return await fetch("https://vault-co.in/customer", {
              method: "POST",
              headers: {
                "Content-Type": "Application/JSON",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": [
                  "Origin",
                  "Content-Type"
                ] //allow referer
              },
              body: JSON.stringify(customer)
            })
              .then(async (res) => await res.json())
              .then((res) => {
                if (!res.customer)
                  return console.log(
                    "no customerId from vault-co.in/customer",
                    res
                  );
                getDoc(
                  doc(
                    collection(firestore, "userDatas"),
                    this.props.auth.uid
                  )
                )
                  .then((d) => {
                    const digits = String(trust.mcc).substring(0, 2);
                    //kv.invoice_prefix = store.invoice_prefix;
                    (d.exists() ? updateDoc : setDoc)(
                      doc(
                        collection(firestore, "userDatas"),
                        this.props.auth.uid
                      ),
                      {
                        [`customer${digits}Id`]: res.customer.id
                      }
                    )
                      .then(() => {})
                      .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
                  })
                  .catch((e) => standardCatch(e));
              });
        };
        var bypass = false;
        if (bypass)
          return noissuing(
            {
              error: {
                raw: {
                  message:
                    "Issuing is only available in testmode for this account."
                }
              }
            },
            body.customer
          );
        return await fetch("https://vault-co.in/buy", {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": [
              "Origin",
              "Content-Type"
            ] //allow referer
          },
          body: JSON.stringify(body)
        })
          .then(async (res) => await res.json())
          .then(async (res) => {
            if (!res.customer || !res.cardholder) {
              return noissuing(res, body.customer);
            }
            getDoc(
              doc(
                collection(firestore, "userDatas"),
                this.props.auth.uid
              )
            )
              .then((d) => {
                const digits = String(trust.mcc).substring(0, 2);
                //kv.invoice_prefix = store.invoice_prefix;
                (d.exists() ? updateDoc : setDoc)(
                  doc(
                    collection(firestore, "userDatas"),
                    this.props.auth.uid
                  ),
                  {
                    [`customer${digits}Id`]: res.customer.id,
                    [`cardholder${digits}Id`]: res.cardholder.id,
                    [`subscription${digits}Id`]: res.subscription.id
                  }
                )
                  .then(() => {
                    cb(clientSecret);
                  })
                  .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
              })
              .catch((e) => standardCatch(e)); //plaidLink payouts account.details_submitted;
          });
        // { keyvalue },"firestore store id (then callback)"
        //plaidLink payouts account.details_submitted;
      });
  }}
 */
