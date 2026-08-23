# Security policy

Report vulnerabilities privately through GitHub's security advisory flow for
this repository. Do not include real credentials or sensitive user data in an
issue, pull request, or test fixture.

## Agent gateway threat model

`agents.kimetsu.dev` is deliberately capability-poor:

- It supports public, read-only discovery over `GET` and `HEAD`.
- Its only `POST` route is the credential-free Sidequest A2A guidance endpoint.
  That endpoint returns deterministic text, performs no writes or tool calls,
  and never logs, echoes, fetches, or forwards caller message content.
- It rejects requests carrying `Authorization`, `Cookie`, or `Proxy-Authorization`.
- It rejects query strings everywhere and request bodies outside the bounded A2A route.
- It fetches only a fixed allowlist of public Sidequest Commons JSON documents.
- It constructs upstream requests from scratch, so caller headers never cross
  the trust boundary.
- It validates response type and size before returning an upstream document.
- It exposes no secrets, bindings, mutation APIs, tool execution, or arbitrary
  fetch capability.

These constraints are product requirements, not optional hardening.
