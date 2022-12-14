export function handleVerify(request: Request, env: any) {
  const { searchParams } = new URL(request.url);
  let challenge = searchParams.get("hub.challenge");
  let token = searchParams.get("hub.verify_token");

  if (token !== env.WHATSAPP_VERIFY_TOKEN || !challenge) {
    return new Response(null, { status: 403 });
  }

  return new Response(challenge, { status: 200 });
}
