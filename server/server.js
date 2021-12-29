import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import koaBody from "koa-body";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  var mysql = require("mysql");

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "csv_downloader",
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  router.post("/export-history", verifyRequest(), koaBody(), async (ctx) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    async function getData() {
      return new Promise(async (resolve, reject) => {
        const data = await client.get({
          path: "shop",
        });
        let sId = data.body.shop.id;
        let resData = ctx.request.body;
        con.query(
          `INSERT INTO history (shop_id, export_name) VALUES (${sId}, '${resData.export_name}')`,
          (err, res) => {
            if (!err) {
              resolve({ status: 200 });
            } else {
              reject({ status: 500 });
            }
          }
        );
      });
    }
    ctx.body = await getData();
  });

  router.get("/get-history", verifyRequest(), async (ctx) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    async function getData() {
      return new Promise(async (resolve, reject) => {
        const data = await client.get({
          path: "shop",
        });
        let sId = data.body.shop.id;
        con.query(
          `SELECT * FROM history where shop_id = ${sId}`,
          (err, result) => {
            if (!err) {
              resolve({ status: 200, body: result });
            } else {
              reject({ status: 500 });
            }
          }
        );
      });
    }
    ctx.body = await getData();
  });

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("/products", verifyRequest(), async (ctx) => {
    let products = [];
    let newPageInfo;

    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const data = await client.get({
      path: "products",
      query: { limit: "250" },
    });
    products = [...data.body.products];
    newPageInfo =
      data.pageInfo.nextPage !== undefined &&
      data.pageInfo.nextPage.query.page_info;

    while (newPageInfo) {
      let addData = await client.get({
        path: "products",
        query: { limit: "250", page_info: newPageInfo },
      });

      products = [...products, ...addData.body.products];
      newPageInfo =
        addData.pageInfo.nextPage !== undefined &&
        addData.pageInfo.nextPage.query.page_info;
    }

    // console.log(products);
    ctx.status = 200;
    ctx.body = products;
  });

  // router.get("/products-limit", verifyRequest(), async (ctx) => {
  //   let products = [];
  //   let newPageInfo;

  //   const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
  //   const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

  //   const data = await client.get({
  //     path: "products",
  //     query: { fields: "id%2Cimages%2Ctitle" },
  //   });

  //   ctx.status = 200;
  //   ctx.body = products;
  // });
  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
