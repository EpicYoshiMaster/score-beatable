import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
	layout("./routes/layout.tsx", [
		index("./routes/index.tsx"),
		route("scores", "./routes/scores.tsx"),
		route("top-cut", "./routes/top-cut.tsx"),
		route("ratings-info", "./routes/ratings-info.tsx"),
	])
] satisfies RouteConfig;
