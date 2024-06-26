export interface VerifiedOptions {
	methods: (VerificationMethods & { verified: boolean, id: string })[];
}

export interface VerificationSettings {
	triggerWhenOver: number;
	methods: VerificationMethods[];
}

export type VerificationMethods = GPTInterrogation | ReactionTest | PupilDialationTest | RubiksCubeTimeTest;

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

export interface RubiksCubeTimeTest {
	name: "RubiksCubeTimeTest";
	secondsToBeat: number;
}