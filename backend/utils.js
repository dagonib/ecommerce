import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  // Pasará los datos del usuario pero solo los que se ponen a continuación.
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
