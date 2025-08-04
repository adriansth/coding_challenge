// simple pipeline resolver (just passes through)
export function request(ctx) {
   return {};
}

export function response(ctx) {
   return ctx.result;
}
