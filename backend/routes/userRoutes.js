const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);       // Crear usuario
router.get('/', userController.getUsers);          // Obtener usuarios
router.get('/:id', userController.getUser);        // Obtener un usuario
router.put('/:id', userController.updateUser);     // Actualizar usuario
router.delete('/:id', userController.deleteUser);  // Eliminar usuario

module.exports = router;
