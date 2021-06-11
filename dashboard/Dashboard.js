const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const { MONGO_HOST,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_PORT } = process.env

class DashBoard {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });

        this.app = app;
        this.app.use(express.json()) // for parsing application/json
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors());
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    "script-src-elem": ["'self'","https:"],
                    "img-src": ["'self'", "data:", "https:"]
                }
            }
        }));
        this.app.use(morgan("common"));
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "ejs");
        this.app.use(session({
            store: new MongoStore(
                {
                    mongoUrl: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`,
                    mongoOptions: {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    },
                    dbName: "dashboard"
                }
            ),
            secret: process.env.SECRET_PASS,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7 * 2
            }
        }));
        this.app.use((req, res, next) => {
            req.user = req.session.user;
            req.client = client;
            next()
        })
        this.app.use("/", require("./routes/index"));

        this.app.listen(parseInt(PORT), () => {
            console.log(`Dashboard is running at port ${PORT}`);
        })
    }
}

module.exports = DashBoard;