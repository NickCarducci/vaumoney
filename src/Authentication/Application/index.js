import React from "react";
import { suggestions } from "./funcData";
import Mapbox from "./Mapbox";
import Nav from "./Nav";
//import locs from "mastercard-locations";

export const standardCatch = (err) => console.log(err.message);

class Application extends React.Component {
  constructor(props) {
    super(props);
    var mountSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];
    const city = mountSuggestion.place_name;
    const center = mountSuggestion.center;
    this.state = {
      center,
      distance: 15,
      y: 15,
      zoomChosen: 8,
      radioChosen: 8,
      scrollChosen: 8,
      city,
      mountSuggestion,
      deviceLocation: false
    };
  }

  /*
  user.username &&
  user.name &&
  user.surname &&
  user.email &&
  user.address1 &&
  user.city &&
  user.state &&
  user.ZIP &&
  user.DOB &&
  user.SSN &&
  meAuth.uid*/
  chooseCitypoint = async (
    center,
    distance,
    city,
    cityapi,
    stateapi,
    tile,
    noLoad
  ) => {
    if (city.replace(/[ ]+/g, "_") !== this.props.pathname) {
      this.props.sustainPath(city);
    }
    console.log(city + " fetching");
    /**
          var Lat = center[0];
          var Length = distance * 1.60934;
          var Ratio = 100;
          var WidthPixel = window.innerWidth;
          this.calculateZoom(WidthPixel, Ratio, Lat, Length, city);
         */

    this.setState(
      {
        previousCityQuery: [
          center,
          distance,
          city,
          cityapi,
          stateapi,
          tile,
          noLoad
        ],
        center
      },
      () => {}
    );
  };
  sustainPath = (city, once) => {
    clearTimeout(this.susPath);
    this.susPath = setTimeout(() => {
      this.setState(
        {
          pathAliasDiffCity: once ? city : this.state.pathAliasDiffCity
        },
        () => this.props.history.push(city.replace(/[ ]+/g, "_"))
      );
    }, 200);
  };
  render() {
    return (
      <div
        style={{
          //zIndex: -1,
          left: "0px",
          top: "0px",
          position: "fixed",
          width: "100%"
        }}
      >
        <div
          style={{
            position: "relative",
            backgroundColor: "black",
            textAlign: "center",
            width: "100%"
          }}
        >
          <div
            style={{
              //zIndex: "-1",
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(20,20,60,.7)"
            }}
            onClick={() => this.props.emulateRoot({ onroot: true })}
          >
            <div
              onClick={() => {
                this.setState({ openListedTransations: true });
              }}
              style={{
                display: "flex",
                position: "relative",
                left: "20px",
                width: "36px",
                height: "36px",
                backgroundColor: "rgb(25,35,25)",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "5px",
                color: "white",
                fontSize: "30px"
              }}
            >
              ~
            </div>

            <div
              onClick={async () => {
                this.setState({ openNewBank: true, openBanks: false });
                if (
                  this.props.user !== undefined &&
                  this.props.user.username &&
                  this.props.user.name &&
                  this.props.user.surname
                ) {
                  if (!this.props.access_token) {
                    console.log("no token -- fetching...");
                    this.getDwollaToken();
                  } else {
                    console.log("reusing token.");
                  }
                } else {
                  window.alert("please sign up to transfer");
                }
              }}
              style={{
                display: "flex",
                position: "relative",
                left: "20px",
                width: "36px",
                height: "36px",
                backgroundColor: "rgb(25,35,25)",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "5px",
                color: "white",
                fontSize: "30px"
              }}
            >
              +
            </div>

            <h2
              style={{
                display: "flex",
                position: "relative",
                left: "20px",
                width: "36px",
                height: "36px",
                backgroundColor: "rgb(25,35,25)",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "5px",
                color: "white",
                fontSize: "30px"
              }}
              onClick={() => {
                this.setState({ openBanks: true, openNewBank: true });
              }}
            >
              ${this.state.balance}
            </h2>
          </div>
          <Mapbox
            center={this.state.center}
            city={this.state.city}
            mountSuggestion={this.state.mountSuggestion}
            chooseCitypoint={this.chooseCitypoint}
            deviceLocation={this.state.deviceLocation}
            sustainPath={this.sustainPath}
          />
        </div>
        <Nav
          openLegal={this.props.openLegal}
          setLegal={this.props.setLegal}
          center={this.state.center}
          city={this.state.city}
          setApp={(x) => this.setState(x)}
          open={this.props.open}
          deviceLocation={this.state.deviceLocation}
          chooseCitypoint={this.chooseCitypoint}
        />
      </div>
    );
  }
}

export default Application;
