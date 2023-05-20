import React from "react";
class Documentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username:
        props.user && props.user.username ? props.user.username : "nick",
      billingHistory: {},
      domains:
        props.user && props.user.domains
          ? props.user.domains
          : ["scopes.cc", "wavv.art"],
      issues: {},
      chosenDomain: ""
    };
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.user !== this.props.user) {
      this.props.user !== undefined &&
        this.setState({
          username: this.props.user.username,
          domains:
            this.props.user.domains && this.props.user.domains.length > 0
              ? this.props.user.domains
              : ["scopes.cc", "wavv.art"]
        });
    }
  };
  componentWillUnmount = () => {
    clearTimeout(this.hoverless);
  };
  render() {
    const space = " ";
    const header = () => (
      <tr>
        <td
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{ userSelect: "none" }}
            onClick={() => this.props.navigate("/login")}
          >
            {"<"}
          </div>
          <div>&nbsp;&nbsp;&nbsp;Vault-co.in&nbsp;&nbsp;&nbsp;</div>
          <div>nick@</div>
        </td>
        <td style={{ fontSize: "12px" }}>
          terminal&nbsp;&nbsp;&nbsp;&nbsp;
          <br />
          <div
            style={{
              backgroundColor: "white",
              position: "absolute"
            }}
          >
            vaumoney
          </div>
        </td>
        <td>
          <div style={{ fontSize: "12px" }}>
            codesandbox.io/s/vau-money-jwi5k ?
            <br />
            <div
              style={{
                backgroundColor: "white",
                position: "absolute"
              }}
            >
              /src/Authentication
            </div>
          </div>
        </td>
      </tr>
    );
    return (
      <div>
        <table
          style={{
            /*transform: `translate(0%,0%) rotate(${
              this.props.scrollTop > 0 ? 0 : 180
            }deg)`,*/
            transition: ".3s ease-in",
            transform: `translateY(${this.props.scrollTop > 0 ? 0 : -150}%)`,
            zIndex: "1",
            position: "fixed",
            width: "100px",
            whiteSpace: "nowrap",
            backgroundColor: "white"
          }}
        >
          <thead>{header()}</thead>
        </table>
        <table
          style={{
            width: "100px",
            whiteSpace: "nowrap"
          }}
        >
          <thead>
            <tr>
              <td
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div
                  style={{ userSelect: "none" }}
                  onClick={() => this.props.navigate("/login")}
                >
                  {"<"}
                </div>
                <div>Vault-co.in</div>
                <div>nick@</div>
              </td>
              <td style={{ fontSize: "12px" }}>
                terminal
                <br />
                <div style={{ position: "absolute" }}>vaumoney</div>
              </td>
              <td>
                <div style={{ fontSize: "12px" }}>
                  codesandbox.io/s/vau-money-jwi5k ?
                  <br />
                  <div style={{ position: "absolute" }}>
                    /src/Authentication
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <form>
                  <input placeholder="domain origin"></input>
                </form>
              </td>
            </tr>
            <tr style={{ fontSize: "12px", backgroundColor: "yellowgreen" }}>
              <td style={{ textAlign: "right" }}>My marketplaces</td>
              <td style={{ textAlign: "center", fontSize: "10px" }}>
                processing
              </td>
              <td
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ opacity: 0.5 }}>
                  /do-service-app (/integrity build-logs)
                </div>
              </td>
            </tr>
            {this.state.domains.map((x, i) => (
              <tr style={{ fontSize: "12px" }}>
                <td
                  style={{
                    userSelect: "none",
                    textAlign: "right",
                    backgroundColor:
                      this.state.chosenDomain === x ? "dodgerblue" : "",
                    color: this.state.chosenDomain === x ? "white" : ""
                  }}
                  onClick={() =>
                    this.setState({
                      chosenDomain: this.state.chosenDomain === x ? "" : x
                    })
                  }
                >
                  <span style={{ opacity: 0.4, fontSize: "9px" }}>caller</span>
                  {space}
                  {x}
                </td>
                <td
                  onClick={() => {
                    if (this.state.hoverDel === x)
                      window.confirm("delete domain for next month?");
                  }}
                  onMouseEnter={() => {
                    this.setState({ hoverDel: x }, () => {
                      clearTimeout(this.hoverless);
                      this.hoverless = setTimeout(() => {
                        this.setState({ hoverDel: null });
                      }, 2000);
                    });
                  }}
                  style={{
                    textAlign: "center",
                    opacity: this.state.hoverDel === x ? 0.5 : 0.2
                  }}
                >
                  <span role="img" aria-label="trash">
                    &#128465;
                  </span>
                </td>
                <td>{/* $3/issue */}$5/mo</td>
              </tr>
            ))}
          </tbody>
          <thead>
            <tr
              style={{
                fontSize: this.state.chosenDomain !== "" ? "12px" : "0px",
                transition: ".1s ease-out",
                backgroundColor:
                  this.state.chosenDomain !== "" ? "lightsalmon" : ""
              }}
            >
              <td style={{ textAlign: "right" }}>
                {this.state.chosenDomain}/{"${username}"}
              </td>
              <td
                style={{
                  textAlign: "center",
                  fontSize: this.state.chosenDomain !== "" ? "11px" : "0px"
                }}
              >
                issuing
              </td>
              <td
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div>+$2 issue/mo</div>
              </td>
            </tr>
          </thead>
          <tbody>
            {this.state.issues[this.state.chosenDomain] &&
              this.state.issues[this.state.chosenDomain].map((x, i) => (
                <tr style={{ fontSize: "12px" }}>
                  <td style={{ textAlign: "right" }}>{x.name}</td>
                  <td></td>
                  <td>{/* $3/issue */}$5/mo +$2 issue/mo</td>
                </tr>
              ))}
          </tbody>
          <thead>
            <tr style={{ fontSize: "12px", backgroundColor: "lightsteelblue" }}>
              <td style={{ textAlign: "right" }}>{this.state.username}</td>
              <td style={{ textAlign: "center", fontSize: "11px" }}>history</td>
              <td
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div>monthly / annnual</div>
              </td>
            </tr>
          </thead>
          <tbody>
            {this.state.billingHistory[this.state.username] &&
              this.state.billingHistory[this.state.username].map((x, i) => (
                <tr style={{ fontSize: "12px" }}>
                  <td style={{ textAlign: "right" }}>{x.name}</td>
                  <td></td>
                  <td>{/* $3/issue */}$5/mo +$2 issue/mo</td>
                </tr>
              ))}
          </tbody>
          <thead>
            <tr>
              <td>
                <span style={{ textDecoration: "underline" }}>
                  Tokenization
                </span>
              </td>
              <td>var</td>
              <td>/${"{app}"}/Cash/STRIPE_ADDRESS/index.js</td>
              {/*<td>
                Are economists, union leaders, or technologists good people?
                Is a CarShield, Inflation Reduction Act, or T-Mobile price lock guarantee legitimately premium? Are broadband, health care, or auto providers variable final good capital?
                Would joining WIPO save Taiwan?
                Does the Justice Department make deals with the USPTO's pharmaceutical companies?
              </td>*/}
            </tr>
            <tr>
              <td>User</td>
              <td>
                <span style={{ color: "dodgerblue" }}>firebase</span>
              </td>
              <td>/${"{vaumoney}"}/FIREBASE_SUDO/index.js</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <td>Initialization</td>
              <td>app</td>
              <td>/src/Authentication/Application</td>
              {/*<td>
                Are economists, union leaders, or technologists good people?
                Is a CarShield, Inflation Reduction Act, or T-Mobile price lock guarantee legitimately premium? Are broadband, health care, or auto providers variable final good capital?
                Would joining WIPO save Taiwan?
                Does the Justice Department make deals with the USPTO's pharmaceutical companies?
              </td>*/}
            </tr>
          </thead>
          <tbody>
            {["join"].map((x) => (
              <tr style={{ fontSize: "14px" }}>
                <td style={{ textAlign: "right" }}>/{x}</td>
                <td style={{ width: "max-content" }}>:&nbsp;account</td>
                <td
                  style={{
                    maxWidth: "300px"
                  }}
                >
                  {"{"}
                  <br />
                  <div
                    style={{
                      marginLeft: "8px",
                      backgroundColor: "rgba(80,30,160,.2)"
                    }}
                  >
                    newAccount:{" {"}
                    <br />
                    &nbsp;&nbsp;business_profile:{" {"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;mcc: ""
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;name: ""
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;product_description: `${"{"}name
                    {"}"} ${"{"}
                    mcc{"}"} yadda yadda`
                    <br />
                    <span style={{ color: "dodgerblue" }}>
                      &nbsp;&nbsp;&nbsp;&nbsp;support_email: /${"{app}"}
                      /Cash/FIREBASE_EMAIL/index.js
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;support_phone: phoneNumber
                    </span>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;support_url: `https://vau.money/$
                    {"{"}username{"}"}`
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;url: `https://vau.money/$
                    {"{"}username{"}"}`
                    <br />
                    &nbsp;&nbsp;{"}"}
                    <br />
                    &nbsp;&nbsp;settings:{" {"}
                    <br />
                    {/*payouts_enabled: true,
                      controller: {
                        type: "application",
                        is_controller: true
                      },* / //https://stripe.com/docs/connect/platform-controls-for-standard-accounts
                  //why are the above on the doc-spec account object but not "create" iteration
                  /*card_issuing: {
                  tos_acceptance: {
                    user_agent,
                    date,
                    ip
                  }
                },
                  //https://stripe.com/docs/connect/statement-descriptors
                  */}
                    &nbsp;&nbsp;&nbsp;&nbsp;payouts
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;payments:{" {"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;statement_descriptor:
                    mcc + " " + name
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {" }"}
                    <br />
                    &nbsp;&nbsp;
                    {"}"}
                    <br />
                    &nbsp;&nbsp;business_type: "company"
                    <br />
                    &nbsp;&nbsp;default_currency: "usd"
                    <br />
                    {/*&nbsp;&nbsp;tos_acceptance:{" {"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;...ownership_declaration,
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;service_agreement: "full"
                    <br />&nbsp;&nbsp;{"}"}
                    
                    Paper bag politics*/}
                    <br />
                    {"}"}
                  </div>
                  &nbsp;&nbsp;first: ""
                  <br />
                  &nbsp;&nbsp;last: ""
                  <br />
                  &nbsp;&nbsp;person:{" { "}
                  <span style={{ textDecoration: "underline" }}>
                    account_token
                  </span>
                  : `${"{Tokenization}` }"}
                  <br />
                  &nbsp;&nbsp;companyAccount:{" { "}
                  <span style={{ textDecoration: "underline" }}>
                    account_token
                  </span>
                  : `${"{Tokenization}` }"}
                  <br />
                  &nbsp;&nbsp;customer:{" {"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;email:{space}
                  <span style={{}}>
                    /${"{app}"}/Cash/FIREBASE_MULTI/index.js
                  </span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;name: ""
                  <br />
                  <span style={{ color: "dodgerblue" }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;phone: phoneNumber
                  </span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;shipping:{space}
                  <span style={{ textDecoration: "line-through" }}>
                    Tokenization
                  </span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;invoice_prefix: `${"{"}username{"}"}`
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;description: `${"{"}name{"}"} ${"{"}
                  mcc{"}"} yadda yadda`
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  {"}"}
                </td>
              </tr>
            ))}
          </tbody>
          <thead>
            <tr>
              <td>Extensible</td>
            </tr>
          </thead>
          <tbody>
            {[
              "customer",
              "scope",
              "purchase",
              "add",
              "load",
              "link",
              "advance",
              "w2"
            ].map((x) => (
              <tr style={{ fontSize: "14px" }}>
                <td style={{ textAlign: "right" }}>/{x}</td>
                <td style={{ width: "max-content" }}>
                  :&nbsp;{x === "customer" ? "issue" : "actions"}
                </td>
              </tr>
            ))}
          </tbody>
          <thead>
            <tr>
              <td>Reconciliation</td>
            </tr>
          </thead>
          <tbody>
            {["integrity", "search", "transfers", "maintenance"].map((x) => (
              <tr style={{ fontSize: "14px" }}>
                <td style={{ textAlign: "right" }}>{x}</td>
                <td style={{ width: "max-content" }}>:&nbsp;reports</td>
                <td style={{ textAlign: "right", display: "flex" }}>
                  {JSON.stringify({ code: "<your>" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Documentation;
