const express = require("express");
const { getPool } = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT PatientId, FullName, Department
      FROM dbo.Patients
      ORDER BY PatientId
    `);

    res.status(200).json({
      count: result.recordset.length,
      patients: result.recordset
    });
  } catch (error) {
    console.error("Database query failed:", error.message);

    res.status(503).json({
      error: "Database service unavailable"
    });
  }
});

module.exports = router;
