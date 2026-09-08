import Image from "next/image";
import SketchBorder from "./SketchBorder";
import styles from "./v2.module.css";

const TIKTOK_URL = "https://www.tiktok.com/@qoljee";
const INSTAGRAM_URL = "https://www.instagram.com/ichiberries/";
const MYTRIA_URL = "https://mytria.app/";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection} id="about" aria-labelledby="about-heading">
      <div className={styles.aboutGrid}>
        <figure className={styles.polaroid}>
          <div className={styles.polaroidPhoto}>
            <Image
              src="/images/profile_pic.png"
              alt="isha in front of the golden gate bridge"
              fill
              sizes="(max-width: 800px) 70vw, 320px"
              className={styles.polaroidImage}
            />
          </div>
          <figcaption className={styles.polaroidCaption}>golden gate 01/26</figcaption>
        </figure>

        <div className={styles.aboutCard}>
          <SketchBorder />
          <div className={styles.aboutCardInner}>
            <h2 id="about-heading" className={styles.aboutHeading}>
              about me
            </h2>
            <p className={styles.aboutBody}>i like to build.</p>
            <p className={styles.aboutBody}>
              i&apos;m a management engineering student at{" "}
              <span className={styles.uni}>
                <Image
                  src="/images/icons/uwaterloo-crest.png"
                  alt=""
                  width={18}
                  height={18}
                  className={styles.crest}
                />
                Waterloo
              </span>
              , and i build software with a product mindset: do people want it, and why? i like
              understanding what makes something useful, then building it well.
            </p>
            <p className={styles.aboutKnown}>i&apos;m also...</p>
            <ol className={styles.aboutList}>
              <li>
                a founder. i started{" "}
                <a
                  href={MYTRIA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.hlOrange}
                >
                  mytria
                </a>{" "}
                and grew it from zero to 15k+ users with $0 ad spend.
              </li>
              <li>
                a creator. 7M+ views on{" "}
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className={styles.dashLink}>
                  TikTok
                </a>
                , 5M+ on{" "}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.dashLink}>
                  Instagram
                </a>
                .
              </li>
            </ol>
            <p className={`${styles.aboutBody} ${styles.aboutClose}`}>
              open to any opportunities, let&apos;s chat!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
