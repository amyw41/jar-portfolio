export type EtcCategorySlug = "drawing" | "nails" | "dancing" | "content";

export type EtcCategoryInfo = {
  slug: EtcCategorySlug;
  label: string;
};

export type EtcPhoto = {
  src: string;
  caption: string;
  width: number; // intrinsic pixel size, used to lay photos out at their own aspect ratio
  height: number;
};

export const ETC_CATEGORIES: EtcCategoryInfo[] = [
  { slug: "drawing", label: "Drawing" },
  { slug: "dancing", label: "Dancing" },
  { slug: "nails", label: "Nails" },
  { slug: "content", label: "Content" },
];

// One shared plate illustration per category (replaces the single generic
// plate-1.png every PlateCircle used to render regardless of category) —
// Amy dropped in a distinct hand-drawn plate per category, named
// plate-{category}.png except content, whose file is plate-me.png.
export const PLATE_IMAGES: Record<EtcCategorySlug, string> = {
  drawing: "/images/drawings/plate-drawing.png",
  dancing: "/images/drawings/plate-dance.png",
  nails: "/images/drawings/plate-nails.png",
  content: "/images/drawings/plate-me.png",
};

// First-draft captions — edit freely, these just describe what's actually in
// each photo. Nails/Content are empty until there are photos to add.
export const ETC_PHOTOS: Record<EtcCategorySlug, EtcPhoto[]> = {
  drawing: [
    { src: "/images/etc/drawing1.webp", caption: "Niu Zaizai - 2023.", width: 808, height: 1076 },
    { src: "/images/etc/drawing2.webp", caption: "Jo Yuri (Squid Games) - 2025.", width: 888, height: 896 },
    { src: "/images/etc/drawing3.webp", caption: "Cha Woongki (AHOF) - 2023.", width: 812, height: 824 },
    { src: "/images/etc/drawing4.png", caption: "Chihen (WIP, AHOF) - 2026.", width: 716, height: 892 },
  ],
  nails: [
    { src: "/images/etc/nails1.jpg", caption: "Chrome foil accents on glazed nude nails.", width: 2160, height: 2373 },
    { src: "/images/etc/nails2.jpg", caption: "Negative space French with a crystal lattice accent.", width: 2160, height: 2880 },
    { src: "/images/etc/nails3.jpg", caption: "Leopard print with 3D star charms.", width: 2160, height: 2880 },
    { src: "/images/etc/nails4.jpg", caption: "Nude nails with bold number decals.", width: 2160, height: 2880 },
    { src: "/images/etc/nails5.jpg", caption: "Shimmery mauve coffin nails with a chrome accent.", width: 2160, height: 2880 },
  ],
  dancing: [
    { src: "/images/etc/dance1.webp", caption: "Curtain call after a group recital.", width: 1192, height: 892 },
    { src: "/images/etc/dance3.webp", caption: "Korean traditional hanbok dance.", width: 756, height: 1136 },
    { src: "/images/etc/dance4.webp", caption: "Fan dance in blue stage light.", width: 1160, height: 772 },
    { src: "/images/etc/dance5.webp", caption: "Extension into an arabesque.", width: 992, height: 660 },
    { src: "/images/etc/dance6.webp", caption: "Backstage at the Abstract Dance Challenge.", width: 704, height: 936 },
    { src: "/images/etc/dance7.webp", caption: "Fan in hand, between poses.", width: 872, height: 580 },
  ],
  content: [],
};
