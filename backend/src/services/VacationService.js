const { STATUS } = require("../constants/constants");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const {
  validateDateRange,
  validateLeaveType,
  validateRejectReason,
  validateVacationBalance,
} = require("../validators/vacationValidator");

class VacationService {
  constructor(vacationRepo, userRepo) {
    this.vacationRepo = vacationRepo;
    this.userRepo = userRepo;
  }

  async approveRequest(requestId, managerId) {
    return await this.vacationRepo.withTransaction(async client => {
      const absence = await this.vacationRepo.findByIdAndStatus(
        requestId,
        STATUS.PENDING,
        client,
      );

      if (!absence) {
        throw new NotFoundError("Vacation request");
      }

      await this.vacationRepo.updateStatus(
        requestId,
        STATUS.APPROVED,
        managerId,
        null,
        client,
      );

      const updatedUser = await this.vacationRepo.deductDays(
        absence.user_id,
        absence.days_count,
        client,
      );

      return {
        success: true,
        newDaysLeft: updatedUser.days_left,
        requestId: absence.id,
      };
    });
  }

  async rejectRequest(requestId, managerId, rejectReason) {
    const reason = validateRejectReason(rejectReason);

    return await this.vacationRepo.withTransaction(async client => {
      const absence = await this.vacationRepo.findByIdAndStatus(
        requestId,
        STATUS.PENDING,
        client,
      );

      if (!absence) {
        throw new NotFoundError("Vacation request");
      }

      await this.vacationRepo.updateStatus(
        requestId,
        STATUS.REJECTED,
        managerId,
        reason,
        client,
      );

      return { success: true, requestId: absence.id };
    });
  }

  async createRequest(userId, { start_date, end_date, type, comment = "" }) {
    const {
      start_date: validStart,
      end_date: validEnd,
      daysCount,
    } = validateDateRange(start_date, end_date);
    validateLeaveType(type);

    const user = await this.userRepo.findUserById(userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    validateVacationBalance(daysCount, user.days_left);

    const created = await this.vacationRepo.create({
      user_id: userId,
      start_date: validStart,
      end_date: validEnd,
      type,
      comment,
      status: STATUS.PENDING,
    });

    return {
      message: "Vacation request created",
      absenceId: created.id,
      days_used: daysCount,
      days_remaining: user.days_left,
      status: STATUS.PENDING,
    };
  }

  async getRequestsForUser(userId, year = new Date().getFullYear()) {
    const [myRequests, teamRequests] = await Promise.all([
      this.vacationRepo.findRequestsByUserId(userId, year),
      this.vacationRepo.findApprovedTeamRequests(userId, STATUS.APPROVED, year),
    ]);

    return { myRequests, teamRequests };
  }

  async getRequestsForManager(year = new Date().getFullYear()) {
    const [pendingRequests, archiveRequests] = await Promise.all([
      this.vacationRepo.findPendingRequests(STATUS.PENDING, year),
      this.vacationRepo.findArchivedRequests(STATUS.PENDING, year),
    ]);

    return { pendingRequests, archiveRequests };
  }
}

module.exports = VacationService;
