const R2 = "https://pub-e9e78dac8b6640e4a96a1056d37c756a.r2.dev";

// Raw clips live in scaleshift-content/raw/, edited ones in scaleshift-content/portfolio/, same numbering.
export const machineClips = [
  { id: "001", views: 1_200_000, followers: 2_100 },
  { id: "002", views: 842_000, followers: 2_400 },
  { id: "003", views: 620_000, followers: 2_200 },
  { id: "004", views: 430_000, followers: 1_900 },
  { id: "005", views: 310_000, followers: 1_700 },
  { id: "006", views: 280_000, followers: 1_500 },
].map((clip) => ({
  ...clip,
  raw: `${R2}/raw/${clip.id}.mp4`,
  edited: `${R2}/portfolio/${clip.id}.mp4`,
}));

// Real account numbers at the time of writing: instagram.com/scaleshift.uk
const startFollowers = 1_729;
const watchTime = [0, 61, 64, 66, 67, 68, 69];
const likesPerView = 0.042;

export type MachinePhase = "idle" | "travel" | "editing" | "drop";
export type MachineStep = { index: number; phase: MachinePhase };

export const phaseDuration: Record<MachinePhase, number> = {
  idle: 700,
  travel: 1300,
  editing: 3600,
  drop: 1400,
};

export const machineSequence: MachineStep[] = [
  { index: 0, phase: "idle" },
  ...machineClips.flatMap((_, index) =>
    (["travel", "editing", "drop"] as const).map((phase) => ({ index, phase })),
  ),
  { index: machineClips.length, phase: "idle" },
];

/** Account numbers after `landed` edited videos have been published. */
export function machineStats(landed: number) {
  const published = machineClips.slice(0, landed);
  const totalViews = published.reduce((sum, clip) => sum + clip.views, 0);
  return {
    posts: landed,
    totalViews,
    likes: Math.round(totalViews * likesPerView),
    watchTime: watchTime[landed] ?? watchTime[watchTime.length - 1],
    followers: startFollowers + published.reduce((sum, clip) => sum + clip.followers, 0),
    newFollowers: published.reduce((sum, clip) => sum + clip.followers, 0),
  };
}

/** 1.2M / 842K / 13.7K / 1,729, the way Instagram shortens counts. */
export function compactNumber(value: number): string {
  const trim = (text: string) => text.replace(/\.0$/, "");
  if (value >= 1e6) return `${trim((value / 1e6).toFixed(1))}M`;
  if (value >= 1e5) return `${Math.round(value / 1e3)}K`;
  if (value >= 1e4) return `${trim((value / 1e3).toFixed(1))}K`;
  return value.toLocaleString("en-US");
}
