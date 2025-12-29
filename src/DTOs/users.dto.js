class UserDTO {
  constructor(_id, user, email, age, password, role, tag) {
    (this._id = _id),
      (this.user = user),
      (this.email = email),
      (this.role = role),
      (this.age = age),
      (this.password = password),
      (this.tag = tag); // Agregar el campo tag
  }
}
export default UserDTO;
