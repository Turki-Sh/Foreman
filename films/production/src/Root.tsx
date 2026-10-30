import { FilmThumbnails } from "./FilmThumbnails";
import { CinemaCompositions } from "./CinemaFilms";
import { RebuiltCompositions } from "./RebuiltFilms";
import { WorkCompositions } from "./WorkFilms";
import { SeriesCompositions } from "./Series";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <WorkCompositions />
      <RebuiltCompositions />
      <CinemaCompositions /><FilmThumbnails />
      <SeriesCompositions />
    </>
  );
};
