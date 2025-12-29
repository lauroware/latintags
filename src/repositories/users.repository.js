import UsersDAOMongoDb from "../daos/usersMongooseDao.js";
import { userSchema } from "../models/users.model.js";
const userDAO = new UsersDAOMongoDb("users", userSchema);

class UserRepository {
  async getAllUsers() {
    return userDAO.getAllUsers();
  }

  async getUserByTag(tag) {
    try {
      return userDAO.getUserByTag(tag); // Llamar a la función getUserByTag del objeto userDAO
    } catch (error) {
      console.error("Error al obtener usuario por tag:", error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    return userDAO.getUserByEmail(email);
  }

  async saveUser(newUser, cid) {
    return userDAO.saveUser(newUser, cid);
  }

  async findUser(user) {
    return userDAO.findUser(user);
  }

  async updateUserRole(uid, newRole) {
    return userDAO.updateUserRole(uid, newRole);
  }

  async updateUserEmail(uid, newEmail) {
    return userDAO.updateUserEmail(uid, newEmail);
  }

  async deleteUsers() {
    return userDAO.deleteUsers();
  }

  async deleteUserById(uid) {
    return userDAO.deleteUserById(uid);
  }

  async restorePassword(email, newPassword) {
    return userDAO.restorePassword(email, newPassword);
  }
}

export default UserRepository;
