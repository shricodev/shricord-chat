import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "@/app/api/uploadthing/core";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
