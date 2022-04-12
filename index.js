#!/usr/bin/env node

const fs = require("fs");

fs.mkdir("config", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "config/database.js",
    `const { info, mongooseDebug } = require("../debugging/debug"),
mongoose = require("mongoose"),
{ PORT, MONGODB_URL } = process.env;

module.exports = (app) => {
mongoose
    .connect(MONGODB_URL)
    .then(() => {
        mongooseDebug(\`Server connected to MongoDB...\`);

        app.listen(PORT, () => info(\`Server is running on...http://localhost:\${PORT}\`));
    })
    .catch(() => mongooseDebug(\`Server is not connected to MongoDB...\`));
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "config/passport.js",
    `const { Strategy, ExtractJwt } = require("passport-jwt"),
    { User } = require("../models/user"),
    { Seller } = require("../models/seller"),
    { Admin } = require("../models/admin"),
    passport = require("passport"),
    options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_PRIVATE_KEY
    };

passport.use(
    "user",
    new Strategy(options, (decoded, done) => {
        User.findById(decoded._id)
            .then((user) => {
                if (!user) return done(null, false);
                done(null, user);
            })
            .catch((err) => done(err));
    })
);

passport.use(
    "seller",
    new Strategy(options, (decoded, done) => {
        Seller.findById(decoded._id)
            .then((seller) => {
                if (!seller) return done(null, false);
                done(null, seller);
            })
            .catch((err) => done(err));
    })
);

passport.use(
    "admin",
    new Strategy(options, (decoded, done) => {
        Admin.findById(decoded._id)
            .then((admin) => {
                if (!admin) return done(null, false);
                done(null, admin);
            })
            .catch((err) => done(err));
    })
);
`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.mkdir("controllers", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "controllers/users.js",
    `const { User } = require("../models/user")

module.exports = { };`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.mkdir("debugging", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "debugging/debug.js",
    `const debug = require("debug");

const info = debug("info"),
    errors = debug("error"),
    mongooseDebug = debug("mongoose"),

module.exports = { info, errors, mongooseDebug};
    `,
    (err) => {
        if (err) console.log(err);
    }
);

fs.mkdir("docs", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "docs/basicInfo.js",
    `module.exports = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "E-commerce API",
        description: "A basic E-commerce API",
        contact: {
            name: "Harsh Dobariya",
            email: "hdobariya229@gmail.com",
            url: "https://github.com/Harsh-Dobariya"
        }
    }
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "docs/servers.js",
    `module.exports = {
    servers: [
        {
            url: process.env.BASE_URL,
            description: "Local server"
        }
    ]
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "docs/index.js",
    `const basicInfo = require("./basicInfo"),
    servers = require("./servers"),
    components = require("./components"),
    tags = require("./tags"),
    paths = require("./paths");

module.exports = {
    ...basicInfo,
    ...servers
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.mkdir("middleware", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "middleware/errors.js",
    `const { errors } = require("../debugging/debug");

module.exports = (err, req, res, next) => {
    errors(err.name, err.code, err.status);

    let error = {};

    if (Object.keys(error).length === 0) {
        error[err.name] = err.message;
    }

    res.status(err.status || 500).send({ error, status_code: err.status });
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.mkdir("models", { recursive: true }, (err) => {
    if (err) console.log(err);
});

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

fs.mkdir("routes", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "routes/users.routes.js",
    `const router = require("express").Router();

module.exports = router;`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "routes/index.js",
    `const express = require("express"),
    swaggerUI = require("swagger-ui-express"),
    docs = require("../docs"),

module.exports = (app) => {
    app.use(require("cors")());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(require("passport").initialize());
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));
    app.use("/users", require("./users.routes"));
    app.use(require("../middleware/errors"));
};`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.mkdir("services", { recursive: true }, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    ".env.development",
    `# Debugging configuration
DEBUG=info,error,mongoose

# Server configuration
BASE_URL=http://localhost:3000
PORT=3000

# Database configuration
MONGODB_URL=mongodb://localhost/Express-mvc`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(".gitignore", `node_modules/\n*.env.*`, (err) => {
    if (err) console.log(err);
});

fs.writeFile(
    "package.json",
    `{
    "name": "express-project",
    "version": "1.0.0",
    "description": "For practice",
    "main": "server.js",
    "author": "Harsh Dobariya",
    "license": "MIT",
    "scripts": {
        "start": "node server.js",
        "dev": "dotenv -e .env.development nodemon server.js"
    },
    "dependencies": {
        "cors": "^2.8.5",
        "express": "^4.17.3",
        "express-async-errors": "^3.1.1",
        "http-errors": "^2.0.0",
        "mongoose": "^6.2.9",
        "passport": "^0.5.2",
        "passport-jwt": "^4.0.0",
        "swagger-ui-express": "^4.3.0"
    },
    "devDependencies": {
        "debug": "^4.3.4",
        "dotenv-cli": "^5.1.0",
        "nodemon": "^2.0.15"
    }
}`,
    (err) => {
        if (err) console.log(err);
    }
);

fs.writeFile(
    "server.js",
    `const app = require("express")();

require("express-async-errors");
require("./config/mongoose")(app);
require("./config/passport");
require("./routes")(app);`,
    (err) => {
        if (err) console.log(err);
    }
);
