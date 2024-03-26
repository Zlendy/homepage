import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

/**
 * Returns a simplified list of the current supported libraries
 * @param {Object[]} libraries
 * @param {String[]} supported
 * @returns {{ name: String, type: String }[]}
 */
function parseLibraries(libraries, supported) {
  return libraries
    .filter((library) => library.archived === false && supported.includes(library.CollectionType))
    .map((library) => ({ name: library.Name, type: library.CollectionType }));
}

/**
 *
 * @param {Object} data
 * @param {Object[]} libraries
 * @returns {{[String]: Number}}
 */
function countByLibrary(data, libraries) {
  const count = {};

  data.stats.forEach((day) => {
    libraries.forEach(({ name, type }) => {
      if (!count[type]) count[type] = 0;
      count[type] += parseInt(day[name], 10);
    });
  });

  return count;
}

export default function Component({ service }) {
  const { widget } = service;
  const days = 2;

  const { data: librariesData, error: librariesError } = useWidgetAPI(widget, "getLibraries");
  const { data: viewsData, error: viewsError } = useWidgetAPI(widget, "getViewsByDays", { days }); // FIXME: "days" is added as a query parameter, not the body of the HTTP request.

  const errorMessage = viewsData?.message ?? librariesData?.message;
  if (viewsError || errorMessage || librariesError) {
    return <Container service={service} error={viewsError ?? { message: errorMessage }} />;
  }

  console.log({ librariesData, viewsData });

  if (!viewsData || !viewsData?.libraries || !viewsData?.stats) {
    return (
      <Container service={service}>
        <Block label="jellystat.days" />
        <Block label="jellystat.movies" />
        <Block label="jellystat.episodes" />
        <Block label="jellystat.songs" />
      </Container>
    );
  }

  const supportedLibraries = ["tvshows", "movies", "music"];
  const libraries = parseLibraries(librariesData, supportedLibraries);
  const count = countByLibrary(viewsData, libraries);

  // console.log(count);

  return (
    <Container service={service}>
      <Block label="jellystat.days" value={days} />
      <Block label="jellystat.movies" value={count.movies} />
      <Block label="jellystat.episodes" value={count.tvshows} />
      <Block label="jellystat.songs" value={count.music} />
    </Container>
  );
}
