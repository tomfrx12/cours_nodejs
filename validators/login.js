const zod = require('zod');

const LoginSchema = zod.object({ 
  email: zod.email(),
  password:zod.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre")
});

module.exports = LoginSchema;