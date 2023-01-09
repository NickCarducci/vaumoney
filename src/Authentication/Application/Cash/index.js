import React from "react";
import NewBank from "./NewBank";
import firebase from "../.././init-firebase.js";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  arrayUnion,
  addDoc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  query,
  where,
  deleteDoc,
  getDocs,
  arrayRemove,
  orderBy,
  limit
} from "firebase/firestore";
import { standardCatch } from "../../Sudo";
import { usePlaidLink } from "react-plaid-link";

class ListedTransactions extends React.Component {
  state = {}; //almostnever overflow height 100
  render() {
    if (!this.props.openListedTransations) return null;
    return (
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
    );
  }
}
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
class Operating extends React.Component {
  state = {};
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
        {/*<hr />
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
        </h3>*/}
      </div>
    );
  }
}
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
      token: ""
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
const firestore = getFirestore(firebase);
class Cash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteTries: 0,
      balance: 0,
      userQuery: "",
      currency: "USD",
      users: [],
      banks: [],
      billing_details: {
        name: "",
        city: "",
        country: "",
        line1: "",
        line2: "",
        district: "",
        postalCode: ""
      },
      bank_account_type: "retail",
      openBankType: "login",
      bank_address: {
        bankName: "",
        city: "",
        country: "",
        line1: "",
        line2: "",
        district: ""
      }
    };
    this.stinker = React.createRef();
  }
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
      }*/
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
  componentWillUnmount = () => {
    clearInterval(this.loading);
    this.state.unmountPlaid && this.state.unmountPlaid();
  };

  render() {
    const vaumoneyOpen = true;
    const tryDelete = async (x) => {
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
      }
    };
    //console.log(this.state.users);
    const submitBank = () => {
      //https://plaid.com/docs/link/web/
      //https://plaid.com/docs/link/duplicate-items/
      fetch("https://vault-co.in/join", {
        "Content-Type": "Application/JSON",
        Accept: "Application/JSON"
      }) //access token
        .then(async (res) => await res.json())
        .then((result) => {
          const config = {
            onSuccess: (public_token, metadata) => {
              fetch("https://vault-co.in/secure", {
                "Content-Type": "Application/JSON",
                Accept: "Application/JSON",
                body: JSON.stringify({
                  access_token: result.data.access_token,
                  plaid_processor_token: public_token,
                  bank_account_type: this.state.bank_account_type,
                  billing_details: {
                    name: this.state.billing_details.name,
                    city: this.state.billing_details.city,
                    country: this.state.billing_details.country,
                    line1: this.state.billing_details.line1,
                    line2: this.state.billing_details.line2,
                    district: this.state.billing_details.district,
                    postalCode: this.state.billing_details.postalCode
                  }
                })
              })
                .then(async (res) => await res.json())
                .then((result) => {
                  updateDoc(doc(firestore, "users", this.props.auth.uid), {
                    banks: arrayUnion("ach" + result.id)
                    //desist free content invokes usufructuary rights / responsibilities
                  }); //.catch(standardCatch);

                  this.setState({
                    bank_account_type: "retail",
                    openFormSecure: false,
                    billing_details: {
                      name: "",
                      city: "",
                      country: "",
                      line1: "",
                      line2: "",
                      district: "",
                      postalCode: ""
                    }
                  });
                })
                .catch(standardCatch);
              /*updateDoc(doc(firestore, "users", this.props.auth.uid), {
                        plaidtokens: arrayUnion(public_token)
                        //desist free content invokes usufructuary rights / responsibilities
                      });*/ //.catch(standardCatch);
            },
            onExit: (err, metadata) => {},
            onEvent: (eventName, metadata) => {},
            token: result.data.access_token, //'GENERATED_LINK_TOKEN',
            //required for OAuth; if not using OAuth, set to null or omit:
            receivedRedirectUri: window.location.href
          };
          const { open, exit, ready, destroy } = usePlaidLink(config);
          // Open Link
          if (ready) this.setState({ unmountPlaid: destroy }, () => open());
        })
        .catch(standardCatch);
    };
    return (
      <div
        style={{
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
          }}
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: "rgb(200,200,200)",
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
              this.state.revenueShow || this.state.expenseShow
                ? () =>
                    this.setState({ revenueShow: false, expenseShow: false })
                : this.state.userQuery.length > 0 && this.state.userQuery !== ""
                ? () => this.setState({ userQuery: "" })
                : this.props.emulateRoot // this.props.closeVaumoney
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
              zIndex: "3"
            }}
          >
            {"<"}
          </div>
          <input
            placeholder={
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
              `username ` +
              (this.props.prepared ? "or routing number" : "search")
            } //curiosity killed the cat not the glutton
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
                //congrats can't get cas fow without tbills
                //huh what investment to make money. oh data servers

                //just in time for party and camp client convenience truncatedwholesaletax.com
                //safety deposit box private EVM
                //robbery tho

                //i will get oil return and rights to drill per dollar to boot
                //the treasury banking system won't alow you to not invest in
                //we work more than older people did and we seek damages.
                //11/1 m2 to deeds of blm
              });
            }}
          />
          <div
            onClick={() => {
              if (!this.state.openFormSecure)
                return this.setState({ openFormSecure: true });
              const missing = Object.keys(this.state.billing_details).filter(
                (x) => this.state.billing_details[x] === ""
              );
              if (missing) return window.alert("missing " + missing);
              if (this.state.openBankType === "login") {
                submitBank();
              } else {
                var payload = {
                  bank_address: {
                    bankName: this.state.bank_address.bankName,
                    city: this.state.bank_address.city,
                    country: this.state.bank_address.country,
                    line1: this.state.bank_address.line1,
                    line2: this.state.bank_address.line2,
                    district: this.state.bank_address.district
                  },
                  billing_details: {
                    name: this.state.billing_details.name,
                    city: this.state.billing_details.city,
                    country: this.state.billing_details.country,
                    line1: this.state.billing_details.line1,
                    line2: this.state.billing_details.line2,
                    district: this.state.billing_details.district,
                    postalCode: this.state.billing_details.postalCode
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
                        name: "",
                        city: "",
                        country: "",
                        line1: "",
                        line2: "",
                        district: "",
                        postalCode: ""
                      },
                      bank_address: {
                        bankName: "",
                        city: "",
                        country: "",
                        line1: "",
                        line2: "",
                        district: ""
                      }
                    });
                  })
                  .catch(standardCatch);
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
              backgroundColor: "rgb(25,35,25)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "1",
              color: "white"
            }}
            //alt="err"
          >
            +
          </div>
        </form>
        <div
          style={{
            backgroundColor: "white",
            color: "rgb(25,35,25)",
            transition: ".3s ease-in",
            flexDirection: "column"
          }}
          /*if (
              x.username.includes(this.state.userQuery) &&
              (this.state.amount === "" ||
                x.id === this.state.usingUserAsRecipient)
            ) {*/
          //why do you want to keep jobs if they aren't inflationary by their unemployment?
          //nor deflationary by their employment
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
                {/*this.state.amount && !this.state.askIfRouting && (
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
                  )*/}
              </form>
            );
          })}
          {/*this.state.askIfRouting && this.state.receiverAccountNumber && (
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
              )*/}
        </div>
        {/*<div ref={this.stinker}>
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
          </div>*/}
        {this.state.openFormSecure && (
          <div>
            <div
              style={{
                display: "flex",
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
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: this.state.openFormSecure ? "" : "0px"
              }}
            >
              {this.state.openBankType === "login" ? (
                <select
                  value={this.state.bank_account_type}
                  onSelect={(e) => {
                    this.setState({ bank_account_type: e.target.value });
                  }}
                >
                  {["retail", "business"].map((x) => (
                    <option>{x}</option>
                  ))}
                </select>
              ) : (
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
                    id="district"
                    placeholder="district"
                  />
                </div>
              )}
              <b>personal</b>
              <input
                required={true}
                onSubmit={(e) => e.preventDefault()}
                id="name"
                placeholder="name"
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
                id="district"
                placeholder="district"
              />
              <input
                required={true}
                value={this.state.billing_details["postalCode"]}
                onChange={(e) =>
                  this.setState({
                    billing_details: {
                      ...this.state.billing_details,
                      [e.target.id]: e.target.value
                    }
                  })
                }
                onSubmit={(e) => e.preventDefault()}
                id="postalCode"
                placeholder="postalCode"
              />
            </form>
          </div>
        )}
        <Operating
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
          </div>*/}
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
        {this.props.user !== undefined && (
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
                  `https://cors-anywhere.herokuapp.com/https://api-sandbox.dwolla.com/token`,
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
        )}
        {this.props.user !== undefined && (
          <ListedTransactions
            openListedTransations={this.props.openListedTransations}
            auth={this.props.auth}
            transactions={this.props.transactions}
          />
        )}
        {/*this.props.user === undefined && (
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
          )*/}
      </div>
    );
  }
}
export default Cash;

/**
 * 
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
