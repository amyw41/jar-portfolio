/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next only serves `quality` values explicitly allow-listed here (the
    // built-in default is just [75]) — requesting any other value 400s.
    // 95 is used by border.png (About page + Experience) and the plate
    // illustrations (PlateCircle.tsx), which need it more than 75 to keep
    // their fine hand-drawn linework from visibly softening.
    qualities: [75, 95],
  },
};

export default nextConfig;
