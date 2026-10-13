const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  city: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const existing = await User.findOne({ where: { email: value.email } });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

    const user = await User.create(value);
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ success: true, message: 'Account created!', token, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const user = await User.findOne({ where: { email: value.email } });
    if (!user || !(await user.comparePassword(value.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.is_active) return res.status(403).json({ success: false, message: 'Account deactivated' });

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ success: true, message: 'Welcome back!', token, user });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, city, avatar_url } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.update({ name, phone, city, avatar_url });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
};
