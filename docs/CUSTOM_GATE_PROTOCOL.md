# Custom Gate Message Protocol v1.0

Envelope fields: `protocol: quolab.custom-gate`, `protocolVersion: 1.0.0`, `requestId`, and `gate`.

- `OPENQ_CUSTOM_GATE`: Gate Designer requests import into Quantum Architect.
- `OPENQ_CUSTOM_GATE_RESPONSE`: receiver replies with `ok`, `message`, and optionally `gateId`.
- `OPENQ_CUSTOM_GATE_REQUEST` and `OPENQ_CUSTOM_GATE_ERROR` are reserved protocol extensions; they are not routed in this first implementation. Current failures are returned through the corresponding RESPONSE message with `ok: false`.

Security: parent checks source iframe and same origin; child checks parent source and same origin. Never use wildcard target origins. Receivers independently validate schema version, matrix dimensions, finite complex entries, and unitarity.

Matrix basis convention: `q0-lsb`; computational basis index k stores qubit 0 in bit 0. Convert explicitly when integrating an SDK with another convention.
