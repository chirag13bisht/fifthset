export interface EventDefinition {
  slug: string;
  name: string;
  /** Max confirmed places; RSVPs beyond this go to the waitlist. null = always waitlist. */
  capacity: number | null;
  /** If true, submissions are recorded as expressions of interest, not RSVPs. */
  interestOnly: boolean;
}

export const EVENTS: EventDefinition[] = [
  {
    slug: "open-play-singapore",
    name: "Open Play — Singapore",
    capacity: 24,
    interestOnly: false,
  },
  {
    slug: "the-championship-2027",
    name: "The Championship — Singapore 2027",
    capacity: null,
    interestOnly: false,
  },
  {
    slug: "experiences",
    name: "Collective Experiences",
    capacity: null,
    interestOnly: true,
  },
];

export const PLAY_LEVELS = [
  "Beginner — finding my feet",
  "Improver — rallying with intent",
  "Intermediate — competitive social",
  "Advanced — tournament hardened",
] as const;
