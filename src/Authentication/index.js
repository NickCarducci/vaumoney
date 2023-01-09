import React from "react";
import Sudo from "./Sudo";
import Cash from "./Application/Cash";
import Application from "./Application";
import S404 from "./404.js";
//​moving to work scapegoating
//work from home uniformity!
//you make inflation you pay with nest
//I like natural (equal and full measure, nairu)
//Do sole proprietors and partnerships or corporations alone report to pay taxes quarterly?
//​tax defered wills with maybe a tax free open source business
//Free association is the bane of corpus linguistics, property and labor are to be fiduciary-debenture stock, not collateral and down, nor escrow indemnity. Most of all, IRS agents are a waste of money for life only agents (with a fax number...) and geohash local sales tax for plaintiffs and consensus industry variable business permits.
//Couldn't physiological roles determine reason for diagnosing abnormal sociological ones? Is the fourth turning any less misogynistic than Jordan B. Peterson on chaos in his Biblical series lectures?
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  query,
  where
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
const firestore = getFirestore(firebase);
export default class App extends React.Component {
  constructor(props) {
    super(props);

    const init = { hovers: {}, auth: undefined, user: undefined };
    this.state = {
      ...init,
      transactions: [],
      businesses: [],
      defaultSendingFund: []
    };
    this.pa = React.createRef();
    this.gui = React.createRef();
    this.ra = React.createRef();
  }
  componentDidMount = () => {
    const { pathname } = this.props;
    this.checkPathname(pathname);
  };
  componentDidUpdate = async (prevProps) => {
    const { pathname } = this.props;
    if (pathname !== prevProps.pathname) {
      this.checkPathname(pathname);
      console.log("••• " + pathname);
    }
  };
  checkPathname = async (pathname) => {
    if (pathname === "/login") {
      return this.setState({ sudo: true });
    } else {
      this.setState({ sudo: false });
    }
  };
  render() {
    const { sudo404 } = this.props;
    const { sudo } = this.state;
    const space = " ";

    const logoutofapp = () => {
      var answer = window.confirm("Are you sure you want to log out?");
      if (!answer) return null;
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
    }; //linear-gradient(to right, #fb8b1e, #2b00f7)
    //console.log(window.meAuth);
    const hover = (name, timeout) => {
      this.setState({
        hovers: {
          [name]: true
        }
      });
      clearTimeout(this[name]);
      this[name] =
        timeout &&
        setTimeout(() => {
          this.setState({ hovers: { [name]: false } });
        }, timeout);
    };
    return (
      <div
        style={{
          position: "relative",
          width: "100%"
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
          //storableAuth={this.state.storableAuth}
          //clearAuth={() => this.setState({ storableAuth: [] })}
          //pa={this.props.pa}
          //gui={this.props.gui}
          onPromptToLogin={() => {}} //this.props.history.push("/login")}
          verbose={null} //{true}
          onStart={() => window.alert("loading authentication...")}
          windowKey={"meAuth"} //this.state.auth
          setFireAuth={(me, reload, isStored) => {
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
                  this.setState({
                    user: { ...doc.data(), id: doc.id },
                    loaded: true
                  })
              );
              return reload && window.location.reload();
            }
            console.log(me);
          }}
          onFinish={() => {}}
          meAuth={window.meAuth === undefined ? null : window.meAuth}
        />
        <Customs
          meAuth={window.meAuth}
          getUserInfo={() => this.gui.current.click()}
          logoutofapp={logoutofapp} //rendered function
        />
        {/**inflation doesn't check from base of private investment by deficit but not currency //&& this.state.user.sausageadmin*/}

        {
          sudo404 ? (
            // !sudo && (
            <Sudo
              lastWidth={this.props.lastWidth}
              availableHeight={this.props.availableHeight}
              //rooturi={"https://vau.money/"}//comment out to use click
              //homeuri={"https://vau.money"} // onroot onroot instead
              backgroundColor={null} //transparent
              position={"absolute"} //default "fixed" yet assert (root to) alignItems by row, objective promises //the moral anarchist as a part of the moral dynameic anarchist modicum
              welcomeName={"Vau.money - Tax prep"}
              logoutofapp={logoutofapp}
              /*ref={{
                current: {
                  pa: this.pa, //padrone redraft every season. overtime change orders. selling future labor general standing: surrender freedom right to own objective
                  gui: this.gui //subjective fact but for repitition. subjective fact but for confirmation of one more. Isn't 1/12 natural modicum or is 1/7
                }
              }}*/ onroot={
                this.props.onroot
              }
              emulateRoot={this.props.emulateRoot} //moral anarchy would be anarchy of the moral. morale, anarchy, or anarchy morale is moral anarchism
              getUserInfo={() => this.gui.current.click()}
              setAuth={(auth) =>
                this.setState(auth, () => this.pa.current.click())
              }
              meAuth={window.meAuth}
              //save the rats! Putin pharma cannot compete. pussy. made with rationality
              user={this.state.user} //root? or home as guest. UN membership depends on good advice
              //real inflation == non-deflationary (velocity) growth
              //1968 gun control potheads. i was thrown off NCAA for weed over performance
              //setBasic={this.props.setBasic} //chastity court the problem is the prudes
              pathname={this.props.pathname} //for a serious single issue voter, abortion is the best  issue to go no mandate reonciliation budget vote on
              useTopComment={
                <span
                  style={{
                    lineHeight: "26px",
                    //border: "0px solid rgb(0,10,40)",
                    margin: "4px 10px",
                    fontSize: this.state.more ? "" : "0px",
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.setState({
                        more: !this.state.more
                      });
                    }}
                    type="submit"
                  >
                    why
                  </button>
                  <i style={{ backgroundColor: "rgb(0,10,40)" }}>
                    Why does one need a bank identification number to avoid
                    credit?{space}
                    <span style={{ color: "lightslategrey" }}>
                      How does the Office of the Comptroller of the Currency
                      determine if someone has good character and
                      responsibility?
                    </span>
                  </i>
                  {space}Why does someone need good character and responsibility
                  to use the automated clearing house for their business?
                  {/*space}
                  <span style={{ color: "cornflowerblue" }}>
                    How's inextricable and intractable differ?
                  </span>
                  {space}
                  <i style={{ color: "burlywood" }}>
                    Did agriculture get better with finance?{space}Why doesn’t
                    the government amortize its liabilities to plausible
                    cash-to-debt ratios?{space}Is there an Office of the
                    Comptroller of the Currency employee that would sponsor a
                    fee-only bank?{space}Doesn’t a nation's production of
                    durable goods make its currency’s valued price?{space}Isn't
                    oil a durable good because it isn't perishable?
                  </i>
                  {space}Shouldn’t we count all instant runoff votes in each
                  round?{space}I have{space}
                  <a
                    style={{ color: "white" }}
                    href="https://landlordliquidity.quora.com/Why-do-landlords-raise-the-rent-for-a-steady-tenant-every-year-1"
                  >
                    77%
                  </a>
                  {space}saying rent is{space}
                  <a
                    style={{ color: "white" }}
                    href="https://truncatedwholesaletax.com"
                  >
                    certain
                  </a>
                  {space}harm.{space}
                  Do I own my home if I have a mortgage?{space}
                  <a
                    style={{ color: "white" }}
                    href="https://implausibleuseleases.quora.com/Is-it-normal-for-landlords-to-require-first-and-last-months-rent-up-front-1"
                  >
                    No
                  </a>
                  . Your{space}
                  <a style={{ color: "white" }} href="https://marginalism.uk">
                    contract
                  </a>
                  {space}is a not{space}
                  <a
                    style={{ color: "white" }}
                    href="https://stocktwits.com/nmc123"
                  >
                    complete
                  </a>
                  .{space}Isn't stock equal to capital without compulsory good
                  will contracts? Doesn't the economy get worse from
                  non-deflationary finance? Who owns welfare - my parents.
                  Infrastructural trust fund baby, who would like to move out.*/}
                  {/*"one other quick thing" (future demand{space}
                  <a
                    style={{
                      color: "white"
                    }}
                    href="https://marginalism.uk" //neosaltlib 
                  >
                    berose
                  </a>
                  ). When banks borrow short term and lend long term, how can
                  {space}
                  <a
                    style={{
                      color: "white"
                    }}
                    href="https://leisuretoprefer.com"
                  >
                    we tell
                  </a>
                  {space}the difference between{space}
                  <a
                    style={{
                      color: "white"
                    }}
                    href="https://stocktwits.com/nmc123/message/491429939"
                  >
                    bonds and checkable deposits
                  </a>
                  ? Do banks{space}
                  <a
                    style={{
                      color: "white"
                    }}
                    href="https://marginalism.uk"
                  >
                    need
                  </a>
                  {space}to lend? How can foreclosure restore the damages of
                  loitering, interest, and principal over collateral? Doesn’t
                  general poverty mean no profits?{space}
                  <span style={{ color: "cornflowerblue" }}>
                    Would the OCC more readily sponsor 12.1.5 with Scopebook
                    versus a fee-based bank?
                  </span>
                  {space}Why is there a $2,900 individual/multi-candidate,
                  $2,000 candidate-committee, and $5,000 political action
                  committee personal donation limit?{space}
                  <i>
                    Why do the Census poverty measures impute mortgages as costs
                    while the Bureau of Labor Statistics impute rents as
                    product?
                  </i>
                  {space}
                  <span style={{ color: "cornflowerblue" }}>
                    How does Trump raise $250m when the top 50k have{space}
                    <a
                      style={{ color: "cornflowerblue" }}
                      href="https://vaults.biz"
                    >
                      $50m
                    </a>
                    ?
                  </span>
                  {space}When a{space}
                  <a
                    style={{ color: "white" }}
                    href="https://rolloverinsurance.quora.com/How-does-Obamacare-not-reconcile-what-private-insurance-does"
                  >
                    Ponzi scheme
                  </a>
                  {space}is extricable, isn’t it a pyramid scheme?
                  
                  When aren't government politicians good for making risk-free mistakes?

                  */}
                </span>
              }
              useTitle={
                <div
                  style={{
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <h1 style={{ color: "rgb(230, 230, 170)" }}>vau.money</h1>
                  <h2>tax prep</h2>
                  <h3>Manifest life</h3>
                  <span
                    onMouseEnter={() => hover("teaseDefer", 4500)}
                    onClick={() => {
                      this.setState({ openDefer: !this.state.openDefer });
                    }}
                  >
                    Can escrow be used to defer tax exempt benefits?
                  </span>
                  {/* Does the manual payouts api allow Stripe Connect processors to report 
                    unlike sales towards living costs of which are convenient to client and/or 
                    either open source or home aide proprietor? Should closed source inventors or 
                    economic opportunity costs?
                     */}
                  <h3
                    style={{
                      fontSize: this.state.hovers.teaseDefer ? "" : "0px"
                    }}
                  >
                    <a
                      style={{
                        color: "white"
                      }}
                      href="https://scopes.cc"
                    >
                      social
                    </a>{" "}
                    production, PRivatE
                    {space}
                    <a
                      style={{
                        color: "white"
                      }}
                      href="https://bankingisnotabusiness.quora.com/How-does-one-have-access-to-capital-when-capital-is-return-ability"
                    >
                      CAPITAl
                    </a>
                    .
                  </h3>
                  <h3
                    style={{
                      textDecoration: "line-through",
                      fontSize: this.state.openDefer ? "" : "0px"
                    }}
                  >
                    <br />
                    {" " /**​cardinal order is chaos */}
                    {/*anarchy of production
                      depraved allow Allah, would have
                      ...and?? why correlation less homicides everyone smoke weed & car DUI
                      
                      don't degrade yourself man
                      
                      */}
                    <span
                      onMouseEnter={() => hover("openTitle", 4500)}
                      onClick={() => {
                        !this.state.openTotal &&
                          window.alert(
                            "I believe if you open source your work you 501c3; or use FedCash, anything [better]"
                          );
                        this.setState({ openTotal: !this.state.openTotal });
                      }}
                    >
                      $300 non-profit application
                    </span>
                    ,{space}
                    <span style={{ textDecoration: "line-through" }}>
                      $15/mo insurance (with fax)
                    </span>
                    , encampment to client.
                    {space}
                    {"<"}YOUR_NAME_HERE{">"}
                    <br />
                    <span
                      style={{
                        fontSize:
                          this.state.hovers.openTitle && !this.state.openTotal
                            ? ""
                            : "0px"
                      }}
                    >
                      tax defered wills with maybe a tax free open source
                      business{space}
                      <i>(why are will accounts tax deferred globally?)</i>
                    </span>
                    {
                      this.state.hovers.openTitle && <br />
                      /**
                       * horny dudes (marginalism.uk deprived hijabs); ​cover up babe
                       * no shame in the garden tho
                       * alternatives are always covalently endogenous by happenstance
                       * artifactually, not necessarily cause and maybe just mere general prevalence
                       * regcops.quora.com (all cops are literally bastards of the state government kerfuffle)
                       * all cops are literally bastards of the state government kerfuffle
                       * invest in yourself vau.money
                       * humility is narcisicm. nietzche marxism
                       * Is a life insurance account much different than an escrow merchant account but for licensure exclusion and tax privileges?
                       * r/ comptroll (Relinquish your morals for your art in ordinary carnations: (1) humility is narcissism, and (2) value comes from the stomachs. A natural monopoly is a network, alone.)
                       * Can life-only insurance producer agent tax exempt either inventories, escrow, or fiduciary will Stripe Connect merchant processor money services be nearly as risk-loving as are the FACHA banks with bank identification numbers for MasterCard issuance?
                       * keep the hereditary caste going with tax exempt life only broke peeps
                       * ​deferred until open source i mean
                       * ​popcorn can overfloweth (non-perisable
                       * self sustaining water filtration)
                       * make an alternative government
                       * ​I'll do your taxes I just need a fucking fax, "[yes, I'll take a latte.] I’m here for fundamental change. Latte?"
                       * the tax party choose another binary edge
                       * might not be white but pink
                       * Warranty project agent merchant (fraud indemnity open source and home aid)
                       * Taxes for closed source and travelers (home aide/ convenient)
                       * cardinal benefits overhead
                       */
                    }
                    <div
                      style={{
                        //out of scope, abundance cups of popcorn depos
                        fontSize: !this.state.openTotal ? "" : "0px"
                      }}
                    >
                      Can an insurance producer open an escrow account with any
                      bank for and toward their clients' long term living costs?
                      {/**Russell brand invented settling  out of course? 
                        
                        */}
                      {space}[
                      <span style={{ color: "pink" }}>
                        Can real estate agent collateral include a scope of
                        requirement project proposal accepted request in escrow?
                      </span>
                      ,{space}
                      <i>
                        If you settle out of court can an insurance agent
                        produce an escrow account (Publication 544)?
                      </i>
                      ,{space}
                      <i style={{ color: "cornflowerblue" }}>
                        Doesn't the government banking system tax higher
                        brackets in order to force us into mortgages to sustain
                        cardinal financial industry value benefits?
                      </i>
                      ,{space}
                      <span style={{ color: "indianred" }}>
                        Don't non-qualified either insurance or real estate
                        agent escrow providers qualify living costs as tax
                        exempt like IRS agents delegate to non-profit board
                        members for living costs of open source or home aid
                        business income work generally?
                      </span>
                      ,{space}
                      <span style={{ color: "gold" }}>
                        Can Stripe Connect rollover manual payouts to multiple
                        customer account links to avoid taxes?
                      </span>
                      ,{space}
                      <span>
                        Is there an Internal Revenue Service (IRS) publication
                        for each and every Internal Revenue Code (IRC) section?
                      </span>
                      ,{space /**blueviolet, darkviolet, darkorchid */}
                      <span style={{ color: "orchid" }}>
                        Can an agent producer establish and maintain a certain
                        group-life insurance policy cash value through an
                        employee tax withholding yet as a merchant’s manual
                        payment? Does Stripe Connect issue 1099-k for merchant
                        sole proprietors that employ people?
                      </span>
                      ,{space}
                      <span style={{ color: "plum" }}>
                        Can Stripe Connect rollover manual payouts to multiple
                        customer account links to avoid taxes?
                      </span>
                      ]{space}
                      <span style={{ opacity: 0.8 }}>
                        <span style={{ color: "linen" }}>
                          How can an IRC section 79 tax exempt life insurance
                          and 457(b) tax deferred compensation account
                          withdrawal early without borrowing the liability
                          assumed purchases?{space}
                          <span
                            style={{
                              textDecoration: "underline",
                              opacity: 0.8
                            }}
                          >
                            <b>Competition and hours are deflationary</b>
                            {space}in void of accelerating inflation happenings
                            over marginalism.uk; resource productivity over
                            consumption is retardation
                          </span>
                          .
                        </span>
                        {space}
                        <span style={{ color: "lightskyblue" }}>
                          Doesn't a life insurance policy work as a living will?
                          Does it need to expire with non fiduciary depository
                          inventory nor warranty indemnity consumer fraud or can
                          the certificate issuer also be an outright either
                          depositary or merchant processor?
                        </span>
                      </span>
                      {/*
                        warranty schedule fraud EULA

                        If you settle out of court can an insurance agent produce an escrow account?

                        lead with pain
                        Can life-only insurance producer agent tax exempt either inventories, 
                        escrow, or fiduciary will Stripe Connect merchant processor money services 
                        be nearly as risk-loving as are the FACHA banks with bank identification numbers 
                        for MasterCard issuance?  Isn't New Jersey health insurance abetting 
                        consumer fraud liabilities through long-term either scheduled or 
                        not labor contracts?
                        ​healthcare value productivity over material is consumer fraud indemnifiable
                        ​life insurance defer then institutionally gift essentials all tax free unlimited

                        Is a chaotic or normal money velocity rate negatively correlated to its tax rate?

                        change the nonpartisan question
                         */}
                    </div>
                  </h3>
                  <div
                    style={{
                      fontSize: this.state.openTotal ? "" : "0px"
                    }}
                  >
                    <span style={{ color: "palevioletred" }}>
                      Should skill and working age merit be a factor in a work
                      visa and immigration? Is legal immigration virtuously slow
                      or racist? If legal immigration were quicker, wouldn't
                      illegal immigrants pay taxes?
                    </span>
                    {space}
                    <span style={{ color: "hotpink" }}>
                      Doesn't affordable housing fund the treasury?
                    </span>
                    <span
                      onClick={() => {
                        this.setState({ openEncamp: !this.state.openEncamp });
                      }}
                    >
                      Defer income and profit taxes
                    </span>
                    <br />
                    <span style={{ textDecoration: "line-through" }}>
                      with vaumoney NFT's
                    </span>
                    <br />
                    <span style={{ color: "lime" }}>
                      Do merchant processing third-party networks provide whole
                      life insurance accounts?
                    </span>
                    {space}
                    <span style={{ textDecoration: "line-through" }}>
                      What will happen to the U.S. House of Representatives Ways
                      and Means Committee when Nick Carducci automates merchant
                      processing permanent life insurance?
                    </span>
                    {space}
                    <i style={{ color: "orange" }}>
                      Why would anyone defer to pay more than the first income
                      tax bracket after convenient to client and essential
                      institutional gift expenses instead of a life insurance
                      sole proprietorship or even a programmatic non-profit
                      board member provider?
                    </i>
                    {space}How expensive would a global life insurance
                    processing provider cost in licensing?{space}
                    <span style={{ color: "skyblue" }}>
                      Isn't the House ways and Means Committee that of the
                      Internal Revenue Service as the Office of the Comptroller
                      of the Currency is to the Treasury, bureaucratically?
                    </span>
                    {space}Aren't institutional gifts tax exempt totally and on
                    an unlimited basis?{space}Are gifts to essential
                    institutions other than medicine and education tax exempt
                    totally and on an unlimited basis?
                  </div>
                  {/**we will use the goods to gget the job done 
                    every good is a service tho, which can have defered income.

                    how does the anarchist confront the blessings  of anyone but G-d? (marginalism.uk)

                    tax deferable NFT

                    What's the default either third party network merchant- and/or general-income escrow-account living will?

                    Would you not disown your child if they were proven to be dangerous?


                    //Can't escrow in a merchant account be paid out anytime for either business expenses or taxed income?
                    Do criminals or fatties more often wear black sweatpants?

                    Isn't entropic order giving way to chaos?

                    I believe marginalists the world-over would postulate that entropy is void of chaotic, cardinally-ordinal individuals.

                    Is the opportunity cost of not having emergency either tax or deficit healthcare coverage more expensive than its outcome or is escrow cardinal?

                    */}
                  <div
                    style={{
                      maxWidth: "400px",
                      fontSize: this.state.openEncamp ? "" : "0px",
                      transition: ".3s ease-in"
                    }}
                  >
                    <span style={{ textDecoration: "line-through" }}>
                      Is either a sole proprietor's or partnership's
                      business-related income that remains in a business account
                      taxable before it's either taken out in income tax or
                      spent in intermediate good sales tax? Corporations pay the
                      same taxes{space}
                      <b>quarterly</b>
                      {space}that{space}
                      <i>
                        sole proprietorships and partnerships{space}
                        <b>yearly</b>
                      </i>
                      {space}do. Do sole proprietorships and partnerships
                      usually{space}
                      <span style={{ textDecoration: "underline" }}>
                        pay income tax withholdings for their employees as they
                        do their payouts annually
                      </span>
                      {space}as well?
                    </span>
                    <br />
                    <br />
                    Can one person{space}
                    <span style={{ textDecoration: "underline" }}>
                      vote with their non-profit board providing processor users
                    </span>
                    {space}on{space}
                    <i>all changes to their bylaws</i>? Does the user even need
                    to bother to fill the empty seat with a programmatic and
                    {space}
                    <span style={{ textDecoration: "underline" }}>
                      open source gateway as the second boardmember
                    </span>
                    ?
                    <br />
                    <br />
                    Otherwise, either you plan to{space}
                    <b>spend two or three times slower</b>
                    {space}than you make{space}
                    <span style={{ textDecoration: "underline" }}>
                      you start saving money as an S Corp, LLC, or C Corporation
                      (and go public)
                    </span>
                    {space}
                    <i>we can report quarterly by a similar fee</i>
                    {space}(
                    <span style={{ color: "violet" }}>
                      At what tax bracket do people usually consider paying
                      quarterly corporate profit taxes? Why don't people just
                      defer taxes in a whole life insurance policy over $10,275?
                    </span>
                    ) or over being
                    {space}
                    <b>
                      a single proprietorship or equivalently shared partnership
                      with
                    </b>
                    {space}taxes.{space}
                    <i>
                      Isn't an{space}
                      <span style={{ textDecoration: "underline" }}>
                        internet business' processor account a functional
                        tax-deferred
                      </span>
                      {space}either depositary or depository? Wouldn't escrow in
                      money processor accounts still remain tax-deferred, even
                      if taxes were virtuously classified as "uniform"?
                    </i>
                    {space}
                    <span style={{ textDecoration: "underline" }}>
                      Can't either a third party network escrow or customer
                      merchant account buy a divisible certificate of deposit
                      with the account processing network to defer income taxes?
                      Is this why non-fungible tokens are so expensive and vary
                      wildly in price?
                    </span>
                    {space}
                    <i>
                      Are either merchant or escrow account processors' sole
                      proprietorship and partnership accounts with over $20,000
                      in annual transactions to report sales to the user and the
                      IRS in a 1099-K form{space}
                      <span style={{ textDecoration: "underline" }}>
                        upon a customer connected{space}
                        <b>account sale or income payout</b>?
                      </span>
                    </i>
                    <br />
                    <br />
                    Does either employee- or merchant-owned inventory unrelated
                    to business income become taxable?
                    {
                      /* buy with NFT made for payment, that acts as a certificat of deposit
                        each amount and purchase ID can AI-generate art
                        
                        */
                      space
                    }
                    <i>
                      Are any insurance policy premium personal consumptions
                      taxable income in-kind fringe benefits?
                      {/*Is all warranty or health insurance specifically tax exempt in-kind income benefits?

                        nurse cops? "don't cut squirrels' homes down"
                         */}
                    </i>
                    {space}Can AI-generated art from some purchase alphanumeric
                    identifier serve as a certificate of deposit with a merchant
                    tax-free? Does the third party network need some sort of
                    unsettled default risk to be legal today so far in the early
                    21st century?
                    <br />
                    <br />
                    What kinds of warranty are tax exempt in-kind benefits in
                    the United Kingdom?
                  </div>
                </div>
              }
              useCan={() =>
                this.setState({
                  tempRecentlyDeleted: !this.state.tempRecentlyDeleted
                })
              }
              useCanComment={
                <span>
                  <span
                    style={{
                      fontSize: this.state.moreSecure ? "" : "0px"
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
                          moreSecure: !this.state.moreSecure
                        });
                      }} /*type="submit"*/
                    >
                      security
                    </button>
                    secure your account with consensus in the cloud. I'm trying
                    to look to content secure by allow-list c̶o̶n̶s̶e̶n̶s̶u̶s̶ hullabaloo
                    with node Ethereum records{space}
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
                      fontSize: this.state.moreMore ? "" : "0px"
                    }}
                  >
                    {/*Very contrived/inextricable 
                  <br/>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      this.setState({
                        moreMore: !this.state.moreMore
                      });
                    }}
                  >*/}
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
                    . If anyone works at the Office of the Comptroller of the
                    Currency who would like to 12.1.5 sponsor vau.money Bank
                    Identification Number 86 all standing liquidity facilities,
                    {space}
                    <a
                      style={{
                        color: "rgb(230, 230, 170)"
                      }}
                      href="mailto:nick@vaults.biz"
                    >
                      nick@vaults.biz
                    </a>
                    {/*Is there an Office of the Comptroller of the Currency employee that would sponsor a fee-only bank? */}
                    {/*Migrational{space}
                  <a
                    style={{
                      cursor: "pointer",
                      color: "rgb(230, 230, 170)"
                    }}
                    href="https://virtualid.quora.com/Isn-t-insider-information-allowed-when-there-are-political-office-holds-reports-to-abstain-and-a-comment-box-in-the-brok"
                  >
                    timing
                  </a>
                  {space}of frequency comes to be the working-age 25-64 cohort
                  the same with natural rate of population increase, half life
                  ago. Notwithstanding children, school-age, retired, and
                  elderly population growth nor an unnatural rate of employment,
                  {space}
                  <a
                    style={{
                      cursor: "pointer",
                      color: "rgb(230, 230, 170)"
                    }}
                    href="https://www.reddit.com/r/dataisbeautiful/comments/oa7lg4/oc_real_gdp_per_capita_in_2011_usd_since_1800_for/"
                  >
                    real GDP growth
                  </a>
                  {space}
                  only for the
                  {space}
                  <a
                    style={{
                      cursor: "pointer",
                      color: "rgb(230, 230, 170)"
                    }}
                    href="https://ourworldindata.org/grapher/population-since-1800?country=NOR~CHE~USA~NLD~DEU~JPN~FRA~GBR~CHL~ARG~BRA~CHN~IND"
                  >
                    population
                  </a>
                  {space}
                  and not dynamic inflationary nor square footage ΔrGDP{">"}
                  <a
                    style={{
                      cursor: "pointer",
                      color: "rgb(230, 230, 170)"
                    }}
                    href="https://vaults.biz/gdp"
                  >
                    ΔrGDP/p
                  </a>
                  -productivity.{space}Is overeating equality? Doesn't a made
                  price turn elasticity? Investment labor should either (1)
                  deflate or (2){space}
                  <a
                    style={{ color: "lightskyblue" }}
                    href="https://census.quora.com/In-what-ways-has-Capitalism-been-successful-in-lifting-people-out-of-poverty-1"
                  >
                    impoverish generally
                  </a>
                  . When has real growth instead fallen?*/}
                  </span>
                </span>
                /**
             * <div style={{ textAlign: "left", width: "80%" }}>
          <a href="https://www.marxists.org/reference/archive/smith-adam/works/moral/part02/part2b.htm#2.3">
            Nature
          </a>
          {space}and{space}
          <a href="https://www.marxists.org/reference/archive/smith-adam/works/wealth-of-nations/book02/ch01.htm">
            Capital
          </a>
          ...{space}and{space}
          <a href="https://www.reddit.com/r/moralanarchism/">Moral</a>
          <br />
             */
              }
              root={
                //this.props.onroot &&
                <Cash
                  openBanks={this.state.openBanks}
                  openNewBank={this.state.openNewBank}
                  setApp={(e) => this.setState(e)}
                  openListedTransations={this.state.openListedTransations}
                  tempRecentlyDeleted={this.state.tempRecentlyDeleted}
                  history={this.props.history}
                  pathname={this.props.pathname}
                  //teammember
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
                    window.meAuth.uid
                  }
                  transactions={this.state.transactions}
                  businesses={this.state.businesses}
                  users={[]}
                  user={this.state.user}
                  auth={window.meAuth}
                  access_token={this.state.access_token}
                  deletePouchToken={() => this.state.tdb.deleteKeys()}
                  setPouchToken={async (access_token) => {
                    this.setState({ access_token });
                    this.setPouchToken(access_token, "setKey");
                  }}
                  onroot={this.props.onroot}
                  defaultSendingFund={this.state.defaultSendingFund}
                />
              }
              home={
                //!this.props.onroot &&
                !window.location.href.includes(
                  "https://employee.scopes.cc/"
                ) && (
                  <Application
                    openLegal={this.state.openLegal}
                    setLegal={(e) => this.setState(e)}
                    onroot={this.props.onroot}
                    emulateRoot={this.props.emulateRoot}
                    onscroll={this.props.onscroll}
                    lastPath={this.props.lastPathname}
                    pathname={this.props.pathname}
                    history={this.props.history}
                    auth={window.meAuth}
                    users={[]}
                    logout={logoutofapp}
                    open={() =>
                      this.setState(
                        {
                          viewCompany: null
                        },
                        this.props.emulateRoot
                      )
                    }
                  />
                )
              }
            />
          ) : (
            <S404
              onscroll={this.props.onscroll}
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
