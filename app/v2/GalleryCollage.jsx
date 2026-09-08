import Image from "next/image";
import { collageArt, collageGallery } from "../data/collageImages";
import styles from "./v2.module.css";

const QUOTE = "A pig who doesn't fly is just a pig.";
const WORDS = QUOTE.split(" ");
const PHOTOS = [...collageGallery, ...collageArt].slice(0, WORDS.length);

const cells = (() => {
  const next = [];
  let wordIndex = 0;
  let photoIndex = 0;

  for (let i = 0; i < WORDS.length * 2; i += 1) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    const isWord = (row + col) % 2 === 1;

    if (isWord) {
      next.push({ type: "word", key: `word-${wordIndex}`, word: WORDS[wordIndex] });
      wordIndex += 1;
    } else {
      next.push({ type: "photo", key: `photo-${photoIndex}`, photo: PHOTOS[photoIndex] });
      photoIndex += 1;
    }
  }

  return next;
})();

export default function GalleryCollage() {
  return (
    <section className={styles.collageSection} aria-label={QUOTE}>
      <div className={styles.collageGrid}>
        {cells.map((cell) => {
          if (cell.type === "word") {
            return (
              <span key={cell.key} className={styles.collageWord}>
                {cell.word}
              </span>
            );
          }

          return (
            <div key={cell.key} className={styles.collagePhoto}>
              <Image
                src={cell.photo.src}
                alt={cell.photo.caption || cell.photo.alt}
                fill
                sizes="(max-width: 640px) 33vw, 11vw"
                className={styles.collageImage}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
