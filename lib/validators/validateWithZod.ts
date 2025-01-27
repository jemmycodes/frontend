import {
	type ForgotPasswordProps,
	type LoginProps,
	type ResetPasswordProps,
	type SignUpProps,
} from "@/interfaces";
import { zxcvbn, zxcvbnAsync, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import { z } from "zod";

const options = {
	dictionary: {
		...zxcvbnCommonPackage.dictionary,
		...zxcvbnEnPackage.dictionary,
	},
	translations: {
		...zxcvbnEnPackage.translations,
	},
	graphs: zxcvbnCommonPackage.adjacencyGraphs,
	// useLevenshteinDistance: true
};
zxcvbnOptions.setOptions(options);

export const checkPasswordStrength = (password: string) =>
	zxcvbnAsync(password).then((response) => response.score);

type FormType =
	| "login"
	| "signup"
	| "resetPassword"
	| "forgotPassword"
	| "campaignStepOne"
	| "campaignStepTwo"
	| "campaignStepThree";

const signUpSchema: z.ZodType<SignUpProps> = z
	.object({
		firstName: z
			.string()
			.min(2, { message: "First Name is required" })
			.max(50, { message: "First Name must be less than 50 characters" })
			.transform((value) => {
				return (
					value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
				).trim();
			}),
		lastName: z
			.string()
			.min(2, { message: "Last Name is required" })
			.max(50, { message: "Last Name must be less than 50 characters" })
			.transform((value) => {
				return (
					value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
				).trim();
			}),
		email: z
			.string()
			.min(2, { message: "Email is required" })
			.email({ message: "Invalid email address" })
			.regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
				message: "Enter a valid email",
			})
			.transform((value) => {
				return value.toLowerCase().trim();
			}),
		terms: z.boolean().refine((value) => value === true, {
			message: "Please accept the terms before proceeding",
		}),
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
				{
					message:
						"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				}
			)
			.max(50)
			.transform((value, ctx) => {
				const options = {
					dictionary: {
						...zxcvbnCommonPackage.dictionary,
						...zxcvbnEnPackage.dictionary,
					},
					translations: {
						...zxcvbnEnPackage.translations,
					},
					graphs: zxcvbnCommonPackage.adjacencyGraphs,
					// useLevenshteinDistance: true
				};
				zxcvbnOptions.setOptions(options);
				const testedResult = zxcvbn(value);

				if (testedResult.score < 3) {
					testedResult.feedback.suggestions.map((issue) => {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: issue,
						});
					});
				}

				return value.trim();
			}),
		confirmPassword: z
			.string()
			.min(6, { message: "Passwords must match" })
			.transform((value) => {
				return value.trim();
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

const loginSchema: z.ZodType<LoginProps> = z.object({
	email: z
		.string()

		.min(2, { message: "Email is required" })
		.regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
			message: "Enter a valid email",
		})
		.email({ message: "Invalid email address" })
		.transform((value) => {
			return value.toLowerCase().trim();
		}),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" })
		.max(50)
		.transform((value) => {
			return value.trim();
		}),
});

const forgotPasswordSchema: z.ZodType<ForgotPasswordProps> = z.object({
	email: z
		.string()
		.min(2, { message: "Email is required" })
		.regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
			message: "Enter a valid email",
		})
		.email({ message: "Invalid email address" })
		.transform((value) => {
			return value.toLocaleLowerCase().trim();
		}),
});

const resetPasswordSchema: z.ZodType<ResetPasswordProps> = z
	.object({
		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
				{
					message:
						"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				}
			)
			.max(50)
			.transform((value, ctx) => {
				const options = {
					dictionary: {
						...zxcvbnCommonPackage.dictionary,
						...zxcvbnEnPackage.dictionary,
					},
					translations: {
						...zxcvbnEnPackage.translations,
					},
					graphs: zxcvbnCommonPackage.adjacencyGraphs,
					// useLevenshteinDistance: true
				};
				zxcvbnOptions.setOptions(options);
				const testedResult = zxcvbn(value);

				if (testedResult.score < 3) {
					testedResult.feedback.suggestions.map((issue) => {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: issue,
						});
					});
				}

				return value.trim();
			}),
		confirmPassword: z
			.string()
			.min(6, { message: "Password must be at least 6 characters" })
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,!@#$%^&*])[A-Za-z\d.,!@#$%^&*]{6,}$/,
				{
					message:
						"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
				}
			)
			.max(50)
			.transform((value) => {
				return value.trim();
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

const campaignStepOneSchema = z.object({
	categoryId: z.string().min(1, { message: "Select a category" }),
	country: z.string().min(1, { message: "Select a country" }),
	tags: z.array(z.string()),
});

const campaignStepTwoSchema = z.object({
	title: z.string().min(3, { message: "Title must be at least 3 characters" }),
	fundraiser: z.enum(["INDIVIDUAL", "BENEFICIARY"], {
		errorMap: () => ({ message: "Select the fundraiser's target" }),
	}),
	goal: z.coerce
		.number()
		.min(5000, { message: "Goal must be at least 5,000 Naira" }),
	deadline: z
		.string()
		.min(1, { message: "Choose a deadline for the campaign" }),
});

const campaignStepThreeSchema = z.object({
	photos: z.array(z.custom<File>((file) => file instanceof File)).min(1, {
		message: "Select at least one image (which would be the cover image)",
	}),
	story: z
		.string()
		.min(100, { message: "Story must be at least 100 characters" }),
	storyHtml: z.string(),
});

export const zodValidator = (formType: FormType) => {
	switch (formType) {
		case "signup":
			return signUpSchema;
		case "login":
			return loginSchema;
		case "forgotPassword":
			return forgotPasswordSchema;
		case "resetPassword":
			return resetPasswordSchema;
		case "campaignStepOne":
			return campaignStepOneSchema;
		case "campaignStepTwo":
			return campaignStepTwoSchema;
		case "campaignStepThree":
			return campaignStepThreeSchema;
		default:
			return;
	}
};

export type SignUpType = z.infer<typeof signUpSchema>;
export type LoginType = z.infer<typeof loginSchema>;
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
