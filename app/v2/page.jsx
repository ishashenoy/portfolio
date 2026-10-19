import { Dawning_of_a_New_Day, Inter, Roboto } from "next/font/google";
import AboutSection from "./AboutSection";
import BasketNav from "./BasketNav";
import BlogSection from "./BlogSection";
import ExperienceApple from "./ExperienceApple";
import GalleryCollage from "./GalleryCollage";
import ProjectsSection from "./ProjectsSection";
import { getAllPosts } from "../lib/blog";
import styles from "./v2.module.css";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-inter",
});

const dawning = Dawning_of_a_New_Day({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-v2-dawning",
});

const EMAIL = "ishenoy@uwaterloo.ca";
const RESUME_URL =
  "https://drive.google.com/file/d/14mkg2P8_zrI10RepVzGZ21CnGgXMCRx3/view";

const nav = [
  { label: "about", href: "#about", className: "about" },
  { label: "work", href: "#work", className: "work" },
  { label: "blog", href: "#blog", className: "blog" },
  { label: "resume", href: RESUME_URL, className: "resume", external: true },
];

const social = [
  { label: "linkedin", href: "https://www.linkedin.com/in/ishashenoy/" },
  { label: "github", href: "https://github.com/ishashenoy" },
  { label: "email", href: `mailto:${EMAIL}` },
  { label: "X", href: "https://x.com/ichiberries" },
];

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className={`${styles.root} ${roboto.variable} ${inter.variable} ${dawning.variable} ${roboto.className}`}>
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.name}>isha shenoy</h1>
          <nav className={styles.socialNav} aria-label="Social">
            {social.map((item) => (
              <a
                key={item.label}
                className={styles.social}
                href={item.href}
                {...(item.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <div className={styles.stage}>
          <BasketNav items={nav} />
        </div>

        <AboutSection />
        <ExperienceApple />
        <ProjectsSection />
        <BlogSection posts={posts} />
        <GalleryCollage />
      </main>
    </div>
  );
}
