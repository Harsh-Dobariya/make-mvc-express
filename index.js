#!/usr/bin/env node

const fs = require("fs");

fs.mkdir("config", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.mkdir("controllers", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.mkdir("middleware", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.mkdir("debugging", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.mkdir("models", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.mkdir("routes", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.mkdir("start", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "server.js",
    `const app = require("express")();

require("express-async-errors");
require("./config/database")(app);
require("./start/routes");`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "config/mongoose.js",
    `const { info, mongooseDebug } = require("../debugging/debug"),
    mongoose = require("mongoose"),
    { port, mongodb_url } = process.env;

module.exports = (app) => {
    mongoose
        .connect(mongodb_url)
        .then(() => {
            mongooseDebug(\`Server connected to MongoDB...\`);

            app.listen(port, () => info(\`Server is running on...http://localhost:\${port}\`));
        })
        .catch(() => mongooseDebug(\`Server is not connected to MongoDB...\`));
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "middleware/errors.js",
    `const { error } = require("../debugging/debug");

module.exports = (err, req, res, next) => {
    error(err.name, err.code, err.status);

    res.status(err.status || 500).send({error: err.message})
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "debugging/debug.js",
    `const debug = require("debug");

const info = debug("info"),
    error = debug("error"),
    mongooseDebug = debug("mongoose");

module.exports = { info, error, mongooseDebug };`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "controllers/users.js",
    `const { User } = require("../models/user")

module.exports = { };`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "models/user.js",
    `const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({});

const User = mongoose.model("User", userSchema);

module.exports = { User }`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "routes/users.routes.js",
    `const router = require("express").Router();

module.exports = router;`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "start/routes.js",
    `module.exports = (app) => {
    app.use(require("express").json());
    app.use('/users', require("../routes/users.routes"));
    app.use(require("../middleware/errors"));
}`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(".gitignore", `node_modules/\n*.env.*`, (err) => {
    if (err) console.log(err);
});
