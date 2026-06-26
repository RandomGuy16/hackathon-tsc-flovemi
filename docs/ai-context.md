# AI Agent Configuration & Context Guide

This directory contains the necessary metadata, system instructions, and server configurations to align various AI coding assistants (Cursor, Claude Code, Cline, and Windsurf) during the hackathon.

---

## 1. Directory Structure

Here is how the AI files are distributed in the workspace root:

```
/
├── .cursorrules             # Configuration rules for Cursor IDE
├── CLAUDE.md                # System instructions & commands for Claude Code
├── .clinerules              # Rule definitions for Cline
├── .windsurfrules           # Rule definitions for Windsurf
├── mcp-config.json          # MCP settings template (General)
├── claude_mcp_config.json   # MCP settings template (Claude Code)
├── docs/
│    └── ai-context.md       # This guide
├── .claude/skills/          # Markdown reference skills for Claude Code
│    ├── goal.md
│    ├── plan.md
│    ├── design.md
│    ├── breadboarding.md
│    ├── testing.md
│    └── deploy.md
└── .cline/skills/           # Copied markdown reference skills for Cline
```

---

## 2. Using the Rule Files

Each AI tool automatically discovers and parses its dedicated rule file:
- **Cursor**: Reads `.cursorrules` in the root workspace. Ensure your editor settings point to the project root.
- **Claude Code**: Automatically reads `CLAUDE.md` to learn about scripts (`npm run build`, `test`, `lint`) and architect rules.
- **Cline**: Parses `.clinerules` upon loading a conversation.
- **Windsurf**: Reads `.windsurfrules` to shape its context.

---

## 3. How to Use the Skill Reference Files

The Markdown files inside `.claude/skills/` and `.cline/skills/` serve as a knowledge base. If your AI assistant asks for details on design, endpoints, or UI layouts, point it to these files:
- Use [goal.md](file:///home/aroon/Projects/hackathon-tsc-flovemi/.claude/skills/goal.md) to explain the problem and MVP target scope.
- Use [plan.md](file:///home/aroon/Projects/hackathon-tsc-flovemi/.claude/skills/plan.md) to understand the hackathon phases and timeline.
- Use [design.md](file:///home/aroon/Projects/hackathon-tsc-flovemi/.claude/skills/design.md) for database tables, API JSON structures, and Risk Score weightings.
- Use [breadboarding.md](file:///home/aroon/Projects/hackathon-tsc-flovemi/.claude/skills/breadboarding.md) for CSS layouts, dark-theme palette tokens, and UI layout sketches.
- Use [testing.md](file:///home/aroon/Projects/hackathon-tsc-flovemi/.claude/skills/testing.md) for Jest tests convention (happy path + error path templates).
- Use [deploy.md](file:///home/aroon/Projects/hackathon-tsc-flovemi/.claude/skills/deploy.md) for Supabase tables schema, RLS policies, and Vercel environment keys.

---

## 4. MCP Servers Configuration

Model Context Protocol (MCP) servers enable the AI to safely interact with database schema structures and third-party APIs.

### Setup Steps:
1. Locate `mcp-config.json` (or `claude_mcp_config.json` if using Claude Code).
2. Edit the configurations:
   - Replace `[PASSWORD]` and `[PROJECT_REF]` with your actual Supabase DB credentials.
   - Replace `${LATINFO_API_KEY}` with your `latinfo.dev` developer token.
3. Move `claude_mcp_config.json` to your Claude Code user directory (e.g. `~/.config/claude/claude_mcp_config.json` on Linux/macOS) or enable it inside your Cline settings.

---

## 5. Development Command Summary
All command lines should run with directory context inside the `codigo/` directory:
- **Dev Server**: `npm run dev --prefix codigo`
- **Lint Validation**: `npm run lint --prefix codigo`
- **Unit Testing**: `npm run test --prefix codigo`
- **Production Build Check**: `npm run build --prefix codigo`
- **DB Seed Feed**: `npm run seed --prefix codigo`
