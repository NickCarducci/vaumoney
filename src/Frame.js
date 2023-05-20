import React from "react";
import Authentication from "./Authentication/index.js";
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
    this.handleScroll();
  };
  assumepath = () => {
    var path = this.state.p.split("/")[1];
    path = "/" + (path.split("/")[1] ? path.split("/")[1] : path);
    //console.log("path", path);
    //this.setState({ sudo404: false });
    // trigger = true
    console.log("path", path);
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
    clearTimeout(this.scrollTimeout);
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
        /*clearTimeout(this.timey);
        this.timey = setTimeout(
          () =>
            this.setState({
              onscroll:
                window.document.body.scrollHeight -
                  window.document.body.clientHeight >
                50
            }),
          200
        );*/

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
    const { p: pathname, l: location, n: navigate } = this.state;
    //const query = location.search.split("?");
    const url = new URL(window.location.href);
    const query = url.searchParams.get("message");
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
          display: pathname.includes("/docs") && "none",
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
    }; //"/docs/"
    return (
      <div
        style={{
          //width: this.props.width - 40,
          //I named my squirrel
          //position: "absolute",
          transition: ".3s ease-in",
          //justifyContent: this.props.onscroll ? "start" : "space-around",
          //maxheight: "min-content",
          //height: "calc(100vh - 20px)", <Links pathname={pathname} />
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            position: "relative"
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
          {
            //window.location.href.includes("https://vau.money/") ? (
            <a
              {...setting(8, {
                textDecoration: "none",
                position: "fixed",
                right: "30px",
                top: "40px"
              })}
              href="https://vau.money/login"
            >
              &diams;
            </a>
            /*) : (
            <div
              {...setting(8, {
                textDecoration: "none",
                position: "fixed",
                right: "30px",
                top: "40px"
              })}
              onClick={() =>
                this.setState({
                  viewCompany: null
                })
              }
            >
              &diams;
            </div>
            )*/
          }
          <div
            {...setting(8, {
              textAlign: "left",
              padding: "6px 4px",
              color: "black",
              textDecoration: "none",
              position: "fixed",
              right: "10px",
              bottom: "0px"
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
          </div>
          <Authentication
            navigate={navigate}
            width={this.props.width}
            lastWidth={this.props.lastWidth}
            availableHeight={this.props.availableHeight}
            sudo404={this.state.sudo404}
            //onscroll={this.state.onscroll}
            scrolling={this.state.scrolling}
            scrollTop={this.state.scrollTop}
            lastPath={this.props.lastPathname}
            pathname={pathname}
            history={location.history}
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
