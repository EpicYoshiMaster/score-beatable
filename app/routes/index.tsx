import { redirect } from "react-router";

export async function clientLoader() {
  throw redirect("/scores");
}