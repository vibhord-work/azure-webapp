const sql = require("mssql");

let poolPromise;

function getPool() {
  if (!poolPromise) {
    const connectionString = process.env.DB_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error("DB_CONNECTION_STRING is not configured");
    }

    const values = {};

    for (const part of connectionString.split(";")) {
      const index = part.indexOf("=");
      if (index === -1) continue;

      const key = part.slice(0, index).trim().toLowerCase();
      const value = part.slice(index + 1).trim();

      values[key] = value;
    }

    const serverAddress = values.server || values["data source"];

    if (!serverAddress) {
      throw new Error("Database server is missing");
    }

    const [server, port] = serverAddress
      .replace(/^tcp:/i, "")
      .split(",");

    const config = {
      server,
      port: Number(port || 1433),
      database: values.database,
      user: values["user id"],
      password: values.password,
      options: {
        encrypt: true,
        trustServerCertificate: false
      },
      connectionTimeout: 15000,
      requestTimeout: 15000
    };

    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .catch(error => {
        poolPromise = undefined;
        throw error;
      });
  }

  return poolPromise;
}

module.exports = { sql, getPool };
