import UserRepository from "../repositories/users.repository.js";
const userRepository = new UserRepository();
const serviceGetAllUsers = async () => {
  let users = await userRepository.getAllUsers();
  return users;
};

const serviceGetUserByEmail = async (email) => {
  let user = await userRepository.getUserByEmail(email);
  return user;
};

const serviceGetUserByTag = async (tag) => {
  let user = await userRepository.getUserByTag(tag);
  return user;
};

const serviceLoginUser = async (user) => {
  let userInDb = await userRepository.findUser(user);
  return userInDb;
};

const serviceUpdateUserRole = async (uid, newRole) => {
  let updatedUser = await userRepository.updateUserRole(uid, newRole);
  return updatedUser;
};

const serviceUpdateUserEmail = async (uid, newEmail) => {
  let updatedUser = await userRepository.updateUserEmail(uid, newEmail);
  return updatedUser;
};

const serviceDeleteAllUsers = async () => {
  let deletedUsers = await userRepository.deleteUsers();
  return deletedUsers;
};

const serviceDeleteUserById = async (uid) => {
  let deletedUser = await userRepository.deleteUserById(uid);
  return deletedUser;
};

const serviceRestorePassword = async (email, newPassword) => {
  let updatedUser = await userRepository.restorePassword(email, newPassword);
  return updatedUser;
};

export {
  serviceGetAllUsers,
  serviceGetUserByEmail,
  serviceLoginUser,
  serviceDeleteAllUsers,
  serviceDeleteUserById,
  serviceUpdateUserRole,
  serviceUpdateUserEmail,
  serviceRestorePassword,
  serviceGetUserByTag, // Agregar el nuevo método serviceGetUserByTag
};
