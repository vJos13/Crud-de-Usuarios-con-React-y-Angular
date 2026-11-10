const User = require('../models/userModel');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUPLICATE_KEY = [2627, 2601]; // códigos de SQL Server para UNIQUE violado

function validate(body) {
  const name = (body?.name ?? '').trim();
  const email = (body?.email ?? '').trim().toLowerCase();
  if (!name) return { error: 'El nombre es obligatorio' };
  if (!EMAIL_RE.test(email)) return { error: 'El correo no es válido' };
  return { data: { name, email } };
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: 'Id inválido' });
    return null;
  }
  return id;
}

function handleError(res, err, action) {
  if (DUPLICATE_KEY.includes(err.number)) {
    return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
  }
  console.error(err);
  res.status(500).json({ message: `Error ${action} usuario: ${err.message}` });
}

// Crear usuario
exports.createUser = async (req, res) => {
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const user = await User.create(data);
    res.status(201).json(user);
  } catch (err) {
    handleError(res, err, 'creando');
  }
};

// Obtener usuarios
exports.getUsers = async (req, res) => {
  try {
    res.json(await User.findAll());
  } catch (err) {
    handleError(res, err, 'obteniendo');
  }
};

// Obtener un usuario
exports.getUser = async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    handleError(res, err, 'obteniendo');
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const user = await User.update(id, data);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    handleError(res, err, 'actualizando');
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    const deleted = await User.remove(id);
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(204).end();
  } catch (err) {
    handleError(res, err, 'eliminando');
  }
};
