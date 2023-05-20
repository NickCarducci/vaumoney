import React from "react";

class Nav extends React.Component {
  state = { openLegal: true };
  render() {
    const { deviceLocation, distance } = this.props;
    const resetPos = (city) => {
      var center = null;
      if (city) {
        center = this.state.center;
        this.props.setApp({ city: null });
      } else {
        center = deviceLocation.center;
        city = deviceLocation.city;
      }
      setTimeout(() => {
        this.setState({
          center
        });
        const cityapi = city.split(",")[0].replace(/[, ]+/g, "_");
        //const stateapi = "California";
        const state = deviceLocation.city.split(", ")[1];
        const stateapi = state.replace(/ /g, "_");
        this.props.chooseCitypoint(
          city ? this.state.center : deviceLocation.center,
          distance,
          deviceLocation.city,
          cityapi,
          stateapi,
          null
        );
      }, 1234);
    };
    const setByMapbox = (longitude, latitude) => {
      this.setState({ city: null }, () =>
        fetch(
          //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
        )
          .then(async (response) => await response.json())
          .then(
            (body) => {
              var city = body.features[0].place_name;
              if (city) {
                var center = body.features[0].center;
                //console.log("found " + city, center);
                if (city !== this.props.city) {
                  const cityapi = city.split(",")[0].replace(/[, ]+/g, "_");
                  const state = city.split(", ")[1];
                  const stateapi = state.replace(/ /g, "_");
                  this.props.setApp(
                    {
                      deviceLocation: { city, center }
                    },
                    () => {
                      this.props.chooseCitypoint(
                        center,
                        this.state.distance,
                        city,
                        cityapi,
                        stateapi,
                        null
                      );
                      console.log("set " + city, center);
                      this.props.setCommunity({ city });
                    }
                  );
                } else this.resizee(false, center);
              }
            },
            (err) => console.log(err)
          )
          .catch((err) => {
            console.log(err);
            alert("please try another city name");
          })
      );
    };
    const errorHandling = (positionError) =>
      positionError.code === 1
        ? () =>
            this.props.setApp({ deviceLocation: "red" }, () =>
              console.log("PERMISSION_DENIED:Permission denied")
            )
        : positionError.code === 2
        ? () =>
            this.props.setApp({ deviceLocation: "orange" }, () =>
              window.alert(
                "systemError:POSITION_UNAVAILABLE:Permission allowed, location disabled:please try again later"
              )
            )
        : positionError.code === 3
        ? () =>
            this.props.setApp({ deviceLocation: false }, () =>
              window.alert(
                "devError:TIMEOUT:Permission allowed, timeout reached:please check your browser settings, try again later or contact nick@thumbprint.us please"
              )
            )
        : null;

    // else console.log(positionError);

    const getPos = () =>
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lastCoords = [
            position.coords.longitude,
            position.coords.latitude
          ];
          if (this.state.lastCoords !== lastCoords) {
            this.setState({
              lastCoords
            });
            setByMapbox(position.coords.longitude, position.coords.latitude);
          } else {
            this.resizee(false, [
              position.coords.longitude,
              position.coords.latitude
            ]);
          }
        },
        (positionError) => {
          errorHandling(positionError);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: Infinity
        }
      );

    const noDeviceLocation = () => {
      if (!navigator.geolocation) {
        window.alert(
          "Geolocation is not supported by your browser " + navigator.userAgent
        );
      } else {
        getPos();
        /*navigator.permissions && navigator.permissions.query({name: 'geolocation'})
      .then(function(PermissionStatus) {if (PermissionStatus.state == 'granted') {//allowed
      } else if (PermissionStatus.state == 'prompt') { // prompt - not yet grated or denied
      } else {//denied}})*/
      }
    };
    const space = " ";
    return (
      <div
        style={{
          top: "0px",
          position: "absolute",
          height: "min-content"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: "rgb(140,180,150)",
            borderBottom: "1px white solid",
            height: "56px",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white"
          }}
        >
          <div style={{ margin: "0px 6px", lineHeight: "18px" }}>
            <h2 style={{ margin: "4px 0px" }} onClick={this.props.open}>
              Vaumoney
            </h2>
            <span style={{ fontSize: "12px" }}>Risk-free banking*</span>
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "36px",
              borderRadius: "50px",
              height: "36px",
              border: "1px white solid",
              backgroundColor: "rgb(25,35,25)",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }} //&#9678;
          >
            <i
              onClick={() => {
                if (!deviceLocation) return noDeviceLocation();
                //getPermissions();
                if (deviceLocation === "orange")
                  return this.props.setApp({ deviceLocation: false }, () => {
                    //navigator.permissions.revoke({ name: "geolocation" })
                    window.alert(
                      "location button reset:please disable from your browser settings " +
                        "if you want to disable our code running on your browser to GET the " +
                        "coordinantes of your device again, although only this button triggers " +
                        "it and we do not have abstracted server calls elsewhere. see open-source " +
                        "github.com/nickcarducci/wavepoint.la"
                    );
                    // });
                  });
                if (deviceLocation === "red") {
                  window.alert(
                    "your browser-settings do not allow this site to access your location"
                  );
                  var answer = window.confirm(`travel to ${this.props.city}?`);
                  if (answer) return resetPos(this.props.city);

                  getPos();
                } else {
                  var answer1 = window.confirm(
                    `travel to ${deviceLocation.city}?`
                  );
                  if (answer1) return resetPos();

                  answer1 = window.confirm("get location again?");
                  if (answer1) getPos();
                }
              }} //sounds like a mistake. whoops
              //className="fas fa-map-pin"
              style={{
                zIndex: "2",
                boxShadow: `0px 0px 10px 2px ${
                  deviceLocation === "red"
                    ? "rgb(220,70,80)"
                    : deviceLocation === "orange"
                    ? "rgb(20,20,20)"
                    : deviceLocation
                    ? "rgb(10,255,255)"
                    : "rgb(170,170,170)"
                }`,
                border: "3px solid white",
                color:
                  deviceLocation === "red"
                    ? "rgb(75,25,25)"
                    : deviceLocation === "orange"
                    ? "rgb(235,165,110)"
                    : deviceLocation
                    ? "rgb(10,255,255)"
                    : "rgb(20,20,140)",
                borderRadius: "10px",
                padding: "4px 10px", //do you sacrifice your laurels
                //Does the government need to tax more because of financial inflation?
                //​dude looks like he works full time too
                backgroundColor:
                  deviceLocation === "red"
                    ? "rgb(170,100,145)"
                    : "rgb(100,100,255)",
                transition: "1s ease-out"
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            backgroundColor: "rgb(25,35,25)",
            height: "56px",
            top: "0",
            left: "0",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white"
          }}
        >
          l
          <div style={{ margin: "4px 6px" }}>
            <div
              style={{ float: "right", textAlign: "right", fontSize: "16px" }}
              onClick={() =>
                this.props.setLegal({ openLegal: !this.props.openLegal })
              }
            >
              info
            </div>
            <div style={{ float: "left", fontSize: "12px" }}>value added</div>
            <div style={{ fontSize: "8px" }}>*issuing customer</div>
            <h4
              style={{
                lineHeight: "18px",
                margin: "4px 0px"
              }}
            >
              <span>
                <a
                  style={{ color: "white" }}
                  href="https://landlordliquidity.quora.com"
                >
                  Liquid
                </a>
                &nbsp;
                <a
                  style={{
                    width: "max-content",
                    color: "white"
                  }}
                  href="https://census.quora.com"
                >
                  Sales&nbsp;tax
                </a>
              </span>
            </h4>
          </div>
          l
        </div>
      </div>
    );
  }
}
export default Nav;
