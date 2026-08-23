import { classifySiteRoute, emitRequestTelemetry } from "./telemetry.mjs";

export async function handleSiteRequest(request, assets, logger = console.log) {
  const [route, stage] = classifySiteRoute(new URL(request.url).pathname);

  try {
    const response = await assets.fetch(request);
    emitRequestTelemetry({
      request,
      response,
      service: "kimetsu.dev",
      route,
      stage,
      logger,
    });
    return response;
  } catch {
    const response = new Response("Service temporarily unavailable.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
    emitRequestTelemetry({
      request,
      response,
      service: "kimetsu.dev",
      route,
      stage,
      logger,
    });
    return response;
  }
}

export default {
  fetch(request, env) {
    return handleSiteRequest(request, env.ASSETS);
  },
};
