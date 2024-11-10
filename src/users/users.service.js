const Service = require("../../common/CommonService");
const Role = require("../roles/roles.model");
const bcrypt = require("bcryptjs");

class UserService extends Service {
  constructor(model) {
    super(model);
  }

  async login(email, password) {
    const user = await this.model.scope("withPassword").findOne({
      where: {
        email,
        isActive: true,
        isLocked: false,
      },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "priority"],
        },
      ],
    });

    if (!user) {
      return null;
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return null;
    }

    return user;
  }
}

module.exports = UserService;
