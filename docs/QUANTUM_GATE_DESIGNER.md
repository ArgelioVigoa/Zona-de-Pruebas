# Quantum Gate Designer — first implementation

## What is implemented

- Complex matrix editor for 1- and 2-qubit operators.
- Complex-entry parsing (a+bi, -i, real numbers) with finite-number checks.
- Independent unitarity check using the maximum entrywise error in U-dagger U minus I.
- Configurable positive numerical tolerance.
- Basis-state action and output probabilities.
- Bloch-vector projection for one-qubit output states.
- Circuit composition for one and two qubits using H, X, Y, Z, S, T, RX, RY, RZ, CX, CZ and SWAP.
- Direct matrix versus circuit comparison, including equivalence up to a global phase.
- Qiskit code export through UnitaryGate.
- Versioned JSON import/export and same-origin browser-local persistence.
- Import of custom 1- and 2-qubit unitaries into the Quantum Architect palette.
- Qiskit code handoff to Quantum Notebook as a documented Markdown code block.

## First-use workflow

1. Open Quantum Gate Designer from the Nexus menu.
2. Choose 1 or 2 qubits.
3. Edit matrix entries or switch to Circuit mode and add operations.
4. Build the matrix from the circuit when using Circuit mode.
5. Validate unitarity. Non-unitary matrices cannot be saved or handed off.
6. Save to the local gate library or export JSON/Qiskit.
7. To import into Architect, open Quantum Architect once, return to Gate Designer and select Send to Architect.
8. To hand Qiskit code to Notebook, open Quantum Notebook once and select Send Qiskit to Notebook. The code is added as a Markdown code block for review/copying, not silently executed.

## Matrix convention

The schema declares basisOrder = q0-lsb: qubit 0 is the least-significant bit of the computational-basis index. The 2-qubit basis order is therefore |q1 q0>, indexed as 00, 01, 10, 11. Any future SDK adapter must explicitly convert if its operator convention differs.

Circuit composition applies operations in listed order from top to bottom:
\[
U_{\mathrm{total}}=U_m\cdots U_2U_1.
\]

## Current limits — intentionally progressive

- The first release accepts only 1- and 2-qubit custom matrices. Three-qubit and n-qubit support is not yet enabled.
- The visual circuit composer is limited to 1- and 2-qubit operations listed above.
- Parameterized custom gate definitions are not yet implemented; rotation parameters are numeric constants.
- Cirq and PennyLane exports are not implemented.
- The Bloch view is a two-dimensional projection plus numeric Bloch vector, not a fully interactive 3D sphere.
- Notebook handoff currently inserts a Markdown code block; it does not create or execute a native Python code cell.
- The live backend test uses the backend URL stored by Quantum Architect (`openq_colab_url`) or entered manually. It requires the backend to expose the QuOlab `/health` and `/run` API (or the Hugging Face `/health/predict` and `/run/predict` API), CORS permission for the deployed Pages origin, a ready isolated sandbox, and Qiskit. The test performs an exact simulator-side matrix reconstruction; it does not execute on quantum hardware or model noise.
- Qiskit export uses UnitaryGate/qc.unitary. Actual execution still depends on the configured backend and its Qiskit version/capabilities.
- Browser storage is local to the current browser origin. It is not cloud-account synchronization.
- Large matrices are deliberately capped at 4×4 in this first iteration.

## Validation

GitHub Actions checks:
- JSON schema parses.
- Regression matrices for H, X, Y, Z, S, T, CNOT, CZ and SWAP are unitary.
- A deliberately non-unitary matrix is rejected.
- Inline JavaScript in the HTML modules parses with Node.
- Critical integration contracts are present.

The backend test can be launched interactively from Gate Designer. CI validates its presence and JavaScript syntax but cannot confirm the user's remote backend is online; that must be run from the deployed browser.
