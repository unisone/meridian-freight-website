import { handleCheckRequest } from "../monitor.mjs";

export default async function handler(request, response) {
  await handleCheckRequest(request, response);
}
