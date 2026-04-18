import { z } from "zod";

export const professorRegistrationSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  fieldOfExpertise: z.string().min(1, { message: "A área de atuação é obrigatória." }),
  graduationTime: z.string().min(1, { message: "O tempo de formação é obrigatório." }),
});

export type ProfessorRegistrationInput = z.infer<typeof professorRegistrationSchema>;

export const studentRegistrationSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  academicNeed: z.string().min(1, { message: "A necessidade acadêmica é obrigatória." }),
});

export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
