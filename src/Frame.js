import React from "react";
import Cable from "./Dropwire.js";
import Authentication from "./Authentication/index.js";
import Links from "./Authentication/Links/index.js";

class Frame extends React.Component {
  constructor(props) {
    super(props);
    const { paths, l, n } = this.props;
    //ref={this.props.fwd}
    const init = {
      scrollTop: 0,
      top: 0,
      scrolling: false,

      p: "/" + paths["*"], //"everyone in order to be for the people that use it. who decides?"
      l,
      n
    };
    //console.log(paths);
    this.state = { ...init, sudo404: true };
  }

  componentDidMount = () => {
    this.assumepath();
    window.addEventListener("scroll", this.handleScroll, false);
  };
  assumepath = () => {
    var path = this.state.p.split("/")[1];
    path = "/" + (path.split("/")[1] ? path.split("/")[1] : path);
    //console.log("path", path);
    if (!["/", "/transactions", "/withdrawals", "/login"].includes(path)) {
      this.setState({ sudo404: false });
      // trigger = true
      console.log("path", path);
    }
    if (path === "/login") this.setState({ onroot: true });
  };
  componentDidUpdate = (prevProps) => {
    const { paths, l, n } = this.props;
    if (paths !== prevProps.paths) {
      this.setState({
        p: "/" + paths["*"],
        l,
        n
      });
    }
  };
  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };
  handleScroll = (e) => {
    const innerHeight = window.innerHeight;
    const scrollTop = window.scrollY; //+ window.innerHeight;
    // const scrollHeight = window.pageYOffset; //document.documentElement.scrollHeight;

    const top = scrollTop === 0;
    this.setState(
      {
        landedPresentation: false,
        scrolling: true,
        top,
        scrollTop
      },
      () => {
        clearTimeout(this.timey);
        this.timey = setTimeout(
          () =>
            this.setState({
              onscroll:
                window.document.body.scrollHeight -
                  window.document.body.clientHeight >
                50
            }),
          200
        );

        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.setState({
            scrollPlacementHeight: Math.round(
              (innerHeight - 65) *
                (window.scrollY / document.documentElement.scrollHeight)
            ),
            scrolling: false
          });
        }, 900);
      }
    );
  };
  render() {
    const { p: pathname, l: location, n } = this.state;
    const sp =
      location.state &&
      location.state.statePathname &&
      location.state.statePathname;
    //const {} = this.state;
    //console.log(this.state.username);
    //const space = " ";
    const setting = (n, more) => {
      return {
        style: {
          color: this.state["hoverin" + n] ? "rgb(50,70,90)" : "black",
          cursor: "pointer",
          ...more
        },
        onMouseEnter: () => this.setState({ ["hoverin" + n]: true }),
        onMouseLeave: () => this.setState({ ["hoverin" + n]: false })
      };
    };
    const setting2 = (n, more) => {
      return {
        style: {
          color: this.state["hoverin" + n]
            ? "rgb(80,100,120)"
            : "rgb(50,70,90)",
          cursor: "pointer",
          ...more
        },
        onMouseEnter: () => this.setState({ ["hoverin" + n]: true }),
        onMouseLeave: () => this.setState({ ["hoverin" + n]: false })
      };
    };
    return (
      <div
        style={{
          //I named my squirrel
          position: "relative",
          transition: ".3s ease-in",
          display: "flex",
          flexDirection: "column",
          justifyContent: this.props.onscroll ? "start" : "space-around",
          //maxheight: "min-content",
          //height: "calc(100vh - 20px)",
          fontFamily: "sans-serif"
        }}
      >
        <Links pathname={pathname} />
        <div
          style={{
            position: "relative",
            top: "0px"
          }}
        >
          <div
            style={{
              bottom: "80px",
              left: "0px",
              width: "200px",
              position: "fixed"
            }}
          >
            {/*<Cable
              style={{
                boxShadow: "0px 0px 0px 0px transparent",
                width: "100px",
                transform: "scale(-1,1)"
              }}
              onError={handleScollImgError}
              img={true}
              src={
                this.state.noyoutube
                  ? ""
                  : "https://www.dropbox.com/s/zgceu1uen2ov9n1/transparentSaverAcorn.png?raw=1"
              }
              float={null}
              title="author"
              scrolling={this.state.scrolling}
              fwd={this.henri}
              scrollTopAndHeight={this.state.scrollTop + window.innerHeight}
              scrollTop={!this.state.oldecon ? 0 : this.state.scrollTop}
            />*/}
            <h3> </h3>
            <h4> </h4>
          </div>
          {window.location.href.includes("https://scopes.cc/") ? (
            <a
              {...setting(8, {
                textDecoration: "none",
                position: "fixed",
                right: "30px",
                top: "40px"
              })}
              href="https://employee.scopes.cc"
            >
              &diams;
            </a>
          ) : (
            <div
              {...setting(8, {
                textDecoration: "none",
                position: "fixed",
                right: "30px",
                top: "40px"
              })}
              onClick={() =>
                this.setState({
                  viewCompany: null,
                  onroot: !this.state.onroot
                })
              }
            >
              &diams;
            </div>
          )}
          <div
            //onClick={() => this.setState({ morewhy: !this.state.morewhy })}
            {...setting(20, {
              textAlign: "left",
              color: "white",
              textDecoration: "none",
              position: "fixed",
              right: "30px",
              top: "80px"
            })}
          >
            {!this.state["hoverin" + 20] ? (
              "what?"
            ) : (
              <div
                style={{
                  padding: "30px 0px",
                  transform: "translateY(-30px)",
                  maxWidth: "200px"
                }}
              ></div>
            )}
          </div>
          <div
            onClick={() => this.setState({ morewhy: !this.state.morewhy })}
            {...setting(30, {
              textAlign: "left",
              color: "white",
              textDecoration: "none",
              position: "fixed",
              left: "30px",
              top: "calc(100% - 70px)"
            })}
            //onMouseEnter={() => this.setState({ hvr: true })} "not the  cost, it is the price, this price is risk of something,"
            //"asset is only worth something pay for it, input costs matter." we are talking about normal things "saliency [of real]"
            //Why do psychiatrists change medications for their patients? Aren't they all guessing and checking? Why can???t patients quit their services once they try them?
            //Has homelessness and involuntary residences increased while poverty has decreased because they weren???t medicated?
          >
            {!this.state["hoverin" + 30] ? (
              "?"
            ) : (
              <span style={{ padding: "30px 0px" }}></span>
            )}
          </div>
          <div
            {...setting(8, {
              textAlign: "left",
              padding: "6px 4px",
              color: "white",
              textDecoration: "none",
              position: "fixed",
              left: "30px",
              top: "40px"
            })}
          >
            <span
              style={{
                top: "-20px",
                userSelect: "none",
                margin: "3px",
                padding: "0px 8px",
                left: "0px",
                position: "absolute",
                display: "block",
                borderRadius: "10px",
                border: "1px solid"
              }}
            >
              <span style={{ fontSize: "9px" }}>
                {
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                  ][new Date().getMonth()]
                }
              </span>
              <br />
              {new Date().getDate()}
            </span>
            <br />
            <a
              {...setting(8, {
                color: "white",
                textDecoration: "none"
              })}
              href="https://vaults.biz/party"
            >
              vaults.biz
            </a>

            {!this.state.morewhy && (
              <div //currency only as good as durable.
                //Isn't the Office of the Comptroller of the Currency in charge of PayPal?
                //Should everyone drop what they are doing and compete with Ticketmaster?
                //Is a nation always down in terms of GDP?
                //Wouldn't Independent be bad advice to describe Nick Carducci for Senate?
                // /Aren't paying publishers alone allowed to prohibit certain ideas?
                //would you be down r/richsaltneolib thetax.party
                //democracy spoofs boss

                //"we are all star babies." you take job in variable labor you harm
                style={{
                  width: "min-content", //Aren't paying publishers alone allowed to prohibit certain ideas?
                  boxShadow: "-4px -4px 1px 1px rgb(240,130,190)",
                  padding: "6px 4px",
                  left: "30px",
                  top: "40px",
                  backgroundColor: "rgb(30,30,90)",
                  borderRadius: "10px",
                  textAlign: "left",
                  color: "white",
                  textDecoration: "none",
                  position: "relative"
                }}
              ></div>
            )}
          </div>
          <Authentication
            lastWidth={this.props.lastWidth}
            availableHeight={this.props.availableHeight}
            sudo404={this.state.sudo404}
            onroot={this.state.onroot}
            onscroll={this.state.onscroll}
            scrolling={this.state.scrolling}
            scrollTop={this.state.scrollTop}
            lastPath={this.props.lastPathname}
            pathname={pathname}
            history={location.history}
            emulateRoot={() =>
              this.setState({
                onroot: !this.state.onroot
              })
            }
            setSudo={() => this.setState({ sudo404: false })}
          />
        </div>
        <div
          style={{
            position: "fixed",
            //alignSelf: "start",
            bottom: "3px",
            right: "5px"
          }}
        ></div>
      </div>
    );
  }
}

export default Frame;
