import _ from 'lodash'
import cors from "cors";
import path from "path";
import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";

import tokyoMetroStations from "./data/tokyo-metro-stations.mjs";

const makeWBFFResp = (p, fail = false) => {
  return {
    header: {
      resultCode: fail ? "S0001" : "S0000",
      resultMessage: fail ? "Request failed to execute" : "Request Successfully executed",
    },
    payload: p,
  };
};

const delay = async (t = 2500) => new Promise(r => setTimeout(r, t))

const appPort = 7070;
const app = express();
const cwd = process.cwd();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// logger
app.use(morgan("dev"));

app.use(express.static("dist"));

app.use("/images", express.static(path.join(cwd, "assets")));

app.get("/v1/search", (req, res) => {
  const { query } = req.query;

  res.send({ message: "Voila!!", query });
});

app.get("/proxy/o2o/location/consumer/v1/address", (req, res) => {
  res.send(
    makeWBFFResp({
      addresses: [
        {
          locationId: "20230214022704-0a4238a3-036f-4230-a2a9-2f30dfd6e05f",
          address: "Far",
          label: "Far",
          longitude: 140.12329227417626,
          latitude: 35.60657866133437,
        },
        {
          locationId: "20230207002434-96dc590e-7224-48cf-b0e1-55610cb0cf13",
          address: "日本, 新潟県新潟市西区山田2307-401",
          label: "Home",
          longitude: 139.02130499294276,
          latitude: 37.86891659135429,
        },
        {
          locationId: "20230130030520-8fd01acc-6133-40eb-baed-67ab2ac1fc68",
          address:
            "P2P2P2P2P2P2P2P2 2P2P2P2 P2P2 P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2 P2P2P2P2P2P2P2P2 2P2P2P2 P2P2 P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2 P2P2P2P2P2P2P2P2 2P2P2P2 P2P2 P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2 P2P2P2P2P2P2P2P2 2P2P2P2 P2P2 P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2",
          label:
            "P2P2P2P2P2P2P2P2 2P2P2P2 P2P2 P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2P2P2P2P2P2P2P2P2P2P2P2P 2P2P2",
          longitude: 139.69920959713,
          latitude: 35.6776111278934,
        },
        {
          locationId: "20230130024909-26ef006b-2ef0-4afb-ae44-92e747d460e4",
          address:
            "P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2",
          label:
            "P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2P2",
          longitude: 139.69920959713,
          latitude: 35.6776111278934,
        },
      ],
    })
  );
});

app.get("/config/search.json", (req, res) => {
  res.send(
    makeWBFFResp({
      categories: ["merchant"],
    })
  );
});

app.get("/api/v1/tokyo/metro/stations", (req, res) => {
  const { pageNumber = 1, pageSize = 10 } = req.query;
  const start = pageNumber * pageSize;

  res.send(
    makeWBFFResp({
      stations: tokyoMetroStations.slice(start, start + pageSize),
    })
  );
});

app.get("/portal/api/v1/nearbylite/config", async (req, res) => {
  await delay()

  res.send(
    makeWBFFResp({
      campaigns: [{ id: 1, url: "campaigns/1", name: "campaigns 1" }],
      giftVouchers: [{ id: 1, url: "giftVoucher/1", name: "GiftVoucher 1" }],
      popularAreas: [
        {
          lat: 35.68139778248955,
          lng: 139.76711970515865,
          name: "Tokyo Station",
          imageUrl: "popularAreas/tokyoStation",
        },
      ],
      jumboBanner: {
        id: 1, // Unique Campaign Id
        url: "jumboBanner/1", // Campaign details page link
        image: "/images/banners/image_jumbo.png", // Campaign icon url
        label: "Join the PayPay Jumbo Campaign!", // Campaign text
        color: "var(--color-global-cherry-2)", // Campaign text color
        backgroundColor: "var(--color-global-orange-4)", // Campaign banner backgroundColor
      },
      defaultLocation: {
        lat: 35.68139778248955,
        lng: 139.76711970515865,
      },
    })
  );
});

app.post("/portal/api/v1/nearbylite/search/stores", async (req, res) => {
  await delay()

  const storeMeta = [{
    title: 'ATM Top-up',
    iconUrl: 'http://localhost:9106/images/stores/7-11.png'
  }, {
    title: 'Starbucks',
    iconUrl: 'http://localhost:9106/images/stores/starbucks.png'
  }, {
    title: 'Dummy Burger',
    iconUrl: 'http://localhost:9106/images/stores/dummy-burger.png'
  }, {
    title: 'Dummy Ramen',
    iconUrl: 'http://localhost:9106/images/stores/dummy-ramen.png'
  }, {
    title: 'McD',
    iconUrl: 'http://localhost:9106/images/stores/mcd.png'
  }]

  const stores = _.range(1, 20).map((id) => {
    const { title, iconUrl } = _.get(storeMeta, _.sample(_.range(0, storeMeta.length)))
    const ranking = _.sample(_.range(0, 1, 0.1))
    const distance = _.sample(_.range(800, 4000))

    return {
      id: String(id),
      title,
      iconUrl,
      ranking,
      distance,
      resourceType: "STORE",
      category: 'category',
      subCategory: 'subCategory',
      location: {
        lat: 1.23,
        lng: 1.23,
      },
      discounts: ranking > 0.5 ? [
        {
          id: "123",
          type: "coupon",
          name: "Coupon",
        },
        {
          id: "124",
          type: "giftVoucher",
          name: "Gift Voucher",
        },
        {
          id: "125",
          type: "stampCard",
          name: "StampCard",
        },
        {
          id: "126",
          type: "flyer",
          name: "Flyer",
        },
        {
          id: "127",
          type: "campaign",
          name: "Campaign",
        },
        {
          id: "128",
          type: "coupon",
          name: "Name for campaign or coupon",
        },
      ] : [],
    }
  })

  res.send(
    makeWBFFResp({
      totalCount: 10,
      stores
    })
  );
});

app.get("/api/v1/timestamp", (req, res) => {
  res.send(makeWBFFResp({ timestamp: Date.now() }));
});

app.get("/", (req, res) => {
  res.send(makeWBFFResp({ message: "Voila!" }));
});

app.listen(appPort, () => {
  console.log("\n\n server running on =--2> ", appPort, "\n\n");
});
