import React from "react";
import firebase from "../.././init-firebase";
import dayjs from "dayjs";
import { stateCity } from "./funcData";

class AddressModule extends React.Component {
  constructor(props) {
    super(props);
    const { entity } = this.props;
    this.state = {
      predictions: [],
      address1: entity !== undefined && entity.address1 ? entity.address1 : "",
      address2: entity !== undefined && entity.address2 ? entity.address2 : "",
      city: entity !== undefined && entity.city ? entity.city : "",
      state: entity !== undefined && entity.state ? entity.state : "",
      ZIP: entity !== undefined && entity.ZIP ? entity.ZIP : ""
    };
  }

  render() {
    const { entity } = this.props;
    return (
      <div
        onMouseEnter={() => this.setState({ hovering: "address" })}
        onMouseLeave={() => this.setState({ hovering: "" })}
        style={{
          backgroundColor:
            this.state.hovering === "address" ? "rgba(20,20,20,.3)" : ""
        }}
      >
        {(this.state.editAddress || !entity.address1) &&
        ((entity.username &&
          entity.name &&
          entity.surname &&
          entity.email &&
          entity.SSN &&
          entity.DOB) ||
          this.props.isBusiness) ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await fetch(
                //`https://atlas.microsoft.com/search/place_name/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.addressQuery}.json?limit=2&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
              )
                .then(async (response) => await response.json())
                .then(
                  (body) => {
                    console.log(body.features);
                    this.setState({
                      predictions: body.features
                    });
                  },
                  (err) => console.log(err)
                )
                .catch((err) => {
                  console.log(err);
                  this.setState({ place_name: "", center: [] });
                  alert("please use a neighbor's place_name, none found");
                });
            }}
          >
            <label>address1</label>
            <input
              required
              type="text"
              id="address1"
              placeholder="Address"
              value={this.state.addressQuery}
              onChange={(e) => this.setState({ addressQuery: e.target.value })}
            />
            <div>
              {this.state.predictions.length > 0 &&
                this.state.predictions.map((x) => {
                  return (
                    <div
                      style={{
                        border: "1px solid",
                        borderRadius: "3px",
                        width: "200px",
                        height: "min-content",
                        margin: "10px 0px",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        left: "50%",
                        position: "relative",
                        transform: "translateX(-50%)"
                      }}
                      onClick={() => {
                        const address1 = x.place_name.split(", ")[0];
                        const city = x.place_name.split(", ")[1].split(", ")[0];
                        const statefull = x.place_name.split(", ")[2];
                        const ZIP = statefull.substr(
                          statefull.lastIndexOf(/[\d]+/) - 4,
                          statefull.length
                        );
                        var state = stateCity.find((x) =>
                          statefull.includes(x.name)
                        );
                        !this.state.isBusiness
                          ? this.props.updateBusinessAddress({
                              address1,
                              address2: this.state.address2,
                              city,
                              state: state.abbreviation,
                              ZIP
                            })
                          : firebase
                              .firestore()
                              .collection("userDatas")
                              .doc(this.props.auth.uid)
                              .update({
                                address1,
                                address2: this.state.address2,
                                city,
                                state: state.abbreviation,
                                ZIP
                              });
                      }}
                    >
                      {x.place_name}
                    </div>
                  );
                })}
            </div>
            <div
              style={
                this.state.address1
                  ? {
                      border: "1px solid",
                      borderRadius: "3px",
                      width: "120px",
                      height: "min-content",
                      margin: "10px 0px",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      left: "50%",
                      position: "relative",
                      transform: "translateX(-50%)"
                    }
                  : {
                      borderRadius: "3px",
                      width: "120px",
                      height: "min-content",
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      left: "50%",
                      position: "relative",
                      transform: "translateX(-50%)"
                    }
              }
            >
              {entity.address1}
              <br />
              {entity.address2}
              <br />
              {entity.city}
              {entity.address1 && ", "}
              {entity.state}
            </div>
            <button
              type="submit"
              style={{
                left: "50%",
                top: "-30px",
                position: "relative",
                transform: "translateX(-50%)",
                display: "flex",
                width: "min-content"
              }}
            >
              Search
            </button>
          </form>
        ) : !this.state.editAddress && entity.address1 ? (
          <div
            style={{
              flexDirection: "column",
              border: "1px solid",
              borderRadius: "3px",
              width: "120px",
              height: "min-content",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              left: "50%",
              position: "relative",
              transform: "translateX(-50%)"
            }}
          >
            {entity.address1}
            <br />
            <input
              placeholder="optional address line"
              style={{ width: "100%" }}
              value={this.state.address2}
              onChange={(e) => this.setState({ address2: e.target.value })}
            />
            {entity.city}
            {entity.address1 && ", "}
            {entity.state}
          </div>
        ) : null}
        {entity.address1 && (
          <div
            onClick={() => {
              this.setState({
                address1: "",
                address2: "",
                city: "",
                state: ""
              });
              !this.props.isBusiness &&
                firebase
                  .firestore()
                  .collection("userDatas")
                  .doc(this.props.auth.uid)
                  .update({
                    address1: "",
                    address2: "",
                    city: "",
                    state: ""
                  });
            }}
            style={{
              display: "flex",
              position: "relative",
              left: "-9px",
              top: "-40px",
              fontSize: "12px",
              height: "56px",
              width: "56px",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            reset
          </div>
        )}
      </div>
    );
  }
}
class OwnerModule extends React.Component {
  render() {
    return (
      <div>
        <div>
          <label>dateOfBirth</label>
          <input
            type="date"
            id="dateOfBirth"
            placeholder="Birthday"
            value={this.state.newBirthday}
            onChange={(e) => this.setState({ newBirthday: e.target.value })}
          />
        </div>
        <div>
          <label>full ssn</label>
          <input
            autoComplete="off"
            type="number"
            id="ssn"
            placeholder="Social security number"
            value={this.state.fullSSN}
            onChange={(e) => this.setState({ fullSSN: e.target.value })}
          />
        </div>
        <AddressModule
          updateBusinessAddress={(x) => {
            this.setState({
              ownerAddress1: x.businessAddress1,
              ownerAddress2: x.businessAddress2,
              ownerCity: x.businessCity,
              ownerState: x.businessState,
              ownerZIP: x.businessZIP
            });
          }}
          isBusiness={true}
          entity={{
            address1: this.state.ownerAddress1,
            address2: this.state.ownerAddress2,
            city: this.state.ownerCity,
            state: this.state.ownerState,
            ZIP: this.state.ownerZIP
          }}
          auth={this.props.auth}
        />
      </div>
    );
  }
}
class FundingSource extends React.Component {
  state = {
    newName: this.props.x.name,
    currency1: "USD",
    currency2: "USD"
  };
  render() {
    function renderDate(date) {
      let d = dayjs(date);
      return d.format("MMMM D YYYY");
    }
    return (
      <form
        key={this.props.x.id}
        style={{ zIndex: "9999" }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (this.props.x.name !== this.state.newName) {
            await fetch(
              "https://us-central1-vaumoney.cloudfunctions.net/editFundingVaumoney",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Accept: "application/json"
                },
                body: JSON.stringify({
                  name: this.state.newName
                })
              }
            )
              .then(async (res) => await res.json())
              .then((result) => {
                console.log(result);
              })
              .catch((err) => console.log(err.message));
          }
          this.setState({ closeEdit: false });
        }}
      >
        {this.state.closeEdit && (
          <button
            style={{ display: "flex" }}
            onClick={() =>
              this.setState({ closeEdit: true, newName: this.props.x.name })
            }
          >
            Cancel
          </button>
        )}
        {this.state.closeEdit ? (
          <div style={{ display: "flex" }}>
            <input
              className="input"
              required
              placeholder="name"
              value={this.state.newName}
              onChange={(e) => this.setState({ newName: e.target.value })}
            />
            {this.props.x.name !== this.state.newName && (
              <button type="submit">Save</button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              position: "relative",
              justifyContent: "flex-start",
              alignItems: "flex-end"
            }}
          >
            <div
              onClick={async () => {
                console.log(this.props.x.id);
                var answer = window.confirm("check balance?");
                if (answer) {
                  await fetch(
                    "https://us-central1-vaumoney.cloudfunctions.net/getBalanceVaumoney",
                    {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "content-type": "application/json"
                      },
                      body: JSON.stringify({
                        fundingSource: this.props.x.id
                      })
                    }
                  )
                    .then(async (res) => await res.json())
                    .then(async (result) => {
                      console.log(result);
                      console.log(this.props.x.id);
                      if (
                        result.code &&
                        ["Forbidden", "Unsupported"].includes(result.code)
                      ) {
                        var answer = window.confirm(
                          "unsupported request: initiate micro-deposit to unlock this feature?"
                        );
                        if (answer) {
                          await fetch(
                            "https://us-central1-vaumoney.cloudfunctions.net/initiateMicroVaumoney",
                            {
                              method: "POST",
                              headers: {
                                Accept: "application/json",
                                "content-type": "application/json"
                              },
                              body: JSON.stringify({
                                fundingSource: this.props.x.id
                              })
                            }
                          )
                            .then(async (res) => await res.json())
                            .then(async (result) => {
                              console.log(result);
                              if (result.code === "MaxNumberOfResources") {
                                await fetch(
                                  "https://us-central1-vaumoney.cloudfunctions.net/statusMicroVaumoney",
                                  {
                                    method: "POST",
                                    headers: {
                                      Accept: "application/json",
                                      "content-type": "application/json"
                                    },
                                    body: JSON.stringify({
                                      fundingSource: this.props.x.id
                                    })
                                  }
                                )
                                  .then(async (res) => await res.text())
                                  .then((result) => {
                                    console.log(result);
                                    if (result === "pending") {
                                      window.alert(
                                        "Micro-deposits are on their way! They should arrive within two days of being sent."
                                      );
                                    } else if (result === "processed") {
                                      window.alert(
                                        `Micro-deposits have reached your bank account ${this.props.x.name}! Please report to us the amounts to use the balance query feature.`
                                      );
                                      this.setState({
                                        showMicroVerification: true
                                      });
                                    } else if (result === "failed") {
                                      window.alert(
                                        `Micro-deposits have been rejected by your bank account ${
                                          this.props.x.name
                                        }! ${
                                          result.description
                                            ? result.description
                                            : ""
                                        }.`
                                      );
                                    }
                                  })
                                  .catch((err) => console.log(err.message));
                              } else {
                                window.alert(String(result));
                                //window.location.reload();
                              }
                            })
                            .catch((err) => console.log(err.message));
                        }
                      } else {
                        this.setState({ [this.props.x.id]: result });
                      }
                    })
                    .catch((err) => console.log(err.message));
                }
              }}
              onMouseEnter={() => this.setState({ arrow: this.props.x.id })}
              onMouseLeave={() => this.setState({ arrow: false })}
              style={{
                display: "flex",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999",
                height: "22px",
                borderRadius: "6px",
                border: "1px solid",
                width: "40px",
                backgroundColor:
                  this.state.arrow === this.props.x.id ? "" : "teal",
                color: this.state.arrow === this.props.x.id ? "" : "white",
                fontSize: "12px",
                transform: "rotate(180deg)"
              }}
            >
              ^
            </div>
            &nbsp;{this.props.x.name}&nbsp;
            <div
              onClick={() => this.setState({ closeEdit: true })}
              style={{
                display: "flex",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "9999",
                height: "22px",
                borderRadius: "6px",
                border: "1px solid",
                width: "40px",
                backgroundColor: "teal",
                color: "white",
                fontSize: "12px"
              }}
            >
              EDIT
            </div>
          </div>
        )}
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            position: "relative",
            width: "min-content",
            marginLeft: "4px"
          }}
        >
          <div
            style={{
              height: "min-content",
              display: "flex",
              position: "relative",
              alignItems: "center"
            }}
          >
            <div
              onMouseEnter={() => this.setState({ info: "status" })}
              onMouseLeave={() => this.setState({ info: false })}
              style={
                this.state.info === "status"
                  ? {
                      fontSize: "10px",
                      height: "min-content",
                      alignItems: "center",
                      display: "flex",
                      border: "1px solid",
                      position: "relative",
                      width: "max-content",
                      borderRadius: "3px",
                      padding: "0px 3px"
                    }
                  : {
                      fontSize: "10px",
                      height: "min-content",
                      alignItems: "center",
                      display: "flex",
                      border: "1px solid",
                      position: "relative",
                      width: "max-content",
                      color: "rgb(140,160,140)",
                      borderRadius: "3px",
                      padding: "0px 3px"
                    }
              }
            >
              .{this.props.x.status}/{this.props.x.name}
              {this.props.x.channels.length > 0 && "/"}
              {this.props.x.channels.map((x, i) => (i === 0 ? x : `&${x}`))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              alignItems: "center"
            }}
          >
            <div
              onMouseEnter={() => this.setState({ info: "type" })}
              onMouseLeave={() => this.setState({ info: false })}
              style={
                this.state.info === "type"
                  ? {
                      fontSize: "10px",
                      height: "min-content",
                      alignItems: "center",
                      display: "flex",
                      border: "1px solid",
                      position: "relative",
                      width: "max-content",
                      borderRadius: "3px",
                      padding: "0px 3px"
                    }
                  : {
                      fontSize: "10px",
                      height: "min-content",
                      alignItems: "center",
                      display: "flex",
                      border: "1px solid",
                      position: "relative",
                      width: "max-content",
                      color: "rgb(140,160,140)",
                      borderRadius: "3px",
                      padding: "0px 3px"
                    }
              }
            >
              .{this.props.x.type === "balance" ? "dwolla" : this.props.x.type}/
              {this.props.x.bankName}
            </div>
          </div>
        </div>
        <div
          style={{
            marginLeft: "4px",
            display: "flex",
            position: "relative",
            alignItems: "center"
          }}
        >
          <div
            onMouseEnter={() => this.setState({ info: "linked" })}
            onMouseLeave={() => this.setState({ info: false })}
            style={
              this.state.info === "linked"
                ? {
                    fontSize: "10px",
                    height: "min-content",
                    alignItems: "center",
                    display: "flex",
                    border: "1px solid",
                    position: "relative",
                    width: "max-content",
                    borderRadius: "3px",
                    padding: "0px 3px"
                  }
                : {
                    fontSize: "10px",
                    height: "min-content",
                    alignItems: "center",
                    display: "flex",
                    border: "1px solid",
                    position: "relative",
                    width: "max-content",
                    color: "rgb(140,160,140)",
                    borderRadius: "3px",
                    padding: "0px 3px"
                  }
            }
          >
            .linked/
            {renderDate(this.props.x.created)}
          </div>
        </div>
        <div
          style={{
            marginLeft: "4px",
            display: "flex",
            position: "relative",
            alignItems: "center"
          }}
        >
          <div
            onMouseEnter={() => this.setState({ info: "linked" })}
            onMouseLeave={() => this.setState({ info: false })}
            style={
              this.state.info === "linked"
                ? {
                    fontSize: "10px",
                    height: "min-content",
                    alignItems: "center",
                    display: "flex",
                    border: "1px solid",
                    position: "relative",
                    width: "max-content",
                    borderRadius: "3px",
                    padding: "0px 3px"
                  }
                : {
                    fontSize: "10px",
                    height: "min-content",
                    alignItems: "center",
                    display: "flex",
                    border: "1px solid",
                    position: "relative",
                    width: "max-content",
                    color: "rgb(140,160,140)",
                    borderRadius: "3px",
                    padding: "0px 3px"
                  }
            }
          >
            .balance/
            {this.state[this.props.x.id]}
          </div>
          {this.state.showMicroVerification && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                console.log("d");
                await fetch(
                  "https://us-central1-vaumoney.cloudfunctions.net/verifyMicroVaumoney",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "content-type": "application/json"
                    },
                    body: JSON.stringify({
                      fundingSource: this.props.x.id,
                      amount1: this.state.amount1,
                      currency1: this.state.currency1,
                      amount2: this.state.amount2,
                      currency2: this.state.currency2
                    })
                  }
                )
                  .then(async (res) => await res.json())
                  .then((result) => {
                    if (result.status === 200) {
                      this.props.getTheGoods();
                    } else {
                      window.alert(result.description);
                    }
                  })
                  .catch((err) => console.log(err.message));
              }}
            >
              <div>
                <select
                  required
                  defaultChecked={this.state.currency1}
                  value={this.state.currency1}
                  onChange={(e) => this.setState({ currency1: e.target.value })}
                >
                  <option id="USD">USD</option>
                </select>
                <input
                  required
                  value={this.state.amount1}
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    this.setState({
                      amount1: e.target.value
                    })
                  }
                />
              </div>
              <div>
                <select
                  required
                  defaultChecked={this.state.currency2}
                  value={this.state.currency2}
                  onChange={(e) => this.setState({ currency2: e.target.value })}
                >
                  <option id="USD">USD</option>
                </select>
                <input
                  required
                  value={this.state.amount2}
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    this.setState({
                      amount2: e.target.value
                    })
                  }
                />
              </div>
              <div style={{ display: "flex" }}>
                <button type="submit">Verify</button>
                <div
                  onClick={() =>
                    this.setState({ showMicroVerification: false })
                  }
                >
                  &nbsp;&times;
                </div>
              </div>
            </form>
          )}
        </div>
        <br />
        {this.state.closeEdit && (
          <div
            style={{ fontSize: "20px", border: "1px solid black" }}
            onClick={async () => {
              if (this.props.x.type === "balance") {
                var thereisone1 = this.props.transactions.find(
                  (x) => x.status === "pending"
                );
                if (thereisone1) {
                  window.alert(
                    "transactions are still being processed. please wait a few more moments" +
                      " to try deleting this bank account's connection again"
                  );
                } else {
                  if (
                    this.props.x.balance !== 0 &&
                    this.props.x.balance !== undefined
                  ) {
                    window.alert(
                      `please withdraw your $${this.props.x.balance} before deleting your balance. add another bank if you have to`
                    );
                  } else {
                    var answer1 = window.confirm(
                      "are you sure you'd like to delete your account?"
                    );
                    if (answer1) {
                      await fetch(
                        "https://us-central1-vaumoney.cloudfunctions.net/deleteCustomerVaumoney",
                        {
                          method: "POST",
                          headers: {
                            "content-type": "application/json",
                            Accept: "application/json"
                          },
                          body: JSON.stringify({
                            mastercardId: this.props.user.mastercardId
                          })
                        }
                      )
                        .then(async (res) => await res.json())
                        .then((result) => {
                          console.log(result);
                          firebase
                            .firestore()
                            .collection("userDatas")
                            .doc(this.props.auth.uid)
                            .update({ mastercardId: false });
                          window.location.reload();
                        })
                        .catch((err) => console.log(err.message));
                    }
                  }
                }
              } else {
                var answer = window.confirm(
                  "are you sure you'd like to delete this funding source?"
                );
                if (answer)
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
                        fundingSource: this.props.x.id
                      })
                    }
                  )
                    .then(async (res) => await res.json())
                    .then((result) => {
                      console.log(result);
                      window.location.reload();
                    })
                    .catch((err) => console.log(err.message));
                } else {
                  window.alert(
                    "transactions are still being processed. please wait a few more moments" +
                      " to try deleting this bank account's connection again"
                  );
                }
              }
            }}
          >
            delete
          </div>
        )}
      </form>
    );
  }
}
class NewBank extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    const userIsLoaded = user !== undefined;
    this.state = {
      preferMicro: false,
      biztype: "Sole Proprietorship",
      businesses: [],
      ein: "",
      bizname: "",
      newSurname: userIsLoaded ? user.surname : "",
      newName: userIsLoaded ? user.name : "",
      newUsername: userIsLoaded ? user.username : "",
      newEmail: userIsLoaded && user.email ? user.email : "",
      newBirthday: userIsLoaded && user.DOB ? user.DOB : "",
      last4: userIsLoaded && user.SSN ? user.SSN : ""
    };
  }
  handleSubmit = async () => {
    const { user } = this.props;
    const add = (mastercardId) =>
      firebase.firestore().collection("users").doc(this.props.auth.uid).update({
        mastercardId
      });
    if (!user.mastercardId) {
      await fetch(
        "https://us-central1-vaumoney.cloudfunctions.net/verifiedCustomerVaumoney",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            correlationId: this.props.auth.uid,
            firstName: user.name,
            lastName: user.surname,
            email: user.confirmedEmail,
            DOB: user.DOB,
            SSN: user.SSN,
            address1: user.address1,
            address2: user.address2,
            city: user.city,
            state: user.state,
            ZIP: user.ZIP
          })
        }
      )
        .then(async (res) => await res.json())
        .then(async (result) => {
          if (result._embedded.errors[0].code === "Duplicate") {
            console.log("email already exists with dwolla");
            var confirmedEmail = encodeURIComponent(user.confirmedEmail);
            await fetch(
              "https://us-central1-vaumoney.cloudfunctions.net/searchCustomerVaumoney",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Accept: "application/json"
                },
                body: JSON.stringify({
                  confirmedEmail
                })
              }
            )
              .then(async (res) => await res.json())
              .then((result) => {
                /*var mastercardId = result.split(
                "https://api-sandbox.dwolla.com/customers/"
              )[1];*/
                console.log(result);
                var mastercardId = result._embedded["customers"][0].id;
                console.log(mastercardId);
                add(mastercardId);
                console.log("!");
                this.deployNewFundingSource(mastercardId);
              })
              .catch((err) => console.log(err.message));
          } else {
            /*var mastercardId = result.split(
          "https://api-sandbox.dwolla.com/customers/"
        )[1];*/
            var mastercardId = result._embedded["customers"][0].id;
            console.log(mastercardId);
            add(mastercardId);
            console.log("!");
            this.deployNewFundingSource(mastercardId);
          }
        })
        .catch(async (err) => {
          console.log(err.message);
        });
    } else {
      console.log(
        `Dwolla user - ${user.mastercardId} deploying instant access verification for Vaumoney`
      );
      this.deployNewFundingSource(user.mastercardId);
    }
  };
  deployNewFundingSource = async (x) => {
    console.log(x);
    if (!this.state.preferMicro) {
      await fetch(
        "https://us-central1-vaumoney.cloudfunctions.net/initiateIAVVaumoney",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            mastercardId: x
          })
        }
      )
        .then(async (res) => await res.json())
        .then((result) => {
          console.log("!");
          console.log(result);
          /*{
            "_links":
            {
              "self":
              {
                "href": "https://api-sandbox.dwolla.com/customers/7d5d65b8-0b66-48c9-b018-cc691c4bd010/iav-token",
                  "type": "application/vnd.dwolla.v1.hal+json",
                    "resource-type": "iav-token"
              }
            },
            "token": "RLXvNpcR7QEX1frib9ZhbDMfaTAV7NPZPNl2ufnMPhvsLQYnWb"
          }*/
          if (result) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://cdn.dwolla.com/1/dwolla.js";
            script.onload = () => {
              console.log("ok");
              const dwolla = window.dwolla;
              // create a token
              dwolla.configure("sandbox");
              dwolla.iav.start(
                result,
                {
                  backButton: true,
                  container: "iavContainer",
                  stylesheets: [
                    "https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext"
                  ],
                  //microDeposits: "true",
                  fallbackToMicroDeposits: true
                },
                (err, res) => {
                  if (err) {
                    console.log(err);
                    window.alert(err);
                  }
                  if (res._links) {
                    console.log(res);
                    window.alert(
                      `congrats! new funding source initiated with id: ${res._links.href}`
                    );
                    window.location.reload();
                    this.setState({
                      newBankplease: false
                    });
                  }
                }
              );
            };
            document.body.appendChild(script);
          } else
            return window.alert(
              "no instant verification token returned in successful response"
            );
        })
        .catch((err) => {
          console.log("!");
          console.log(err.message);
        });
    } else {
      console.log("!");
      await fetch(
        "https://us-central1-vaumoney.cloudfunctions.net/verifiedFundingVaumoney",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            //Allow: "*",
            Accept: "application/json"
          },
          body: JSON.stringify({
            mastercardId: x,
            routingNumber: this.state.routingNumber,
            accountNumber: this.state.accountNumber,
            name: this.state.uniqueName
          })
        }
      )
        .then(async (res) => await res.json())
        .then(async (result) => {
          console.log(result);
          /*var fundingSource = result.split(
          "https://api-sandbox.dwolla.com/funding-sources/"
        )[1];*/
          var fundingSource = result.id;
          await fetch(
            "https://us-central1-vaumoney.cloudfunctions.net/initiateMicroVaumoney",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Allow: "*",
                Accept: "application/json"
              },
              body: JSON.stringify({
                fundingSource
              })
            }
          )
            .then(async (res) => await res.json())
            .then((result) => {
              console.log(result);
              if (result.code === 201)
                window.alert(
                  "congrats! now verify your account with two microdeposits " +
                    "to send money from this accounting and routing number!" +
                    " It usually takes 1-2 days to settle in your account."
                );
            })
            .catch((err) => {
              console.log(err.message);
            });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };
  render() {
    const { user } = this.props;
    const userIsLoaded = user !== undefined;
    function intToString(v) {
      var abbs = ["", "k", "m", "b", "t"];
      var abbIndex = Math.floor(("" + v).length / 3);
      var num = parseFloat(
        (abbIndex !== 0 ? v / Math.pow(1000, abbIndex) : v).toPrecision(2)
      );
      if (num % 1 !== 0) {
        num = num.toFixed(1);
      }
      return num + abbs[abbIndex];
    }
    if (!this.props.openNewBank) return null;
    return (
      <div
        style={{
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          width: "50%",
          maxWidth: "100vw",
          minWidth: "200px",
          transform: `translateX(${this.props.openNewBank ? 0 : -100}%)`,
          transition: ".3s ease-out",
          backgroundColor: "white",
          opacity: this.props.openNewBank ? "1" : "0"
        }}
      >
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            position: "relative",
            width: "min-content"
          }}
        >
          {!this.state.newBusinessplease &&
            !this.state.newBankplease &&
            !this.props.openBusinesses &&
            this.props.fundingSources.length > 0 && (
              <div
                onMouseEnter={() => this.setState({ banksbtn: true })}
                onMouseLeave={() => this.setState({ banksbtn: false })}
                style={{
                  display: "flex",
                  position: "relative",
                  justifyContent: "center",
                  marginTop: "20px",
                  borderRadius: "6px",
                  border: "1px solid",
                  width: "60px",
                  backgroundColor:
                    this.state.banksbtn || this.props.openBanks
                      ? "teal"
                      : "white",
                  color:
                    this.state.banksbtn || this.props.openBanks ? "white" : ""
                }}
                onClick={this.props.toggleBanks}
              >
                Banks
              </div>
            )}
          {/*!this.state.newBusinessplease &&
            !this.state.newBankplease &&
            !this.props.openBanks &&
            this.props.fundingSources.length > 0 && (
              <div
                onMouseEnter={() => this.setState({ bizbtn: true })}
                onMouseLeave={() => this.setState({ bizbtn: false })}
                style={
                  this.state.bizbtn || this.props.openBusinesses
                    ? {
                        display: "flex",
                        position: "relative",
                        justifyContent: "center",
                        marginTop: "20px",
                        borderRadius: "6px",
                        border: "1px solid",
                        width: "90px",
                        backgroundColor: "teal",
                        color: "white"
                      }
                    : {
                        display: "flex",
                        position: "relative",
                        justifyContent: "center",
                        marginTop: "20px",
                        borderRadius: "6px",
                        border: "1px solid",
                        backgroundColor: "white",
                        width: "90px"
                      }
                }
                onClick={this.props.toggleBusinesses}
              >
                Businesses
              </div>
            )*/}
        </div>
        <br />
        <br />
        {this.props.openBanks &&
          this.props.fundingSources.map((x) => {
            return x._embedded["funding-sources"].map((x) => {
              if (!x.removed) {
                console.log(x);
                return (
                  <FundingSource
                    user={user}
                    transactions={this.props.transactions}
                    tryDelete={this.props.tryDelete}
                    x={x}
                    getTheGoods={this.props.getTheGoods}
                  />
                );
              } else return null;
            });
          })}
        {(this.props.openBanks || this.state.newBankplease) && (
          <div
            style={{
              bottom: "10px",
              display: "flex",
              position: "fixed",
              fontSize: "10px",
              backgroundColor: "white",
              color: "rgb(140,160,140)"
            }}
          >
            We claim no responsibility for mistakes made by dwolla or your bank,
            only our own.&nbsp;
            {this.state.mistakes
              ? `${intToString(this.state.mistakes.length)}/`
              : `${0}/`}
            {this.state.appTransactions
              ? `${intToString(this.state.appTransactions.length)} transactions`
              : `0 transactions`}
          </div>
        )}
        <div
          style={{
            left: "0px",
            flexDirection: "column",
            display: "flex",
            height: "min-content",
            width: "100%"
          }}
        >
          {this.props.openBanks ? (
            <div
              style={{
                left: "0px",
                color: "white",
                backgroundColor: "teal",
                fontSize: "20px",
                width: "56px",
                height: "56px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                border: "1px solid"
              }}
              onClick={this.props.closebanks}
            >
              {"<"}
            </div>
          ) : this.state.newBankplease ? (
            <div
              style={{
                fontSize: "20px",
                width: "56px",
                height: "56px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                border: "1px solid"
              }}
              onClick={() => this.setState({ newBankplease: false })}
            >
              {"<"}
            </div>
          ) : this.props.openBusinesses ? (
            <div
              style={{
                color: "white",
                backgroundColor: "teal",
                fontSize: "20px",
                width: "56px",
                height: "56px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                border: "1px solid"
              }}
              onClick={this.props.closebusinesses}
            >
              {"<"}
            </div>
          ) : this.state.newBusinessplease ? (
            <div
              style={{
                fontSize: "20px",
                width: "56px",
                height: "56px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                border: "1px solid"
              }}
              onClick={() => this.setState({ newBusinessplease: false })}
            >
              {"<"}
            </div>
          ) : (
            <div
              style={{
                fontSize: "20px",
                width: "56px",
                height: "56px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                border: "1px solid"
              }}
              onClick={this.props.close}
            >
              &times;
            </div>
          )}
          {!this.state.newBankplease &&
            !this.props.openBanks &&
            !this.state.newBusinessplease &&
            !this.props.openBusinesses && (
              <div>
                <form
                  onMouseEnter={() => this.setState({ hovering: "username" })}
                  onMouseLeave={() => this.setState({ hovering: "" })}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (
                      !this.state.usernameTaken &&
                      (user.username !== this.state.newUsername ||
                        user.name !== this.state.newName ||
                        user.surname !== this.state.newSurname)
                    ) {
                      firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          surname: this.state.newSurname,
                          name: this.state.newName,
                          username: this.state.newUsername
                        });
                    } else
                      return console.log(
                        this.state.usernameTaken,
                        user.username,
                        this.state.newUsername,
                        user.name,
                        this.state.newName,
                        user.surname,
                        this.state.newSurname
                      );
                  }}
                  style={
                    this.state.hovering === "username"
                      ? { backgroundColor: "rgba(20,20,20,.3)" }
                      : {}
                  }
                >
                  <div>
                    <label>
                      {this.state.usernameTaken && "please use another"}Username
                    </label>
                    <input
                      autoComplete="off"
                      minLength="2"
                      type="text"
                      id="username"
                      placeholder="Name"
                      value={this.state.newUsername}
                      onChange={(e) => {
                        var query = e.target.value;
                        if (query) {
                          var therealready = this.props.users.find(
                            (x) =>
                              x.username === query &&
                              user.username !== x.username
                          );
                          if (therealready) {
                            this.setState({ usernameTaken: true });
                          } else if (this.state.usernameTaken) {
                            this.setState({ usernameTaken: false });
                          }
                        }

                        this.setState({ newUsername: query });
                      }}
                    />
                  </div>
                  <div>
                    <label>firstName</label>
                    <input
                      autoComplete="off"
                      minLength="2"
                      type="text"
                      id="firstName"
                      placeholder="Name"
                      value={this.state.newName}
                      onChange={(e) =>
                        this.setState({ newName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>lastName</label>
                    <input
                      autoComplete="off"
                      minLength="2"
                      type="text"
                      id="lastName"
                      placeholder="Surname"
                      value={this.state.newSurname}
                      onChange={(e) =>
                        this.setState({ newSurname: e.target.value })
                      }
                    />
                  </div>
                  {!this.state.usernameTaken &&
                    ((userIsLoaded &&
                      (user.username !== this.state.newUsername ||
                        "" === this.state.newUsername)) ||
                      (userIsLoaded &&
                        (user.name !== this.state.newName ||
                          "" === this.state.newName)) ||
                      (userIsLoaded &&
                        (user.surname !== this.state.newSurname ||
                          "" === this.state.newSurname))) && (
                      <button type="submit">Save</button>
                    )}
                </form>
                {/*user === undefined && (
                  <Login
                    pleaseClose={this.props.pleaseClose}
                    users={this.props.users}
                    user={user}
                    auth={this.props.auth}
                  />
                )*/}
                <br />
                {userIsLoaded &&
                  user.username &&
                  user.name &&
                  user.surname &&
                  user.username === this.state.newUsername &&
                  user.name === this.state.newName &&
                  user.surname === this.state.newSurname && (
                    <div>
                      {this.state.changePrivate ||
                      user.email === "" ||
                      user.SSN === "" ||
                      user.DOB === "" ? (
                        <form
                          onMouseEnter={() =>
                            this.setState({ hovering: "private" })
                          }
                          onMouseLeave={() => this.setState({ hovering: "" })}
                          onSubmit={(e) => {
                            e.preventDefault();
                            var start = { ...this.state };
                            if (
                              start.newEmail &&
                              start.newBirthday &&
                              start.last4
                            ) {
                              const goset = firebase
                                .firestore()
                                .collection("userDatas")
                                .doc(this.props.auth.uid)
                                .set({
                                  email: start.newEmail,
                                  DOB: start.newBirthday,
                                  SSN: start.last4
                                });
                              const goupdate = firebase
                                .firestore()
                                .collection("userDatas")
                                .doc(this.props.auth.uid)
                                .update({
                                  email: start.newEmail,
                                  DOB: start.newBirthday,
                                  SSN: start.last4
                                });
                              if (
                                user.email ||
                                user.SSN ||
                                user.DOB ||
                                user.ZIP ||
                                user.address1 ||
                                user.address2 ||
                                user.city ||
                                user.state
                              ) {
                                if (!user.confirmedEmail) {
                                  firebase
                                    .auth()
                                    .sendSignInLinkToEmail(start.newEmail, {
                                      url: window.location.href,
                                      handleCodeInApp: true
                                    })
                                    .then(() => {
                                      goupdate();
                                    })
                                    .catch((err) => {
                                      console.log(err.message);
                                    });
                                } else {
                                  goupdate();
                                }
                              } else {
                                firebase
                                  .auth()
                                  .sendSignInLinkToEmail(start.newEmail, {
                                    url: window.location.href,
                                    handleCodeInApp: true
                                  })
                                  .then(() => {
                                    goset();
                                  })
                                  .catch((err) => {
                                    console.log(err.message);
                                  });
                              }
                              this.state.changePrivate &&
                                this.setState({ changePrivate: false });
                            } else
                              return window.alert(
                                "please enter email, date of birth & the last 4 digits of social security number to bank with us"
                              );
                          }}
                          style={
                            this.state.hovering === "private"
                              ? {
                                  backgroundColor: "rgba(20,20,20,.3)",
                                  paddingBottom: "10px"
                                }
                              : { paddingBottom: "10px" }
                          }
                        >
                          Private / To add bank
                          <br />
                          <div>
                            <label>email</label>
                            <input
                              autoComplete="off"
                              type="email"
                              id="email"
                              placeholder="Email"
                              value={this.state.newEmail}
                              onChange={(e) =>
                                this.setState({ newEmail: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label>dateOfBirth</label>
                            <input
                              type="date"
                              id="dateOfBirth"
                              placeholder="Birthday"
                              value={this.state.newBirthday}
                              onChange={(e) =>
                                this.setState({ newBirthday: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label>last 4 of ssn</label>
                            <input
                              autoComplete="off"
                              type="number"
                              id="ssn"
                              placeholder="Social security number"
                              value={this.state.last4}
                              onChange={(e) =>
                                this.setState({ last4: e.target.value })
                              }
                            />
                          </div>
                          <button
                            type="submit"
                            style={{
                              left: "50%",
                              top: "5px",
                              position: "relative",
                              transform: "translateX(-50%)",
                              display: "flex",
                              width: "min-content"
                            }}
                          >
                            Save
                          </button>
                        </form>
                      ) : (
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              "edit your private email, ssn or dob?"
                            );

                            if (answer) {
                              this.setState({ changePrivate: true });
                            }
                          }}
                        >
                          Locked
                          <br />
                          <div style={{ fontSize: "12px" }}>
                            ["email", "ssn", "dob"]
                          </div>
                        </div>
                      )}
                      <br />
                      <AddressModule entity={user} auth={this.props.auth} />
                    </div>
                  )}
              </div>
            )}
          {userIsLoaded &&
            !this.props.openBanks &&
            !this.props.openBusinesses &&
            !this.state.newBusinessplease &&
            user.username &&
            user.name &&
            user.surname &&
            user.username === this.state.newUsername &&
            user.name === this.state.newName &&
            user.surname === this.state.newSurname &&
            user.address1 && (
              <div
                onMouseEnter={() => this.setState({ hoverbankbutton: true })}
                onMouseLeave={() => this.setState({ hoverbankbutton: false })}
                style={
                  this.state.hoverbankbutton || this.state.newBankplease
                    ? {
                        border: "1px solid",
                        borderRadius: "3px",
                        width: "120px",
                        height: "33px",
                        top: "-40px",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        left: "50%",
                        position: "relative",
                        transform: "translateX(-50%)"
                      }
                    : {
                        color: "white",
                        backgroundColor: "teal",
                        border: "1px solid",
                        borderRadius: "3px",
                        width: "120px",
                        height: "33px",
                        top: "-40px",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        left: "50%",
                        position: "relative",
                        transform: "translateX(-50%)"
                      }
                }
                onClick={
                  this.state.newBankplease
                    ? () => this.setState({ newBankplease: false })
                    : user.confirmedEmail
                    ? () => this.setState({ newBankplease: true })
                    : () => {
                        firebase
                          .auth()
                          .signInWithEmailLink(user.email, window.location.href)
                          .then((result) => {
                            console.log(result);
                            firebase
                              .firestore()
                              .collection("userDatas")
                              .doc(this.props.auth.uid)
                              .update({
                                confirmedEmail: user.email
                              });
                            console.log(
                              "nice! email confirmed.. now you can add banks"
                            );
                          })
                          .catch((err) => {
                            console.log(err.message);
                          });
                      }
                }
              >
                {this.state.newBankplease ? "Back" : "Add bank"}
              </div>
            )}
          {/*userIsLoaded &&
            !this.props.openBusinesses &&
            !this.props.openBanks &&
            !this.state.newBankplease &&
            user.username &&
            user.name &&
            user.surname &&
            user.username === this.state.newUsername &&
            user.name === this.state.newName &&
            user.surname === this.state.newSurname &&
            user.address1 &&
            user.confirmedEmail && (
              <div
                onMouseEnter={() =>
                  this.setState({ hoverbusinessbutton: true })
                }
                onMouseLeave={() =>
                  this.setState({ hoverbusinessbutton: false })
                }
                style={
                  this.state.hoverbusinessbutton || this.state.newBusinessplease
                    ? {
                        border: "1px solid",
                        borderRadius: "3px",
                        width: "120px",
                        height: "33px",
                        top: "-40px",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        left: "50%",
                        position: "relative",
                        transform: "translateX(-50%)"
                      }
                    : {
                        color: "white",
                        backgroundColor: "teal",
                        border: "1px solid",
                        borderRadius: "3px",
                        width: "120px",
                        height: "33px",
                        top: "-40px",
                        alignItems: "center",
                        justifyContent: "center",
                        display: "flex",
                        left: "50%",
                        position: "relative",
                        transform: "translateX(-50%)"
                      }
                }
                onClick={
                  this.state.newBusinessplease
                    ? () => this.setState({ newBusinessplease: false })
                    : () => {
                        this.props.getBizCodes();
                        this.setState({ newBusinessplease: true });
                      }
                }
              >
                {this.state.newBusinessplease ? "Back" : "Add Business"}
              </div>
            )*/}
          {userIsLoaded &&
            user.name &&
            user.surname &&
            user.name === this.state.newName &&
            user.surname === this.state.newSurname &&
            this.state.newBankplease && (
              <form
                style={{
                  flexDirection: "column",
                  top: "-40px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  left: "50%",
                  position: "relative",
                  transform: "translateX(-50%)"
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  this.handleSubmit();
                  /*if (
                    this.state.routingNumber &&
                    this.state.accountNumber &&
                    this.state.uniqueName
                  ) {
                    this.handleSubmit();
                  } else
                    return window.alert(
                      "please complete the form to add the account"
                    );*/
                }}
              >
                {/*<br /> Add bank
                <br />
                <div>
                  <input
                    type="text"
                    id="name"
                    placeholder="Unique name"
                    value={this.state.uniqueName}
                    onChange={e =>
                      this.setState({ uniqueName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Routing number</label>
                  <input
                    type="text"
                    id="routingNumber"
                    placeholder="273222226"
                    value={this.state.routingNumber}
                    onChange={e =>
                      this.setState({ routingNumber: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Account number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    placeholder="Account number"
                    value={this.state.accountNumber}
                    onChange={e =>
                      this.setState({ accountNumber: e.target.value })
                    }
                  />
                </div>*/}
                <br />
                <br />
                <div>
                  <label>method</label>
                  <select
                    required
                    name="preferMicro"
                    id="preferMicro"
                    value={this.state.preferMicro}
                    onChange={(e) =>
                      this.setState({ preferMicro: e.target.id })
                    }
                  >
                    <option value={false}>instant:receive</option>
                    <option value={true}>1-3 days:send+balance</option>
                  </select>
                </div>
                <div>
                  <input
                    type="submit"
                    value={
                      !this.state.preferMicro
                        ? "Load instant form"
                        : "use 1-3 day microDeposits"
                    }
                  />
                </div>
              </form>
            )}
          {!this.props.openBanks &&
            !this.props.openBusinesses &&
            this.state.newBankplease && <div id="iavContainer" />}
          <br />
          {userIsLoaded &&
            user.name &&
            user.surname &&
            user.name === this.state.newName &&
            user.surname === this.state.newSurname &&
            this.state.newBusinessplease && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (this.state.biztype !== "Sole Proprietorship") {
                    if (this.state.ein === "") {
                      alert(
                        "for Corporations, LLC & Partnerships, or Sole Proprietorshiops with employees, you need an ein. " +
                          " please visit irs.gov to quickly get one"
                      );
                    } else {
                      await fetch(
                        `https://us-central1-vaumoney.cloudfunctions.net/verifiedBusinessVaumoney`,
                        {
                          method: "POST",
                          headers: {
                            "content-type": "application/json",
                            Accept: "application/json"
                          },
                          body: JSON.stringify({
                            correlationId: this.props.auth.uid,
                            firstName: user.name,
                            lastName: user.surname,
                            email: user.confirmedEmail,
                            DOB: user.DOB,
                            SSN: user.SSN,
                            address1: user.address1,
                            address2: user.address2,
                            city: user.city,
                            state: user.state,
                            ZIP: user.ZIP,
                            businessAddress1: this.state.businessAddress1,
                            businessAddress2: this.state.businessAddress2,
                            businessCity: this.state.businessCity,
                            businessState: this.state.businessState,
                            businessZIP: this.state.businessZIP,
                            businessRole: this.state.businessRole
                          })
                        }
                      )
                        .then(async (response) => await response.json())
                        .then((body) => {
                          console.log("beneficial owner resource");
                          console.log(body.verificationStatus);
                          this.setState({
                            verificationStatus: body.verificationStatus
                          });
                        })
                        .catch((err) => {
                          console.log("auth");
                          console.log(err.message);
                        });
                    }
                  } else {
                    await fetch(
                      `https://us-central1-vaumoney.cloudfunctions.net/verifiedBusinessVaumoney`,
                      {
                        method: "POST",
                        headers: {
                          "content-type": "application/json",
                          Accept: "application/json"
                        },
                        body: JSON.stringify({
                          correlationId: this.props.auth.uid,
                          firstName: user.name,
                          lastName: user.surname,
                          email: user.confirmedEmail,
                          DOB: user.DOB,
                          SSN: user.SSN,
                          address1: user.address1,
                          address2: user.address2,
                          city: user.city,
                          state: user.state,
                          ZIP: user.ZIP
                        })
                      }
                    )
                      .then(async (response) => await response.json())
                      .then((body) => {
                        console.log("beneficial owner resource");
                        console.log(body.verificationStatus);
                        this.setState({
                          verificationStatus: body.verificationStatus
                        });
                      })
                      .catch((err) => {
                        console.log("auth");
                        console.log(err.message);
                      });
                  }
                }}
              >
                <br />
                <div>
                  <label>bizname</label>
                  <input
                    required
                    id="bizname"
                    placeholder="Business name"
                    value={this.state.bizname}
                    onChange={(e) => this.setState({ biztype: e.target.value })}
                  />
                </div>
                <div>
                  <label>biztype</label>
                  <select
                    required
                    name="biztype"
                    id="biztype"
                    value={this.state.biztype}
                    onChange={(e) => this.setState({ biztype: e.target.id })}
                  >
                    {[
                      "Sole Proprietorship",
                      "Corporation",
                      "LLC",
                      "Partnership"
                    ].map((x) => {
                      return <option value={x}>{x}</option>;
                    })}
                  </select>
                </div>
                {this.props.businessCodes && (
                  <div>
                    <select
                      required
                      name="bizclass"
                      id="bizclass"
                      value={this.state.chosenBusinessCode}
                      onChange={(e) =>
                        this.setState({ chosenBusinessCode: e.target.id })
                      }
                    >
                      {this.props.businessCodes.map((x) => {
                        return <option value={x.id}>{x.name}</option>;
                      })}
                    </select>
                  </div>
                )}
                <div>
                  <label>ein </label>
                  <label style={{ color: "grey" }}>
                    {this.state.biztype === "Sole Proprietorship" && "optional"}
                  </label>
                  <input
                    type="number"
                    id="ein"
                    placeholder="Employer identification #"
                    value={this.state.ein}
                    onChange={(e) => this.setState({ ein: e.target.value })}
                  />
                </div>
                <br />
                <AddressModule
                  updateBusinessAddress={(x) => {
                    this.setState({
                      businessAddress1: x.businessAddress1,
                      businessAddress2: x.businessAddress2,
                      businessCity: x.businessCity,
                      businessState: x.businessState,
                      businessZIP: x.businessZIP
                    });
                  }}
                  isBusiness={true}
                  entity={{
                    address1: this.state.businessAddress1,
                    address2: this.state.businessAddress2,
                    city: this.state.businessCity,
                    state: this.state.businessState,
                    ZIP: this.state.businessZIP
                  }}
                  auth={this.props.auth}
                />
                <div>
                  <label>ein </label>
                  <label style={{ color: "grey" }}>role</label>
                  <input
                    id="businessRole"
                    placeholder="owner"
                    value={this.state.ein}
                    onChange={(e) => this.setState({ ein: e.target.value })}
                  />
                </div>
                {this.state.biztype !== "Sole Proprietorship" &&
                  this.state.owners.map((x) => {
                    return <OwnerModule auth={this.props.auth} />;
                  })}
                <button type="submit">Submit</button>
              </form>
            )}
        </div>
      </div>
    );
  }
}
export default NewBank;
