import { Composition } from "remotion";
import { ShowcaseVideo } from "./ShowcaseVideo";
import { LucasShort } from "./LucasShort";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TrendSpotShowcase"
        component={ShowcaseVideo}
        durationInFrames={485}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="LucasShort"
        component={LucasShort}
        durationInFrames={1575}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
