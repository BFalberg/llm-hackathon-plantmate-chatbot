import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    index("routes/home.jsx"),
    route("planner", "routes/planner.jsx"),
    route("community", "routes/community.jsx"),
    route("recipes", "routes/recipes.jsx"),
    route("account", "routes/account.jsx"),
    route("chat", "routes/chatLayout.jsx", [
      index("routes/chat.jsx"),
      route("new", "routes/chatNew.jsx"),
      route(":threadId", "routes/chatThread.jsx"),
    ]),
    route("threads", "routes/threads.jsx"),
  ]),
  route("start", "routes/start.jsx"),
  route("login", "routes/login.jsx"),
  route("register", "routes/register.jsx"),
];
