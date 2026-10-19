/** Images under /public/images/gallery and /public/images/art for the home collage. */
export const collageGallery = [
  { id: "g1", src: "/images/gallery/photo1.jpg", alt: "Gallery photo 1", caption: "grassrootskw team", w: 200, h: 150 },
  { id: "g2", src: "/images/gallery/photo2.jpg", alt: "Gallery photo 2", caption: "w/ mayor of kitchener", w: 180, h: 135 },
  { id: "g3", src: "/images/gallery/photo3.jpg", alt: "Gallery photo 3", caption: "golden gate bridge", w: 220, h: 165 },
  { id: "g4", src: "/images/gallery/symposium.jpg", alt: "Gallery photo 4", caption: "socratica symposium '26", w: 160, h: 120 },
  { id: "g5", src: "/images/gallery/photo5.png", alt: "Gallery photo 5", caption: "demoing at akatos symposium", w: 190, h: 142 },
  { id: "g6", src: "/images/gallery/photo6.png", alt: "Gallery photo 6", caption: "3ds circle", w: 210, h: 158 },
  { id: "g7", src: "/images/gallery/photo7.jpg", alt: "Gallery photo 7", caption: "dev setup", w: 180, h: 240 },
  { id: "g8", src: "/images/gallery/photo8.jpeg", alt: "Gallery photo 8", caption: "cupcake", w: 160, h: 220 },
];

export const collageArt = [
  { id: "a1", src: "/images/art/art1.jpg", alt: "Art 1", w: 170, h: 128 },
  { id: "a2", src: "/images/art/art2.jpg", alt: "Art 2", w: 200, h: 150 },
  { id: "a4", src: "/images/art/art4.jpg", alt: "Art 4", w: 175, h: 131 },
  { id: "a5", src: "/images/art/art5.jpg", alt: "Art 5", w: 195, h: 146 },
  { id: "a6", src: "/images/art/art6.jpg", alt: "Art 6", w: 205, h: 154 },
];

export const footerQuote = "A pig who doesn't fly is just a pig.";

/** Photos shown in the collage footer, in the order they appear. */
export const footerPhotos = [...collageGallery, ...collageArt].slice(0, footerQuote.split(" ").length);
