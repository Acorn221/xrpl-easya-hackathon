export interface VerificationSettings {
	triggerWhenOver: number;
	methods: VerificationMethods[];
}

export type VerificationMethods = GPTInterrogation | ReactionTest | PupilDialationTest;

export interface GPTInterrogation {
	name: "GPTInterrogation";
	beliefs: string[];
}

export interface ReactionTest {
	name: "ReactionTest";
}

export interface PupilDialationTest {
	name: "PupilDialationTest";
}