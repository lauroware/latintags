import { userModel } from "../models/users.model.js";
import { ContenedorMongoDb } from "../persistence/mongoDbPersistence.js";
import UserDTO from "../DTOs/users.dto.js";
import { createHash } from "../utils/index.js";

const userDtoFromObj = (obj) => {
  const { _id, first_name, last_name, email, age, password, role, tag } = obj;
  let userDTO = new UserDTO(
    _id,
    `${first_name} ${last_name}`,
    email,
    age,
    password,
    role,
    tag
  );
  return userDTO;
};

const allUsersDtoFromObj = (users) => {
  return users.map((user) => {
    const { _id, first_name, last_name, email, age, password, role, tag } =
      user;
    return new UserDTO(
      _id,
      `${first_name} ${last_name}`,
      email,
      age,
      password,
      role,
      tag
    );
  });
};

class UsersDAOMongoDb extends ContenedorMongoDb {
  async getAllUsers() {
    try {
      const users = await userModel.find();
      return allUsersDtoFromObj(users);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email: email }).lean();
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Métodos existentes...

  async getUserByTag(tag) {
    try {
      if (tag === undefined) {
        throw new Error("El parámetro tag no está definido");
      }

      const user = await userModel.findOne({ tag });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return userDtoFromObj(user);
    } catch (error) {
      throw new Error(`Error al obtener usuario por tag: ${error.message}`);
    }
  }

  async saveUser(newUser, cid) {
    try {
      const savedUser = await this.save({ ...newUser });
      return userDtoFromObj(savedUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findUser(user) {
    let existUser = await userModel.findOne({ email: user.email });
    if (!existUser) return { status: "error", payload: "Usuario inexistente" };
    return userDtoFromObj(existUser);
  }

  async updateUserRole(uid, newRole) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: uid },
        { role: newRole },
        { new: true }
      );

      if (!updatedUser) {
        return { status: "error", payload: "Usuario inexistente" };
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserEmail(uid, newEmail) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: uid },
        { email: newEmail },
        { new: true }
      );

      if (!updatedUser) {
        return { status: "error", payload: "Usuario inexistente" };
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async restorePassword(email, newPassword) {
    try {
      const updatedUser = await userModel.findOneAndUpdate(
        { email: email },
        { password: createHash(newPassword) },
        { new: true }
      );

      if (!updatedUser) {
        return { status: "error", payload: "Usuario inexistente" };
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUsers() {
    try {
      const deleteAll = await this.deleteAll();
      return deleteAll;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUserById(uid) {
    try {
      let existUser = await userModel.findOne({ _id: uid });
      if (!existUser)
        return { status: "error", payload: "Usuario inexistente" };
      const deletedUser = await this.delete(existUser);
      return userDtoFromObj(deletedUser);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default UsersDAOMongoDb;
