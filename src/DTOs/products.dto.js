class ProductDTO {
  constructor(
    _id, email, mostrarEmail, title, description,
    fechadenacimiento, medicamentos, enfermedades,
    nombredelhumano, telefono, thumbnail, tag, userId,
    modoPerdido, perdidoDesde, mensajePerdido
  ) {
    this._id = _id;
    this.email = email;
    this.mostrarEmail = mostrarEmail;
    this.title = title;
    this.description = description;
    this.fechadenacimiento = fechadenacimiento;
    this.medicamentos = medicamentos;
    this.enfermedades = enfermedades;
    this.nombredelhumano = nombredelhumano;
    this.telefono = telefono;
    this.thumbnail = thumbnail;
    this.tag = tag;
    this.userId = userId;
    this.modoPerdido = modoPerdido;
    this.perdidoDesde = perdidoDesde;
    this.mensajePerdido = mensajePerdido;
  }
}

export default ProductDTO;