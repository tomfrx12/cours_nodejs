const zod = require('zod');

const SigninSchema = zod.object({ 
  email: zod.email(),
  password:zod.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre"),
  username: zod.string().min(2, "Le nom d'utilisateur est trop petit: il doit être supérieur ou égal à 2 caractères").max(50, "Le nom d'utilisateur est trop grand: il doit être inférieur ou égal à 50 caractères")
});

module.exports = SigninSchema;