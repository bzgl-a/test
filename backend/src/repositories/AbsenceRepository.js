const BaseRepository = require("./BaseRepository");

class AbsenceRepository extends BaseRepository {
  constructor(pool) {
    super(pool);
  }

  async findAbsenceCountsByYear(year, status, client = null) {
    const startDate = `${year}-01-01`;

    const rows = await this.query(
      `SELECT 
         to_char(day, 'YYYY-MM-DD') AS day, 
         COUNT(a.id) AS count
       FROM generate_series(
         $1::date, 
         ($1::date + interval '1 year - 1 day')::date, 
         '1 day'::interval
       ) AS day
       LEFT JOIN absences a 
         ON day BETWEEN a.start_date AND a.end_date 
         AND a.status = $2
       GROUP BY day 
       ORDER BY day`,
      [startDate, status],
      client,
    );

    return rows.reduce((acc, row) => {
      acc[row.day] = parseInt(row.count, 10);
      return acc;
    }, {});
  }

  async findByDateRange(startDate, endDate, status, client = null) {
    return await this.query(
      `SELECT 
        u.id AS user_id, u.first_name, u.last_name,
        a.id AS absence_id, a.type, a.start_date, a.end_date, a.status
       FROM absences a
       JOIN users u ON a.user_id = u.id
       WHERE a.status = $3
         AND a.start_date <= $2::date
         AND a.end_date >= $1::date
       ORDER BY u.last_name, u.first_name, a.start_date`,
      [startDate, endDate, status],
      client,
    );
  }

  async findByDay(date, status, client = null) {
    return await this.query(
      `SELECT 
        u.first_name, u.last_name,
        a.type, a.start_date, a.end_date
       FROM absences a
       JOIN users u ON a.user_id = u.id
       WHERE a.status = $2 AND $1::date BETWEEN a.start_date AND a.end_date
       ORDER BY u.last_name, u.first_name`,
      [date, status],
      client,
    );
  }
}

module.exports = AbsenceRepository;
