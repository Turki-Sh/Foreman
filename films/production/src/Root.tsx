import { WorkCompositions } from "./WorkFilms";
import { SeriesCompositions } from "./Series";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <WorkCompositions />
      <SeriesCompositions />
    </>
  );
};
