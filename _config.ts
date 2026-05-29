import lume from "lume/mod.ts";

const site = lume({
  src: ".",
});

site.copy("assets");
site.copy("CNAME");

export default site;
