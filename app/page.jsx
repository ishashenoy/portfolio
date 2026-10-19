import { Roboto } from "next/font/google";
import ExperiencePreview, { ExperienceLink } from "./components/ExperiencePreview";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const RESUME_URL =
  "https://drive.google.com/file/d/14mkg2P8_zrI10RepVzGZ21CnGgXMCRx3/view";

const newTab = { target: "_blank", rel: "noopener noreferrer" };

export default function Home() {
  return (
    <div
      className={roboto.className}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ExperiencePreview>
      <div style={{ letterSpacing: "-0.04em", textAlign: "center" }}>
        isha shenoy
        <br />
        <br />
        incoming @ <ExperienceLink href="https://nokia.com" label="nokia" src="https://www.nokia.com/sites/default/files/2025-08/https_www.nokia_.com_sites_default_files_styles_scale_1440_no_crop_public_2023-02_nokia-refreshed-logo-1_1.jpg">nokia</ExperienceLink>
        <br />
        curr @ <ExperienceLink href="https://mytria.app" label="mytria" src="/images/thumb/mymediatracker.png">mytria</ExperienceLink> <ExperienceLink href="https://jointhemunch.app" label="munch" src="/images/thumb/munch.jpg">munch</ExperienceLink>
        <br />
        prev @ <ExperienceLink href="https://capston.ca" label="capston" src="https://www.capston.ca/opengraph-image.png?opengraph-image.0rkr00j4..vz3.png?dpl=dpl_BGfs81qHarGwqT9njfS13KmL7xTx">capston</ExperienceLink>
        <br />
        <br />
        <a href="/writing">writing</a>{" "}
        <a href="/photos">photos</a>
        <br />
        <br />
        <a href={RESUME_URL} {...newTab}>resume</a>{" "}
        <a href="mailto:ishenoy@uwaterloo.ca" {...newTab}>email</a>
        <br />
        <a href="https://www.linkedin.com/in/ishashenoy/" {...newTab}>linkedin</a>{" "}
        <a href="https://github.com/ishashenoy" {...newTab}>github</a>{" "}
        <a href="https://x.com/ichiberries" {...newTab}>x</a>{" "}
        <a href="https://mytria.app/profile/ichiberry" {...newTab}>mytria</a>
      </div>
      </ExperiencePreview>
    </div>
  );
}
