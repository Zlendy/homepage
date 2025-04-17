import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useEffect, useMemo, useState } from "react";
import { formatProxyUrl } from "utils/proxy/api-helpers";

/**
 * @param {{
 *  stats: Record<string, number>[]
 * }} data
 * @param {string[]} libraries
 * @returns {[string, number][]}
 */
function countByLibrary(data, libraries) {
  /** @type {Map<string, number>} */
  const count = new Map();

  if (!data) return [];

  for (const weekday of data.stats) {
    for (const library of libraries) {
      const currentValue = count.get(library) ?? 0; // Defaults to 0 if not initialized
      const accumulator = weekday[library];

      count.set(library, currentValue + accumulator);
    }
  }

  return Array.from(count.entries());
}

export default function Component({ service }) {
  const { widget } = service;

  if (!widget.libraries) {
    widget.libraries = [];
  }

  const MAX_ALLOWED_FIELDS = 4;
  if (widget.libraries.length > MAX_ALLOWED_FIELDS) {
    widget.libraries = widget.libraries.slice(0, MAX_ALLOWED_FIELDS);
  }

  const [viewsData, setViewsData] = useState(null);
  const libraries = useMemo(() => countByLibrary(viewsData, widget.libraries), [viewsData, widget.libraries]);

  useEffect(() => {
    async function fetchData() {
      const url = formatProxyUrl(widget, "getViewsByDays");
      const res = await fetch(url, { method: "POST" });
      setViewsData(await res.json());
    }
    if (!viewsData) {
      fetchData();
    }
  }, [widget, viewsData]);

  if (!viewsData || viewsData?.message) {
    return <Container service={service} error={viewsData?.message} />;
  }

  return (
    <Container service={service}>
      {libraries.map(([label, value]) => (
        <Block key={label} label={label} value={value} />
      ))}
    </Container>
  );
}
