// controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../utils/jwt');

const prisma = new PrismaClient();

// Register
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        }
    });

    res.status(201).json({ message: 'Utilisateur créé', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Email incorrect' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = generateJWT(user);

    res.json({ token });
};

// Admin: List all users
exports.listUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
    });

    res.json(users);
};

// Admin: Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            name: name || user.name,
            email: email || user.email,
            role: role || user.role
        }
    });

    res.json({ message: 'Utilisateur mis à jour', user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } });
};