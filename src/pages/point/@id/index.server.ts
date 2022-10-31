import { PageContext } from "../../../renderer/PageContext";

async function onBeforeRender(pageContext: PageContext) {
  console.log("pageContext", pageContext);
}
