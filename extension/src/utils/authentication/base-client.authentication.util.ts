import { Client, createClient } from "@urql/core";
const { VITE_LENS_API_URL } = import.meta.env;

const baseClientAuthenticationUtil: Client = createClient({
  url: VITE_LENS_API_URL,
  requestPolicy: "cache-and-network"
});

export default baseClientAuthenticationUtil;
