const BaseRepository = require("./BaseRepository");

class VacationRepository extends BaseRepository {
  constructor(pool) {
    super(pool);
  }

  async deductDays(userId, daysCount, client = null) {
    const rows = await this.query(
      `UPDATE users 
       SET days_left = days_left - $1
       WHERE id = $2 AND days_left >= $1
       RETURNING days_left`,
      [daysCount, userId],
      client,
    );

    if (rows.length === 0) {
      const [user] = await this.query(
        "SELECT days_left FROM users WHERE id = $1",
        [userId],
        client,
      );

      throw new ConflictError("Not enough vacation days", {
        requested: daysCount,
        available: user?.days_left || 0,
      });
    }

    return rows[0];
  }

  async updateStatus(
    id,
    status,
    updatedBy,
    rejectionReason = null,
    client = null,
  ) {
    return await this.query(
      `UPDATE absences 
       SET status = $1, updated_at = NOW(), updated_by = $2, rejection_reason = $3
       WHERE id = $4
       RETURNING user_id, start_date, end_date, (end_date - start_date + 1) AS days_count`,
      [status, updatedBy, rejectionReason, id],
      client,
    ).then(rows => rows[0]);
  }

  async findByIdAndStatus(id, status, client = null) {
    return await this.query(
      `SELECT *, (end_date - start_date + 1) AS days_count 
       FROM absences 
       WHERE id = $1 AND status = $2`,
      [id, status],
      client,
    ).then(rows => rows[0]);
  }

  async create(data, client = null) {
    const { user_id, start_date, end_date, type, comment, status } = data;
    return await this.query(
      `INSERT INTO absences (user_id, start_date, end_date, type, comment, status) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, start_date, end_date, type, comment, status],
      client,
    ).then(rows => rows[0]);
  }

  async findRequestsByUserId(userId, year, client = null) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    return await this.query(
      `SELECT 
        a.id AS request_id, a.start_date, a.end_date,
        (a.end_date::date - a.start_date::date + 1) AS absence_days_count,
        a.type, a.status, a.comment, a.rejection_reason, a.updated_at,
        manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
      FROM absences a
      LEFT JOIN users manager ON manager.id = a.updated_by
      WHERE a.user_id = $1
        AND a.start_date >= $2 
        AND a.start_date <= $3
      ORDER BY a.id DESC`,
      [userId, startDate, endDate],
      client,
    );
  }

  async findApprovedTeamRequests(excludeUserId, status, year, client = null) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    return await this.query(
      `SELECT 
        a.id AS request_id, u.first_name, u.last_name,
        a.start_date, a.end_date, (a.end_date::date - a.start_date::date + 1) AS absence_days_count,
        a.type, a.status, a.comment, a.rejection_reason, a.updated_at,
        manager.first_name AS manager_first_name, manager.last_name AS manager_last_name,
        u.first_name, u.last_name
      FROM absences a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN users manager ON manager.id = a.updated_by
      WHERE a.user_id != $1 AND a.status = $2
        AND a.start_date >= $3 
        AND a.start_date <= $4
      ORDER BY a.id DESC`,
      [excludeUserId, status, startDate, endDate],
      client,
    );
  }

  async findPendingRequests(statusFilter, year, client = null) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    return await this.query(
      `SELECT 
        a.id AS request_id, u.first_name, u.last_name, u.days_left,
        a.start_date, a.end_date, (a.end_date::date - a.start_date::date + 1) AS absence_days_count,
        a.type, a.status, a.comment
      FROM absences a
      JOIN users u ON u.id = a.user_id
      WHERE a.status = $1
        AND a.start_date >= $2 
        AND a.start_date <= $3
      ORDER BY a.created_at ASC`,
      [statusFilter, startDate, endDate],
      client,
    );
  }

  async findArchivedRequests(excludeStatus, year, client = null) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    return await this.query(
      `SELECT 
        a.id AS request_id, u.first_name, u.last_name,
        a.start_date, a.end_date, (a.end_date::date - a.start_date::date + 1) AS absence_days_count,
        a.type, a.status, a.comment, a.rejection_reason, a.updated_at,
        manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
      FROM absences a
      JOIN users u ON u.id = a.user_id
      LEFT JOIN users manager ON manager.id = a.updated_by
      WHERE a.status != $1
        AND a.start_date >= $2 
        AND a.start_date <= $3
      ORDER BY a.updated_at DESC`,
      [excludeStatus, startDate, endDate],
      client,
    );
  }
}

module.exports = VacationRepository;
