import styles from "./v2.module.css";

export default function SketchBorder() {
  return (
    <svg className={styles.sketchBorder} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2.2,3.4 C18,1.2 48,2.1 72,1.6 C88,1.3 97.4,3.8 98.1,12 C98.8,28 97.6,52 98.2,74 C98.6,88 96.2,97.4 82,98.2 C54,99.1 28,97.8 12,98.4 C4.2,98.7 1.6,94 1.4,84 C1.1,62 2.4,38 1.8,18 C1.5,9.2 1.2,4.6 2.2,3.4 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
