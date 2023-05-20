import React from "react";
import Marker from "./Marker";
import MappCluster from "./MappCluster";
import PropTypes from "prop-types";
import MapGL, { FlyToInterpolator, Layer, Source } from "react-map-gl";
import { Link } from "react-router-dom";
import { BaseControl } from "react-map-gl";

class MappGroup extends BaseControl {
  _render() {
    const { cluster, mapThis } = this.props;
    const count = cluster.properties.point_count_abbreviated;
    let addresses = [];
    mapThis.map((x) => {
      const comp =
        x.venue && x.venue.address ? x.venue.address : String(x.center);
      if (!x.venue || x.venue.address) {
        return addresses.includes(comp) && addresses.push(comp);
      } else return null;
    });
    return (
      addresses.length > 0 && (
        <div
          onClick={
            addresses.length !== count
              ? () => this.props.onClick(cluster)
              : () => this.props.openCluster(addresses)
          }
          className="markercluster"
        >
          <span>{count}</span>
        </div>
      )
    );
  }
}

const metersToPixels = (meters, latitude) =>
  Math.round(meters / 0.075 / Math.cos((latitude * Math.PI) / 180));
// https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
const circleColorOpts = [
  "match",
  ["get", "distance"],
  8,
  "rgba(255,240,180,.6)",
  9,
  "rgba(255,240,160,.6)",
  10,
  "rgba(255,220,160,.6)",
  11,
  "rgba(255,200,160,.6)",
  12,
  "rgba(255,180,160,.6)",
  13,
  "rgba(235,200,160,.6)",
  14,
  "rgba(215,215,160,.6)",
  15,
  "rgba(200,235,160,.6)",
  16,
  "rgba(180,255,160,.6)",
  17,
  "rgba(160,235,200,.6)",
  18,
  "rgba(160,215,215,.6)",
  19,
  "rgba(160,200,235,.6)",
  20,
  "rgba(160,180,255,.6)",
  "rgba(160,180,255,.6)"
];
const getDuration = (startViewState, endViewState) => {
  const degPerSecond = 100;
  const deltaLat = Math.abs(startViewState.latitude - endViewState.latitude);
  let deltaLng = Math.abs(startViewState.longitude - endViewState.longitude);
  // Transition to the destination longitude along the smaller half of the circle
  if (deltaLng > 180) deltaLng = 360 - deltaLng;
  return (Math.max(deltaLng, deltaLat) / degPerSecond) * 1000;
};
class Mapbox extends React.Component {
  constructor(props) {
    super(props);
    var dayLiked =
      new Date().getHours() > 4 && new Date().getHours() < 12
        ? true
        : new Date().getHours() > 12 && new Date().getHours() < 20
        ? 1
        : false;

    this.state = {
      distance: 15,
      preferenceListener: {},
      now: new Date().getTime(),
      periods: [],
      chosenVector: "earthquake",
      dayLiked,
      lastDayLiked: dayLiked,
      showInfoWindow: false,
      viewport: {
        width: "100%",
        height: "100%",
        pitch: 60, // pitch in degrees
        bearing: -60,
        latitude: props.center[0],
        longitude: props.center[1],
        zoom: 8
      }
    };
    this._cluster = React.createRef();
    this.mapRef = React.createRef();
    this.communityLogo = React.createRef();
  }
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizee);
    clearTimeout(this.resizer);
    Object.keys(this.state.preferenceListener).length !== 0 &&
      this.state.preferenceListener.removeListener();
  };

  mapboxCity = async (newCityToQuery) => {
    //if (newCityToQuery !== this.props.city)
    await fetch(
      //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${newCityToQuery}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
    )
      .then(async (response) => await response.json())
      .then((body) => {
        var city = body.features[0].place_name;
        if (city) {
          console.log("found " + city);
          this.props.setForumDocs({ forumOpen: true });

          const cityapi = city.split(",")[0].replace(/[, ]+/g, "_");
          //const stateapi = "California";
          const state = newCityToQuery.split(", ")[1];
          const stateapi = state.replace(/ /g, "_");
          this.chooseCitypoint(
            body.features[0].center,
            this.state.distance,
            city,
            cityapi,
            stateapi,
            null
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert("please try another city name");
      });
  };

  onClick = (cluster) =>
    this.resizee(
      false,
      cluster.geometry.coordinates,
      this.state.viewport.zoom < 6
        ? 6
        : this.state.viewport.zoom < 9
        ? 9
        : this.state.viewport.zoom < 13
        ? 13
        : this.state.viewport.zoom < 16
        ? 16
        : this.state.viewport.zoom + 2
    );

  resizee = (commChange, coords, zoom) => {
    if (this.state.mapbox) {
      var viewport = { ...this.state.viewport };
      var { lng, lat } = this.state.mapbox.getCenter();
      viewport.latitude = coords ? coords[1] : lat;
      viewport.longitude = coords ? coords[0] : lng;
      viewport.zoom = zoom ? zoom : this.props.zoomChosen;
      //
      viewport.width = "100%";
      viewport.height = "100%";
      viewport.transitionDuration = "auto";
      viewport.transitionInterpolator = new FlyToInterpolator();
      const timeout = getDuration(this.state.viewport, viewport);
      //
      const handleResize = () => {
        clearTimeout(this.start);
        clearTimeout(this.end);
        this.start = setTimeout(() => {
          this.end = setTimeout(() => {
            console.log("resize mapbox");
            if (commChange) {
              console.log("comm change");
            }
          }, timeout);
        }, 200);
      };
      viewport.onTransitionStart = handleResize;
      this.setState({
        viewport
      });
    }
  };
  componentDidUpdate = (prevProps) => {
    if (this.state.dayLiked !== this.state.lastDayLiked) {
      this.setState({
        lastDayLiked: this.state.dayLiked,
        preferTimeBasedMap: this.state.dayLiked
      });
    }
    if (this.state.mapbox) {
      /*if (
        prevProps.forumOpen !== this.props.forumOpen ||
        prevProps.zoomChosen !== this.props.zoomChosen
      ) {
        this.resizee();
      } else */ if (
        this.props.city !== prevProps.city
      ) {
        this.resizee(true);
      } else if (this.props.center !== prevProps.center) {
        console.log("location change " + this.props.center);
        this.resizee(false, this.props.center);
      }
    }
  };

  openCluster = (x) =>
    this.setState(
      {
        openalladdresses: true,
        tellMeAll: x.place_name
      },
      () => this.props.openSurrounds()
    );

  render() {
    const { mapbox } = this.state;
    var mapThis = this.state.atmLocations ? this.state.atmLocations : [];
    let addresses = [];
    if (mapThis) addresses = mapThis.map((x) => x.place_name);
    var object = {};
    var repeats = [];
    addresses.forEach((plc) => {
      if (!object[plc]) object[plc] = 0;
      object[plc] += 1;
    });

    for (var prop in object) {
      if (object[prop] >= 2) {
        repeats.push(prop);
      }
    }
    var inLot = mapThis.filter(
      (x) => x && x.place_name === this.state.tellMeAll
    );

    const pixelFloorSize = metersToPixels(
      this.state.distance,
      this.props.center[1]
    ); //(radiusInMeters, latitude)
    return (
      <div
        style={{
          overflow: "hidden",
          position: "fixed",
          zIndex: "-1",
          transition: ".3s ease-in",
          width: "100%"
        }}
      >
        {
          //mounted &&
          this.state.readyForMap &&
          !isNaN(this.state.viewport.longitude) &&
          !isNaN(this.state.viewport.latitude) ? (
            /*<canvas style={{ display: "none" }} ref={this.communityLogo} />*/
            <MapGL
              pitchEnabled
              touchRotate
              dragRotate
              ref={this.mapRef}
              minZoom={7}
              onLoad={() => {
                if (this.mapRef && this.mapRef.current) {
                  const mapbox = this.mapRef.current.getMap();
                  //map.setTerrain({source: 'mapbox-dem', exaggeration: 1.5});
                  this.setState({
                    mapbox
                  });
                }
              }}
              onError={(err) => window.alert(Object.values(err))}
              onViewportChange={(viewport) =>
                this.setState(
                  {
                    viewport
                  },
                  () => {
                    if (mapbox) {
                      const bnds = mapbox.getBounds();
                      if (bnds) {
                        const bounds = {
                          north: bnds._ne.lat,
                          south: bnds._sw.lat,
                          west: bnds._sw.lng,
                          east: bnds._ne.lng
                        };
                        this.setState({
                          bounds: [
                            bounds.north,
                            bounds.south,
                            bounds.east,
                            bounds.west
                          ]
                        });
                      }
                    }
                  }
                )
              }
              mapStyle={"mapbox://styles/vaults/cko99xt2i1gp318s5qnjgffyv"}
              mapboxApiAccessToken="pk.eyJ1IjoidmF1bHRzIiwiYSI6ImNrbzk4N2pxODAxMjkycG83Yzd0OW9pMHoifQ.UJ8mJdjk-lJpxBMfgAEoyw"
              {...this.state.viewport}
            >
              <Source
                id="floor"
                type="geojson"
                data={{
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      //match get distance
                      properties: {
                        distance: this.state.distance
                      },
                      //layer lnglat
                      geometry: {
                        type: "Point",
                        coordinates: this.props.center
                      }
                    }
                  ]
                }}
              />
              <Layer
                {...{
                  id: "floor",
                  type: "circle",
                  source: "floor",
                  //"source-layer": "landuse", //for vector
                  //filter: ["==", "class", "park"], //??
                  paint: {
                    // make circles larger as the user zooms from 12 to 22
                    "circle-radius": {
                      stops: [
                        [7, 0], //[zoom,width]
                        [22, pixelFloorSize * 10000]
                      ],
                      base: 2
                    },
                    "circle-stroke-color": "rgb(200,200,230)",
                    "circle-stroke-width": 2,
                    "circle-color": circleColorOpts
                  }
                }}
              />
              {this.state.mapbox && (
                <MappCluster
                  ref={this._cluster}
                  mapbox={this.state.mapbox}
                  element={(cluster) => (
                    <MappGroup
                      openCluster={this.openCluster}
                      mapThis={mapThis}
                      onClick={this.onClick}
                      {...cluster}
                    />
                  )}
                >
                  {mapThis.mapbox((x) => (
                    <Marker
                      cityapi={this.props.cityapi}
                      community={this.props.community}
                      commtype={this.props.commtype}
                      tileChosen={this.props.tileChosen}
                      //
                      id={x.id}
                      key={x.id}
                      latitude={Number(x.center[0])}
                      longitude={Number(x.center[1])}
                      event={x}
                      coordinates={x.center}
                    />
                  ))}
                </MappCluster>
              )}
            </MapGL>
          ) : (
            <img
              style={{
                display: "flex",
                height: "100%",
                width: "auto"
              }}
              alt="error"
              src="https://www.dl.dropboxusercontent.com/s/bt07kz13tvjgz8x/Screen%20Shot%202020-07-18%20at%208.52.33%20AM.png?dl=0"
            />
          )
        }
        <div
          //group-cluster; opened
          style={{
            zIndex: "2",
            display: this.state.openalladdresses ? "flex" : "none",
            position: "fixed",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            bottom: "0px",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            onClick={() => {
              this.props.closeSurrounds();
              this.setState({ openalladdresses: false });
            }}
            style={{
              display: "flex",
              position: "fixed",
              right: "10px",
              bottom: "10px",
              fontSize: "40px"
            }}
          >
            &times;
          </div>
          {inLot.map((x) => (
            <Link
              key={x.id}
              to={"/"}
              style={{
                maxWidth: "calc(100% - 60px)",
                width: "max-content",
                right: "0px",
                display: "flex",
                border: "1px solid black",
                color: "black",
                fontSize: "20px",
                textDecoration: "none"
              }}
            >
              <span
                style={{
                  wordBreak: "break-all"
                }}
              >
                {x.message}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
Mapbox.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};
export default Mapbox;
