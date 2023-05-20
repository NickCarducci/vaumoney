import React from "react";
import Cash from "./Cash";
import TDB, { suggestions } from "./funcData";
//import locs from "mastercard-locations";

export const standardCatch = (err) => console.log(err.message);
export default class App extends React.Component {
  constructor(props) {
    super(props);
    var mountSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];
    const city = mountSuggestion.place_name;
    const center = mountSuggestion.center;
    let tdb = new TDB();
    this.state = {
      center,
      distance: 15,
      y: 15,
      zoomChosen: 8,
      radioChosen: 8,
      scrollChosen: 8,
      city,
      mountSuggestion,
      deviceLocation: false,
      tdb,
      fundingSources: [],
      businesses: [],
      transactions: []
    };
  }
  componentDidMount = async () => {
    const result = await this.state.tdb.readKey();
    result &&
      Object.keys(result).length !== 0 &&
      result.constructor === Object &&
      console.log(`token ${Object.keys(result)} found`);
    result &&
      Object.keys(result).length !== 0 &&
      result.constructor === Object &&
      this.setState({ access_token: Object.keys(result) });
    const aliyunURL = ``;
    fetch(aliyunURL)
      .then(async (res) => await res.json())
      .then((result) => {
        console.log(result);
      });
  };

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
          textAlign: "center",
          minHeight: "100vh",
          width: "100%"
        }}
      >
        <Nav
          center={this.state.center}
          city={this.state.city}
          setApp={(x) => this.setState(x)}
          open={() => this.setState({ vaumoneyOpen: true })}
          deviceLocation={this.state.deviceLocation}
          chooseCitypoint={this.chooseCitypoint}
        />

        <Mapbox
          center={this.state.center}
          city={this.state.city}
          mountSuggestion={this.state.mountSuggestion}
          chooseCitypoint={this.chooseCitypoint}
          deviceLocation={this.state.deviceLocation}
          sustainPath={this.sustainPath}
        />
        <Cash
          logout={this.props.logout}
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
            this.state.auth.uid
          }
          transactions={this.state.transactions}
          businesses={this.state.businesses}
          fundingSources={this.state.fundingSources}
          users={this.props.users}
          user={this.props.user}
          auth={this.props.auth}
          access_token={this.state.access_token}
          deletePouchToken={() => this.state.tdb.deleteKeys()}
          setPouchToken={async (access_token) => {
            this.setState({ access_token });
            this.setPouchToken(access_token, "setKey");
          }}
          vaumoneyOpen={this.state.vaumoneyOpen}
          closeVaumoney={() => this.setState({ vaumoneyOpen: false })}
          defaultSendingFund={this.state.defaultSendingFund}
        />
      </div>
    );
  }
}
