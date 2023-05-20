import React from "react";
import FIREBASE_SUDO, { standardCatch } from "./FIREBASE_SUDO";
import Cash, { shorter } from "./Cash";
import Application from "./Application";
import S404 from "./404.js";
//​moving to work scapegoating
//work from home uniformity!
//you make inflation you pay with nest
//I like natural (equal and full measure, nairu)
//Do sole proprietors and partnerships or corporations alone report to pay taxes quarterly?
//​tax defered wills with maybe a tax free open source business
//Free association is the bane of corpus linguistics, property and labor are to be fiduciary-debenture stock, not collateral and down, nor escrow indemnity. Most of all, IRS agents are a waste of money for life only agents (with a fax number...)
// and geohash local sales tax for plaintiffs and consensus industry variable business permits.
//Couldn't physiological roles determine reason for diagnosing abnormal sociological ones? Is the fourth turning any less misogynistic than Jordan B. Peterson on chaos in his Biblical series lectures?
import {
  getFirestore,
  doc,
  onSnapshot,
  query,
  collection,
  where,
  getDocs
} from "firebase/firestore";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signOut
} from "firebase/auth";
import firebase from "./init-firebase.js";
import PromptAuth from "./PromptAuth.js"; //"react-local-firebase";
import Customs from "./Customs.js";
import Legal from "./Application/Legal";
import Stop from "./Stop";
import Documentation from "./Documentation";
import TwitterTweetEmbed from "../TwitterTweetEmbed";
import MicroVerify from "./Cash/MicroVerify";
import { loadStripe } from "@stripe/stripe-js";
import { specialFormatting } from "./Cash/Email";
import { countries } from "./Cash/countries";
import { states } from "./Cash/utils";
const stripePromise = loadStripe(
  "pk_test_51MTtNXGVa6IKUDzpbVag2vdLVm7bU8lfz3sCH0DmMLF9eAhqAJDNyxXxJLzZ2i0YyCkFRCcrjr0qMKD5eIEkLClB00GGdnmtDm"
  //"pk_live_51MTtNXGVa6IKUDzpzfh68EGc5WtnlPHrbihfLz6l4dOjYP9YSU6Sf2a50F1Jcb0iajYsYe6zqmPzbJMmT3RDb2OX00zhmtlWzf"
);
const forbiddenUsernames = [
  "event",
  "events",
  "club",
  "clubs",
  "shop",
  "shops",
  "restaurant",
  "restaurants",
  "service",
  "services",
  "dept",
  "department",
  "departments",
  "classes",
  "class",
  "oldclass",
  "oldclasses",
  "job",
  "jobs",
  "housing",
  "oldhome",
  "page",
  "pages",
  "venue",
  "venues",
  "forum",
  "posts",
  "post",
  "oldelection",
  "elections",
  "election",
  "case",
  "cases",
  "oldcase",
  "oldcases",
  "budget",
  "budgets",
  "oldbudget",
  "oldbudgets",
  "ordinance",
  "ordinances",
  "new",
  "news",
  "login",
  "logins",
  "doc",
  "docs",
  "private",
  "privacy",
  "legal",
  "terms",
  "term",
  "law",
  "laws"
];
const useCanComment = (moreSecure, moreMore, space = " ") => {
  return (
    <span>
      {space}
      <i style={{ color: "yellowgreen" }}>
        Are standardized guarantee schemes or merchant categorized partnerships
        legal?
      </i>
      {space}
      <span style={{ color: "palegreen" }}>
        Does a realty fee or collateral repossession foreclosure fail bank
        deposits?
      </span>
      {space}
      <i style={{ color: "peachpuff" }}>
        Is complementary demand and substitutive supply ethical or a right?
      </i>
      {space}
      <a
        style={{ color: "lightskyblue" }}
        href="https://www.quora.com/How-does-making-everyones-mortgage-more-expensive-help-to-reduce-inflation-that-was-caused-by-high-energy-prices/answer/Nick-Carducci"
      >
        Do limited merchant category codified partnerships or personal credit
        and final good accrual bankruptcy fail bank deposits?{space}
        <span style={{ color: "lightseagreen" }}>
          Does unemployment, repossession, or bankruptcy cause the open market
          bond yield fair values to be subpar their issued interest rates for
          relatively longer duration convenience yields? Isn’t the government
          the best suited to handle duration risk?{space}
          <span style={{ color: "mediumpurple" }}>
            Should the government reverse amortize income by the annual cash to
            debt ratio or tax back its debt by merchant category code?
          </span>
        </span>
        {space}
        <i style={{ color: "orchid" }}>
          Can I keep foreclosed property equity above general interest principal
          or afford the borrower the opportunity to either refinance at the
          lower price if the real estate market crashes before repossessing or
          arrange a merchant category payday loan?
        </i>
      </a>
      {space}
      <span style={{ color: "pink" }}>
        Is retirement, tax advantaged primary residence expense{space}
        <span
          style={{
            color: "indianred"
          }}
        >
          and{space}
          <i>plausible</i>
          {space}use rental income accounting, or{space}
          <a
            href="https://nickcarducci.com/bachelors"
            style={{ color: "linen" }}
          >
            public school teaching
          </a>
          {space}about societal control?
        </span>
        {space}
        <span style={{ color: "linen" }}>
          Are nonprofits evil because the ownership cannot go into a limited
          partnership or because{space}
          <a href="https://lightte.ch" style={{ color: "white" }}>
            the government currency uses (and benefits by sale from) the product
            (Do beneficiaries just spend benefactors’ production or productivity
            too?)
          </a>
          {space}instead of{space}
          <a href="https://socialtreaty.ru" style={{ color: "white" }}>
            taxes
          </a>
          ?
        </span>
      </span>
      {space}Is standardized, rolling, and custom escrow or usual practitioner
      duty to the public state of the art of interest to the vested customer,
      producer, and bystanders in the community?{space}
      <span style={{ color: "tan" }}>
        Are intertemporal standardized insurance guarantee schemes or liquid
        stock of land capital and goods the stuff in part of market-based
        economies?
      </span>
      {space}
      <i style={{ color: "darkorange" }}>
        Can you have more than one indebted business in each industry merchant
        category?
      </i>
      {space}
      <span style={{ color: "sandybrown" }}>
        Does a country’s treasury issue bills and notes or just bonds so central
        bank convenience yields are due to the duration risk across maturities
        that the government can uniquely capitalize on safely?{space}
        <span style={{ color: "orange" }}>
          Do shorter or longer termed maturities gain a convenience yield from
          default risk covered by treasury share buybacks?
        </span>
        {space}
        <span style={{ color: "lightsalmon" }}>
          Do interest rates become more valuable as convenience yields cost less
          from fair value?
          {space}
          <span style={{ color: "burlywood" }}>
            Does the federal reserve purchase at the longer end of the open
            market bond yield curve because the interest rates have the best par
            value regardless of duration?
            {space}
            <span style={{ color: "palevioletred" }}>
              Isn't utility valued by marginal use and measured by material
              benefit?
              {space}
              <span style={{ color: "darksalmon" }}>
                Is duration risk valued by interest or term default risk?{space}
                <span style={{ color: "orangered" }}>
                  Isn't a convenience yield the maturity value of duration risk?
                  {space}
                  <span style={{ color: "tomato" }}>
                    Isn't a convenience yield maturity value and duration risk
                    like the gross domestic purchases of a country are income
                    and cost?
                  </span>
                  {space}
                  <span style={{ color: "coral" }}>
                    Is standardized guarantee and general interest principal or
                    merchant codified payday immediate?{space}
                    <span style={{ color: "plum" }}>
                      Is the convenience yield of maturity a discount from a
                      factor of production or a loss in excess of costs to
                      material benefit and leisure resource productivity?{space}
                      <span style={{ color: "orchid" }}>
                        Does the open market for merchant codified payday loans
                        or bonds sell subpar for a loss?{space}
                        <span style={{ color: "lavender" }}>
                          Why doesn’t the federal reserve allow Nick Carducci to
                          make a bank that doesn’t lend deposits but rather
                          takes fees?
                          {space}
                          <span>
                            Shouldn't the government tokenize anonymous
                            identities for app developers already? Do you want
                            an anonymous virtual identity provider API so that
                            some audience members aren't more valuable than
                            others, even though limited testamentary trusts are
                            community property anyway? Do brokers need to know
                            the identity of account holders to facilitate day
                            trading? If implemented, shouldn't a convict
                            intranet host a non-anonymous virtual identity
                            provider API too already for confidential computing
                            and day trading?{space}
                            <i>
                              Shouldn’t Congress host an open descending longest
                              time since the last action legislation API
                              already?
                            </i>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
      {space}
      <span
        style={{
          transition: ".3s ease-in",
          fontSize: moreSecure ? "" : "0px"
        }}
      >
        <button
          style={{
            float: "right",
            margin: "4px 10px"
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            this.setState({
              moreSecure: !moreSecure
            });
          }} /*type="submit"*/
        >
          security
        </button>
        secure your account with consensus in the cloud. I'm trying to look to
        content secure by allow-list c̶o̶n̶s̶e̶n̶s̶u̶s̶ hullabaloo with node Ethereum
        records{space}
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="https://ethereum.stackexchange.com/questions/65426/is-it-possible-to-tell-which-node-broadcast-a-transaction"
        >
          778
        </a>
        . I've found the RLPReader library, and{space}
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="https://www.mdpi.com/1999-5903/12/8/134"
        >
          an implementation
        </a>
        , but not how to get this base64 binary from{space}
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="https://docs.soliditylang.org/en/v0.5.3/miscellaneous.html?highlight=tx.origin#global-variables"
        >
          any global variable
        </a>
        {space}yet.
      </span>
      <span
        style={{
          transition: ".3s ease-in",
          fontSize: moreMore ? "" : "0px"
        }}
      >
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="https://thetax.party"
        >
          Tax-prep
        </a>
        ,{space}
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="https://islamicbanks.quora.com"
        >
          fee-based
        </a>
        ,{space}
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="https://scopes.cc"
        >
          contract stewardship
        </a>
        , TENTATIVELY credit cash advance{space}
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="https://bankingisnot.biz"
        >
          <span role="img" aria-label="sick gulp exhaustion">
            🤢😑😦
          </span>
        </a>
        . If anyone works at the Office of the Comptroller of the Currency who
        would like to 12.1.5 sponsor vau.money Bank Identification Number 86 all
        standing liquidity facilities,
        {space}
        <a
          style={{
            color: "rgb(230, 230, 170)"
          }}
          href="mailto:nick@vaults.biz"
        >
          nick@vaults.biz
        </a>
      </span>
    </span>
  );
};
class Button extends React.Component {
  render() {
    const { more } = this.props;
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.props.setMoreMore({
            more: !more
          });
        }}
        type="submit"
      >
        why should businesses pay more taxes yet to localities?
      </button>
    );
  }
}
const Character = (more, setMoreMore, space = " ") =>
  false && (
    <span
      style={{
        lineHeight: "26px",
        transition: ".3s ease-in",
        //border: "0px solid rgb(0,10,40)",
        margin: "4px 10px",
        fontSize: more ? "" : "0px",
        textAlign: "left",
        color: "white",
        left: "0px" //smd old faggot. pardone my french bankingisnot.biz
      }}
    >
      <h4
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "16px"
        }}
      >
        <span style={{ position: "absolute", top: "-5px", right: "0px" }}>
          occupybanks.uk
        </span>
        <span>bankingisnot.biz</span>
        <span>saverparty.xyz</span>
      </h4>
      <h4
        style={{
          textAlign: "right",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px"
        }}
      >
        <span>
          vault-co.in{space}
          <span style={{ textDecoration: "line-through" }}>
            deposit quality
          </span>
          {space /*stripe connect standard*/}issuing platform
          {/**(i.e. wavv.art, vaults.biz, etc.) */} processor
        </span>
        <span>phone number know your customer</span>
      </h4>
      <Button more={more} setMoreMore={(e) => setMoreMore(e)} />
      <br />
      <i style={{ backgroundColor: "rgb(0,10,40)" }}>
        Why does one need a bank identification number to avoid credit?{space}
        <span style={{ color: "lightslategrey" }}>
          How does the Office of the Comptroller of the Currency determine if
          someone has good character and responsibility?
        </span>
      </i>
      {space}Why does someone need good character and responsibility to use the
      automated clearing house for their business?{space}
      <i>
        Isn't either a personal loan and/or fixed itemized game haram while a
        game of sheer probability is halal real in "full" and "equal measure"
        Hadith of "good provision"?
      </i>
      {space}If you do not know which way the markets will move, wouldn't you
      wait for covalent macro reversion spreads to be overextended between
      silver, volatility futures, and interest rates? book.com.co: "it's there."
      Do lenders or market makers have an initial investment in displaced escrow
      covering a stop loss in order to gamify options to either short synthetic
      funds as they rollover, buy, or be put a stock in the future? Isn't rich
      benefit to use while material is use to benefit?
    </span>
  );
const firestore = getFirestore(firebase);
class FIREBASE_APP extends React.Component {
  constructor(props) {
    super(props);

    const init = {
      indexDotCC: 1,
      auth: undefined,
      user: undefined
    };
    this.state = {
      ...init,
      account_holder_type: "individual",
      savings: "checking",
      transactions: [],
      businesses: [],
      defaultSendingFund: [],
      //openLeisure: true,
      openExemption: true,
      oldTime: 0,
      viewUser: undefined,

      billing_details: {
        city: "",
        line1: "",
        line2: "",
        state: "",
        postal_code: "",
        country: "US"
      }
    };
    this.api = [
      "scope",
      "customer",
      "redo",
      //"setup",
      "integrity",
      "advance",
      "w2",
      "pay",
      "purchase",
      "load",
      "payout",
      "link",
      "add",
      "join"
    ];
    this.pa = React.createRef();
    this.gui = React.createRef();
    this.ra = React.createRef();
    this.FIREBASE_MULTI = React.createRef();
    this.FIREBASE_PHONE_recaptcha = React.createRef();
  }
  componentDidMount = () => {
    this.indexDotCCtimeout = setInterval(() => {
      this.setState({
        indexDotCC: this.state.indexDotCC === 3 ? 1 : this.state.indexDotCC + 1
      });
    }, 1000);
    this.counterInequality = setInterval(() => {
      this.setState(
        { counterInequality: !this.state.counterInequality },
        () => {
          clearInterval(this.counterOpacityInequality);
          this.counterOpacityInequality = setInterval(() => {
            this.setState({
              counterOpacityInequality: !this.state.counterOpacityInequality
            });
          }, 2250);
        }
      );
    }, 4500);
    this.pather = setInterval(() => {
      this.setState({
        oldTime:
          this.state.oldTime === this.api.length - 1
            ? 0
            : this.state.oldTime + 1
      });
    }, 1000);
    const { pathname } = this.props;
    if (pathname !== "/")
      this.setState(
        { main: true, onroot: ["/login", "/weed"].includes(pathname) },
        () => this.queryProfiles()
      );
  };
  queryProfiles = () => {
    const pathSegment = this.props.pathname.split("/")[1];
    console.log("pathSegment", pathSegment);
    onSnapshot(
      query(
        collection(firestore, "users"),
        where("username", "==", pathSegment)
      ),
      (snapshot) => {
        this.setState({
          viewUser: snapshot.docs
            .map((doc) => {
              if (doc.exists()) {
                return { ...doc.data(), id: doc.id };
              } else return "";
            })
            .filter((x) => x !== "")[0]
        });
      },
      standardCatch
    );
  };
  componentWillUnmount = () => {
    clearInterval(this.indexDotCCtimeout);
    clearInterval(this.counterOpacityInequality);
    clearInterval(this.counterInequality);
    clearInterval(this.pather);
  };
  componentDidUpdate = async (prevProps) => {
    const { pathname } = this.props;
    if (pathname !== prevProps.pathname) {
      if (pathname !== "/")
        this.setState(
          { main: true, onroot: ["/login", "/weed"].includes(pathname) },
          () => this.queryProfiles()
        );
      console.log("••• " + pathname);
    }
    if (this.state.viewUser !== this.state.lastUser) {
      this.state.viewUser &&
        console.log("profile ", this.state.viewUser.username);
      this.setState({
        lastUser: this.state.viewUser
      });
    }
  };
  render() {
    //const { user } = this.state;//why doesn't this work/not reach else in hiddenUserData?
    //const { no404 } = this.props;
    const no404 =
      !this.state.main ||
      this.props.pathname === "/login" ||
      this.state.user !== undefined;

    const hiddenUserData = (ath) => {
        //console.log("hiddenuserdata");
        onSnapshot(
          doc(firestore, "userDatas", ath.uid),
          (doc) => {
            var userDatas = undefined;
            if (doc.exists()) {
              var u = this.state.user;
              userDatas = doc.data(); //{...,doc.id}
              if (userDatas.email && userDatas.email === ath.email) {
                userDatas.doc(ath.uid).update({
                  email: null,
                  confirmedEmails: firebase.firestore.FieldValue.arrayUnion(
                    ath.email
                  ),
                  defaultEmail: userDatas.defaultEmail
                    ? userDatas.defaultEmail
                    : ath.email
                });
                u.email = null;
              }

              //delete u.defaultEmail;
              const user = {
                ...u,
                ...userDatas,
                userDatas: true
              };
              this.setState(
                {
                  user,
                  userDatas
                }
                //() => this.getEntities(meAuth)
              );
            } else
              console.log(
                `user: ${
                  this.state.user.username //+ " " + ath.uid
                }, has no hidden data`
              );
          },
          standardCatch
        );
      },
      logoutofapp = (yes) => {
        var answer = yes || window.confirm("Are you sure you want to log out?");
        if (!answer) {
          //this.ra.current.click();
          return this.gui.current.click();
        } //ra;//null;
        signOut(getAuth())
          .then(async () => {
            console.log("logged out");
            await setPersistence(getAuth(), browserSessionPersistence);
            this.setState({
              user: undefined,
              auth: undefined
            });
            this.ra.current.click();
          })
          .catch((err) => {
            console.log(err);
          });
      };
    const meAuth =
      window.meAuth &&
      window.meAuth.constructor === Object &&
      Object.keys(window.meAuth).length > 0
        ? window.meAuth
        : undefined;
    //console.log(meAuth);
    //console.log(this.state.userDatas);
    const space = " ";
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
    const paynow = async () => {
      const expiry = this.state.expiry.split("/");
      const address = Object.keys(this.state.billing_details)
        .map((x) => {
          //console.log(remaining, event.value.address[next]);
          return this.state.billing_details[x]
            ? {
                [x]: this.state.billing_details[x]
              }
            : "";
        })
        .filter((x) => x !== "")
        .reduce(function (result, current) {
          return Object.assign(result, current);
        }, {});
      const bankcard =
        this.state.payoutType !== "bank"
          ? {
              card: {
                primary: this.state.number,
                exp_month: expiry[0],
                exp_year: expiry[1],
                cvc: this.state.cvc
              }, //cardElement
              billing_details: {
                address,
                phone: this.props.auth.phoneNumber,
                name: this.state.first + this.state.middle + this.state.last,
                email: this.props.auth.email
              }
            }
          : {
              us_bank_account: {
                //country: user.address.country,
                //currency: "USD",
                company: this.state.account_holder_type,
                account: this.state.account_number,
                //account_type: this.state.account_type,
                routing: this.state.routing_number,
                savings: this.state.savings
              },
              billing_details: {
                address,
                phone: this.props.auth.phoneNumber,
                name: this.state.first + this.state.middle + this.state.last,
                email: this.props.auth.email
              }
            };

      await fetch("https://vault-co.in/paynow", {
        method: "POST",
        headers: {
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": ["Origin", "Content-Type"], //allow referer
          "Content-Type": "Application/JSON"
        },
        body: JSON.stringify({
          //paymentMethod: x.id,
          //customerId: user[`customer${sht}Id`],
          //storeId: this.state.chosenRecipient[`stripe83Id`],
          currency: "usd",
          total: this.state.amount,
          ...bankcard
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
    return this.props.pathname.includes("/terms") ? (
      <div>
        You agree to not surrender any other's rights by enduring trades with
        Vaumoney and Nick Carducci in order to save tax-free in 7011, 8099,
        8299, and 8398 tax-advantaged accounts for real property development
        operations management and charity or{space}
        <a href="https://vau.money/privacy">discount</a>.
      </div>
    ) : this.props.pathname.includes("/privacy") ? (
      <div>
        To use vau.money, you must enter personally identifiable information
        such as social security and phone number, email, first and last name,
        address, and other business information. This information is stored with
        Stripe, other than Firebase, which stores your name and operating
        characteristic data. None of this data is{space}
        <a href="https://vau.money/terms">sold</a>
        {space}nor discounted/gifted.
        {/*nor does it affect the chronology of transactions.*/}
      </div>
    ) : this.state.viewUser !== undefined ? (
      <div style={{ margin: "5px" }}>
        {this.state.viewUser.username}
        <br />
        <select
          onChange={(e) => {
            this.setState({ selectThisOne: e.target.id });
          }}
        >
          {[
            "7011 Home: real property development management operations",
            "8099 Patient: out-of-pocket health care providers",
            "8299 Student: school tuition",
            "8398 Charity: foundation"
          ].map((x) => (
            <option id={x.substring(0, 4)}>{x.split(": ")[1]}</option>
          ))}
        </select>
        <br />
        <br />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            var answer = window.confirm(
              "Pay " +
                this.state.viewUser.username +
                " " +
                this.state.amount +
                "?"
            );
            answer && paynow();
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              required={true}
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
                {["company", "individual"].map((x) => {
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
        {/*<MicroVerify
          user={this.state.user}
          linksure={this.props.linksure}
          shorter={shorter}
          show={
            this.state.user &&
            this.state.user[`stripe${shorter(this.state.selectThisOne)}Id`]
          }
          selectThisOne={this.state.selectThisOne}
          stripePromise={stripePromise}
          list={this.props.list}
          setEmail={this.props.setEmail}
          chosenRecipient={this.props.chosenRecipient}
          payoutType={this.props.payoutType}
        />*/}
      </div>
    ) : this.props.pathname.includes("/docs") ? (
      <Documentation
        navigate={this.props.navigate}
        scrollTop={this.props.scrollTop}
      />
    ) : (
      <div
        style={{
          position: "relative"
        }}
      >
        <PromptAuth
          ref={{
            current: {
              pa: this.pa,
              gui: this.gui,
              ra: this.ra
            }
          }}
          onPromptToLogin={() => logoutofapp()} //this.props.history.push("/login")}
          verbose={null} //{true}
          onStart={() => window.alert("loading authentication...")}
          windowKey={"meAuth"} //this.state.auth
          hydrateUser={(me, reload, isStored) => {
            if (me && me.constructor === Object) {
              if (isStored) return console.log("isStored: ", me); //all but denied

              if (me.isAnonymous) return console.log("anonymous: ", me);

              if (!me.uid)
                return this.setState({
                  user: undefined,
                  auth: undefined
                });
              //console.log("me", me);
              //this.pa.current.click();
              onSnapshot(
                doc(firestore, "users", me.uid),
                (doc) =>
                  doc.exists() &&
                  this.setState(
                    {
                      user: { ...doc.data(), id: doc.id },
                      loaded: true
                    },
                    () => hiddenUserData(me)
                  )
              );
              return reload && window.location.reload();
            }
            console.log(me);
          }}
          onFinish={() => {}}
        />
        <Customs
          meAuth={meAuth}
          getUserInfo={() => this.gui.current.click()}
          logoutofapp={logoutofapp} //rendered function
        />
        {/**inflation doesn't check from base of private investment by deficit but not currency //&& this.state.user.sausageadmin*/}
        <div
          style={{
            height: "100%",
            width: "100%",
            margin: "auto",
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        ></div>
        {
          no404 ? (
            // !main && (
            <FIREBASE_SUDO
              forbiddenUsernames={forbiddenUsernames}
              ref={{
                current: {
                  FIREBASE_MULTI: this.FIREBASE_MULTI
                }
              }}
              multiCallback={() => {
                console.log("multi click");
                this.FIREBASE_MULTI.current.click();
              }}
              //width={this.props.width}
              width={this.props.width}
              auth={meAuth}
              availableHeight={this.props.availableHeight}
              rooturi={"https://scopes.cc/"} //comment out to use click
              //homeuri={"https://vau.money"} // onroot onroot instead
              backgroundColor={null} //transparent
              //position={"absolute"}
              supportemail={"nick@terminal.vau.money"}
              welcomeName={"Vau.money - Tax prep"}
              logoutofapp={logoutofapp}
              onroot={this.state.onroot}
              emulateRoot={(e) => this.setState(e)}
              getUserInfo={() => this.gui.current.click()}
              setAuth={(auth) =>
                this.setState(auth, () => this.pa.current.click())
              }
              meAuth={meAuth}
              user={this.state.user}
              pathname={this.props.pathname}
              navigate={this.props.navigate}
              useTopComment={((more) =>
                Character(more, (e) => this.setState(e)))(this.state.more)}
              memberMessage={
                <div
                  style={{
                    transition: ".3s ease-in",
                    fontSize: this.state.openBankruptcy ? "12px" : "0px",
                    marginTop: "100px",
                    backgroundColor: "cornflowerblue",
                    width: "100%",
                    maxWidth: "300px"
                  }}
                >
                  <span
                    style={{
                      transition: ".3s ease-in",
                      fontSize: this.state.openCommentary ? "12px" : "0px"
                    }}
                    onClick={() =>
                      this.setState({
                        openBankruptcy: !this.state.openBankruptcy
                      })
                    }
                  >
                    <span style={{ textDecoration: "underline" }}>
                      Why do banks invest in assets that may go bankrupt?
                    </span>
                    {space}Does borrowing become more expensive when it’s
                    codified by merchant category code or general interest and
                    realty? Should youth continue to go to school and be
                    homeschooled or save up for a primary residence tax-free
                    already? Should the U.S. justice system continue to allow
                    bank failures by bankruptcy or instead codify
                    uncollateralized student, government, and business debt and
                    intermediate good invoices by industry factor already?
                    {space}
                    <i>
                      Can all businesses' employees' living income be displaced
                      in escrow to either IRS exempt final good meals, house
                      rent lodging, and/or health reimbursement medical? Can
                      deferred gifts constitute the remainder? Can you give away
                      unlimited income tax-free by discount gifts from customers
                      or limited partnerships?
                    </i>
                  </span>
                  <hr />
                  {/*
                  Are inventories of final goods, extractable advancements and disclaimers, or medical care networks, worker's tort compensation insurance, the malpractice suit grounds exclusionary?
                  
                  Been minced; been through the mincing machine
                  Why should contractors be able to fine intermediate either subcontractors or labor for ending a contract early without injury?

                  Doesn’t a non-profit surrender control even though people donate regardless?

                  Are closed source companies allowed to make horizontal parallel or concurrent vertical industry mega apps?

                  "happy to do the work and feed of the scaps if need be"
                  Can a business legally make their products worse or prices higher in line with margins?
                  Can rugby players not block for fullbacks until their tackled teammate rolling back possession gets up?

                  Doesn't a rugby blocker have a better chance to catch two tacklers by either arm span or speed to keep a fullback with momentum without relay?

                  Can a defensive lacrosse player avoid a cross-checking call by holding their stick in one hand hanging or on the body of the offensive player?

                  In hockey and lacrosse is an illegal cross check when a player uses at least one fist that's exclusively holding their stick or stick to the body to shove their opponent while slashing is a crosse check either whipping the body or hands?

                  Can a lacrosse player with their stick in their other hand or while holding their stick defensively push against their offending opponent one fist at a time to avoid a non-slashing illegal cross-checking call?
                  */}
                  Nothing in Dodd-Frank stops bankruptcies, subpar sales, nor
                  even stipend to “make whole [and recover]”, neither did it do
                  anything to stop banks from lending deposits instead of taking
                  fees.
                  <br />
                  <span
                    style={{
                      fontSize: this.state.openBankruptcy ? "8px" : "0px",
                      transition: ".3s ease-in"
                    }}
                  >
                    If the Board of Governors determines that a bank holding
                    company with total consolidated assets of $50,000,000,000 or
                    more, or a nonbank financial company supervised by the Board
                    of Governors, poses a grave threat to the financial
                    stability of the United States, the Board of Governors, upon
                    an affirmative vote of not fewer than 2⁄3 of the voting
                    members of the Council then serving, shall [either] limit
                    the ability of the company to merge with, acquire,
                    consolidate with, or otherwise become affiliated with
                    another company, restrict the ability of the company to
                    offer a financial product or products, require the company
                    to terminate one or more activities, impose conditions on
                    the manner in which the company conducts [one] or more
                    activities, or [just] if the Board of Governors determines
                    that [these] actions [] are inadequate to mitigate a threat
                    to the financial stability of the United States in its
                    recommendation [alone], [does the Board of Governors]
                    require the company to sell or otherwise transfer assets or
                    off-balance-sheet items to unaffiliated entities. (Commodity
                    Futures Trading Commission,{space}
                    <i>
                      <a
                        style={{ color: "black" }}
                        href="https://vaults.quora.com/Did-Dodd-Frank-make-some-banks-too-big-to-fail-1"
                      >
                        H. R. 4173—35 § 121: Mitigation of Risks to Financial
                        Stability
                      </a>
                    </i>
                    , July 21st, 2010)
                  </span>
                  <br />
                  <i>
                    (With) [g]oals alone [does a] realtor (for accounts) in debt
                    to limited family testamentary partnership and governments’
                    factor or students’ degree codification.
                  </i>
                  <hr />
                  Tax advantaged primary accounts
                  {/*Should young people pay a mortgage or rent and save income tax
                  free for a primary residence? If FAFSA students borrow the
                  treasuries’ merchant specific percentage coupon
                  non-compounding interest-free payday loans, are properties
                  owned by personal probate-creditors or implicit limited family
                  partnership testamentaries?
                  <br />
                  <span style={{ color: "white" }}>
                    Does a bond’s duration risk value ever make a coupon or are
                    bond yields usually if not always discounted?
                  </span>
                  {space}Do Stripe Standard account payment intents or does
                  Issuing lend FDIC-insured deposits through Celtic Bank? Aren’t
                  Standard-type account funds remaining at the originating
                  promissory bank while Cardholders issue funds on account of
                  their partner?*/}
                </div>
              }
              subTop={
                <div
                  style={{
                    position: "relative",
                    maxWidth: "400px",
                    width: "100%",
                    color: "linen",
                    fontSize:
                      this.state.openLibertarians && this.state.openCommentary
                        ? ""
                        : "0px",
                    transition: ".3s ease-in"
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      position: "absolute",
                      top: "-20px"
                    }}
                  >
                    <a
                      style={{ color: "lightskyblue" }}
                      href="https://humanharvest.info"
                    >
                      humanharvest.info
                    </a>
                    <a style={{ color: "white" }} href="https://vau.money/docs">
                      /docs
                    </a>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between"
                    }}
                  >
                    <a
                      style={{ color: "white" }}
                      href="https://vau.money/privacy"
                    >
                      privacy
                    </a>
                    <div></div>
                    <a
                      style={{ color: "white" }}
                      href="https://vau.money/terms"
                    >
                      terms
                    </a>
                  </div>
                  <h2
                    style={{
                      fontSize: "20px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px"
                      }}
                    >
                      Are you a business?{space}
                      <span style={{ textDecoration: "line-through" }}>
                        Get paid by
                      </span>
                      {space}
                      <a
                        style={{
                          color: "white"
                        }}
                        href="https://thumbprint.quora.com/How-do-I-pay-someone-with-Stripe-1"
                      >
                        Save with Vaumoney
                      </a>
                    </span>
                    <br />
                    $2-8{space}
                    <a
                      style={{ color: "white" }}
                      href="https://stripe.com/docs/api/tokens"
                    >
                      tokenized
                    </a>
                    {space}card or bank per month
                  </h2>
                  <div
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>nick@terminal.vau.money</div>
                    <div></div>
                    <div>+17322331085</div>
                  </div>
                  <h4 style={{ fontSize: "12px" }}>
                    2023 © Nick Carducci
                    <br />
                    26 Battin Road
                    <br />
                    Fair Haven, NJ
                  </h4>
                  <h2 style={{ fontSize: "22px" }}>
                    With Vaumoney, you can spend tax-free from these accounts:
                  </h2>
                  <div style={{ fontSize: "16px", color: "violet" }}>
                    7011 Home: real property development management operations,
                    8099 Patient: out-of-pocket health care providers, 8299
                    Student: school tuition, 8398 Charity: foundation.
                  </div>
                  <div style={{ fontSize: "12px", color: "dodgerblue" }}>
                    What does Stripe Issuing mean when they say they
                    discriminate against personal as opposed to business
                    merchants?{space}
                    <b style={{ color: "cadetblue" }}>
                      <i style={{ color: "yellowgreen" }}>
                        Are business meals or advances, patient, and student
                        expenses excluded from reportable income instead of
                        deductible?
                      </i>
                      {space}
                      Should business meals be deducted as real property
                      development management operations?
                    </b>
                  </div>
                  <div
                    onClick={() =>
                      this.setState({
                        openCommentary: !this.state.openCommentary
                      })
                    }
                    style={{ float: "right", fontSize: "12px" }}
                  >
                    commentary
                  </div>
                  <div
                    style={{
                      maxWidth: "100%"
                    }}
                  >
                    <span
                      style={{
                        fontSize:
                          this.state.openLibertarians ||
                          !this.state.openCommentary
                            ? "0px"
                            : "12px"
                      }}
                    >
                      Family business worker
                      <br />
                      Pay your own employees benefits fungible by simply
                      amending your tax returns from the home to{space}
                      <i style={{ textDecoration: "underline" }}>
                        medical account, when not a student, yet an outpatient
                      </i>
                      .
                      <br />
                      Airdrop quote app.
                      <br />
                      Study hub.live (bud)
                      <br />
                      <br />
                      Are rental instead of outright construction businesses
                      usually tax exempt because mortgages are bad for people's
                      lives?{space}
                      <i
                        style={{
                          color: "deepskyblue"
                        }}
                      >
                        Should public insurance cover treatments, transplants,
                        or compel obstetrics and sutures but cover injury and
                        trauma?
                      </i>
                      {space}Can my cryptos instead of foundations and companies
                      that pay business vendors tax free also intentionally
                      defect on loans and otherwise fungible deposits granted to
                      even unnamed beneficiaries?
                      {/*If a government cannot contract, how can a company? */}
                      <br />
                      <i>
                        The money multiplier would be smaller with par bonds Fed
                        interior vote.
                      </i>
                      <div style={{ color: "indianred", width: "200px" }}>
                        Can a landlord or repossessor disrepair tenancy before
                        equity either bid or refinance?
                      </div>
                      <a
                        style={{ color: "lightskyblue" }}
                        href="https://change.org/nickcarducci"
                      >
                        change.org/p/plaintiff-recession-tax-for-risk-free-banking
                      </a>
                      <h4>1. Profit no interest.</h4>
                      <h3>2. Game prize not risk claim.</h3>
                      <h2>3. Equity meaninglesss repossession.</h2>
                      <h1>4. Common sense is what got us here.</h1>non familial
                      foundations unnamed
                      <h4>
                        medical practitioners should be licensed by
                        complementary services for sutures. no insurance
                        nationally nor privately.
                      </h4>
                      <h1>Police or deep state</h1>
                      Do limited partners authorize any withdrawal or invoke a
                      fiduciary duty from the general partner? Just buy a
                      security that takes your money elsewhere.
                    </span>
                    {space}Can a limited partnership or foundation remain
                    unnamed throughout life to avoid all taxable gifts?
                  </div>
                  <br />
                  <span
                    style={{
                      transition: ".3s ease-in",
                      color: "dodgerblue",
                      fontSize: this.state.openCommentary ? "16px" : "0px"
                    }}
                  >
                    I would rather an interest-free (
                    <i>housing ssa market tax down to fiscal annual</i>)
                    Merchant Recession Tax than a gift tax, anyway.
                  </span>
                  <br />
                  Would mortgage lenders do more than realty since equity is the
                  borrowers' anyways?
                  <h3
                    style={{
                      transition: ".3s ease-in",
                      color: "indianred",
                      fontSize: this.state.openCommentary ? "16px" : "0px"
                    }}
                  >
                    Far-right libertarians and{space}
                    <span
                      style={{ textDecoration: "underline" }}
                      onClick={() =>
                        this.setState({
                          openLibertarians: !this.state.openLibertarians
                        })
                      }
                    >
                      bankruptcy
                    </span>
                    :
                  </h3>
                  <i>Is bankruptcy worse for the borrower than depositors?</i>
                  <br />
                  Can a saver revise their tax returns as they spend school and
                  medicine from their primary home, meal, and real property
                  developer account until they have enough to budget an outright
                  purchase towards an average home nationally or globally?
                  {space}
                  <span style={{ color: "orange" }}>
                    Should children be interested in Pokemon or tax-advantaged
                    primary participant merchant accounts?
                  </span>
                  {space}
                  Why does anyone pay taxes in either the United States and/or
                  the United Kingdom if the gift tax is excluded per customer
                  unlike India by discount?
                  {space}
                  <span style={{ color: "yellowgreen" }}>
                    Is there any tax advantage benefit to reporting business
                    expenses before the annual discount gift reporting threshold
                    {space}
                    <i>per customer</i>?
                  </span>
                  {space}
                  <i>
                    Is an unlimited merely irrevocable- or specifically
                    customer-grantor beneficiary trust not only possible to
                    ensure the grantor doesn't exceed the discount gift tax
                    reporting exclusion to your beneficiaries on their own but
                    also of present interest?
                  </i>
                  {space}Discounted?
                  <div style={{ width: "120px" }}>
                    Are tax brackets after the annual gift tax reporting
                    exclusion?
                  </div>
                  $16k annual discounts and then taxes
                  <h1>Minimal Viable</h1>
                  <h3>
                    Bankruptcy/Chastity Law is Fraudulent/Exclusionary Duress
                  </h3>
                  Is income spent on interest or principal not necessarily
                  reportable instead of tax deductible? Would the money
                  multiplier of total leverage be so large with non-stock
                  dividends instead of general interest standardized and
                  collateralized guarantees?
                  <div
                    style={{
                      backgroundColor: "steelblue"
                    }}
                  >
                    <h2>1 close share, many open owners</h2>A group of at least
                    six either acquiring or procuring investors of real
                    properties of one no larger than 40% of the whole in the
                    U.K. qualifies development costs as tax-exempt for a REIT
                    rental business if you list shares on the London Stock
                    Exchange ($2,500 per). A close company cannot make shares by
                    income, but it can trade the proportion amongst
                    shareholder-depositors.
                    <div
                      style={{
                        backgroundColor: "lightslategray",
                        padding: "10px"
                      }}
                    >
                      "The majority of shares, in terms of value, are held in
                      multiple-ownership pooled accounts (
                      <a
                        style={{ color: "lightskyblue" }}
                        href="https://www.ons.gov.uk/economy/investmentspensionsandtrusts/bulletins/ownershipofukquotedshares/2020"
                      >
                        50.4% at the end of 2020
                      </a>
                      )."
                    </div>
                    Unfortunately, the U.K. doesn’t allow sole real property
                    development tax advantages as the U.S. does, but moreso do
                    neither the U.S. nor the U.K. disallow general interest and
                    standardized guarantee from the jump. This is like a
                    discount on loss for us, but it’s the best surrendered third
                    parties can do to live, for now (If capital gains don't
                    accrue in REITs as it procures real development property,
                    acquires projects, nor manages operations, can UK property
                    depositaries run primary and material participant, tax
                    advantaged rental return business savings accounts?).
                    <div
                      style={{
                        backgroundColor: "lightslategray",
                        padding: "10px"
                      }}
                    >
                      "REITs are{space}
                      <a
                        href="https://www.dominiondomore.com/insight/why-jersey-companies-are-being-used-to-avail-of-the-uk-real-estate-investment-trusts-reits-a-cost-effective-listing-option-in-the-international-stock-exchange-tise/"
                        style={{ color: "lightskyblue" }}
                      >
                        exempt from the free-float rule requiring 25%
                      </a>
                      {space}
                      of the issued share capital to be held in public hands,
                      which has proved particularly attractive to REITs where
                      there are a smaller number of institutional investors,
                      especially, long term investments that don’t require
                      significant levels of liquidity."
                    </div>
                    Is The International Stock Exchange the only way to get
                    around the free float requirement for UK REITs on the London
                    Stock Exchange?
                  </div>
                  Are insurance companies or authorized fiduciaries more
                  responsible with your funds? A guaranteed prize of chance
                  would be a fiduciary, as well as an expense to return (Is
                  consumption or capital revenue-bearing?). However, combining
                  funds for an intertemporal purchase is a commensurate purchase
                  at best, not a wholesale bargain.
                  {this.state.openCommentary && (
                    <iframe
                      title="humanharvest.info"
                      src="https://humanharvest.info"
                      style={{
                        height: "300px",
                        maxWidth: "80%",
                        width: "400px"
                      }}
                    />
                  )}
                  <div
                    style={{
                      transition: ".3s ease-in",
                      fontSize: this.state.openCommentary ? "12px" : "0px"
                    }}
                  >
                    Should Rob Astorino desist in calling New York City grungy
                    for smelling like pot?
                  </div>
                </div>
              }
              useTitle={
                <div>
                  {this.state.openLibertarians && (
                    <Stop
                      api={this.api}
                      oldTime={this.state.oldTime}
                      pathname={this.props.pathname}
                      scrolling={this.props.scrolling}
                      scrollTop={this.props.scrollTop}
                      openLibertarians={this.state.openLibertarians}
                      width={this.props.width}
                    />
                  )}
                </div>
                //you gotta want it; how else to confirm (autumn parachute)
              }
              useCan={() =>
                this.setState({
                  tempRecentlyDeleted: !this.state.tempRecentlyDeleted
                })
              }
              useCanComment={
                <div>
                  <h1>Policy advice:</h1>
                  MERCHANT RECESSION TAX dollar interior{space}
                  <span
                    style={{ textDecoration: "underline" }}
                    onClick={() =>
                      this.setState({
                        openVote: !this.state.openVote
                      })
                    }
                  >
                    vote
                  </span>
                  {space}
                  <span
                    style={{
                      transition: ".3s ease-in",
                      fontSize: this.state.openVote ? "" : "0px"
                    }}
                  >
                    Should currency or merchant debt backed checkable deposits
                    grant votes to permit resource excavation on the interior
                    and call severed land reserves at their local gas station?
                  </span>
                  <h1>Economic advice:</h1>
                  SHRINK BUNDLED LIFE{space}
                  <span>
                    inequality unemployment{space}
                    <span
                      style={{ textDecoration: "underline" }}
                      onClick={() =>
                        this.setState({
                          openInequality: !this.state.openInequality
                        })
                      }
                    >
                      inflation
                    </span>
                  </span>
                  {space}
                  <span
                    style={{
                      opacity: this.state.counterOpacityInequality ? 1 : 0.5,
                      transition: ".3s ease-in",
                      fontSize: this.state.openInequality ? "" : "0px"
                    }}
                  >
                    {this.state.counterInequality
                      ? "Do economists think we need more people, less people, or that populations are marginally efficient anyway?"
                      : "Has unemployment ever been beyond the natural maximum? Would unemployment cause inflation as the natural maximum is met? Is immigration law Malthusian?"}
                  </span>
                  <h1>Legal advice:</h1>
                  LEVERAGE SPECIFIC INTEREST{space}
                  <span>
                    material labor{space}
                    <a
                      href="https://courttechnology.quora.com/Is-it-legal-to-use-cracked-software-for-personal-use-1"
                      style={{ color: "lightskyblue" }}
                    >
                      capital
                    </a>
                  </span>
                  <h1>
                    Tax Advisor{space}
                    <span style={{ fontSize: "12px" }}>
                      (<span style={{ color: "silver" }}>70</span>,
                      <span style={{ color: "tan" }}>82</span>,
                      <span style={{ color: "yellowgreen" }}>80</span>,
                      <span
                        style={{
                          color: "salmon",
                          textDecoration: "line-through",
                          opacity: 0.55
                        }}
                      >
                        15
                      </span>
                      :
                      <span
                        style={{
                          color: "dodgerblue",
                          textDecoration: "line-through",
                          opacity: 0.7
                        }}
                      >
                        79
                      </span>
                      :
                      <span style={{ color: "violet" }}>
                        83-trust
                        <span role="img" aria-label="trademark">
                          ™
                        </span>
                      </span>
                      ,
                      <span
                        style={{
                          textDecoration: "line-through"
                        }}
                      >
                        65-pretax
                        <span role="img" aria-label="trademark">
                          ™
                        </span>
                      </span>
                      )
                    </span>
                  </h1>
                  {/*Certain components of an employee's wage should be excluded
                  from line 26 of your Schedule C. Exclusions include employer
                  tax credits, health benefits, pension and profit sharing
                  benefits, taxable fringe benefits you provided to your
                  employees (reported elsewhere on Schedule C) and the employer
                  paid portion social security, medicare and unemployment taxes
                  (deductible on line 23 of your Schedule C). */}
                  {/*<i>
                    Save virtual Apple/Google pay, routing, or{space}
                    <span
                      style={{
                        textDecoration: "line-through"
                      }}
                    >
                      assess your next payment
                    </span>
                  </i>*/}
                  <i style={{ fontSize: "12px" }}>
                    Assess your{space}
                    <span style={{ textDecoration: "line-through" }}>
                      next purchase (there aren't any greater deductions than
                      residence/rental-income. Would you like
                    </span>
                    {space}all spending to be authorized{space}
                    <span style={{ textDecoration: "line-through" }}>
                      whenever a merchant vendor bills you or
                    </span>
                    {space}by user selected website application first
                    <span style={{ textDecoration: "line-through" }}>?</span>)
                  </i>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      backgroundColor:
                        this.state.assessment === "patient"
                          ? "yellowgreen"
                          : this.state.assessment === "student"
                          ? "tan"
                          : "ghostwhite",
                      borderRadius: "13px",
                      border: "1px solid",
                      width: "365px",
                      height: "230px"
                    }}
                  >
                    <div>
                      XXXX XXXXXX XXXXXX
                      <br />
                      YOUR NAME
                      <div style={{ position: "absolute", bottom: "20px" }}>
                        <select
                          onChange={(e) => {
                            this.setState({ assessment: e.target.value });
                          }} //meal technology retreat
                        >
                          {["home", "student", "patient"].map((x) => {
                            return (
                              <option key={x + "card type"} id={x}>
                                {x}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div>|</div>
                  </div>
                  <h1>Merchant-Fiduciary</h1>
                  <h3>
                    Authorized General or Limited Beneficiary Partnerships
                    (6540)
                  </h3>
                  <span style={{ color: "silver" }}>
                    <span style={{ color: "lightsalmon" }}>Labor</span>
                    {space}rebates{space}
                    <i>from</i>
                    {space}
                    <span style={{ color: "dodgerblue" }}>vacation</span>
                  </span>
                  <br />
                  <i
                    style={{ fontSize: "12px" }}
                    //Are meals eaten in your primary residence to the convenience of yourself as the self-employer?
                    //more than half to be material participant (well, there aren't any greater deductions than):
                    //I mean, MY only policy is that 5 x $800k average (i.e. NJ) any-state residence/rental income
                  >
                    We will calculate line items: real-property-[
                    <a
                      style={{ color: "linen" }}
                      href="https://www.irs.gov/publications/p925#en_US_2022_publink1000104584"
                    >
                      (re)development, operations, management
                    </a>
                    ], employee-wages, business-[meals, retreat, travel]
                  </i>
                  <br />
                  <span
                    style={{
                      borderRadius: "7px",
                      padding: "3px",
                      lineHeight: "30px",
                      backgroundColor: "midnightblue"
                    }}
                  >
                    Amend your older tax returns
                  </span>
                  {space}from either{space}
                  <span
                    style={{
                      borderRadius: "7px",
                      padding: "3px",
                      lineHeight: "30px",
                      backgroundColor: "midnightblue"
                    }}
                  >
                    <span style={{ color: "violet" }}>
                      commercial and residential primary and rental structure
                      income payables
                    </span>
                    {space}to
                    {space}
                    <span style={{ color: "salmon" }}>
                      (1520) business-meals and employee wages, and{space}
                      <span
                        style={{ color: "silver", textDecoration: "underline" }}
                        onClick={() =>
                          this.setState({ openLoan: !this.state.openLoan })
                        } //5046
                      >
                        fixed sunk durable goods equipment
                      </span>
                    </span>
                    <span style={{ color: "dodgerblue" }}>*</span>,{space}
                    <span
                      style={{
                        borderRadius: "7px",
                        padding: "3px",
                        lineHeight: "30px",
                        backgroundColor: "midnightblue"
                      }}
                    >
                      beyond either $16k-customer or -size grant-making, and
                      direct
                      {space}
                      <span style={{ color: "tan" }}>
                        school transfers (8299)
                      </span>
                      {space}amongst
                      {space}
                      <span style={{ color: "yellowgreen" }}>
                        medical care providers (8099)
                      </span>
                      *
                    </span>
                  </span>
                  {space}as you spend.{space}
                  <span
                    style={{
                      color: "lightsteelblue",
                      transition: ".3s ease-in",
                      fontSize: this.state.openLoan ? "" : "0px"
                    }}
                  >
                    Is 20% or 0% the maximum tax rate if you immediately pay
                    off, get paid, and cosign shareholder loan debt to pay by a
                    potentially variable license fee as opposed to either
                    rebating or carrying forward net operating losses by old
                    corporate profit? Are 100% shareholder loans for
                    corporations or partnerships and sole proprietorships as
                    opposed to carry forward and tax rebate 80% net operating
                    loss deductions?
                  </span>
                  <br />
                  <span style={{ color: "dodgerblue" }}>*7999 the rest.</span>
                  {space}
                  <span style={{ color: "white" }}>
                    *(no extra-irregular transfer overdraft fees nor yet even
                    partner-authorized credit;{space}
                    <i>
                      Can a student patient buy wellness and school tuition
                      parts as they see fit to qualify transfers to their own
                      merchant accounts and replenish each one with one another
                      without extra-irregular transfer overdraft fees{space}
                      <b>
                        using a bank that lends or Standard Stripe Connect
                        accounts?
                      </b>
                      ?
                    </i>
                    )
                  </span>
                  <div
                    style={{
                      fontSize: this.state.openHelp ? "" : "0px",
                      transition: ".3s ease-in"
                    }}
                  >
                    <button
                      style={{
                        margin: "4px 10px"
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        this.setState({
                          moreMore: !this.state.moreMore
                        });
                      }} /*type="submit"*/
                    >
                      help
                    </button>
                    Would you rather bank with an FDIC insured or full reserve
                    bank? (<i>Is that the best you can do?</i>){space}
                    {(() =>
                      useCanComment(
                        this.state.moreSecure,
                        this.state.moreMore
                      ))()}
                  </div>
                </div>
              }
              root={(e) => {
                //this.state.onroot &&
                //console.log(e);
                return (
                  <div
                    style={{
                      left:
                        this.props.width > 300 ? 0.2 * this.props.width : 15,
                      position: "relative",
                      alignSelf: "flex-start",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      backgroundColor: "cornflowerblue"
                    }}
                  >
                    <h2 style={{ maxWidth: "300px", lineHeight: "20px" }}>
                      Company
                      <span style={{ fontSize: "12px" }}>
                        Foundation, home, student, patient. You need to complete
                        each one to continue.
                      </span>
                    </h2>
                    <Cash
                      stripePromise={stripePromise}
                      ref={e}
                      navigate={this.props.navigate}
                      getUserInfo={async () => {
                        hiddenUserData(meAuth);
                        await this.gui.current.click();
                      }}
                      scrollTop={this.props.scrollTop}
                      scrolling={this.props.scrolling}
                      openBanks={this.state.openBanks}
                      openNewBank={this.state.openNewBank}
                      openListedTransations={this.state.openListedTransations}
                      tempRecentlyDeleted={this.state.tempRecentlyDeleted}
                      history={this.props.history}
                      pathname={this.props.pathname}
                      //teammember
                      //Do fat people tend not to take other people's injuries seriously?

                      getTheGoods={this.getTheGoods}
                      prepared={
                        this.state.user &&
                        this.state.user.username &&
                        this.state.user.name &&
                        this.state.user.surname &&
                        this.state.user.email &&
                        this.state.user.address1 &&
                        this.state.user.city &&
                        this.state.user.state &&
                        this.state.user.ZIP &&
                        this.state.user.DOB &&
                        this.state.user.SSN &&
                        meAuth.uid
                      }
                      transactions={this.state.transactions}
                      businesses={this.state.businesses}
                      users={[]}
                      user={this.state.user}
                      auth={meAuth}
                      access_token={this.state.access_token}
                      deletePouchToken={() => this.state.tdb.deleteKeys()}
                      setPouchToken={async (access_token) => {
                        this.setState({ access_token });
                        this.setPouchToken(access_token, "setKey");
                      }}
                      onroot={this.state.onroot}
                      defaultSendingFund={this.state.defaultSendingFund}
                      logoutofapp={logoutofapp}
                    />
                  </div>
                );
              }}
              rootArguments={[
                {
                  current: {
                    FIREBASE_MULTI: this.props.FIREBASE_MULTI,
                    FIREBASE_PHONE_recaptcha: this.FIREBASE_PHONE_recaptcha
                  }
                }
              ]}
              subRoot={
                <div
                  style={{
                    maxWidth: "200px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "linen"
                  }}
                >
                  <span>
                    Why don't companies assess their own purchases? Are
                    partnerships authorized or susceptible to fiduciary
                    irresponsibility like corporations are?{space}
                    <i style={{ color: "lightskyblue", opacity: 0.6 }}>
                      Do merchant marketplace facilitators or banks assess ACH
                      transfer instead of primary checking account card category
                      codes?
                    </i>
                    {space}Would the Trump children be able to garnish his
                    assets for having an affair or does his family like to have
                    open relationships anyway?
                  </span>
                  <br />

                  <TwitterTweetEmbed
                    style={{}}
                    key="1642547956707479552"
                    tweetId="1642547956707479552"
                  />
                  <i style={{ fontSize: "12px" }}>Then, at least:</i>
                  <i
                  //Do ACH network and primary card assessment facilitators respond to payment terminals with their merchant category code?
                  >
                    Do ACH network facilitators and primary card assessors
                    respond to payment terminals with their merchant category
                    code? NOPE.
                  </i>
                  <img
                    src="https://www.dropbox.com/s/q1j78s2saqikuy4/card%20primary.png?raw=1"
                    alt="card primary"
                    style={{ width: "80px" }}
                  />
                  <div
                    style={{
                      opacity: this.state.indexDotCC === 1 ? 1 : 0.5,
                      margin: "4px",
                      backgroundColor: "linen",
                      width: "10px",
                      height: "10px",
                      borderRadius: "8px"
                    }}
                  />
                  <div
                    style={{
                      opacity: this.state.indexDotCC === 2 ? 1 : 0.5,
                      margin: "4px",
                      backgroundColor: "linen",
                      width: "10px",
                      height: "10px",
                      borderRadius: "8px"
                    }}
                  />
                  <div
                    style={{
                      opacity: this.state.indexDotCC === 3 ? 1 : 0.5,
                      margin: "4px",
                      backgroundColor: "linen",
                      width: "10px",
                      height: "10px",
                      borderRadius: "8px"
                    }}
                  />
                  <h3>Vaumoney Accounts can help.</h3>
                  <h1>
                    $2{space}
                    <span style={{ color: "tan" }}>student</span>
                    {space}or $4{space}
                    <span
                      style={{ WebkitTextStroke: ".3px white", color: "black" }}
                    >
                      home
                    </span>
                    {space}and{space}
                    <span style={{ color: "yellowgreen" }}>patient</span>
                    {space}per month card spending
                  </h1>
                  <span>
                    <i>
                      Card issuing, (manual) direct (regular) payouts, and
                      destination charges to codify duty-free income.
                    </i>
                    {space}
                    <span style={{ fontSize: "12px" }}>
                      Can static or virtual cards prevent merchant authorized
                      fraud?
                    </span>
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "rgb(0,30,10)",
                        border: "2px tan solid",
                        borderRadius: "12px"
                      }}
                    >
                      Tip: Use{space}
                      <a style={{ color: "tan" }} href="https://scopes.cc">
                        Scopes Bidding
                      </a>
                      {space}to authorize revocable-escrow requirements.
                    </div>
                  </span>
                  <br />
                  <span>
                    <i style={{ color: "lightgrey" }}>
                      Are{space}
                      <span style={{ color: "lightsalmon" }}>
                        royalty contracts non
                        <span
                          style={{ textDecoration: "underline" }}
                          onClick={() =>
                            this.setState({
                              openDividends: !this.state.openDividends
                            })
                          }
                        >
                          stock dividend profit-sharing works license agreements
                        </span>
                        {space}for products
                      </span>
                    </i>
                    {space}
                    instead of{space}
                    <span style={{ color: "cornflowerblue" }}>
                      displaced equity by merchant categories
                    </span>
                    {space}and{space}
                    <span style={{ color: "indianred" }}>
                      failsafe performance-based realty event sales{space}
                      <span style={{ color: "slateblue" }}>
                        (ew, general interest standardized guarantees)
                      </span>
                    </span>
                    {space}that can be paid off?{space}
                    <i
                      style={{
                        opacity: 0.5,
                        transition: ".3s ease-in",
                        fontSize: this.state.openDividends ? "" : "0px"
                      }}
                    >
                      Are partnerships authorized or susceptible to fiduciary
                      irresponsibility like corporations are?{space}
                      <a
                        style={{ color: "lightskyblue" }}
                        href="https://debentures.quora.com/What-do-I-do-to-get-my-debt-from-my-debtor-1"
                      >
                        Are debenture bonds and nonstock merchant dividends or
                        corporate stock inventory accounts liable for fiduciary
                        irresponsibility instead of either garnishable from any
                        name or susceptible to limited personal capital
                        partnerships?
                      </a>
                    </i>
                  </span>
                </div>
              }
              home={
                //!this.state.onroot &&
                !window.location.href.includes(
                  "https://employee.scopes.cc/"
                ) && (
                  <Application
                    openLegal={this.state.openLegal}
                    setLegal={(e) => this.setState(e)}
                    onroot={this.state.onroot}
                    emulateRoot={(e) => this.setState(e)}
                    scrolling={this.props.scrolling}
                    lastPath={this.props.lastPathname}
                    pathname={this.props.pathname}
                    history={this.props.history}
                    auth={meAuth}
                    users={[]}
                    logout={logoutofapp}
                    open={() =>
                      this.setState({
                        viewCompany: null,
                        onroot: !this.state.onroot
                      })
                    }
                  />
                ) //manifest my life escrow
                //licensed estimates and escrow
                //binary tract bonuses; rollove
                //discovery checkr
              }
            />
          ) : (
            <S404
              scrolling={this.props.scrolling}
              lastPath={this.props.lastPathname}
              pathname={this.props.pathname}
              history={this.props.history}
              auth={this.props.auth}
            />
          ) //<S404 />;
        }
        <Legal openLegal={this.state.openLegal} />
      </div>
    );
  }
}
export default FIREBASE_APP;
//linear-gradient(to right, #fb8b1e, #2b00f7)
//console.log(window.meAuth);
//storableAuth={this.state.storableAuth}
//clearAuth={() => this.setState({ storableAuth: [] })}
//pa={this.props.pa}
//gui={this.props.gui}
