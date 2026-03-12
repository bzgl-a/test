const NotFoundError = require("../errors/NotFoundError");
const { validateUserId } = require("../validators/userValidator");

class UserService {
  constructor(userRepository) {
    this.userRepo = userRepository;
  }

  async getCurrentUser(userId) {
    const validatedId = validateUserId(userId, "user ID from token");

    const user = await this.userRepo.findUserById(validatedId);
    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  async getAllUsers() {
    return await this.userRepo.findAllUsers();
  }
}

module.exports = UserService;
