# Project Agents

## graphify

Use the graphify skill for any codebase questions, architecture exploration, or file relationship queries.

- If `graphify-out/graph.json` exists, query it directly with `graphify query "<question>"` instead of searching files manually
- After significant code changes, rebuild the graph: `graphify .` or `graphify --update .`
- The graph tracks entities, relationships, and communities across the entire codebase

### Available commands

- `graphify query "<question>"` — answer questions from the knowledge graph
- `graphify path "A" "B"` — find shortest path between two concepts
- `graphify explain "Concept"` — explain a node in the graph
- `graphify .` — full rebuild
- `graphify --update .` — incremental update (changed files only)

### When to use

- Understanding how modules connect
- Tracing data flow through the system
- Finding all references to a concept across the codebase
- Getting a high-level architecture overview
- Onboarding to unfamiliar parts of the code
