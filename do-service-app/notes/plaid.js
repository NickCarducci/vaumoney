require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
var cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET); //https://dashboard.stripe.com/account/apikeys
//sk_test_4eC39HqLyjWDarjtT1zdp7dc");"pk_test_51MTtNXGVa6IKUDzpbVag2vdLVm7bU8lfz3sCH0DmMLF9eAhqAJDNyxXxJLzZ2i0YyCkFRCcrjr0qMKD5eIEkLClB00GGdnmtDm"
/*const plaid = require("plaid");
const live = false;
const { Configuration, PlaidApi, PlaidEnvironments } = plaid;
const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET
    }
  }
}); //liberation! hard hats 1933
const plaidClient = new PlaidApi(configuration);*/
/*const plaid = require("plaid");
const plaidClient = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PUBLIC_KEY,
  plaid.environments.sandbox,
  {version: '2018-05-22'}
);*/
const { initializeApp, cert } = require("firebase-admin/app"),
  credential = cert(
    JSON.parse(
      process.env.FIREBASE_KEY
    ) /*{
    type: "service_account",
    project_id: "vaumoney",
    private_key_id: process.env.FIREBASE_KEY_ID,
    private_key: process.env.FIREBASE_KEY,
    client_email: "firebase-adminsdk-afvoy@vaumoney.iam.gserviceaccount.com",
    client_id: "105851014051977264103",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-afvoy%40vaumoney.iam.gserviceaccount.com"
  }*/
  );
const firebase = initializeApp({
  credential,
  databaseURL: "https://vaumoney.firebaseio.com"
});
const { getAuth, deleteUser } = require("firebase-admin/auth");

const app = express(),
  port = 8080,
  allowedOrigins = [
    "https://sausage.saltbank.org",
    "https://i7l8qe.csb.app",
    "https://vau.money",
    "https://jwi5k.csb.app"
  ],
  /*
      const printObject = (o) =>
        Object.keys(o).map((x) => {
          return {
            [x]: !o[x] ? {} : o[x].constructor === Object ? printObject(o[x]) : o[x]
          };
        });*/
  standardCatch = (res, e, extra, name) => {
    res.send({
      statusCode: 402,
      statusText: "no caught",
      name,
      error: e,
      extra
    });
  },
  allowOriginType = (origin, res) => {
    res.setHeader("Access-Control-Allow-Origin", origin);
    //allowedOrigins[allowedOrigins.indexOf(origin)]
    res.setHeader("Content-Type", "Application/JSON");
    res.setHeader("Allow", ["POST", "OPTIONS", "GET"]);
    res.setHeader("Access-Control-Allow-Headers", [
      "Content-Type",
      "Access-Control-Request-Method",
      "Access-Control-Request-Methods",
      "Access-Control-Request-Headers"
    ]);
    res.setHeader("Access-Control-Allow-Methods", ["POST", "OPTIONS", "GET"]);
    //https://stackoverflow.com/questions/12027187/difference-between-allow-and-access-control-allow-methods-in-http-response-h
  };
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//http://johnzhang.io/options-request-in-express
//var origin = req.get('origin');

var results = {},
  statusCode = 200,
  statusText = "ok";
app
  .get("/", (req, res) => res.status(200).send("shove it"))
  .options("/*", (req, res) => {
    const origin = req.headers.origin;
    app.use(cors({ origin })); //https://stackoverflow.com/questions/36554375/getting-the-request-origin-in-express
    if (allowedOrigins.indexOf(req.headers.origin) === -1)
      return res.send({
        statusCode: 401,
        error: "no access for this origin- " + req.headers.origin
      });
    allowOriginType(req.headers.origin, res);
    //"Cannot setHeader headers after they are sent to the client"

    res.statusCode = 204;
    res.send(); //res.sendStatus(200);
  })
  .post("/", (req, res) => {
    allowOriginType(req.headers.origin, res);
    res.send({
      statusCode,
      statusText,
      data: {}
    });
  })
  .post("/integrity", async (request, res) => {
    allowOriginType(request.headers.origin, res);
    //https://docs.digitalocean.com/products/app-platform/how-to/view-logs/
    fetch(
      `https://api.digitalocean.com/v2/apps/{app_id}/deployments/{deployment_id}/components/{component_name}/logs`,
      {
        headers: {
          Authorization: `bearer ${process.env.DIGITAL_OCEAN_TOKEN}`
        }
      }
    ).then((r) => {
      res.send({
        statusCode,
        statusText,
        r
      });
    });
  })
  .post("/join", async (request, res) => {
    allowOriginType(request.headers.origin, res);
    var origin = request.query.origin;
    var stripeId = request.query.account;
    if (!origin) {
      origin = request.headers.origin;
      if (!request.body)
        return res.send({
          statusCode: 402,
          statusText: "no newaccount made body",
          error: {
            stripeId,
            body: request.body,
            query: request.query,
            origin
          }
          //...printObject(request) //: origin + " " + (stripeId ? "stripeId" : "")
        });
    }
    var lastLink = null,
      newLink = null;
    const deleteThese = [
      "acct_1MZ1z6GgRkLkqIsB",
      "acct_1MZEAk2fDCBY4qqq",
      "acct_1MZEFIGfFJwayKso"
    ]; //sandbox only!
    deleteThese.forEach(async (x) => {
      try {
        await stripe.accounts.del(x);
      } catch {}
    });
    await Promise.all(
      //"Sorry, you're creating accounts too quickly. You should
      //limit your requests to less than 5 creation attempts per
      //second with a test key, or less than 30 with a live key."
      await request.body.accounts.map(async (body, i) => {
        var newaccount = null;
        if (body.newAccount) {
          newaccount = {
            type: body.type,
            country: body.country,
            ...body.newAccount
            //account_token: body.newAccount.account_token
            //https://stripe.com/docs/connect/account-tokens
          };
        } else stripeId = Object.values(body)[0];
        var account = null;
        if (!stripeId) {
          account = await stripe.accounts
            .create(newaccount)
            .catch((e) => standardCatch(res, e, newaccount, "create"));

          if (!account.id)
            return res.send({
              statusCode: 402,
              statusText: "no stripeId go account",
              error: {
                body,
                query: request.query,
                origin
              }
            });
          const personal = {
              first_name: body.first,
              last_name: body.last,
              account_token: body.person.account_token
            },
            person = await stripe.accounts
              .createPerson(account.id, personal)
              .catch((e) => standardCatch(res, e, personal, "createPerson"));
          if (!person)
            return res.send({
              statusCode: 402,
              statusText: "no person go person",
              error: {
                body,
                query: request.query,
                origin
              }
            });
          const update = {
            account_token: body.companyAccount.account_token
          };
          const fresh = await stripe.accounts
            .update(account.id, update)
            .catch((e) => standardCatch(res, e, update, "update"));
          if (!fresh)
            return res.send({
              statusCode: 402,
              statusText: "no update go account",
              error: {
                body,
                query: request.query,
                origin
              }
            });
          stripeId = account.id;
        }
        const nLink = {
          account: stripeId, //: 'acct_1032D82eZvKYlo2C',
          return_url: i === 0 ? origin : lastLink, // + "/prompt=" + request.body.uid,
          refresh_url: `https://vault-co.in/join?account=${stripeId}&origin=${origin}`, //account.id
          //The collect parameter is not valid when creating an account link of type \"account_onboarding\" for a Standard account.
          //collect: "eventually_due"
          type: "account_onboarding"
        };
        const accLink = await stripe.accountLinks
          .create(nLink)
          .catch((e) => standardCatch(res, e, nLink, "accountLinks"));
        /*const deleted = !live
            ? await stripe.accounts.del(stripeId.id)
            : await stripe.accounts.reject(stripeId.id, {
                reason: "other"// "failed financial connection plaid"
              });*/
        //const response = await plaidClient.linkTokenCreate(request);
        if (!accLink)
          return res.send({
            statusCode: 402,
            statusText: "no accountLink go accountLink",
            nLink
          });
        if (i === request.body.accounts.length - 1)
          newLink = {
            account,
            accountLink: accLink
            //linkToken: response.data.link_token
          };
        lastLink = accLink.url;
        return await new Promise((r) => newLink && r());
      })
    ).then((result) => {
      res.send({
        statusCode,
        statusText: "successful accountLink",
        newLink
      });
    });
    //return res.redirect(accountLink.url);
  })
  .post("/deleteemail", async (req, res) => {
    allowOriginType(req.headers.origin, res);
    var auth = req.body;
    await deleteUser(auth)
      .then(async () => {
        var email = auth.email;
        delete auth.email;
        delete auth.emailVerified;
        delete auth.password;
        await getAuth(firebase)
          .createUser(auth)
          .then(() =>
            res
              .status(200)
              .send(
                `user ${auth.uid} successfully removed ${email} from firebase and firestore`
              )
          )
          .catch((err) => res.status(402).send(err));
      })
      .catch((err) => res.status(402).send(err));

    res.send({
      statusCode,
      statusText,
      data: {} // resp
    });
  })
  .listen(port, () => console.log(`localhost:${port}`));
