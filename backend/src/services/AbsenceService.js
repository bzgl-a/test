const { STATUS } = require("../constants/constants");
const {
  validateYearMonth,
  validateDate,
  validateYear,
} = require("../validators/absenceValidator");

class AbsenceService {
  constructor(absenceRepository) {
    this.absenceRepo = absenceRepository;
  }

  _getDateRangeForMonth(yearNum, monthNum) {
    const monthStart = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const monthEnd = new Date(Date.UTC(yearNum, monthNum, 0));
    return {
      start: this._formatDateUTC(monthStart),
      end: this._formatDateUTC(monthEnd),
    };
  }

  _formatDateUTC(date) {
    return date.toISOString().split("T")[0];
  }

  _groupAbsencesByUser(rows) {
    const grouped = {};

    for (const row of rows) {
      const userId = row.user_id;

      if (!grouped[userId]) {
        grouped[userId] = {
          first_name: row.first_name,
          last_name: row.last_name,
          absences: [],
        };
      }

      grouped[userId].absences.push({
        type: row.type,
        start_date: row.start_date,
        end_date: row.end_date,
        status: row.status,
      });
    }

    return Object.values(grouped);
  }

  async getAbsencesByMonth(year, month, status = STATUS.APPROVED) {
    const { yearNum, monthNum } = validateYearMonth(year, month);

    const { start, end } = this._getDateRangeForMonth(yearNum, monthNum);

    const rows = await this.absenceRepo.findByDateRange(start, end, status);

    return this._groupAbsencesByUser(rows);
  }

  async getAbsencesByDay(date, status = STATUS.APPROVED) {
    const validatedDate = validateDate(date);
    return await this.absenceRepo.findByDay(validatedDate, status);
  }

  async getAbsenceCalendar(year, status = STATUS.APPROVED) {
    const validatedYear = validateYear(year);
    return await this.absenceRepo.findAbsenceCountsByYear(
      validatedYear,
      status,
    );
  }
}

module.exports = AbsenceService;
