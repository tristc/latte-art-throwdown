# Working With Kimi — Tristan's Personal Cheat Sheet

*Your AI assistant's operating manual — customized for WEC, Espresso King, Thunder, and everything else you're building.*

---

## 🎯 Quick Reference

| What You Need | Just Say |
|---------------|----------|
| **Research coffee industry trends** | "Research pre-made espresso adoption in Melbourne" |
| **Deploy/update a website** | "Deploy the WEC registration page" |
| **Create documents** | "Create a partnership proposal for BWT" |
| **Analyze data** | "Analyze our pricing elasticity data" |
| **Manage projects** | "Update the WEC launch timeline" |
| **Write copy** | "Write event description for WLT launch" |
| **Check status** | "What's the status of the latte art throwdown deployment?" |

---

## ☕ Your Active Projects

### 1. WEC / OCC Ecosystem
**What I know:**
- World Espresso Championship (comparison-based judging, no deliberation)
- OCC = Competitions + Community + Courses
- Next event: October 22, 2025 in Milan
- Brand assets, color schemes, positioning against WBC

**How I help:**
- Create marketing materials following brand guidelines
- Research competitors and industry trends
- Build software (like the Latte Art Throwdown PWA)
- Write proposals, pitch decks, copy
- Manage timelines and track deliverables

**Key files:**
- `WEC_OCC_Launch_Timeline.md` — Master timeline
- `Latte_Art_Throwdown_Software_Spec.md` — Software requirements
- `memory/*-latte-art-competition-research.md` — Research logs

---

### 2. Espresso King
**What I know:**
- Mobile espresso operation (bike/truck)
- Pre-made espresso model (Kirk Pearson/Project Zero inspired)
- Target: Kopi market + Grab deliveries
- Melbourne → KL expansion potential

**How I help:**
- Financial modeling and COGS calculations
- Equipment research and sourcing
- Operational workflows
- Investor materials
- Location scouting research

**Key files:**
- `espresso_king_investor_brief.md`
- `espresso_king_one_pager.md`
- `EspressoKing_*` (logos, diagrams)

---

### 3. Thunder (KL Office Kiosk)
**What I know:**
- Menara UOA South Bangsar
- 800 daily foot traffic
- 100 free coffees model (client-funded)
- Halal-friendly, budget-focused
- Peak window: 7:45-10am

**How I help:**
- Menu engineering and pricing
- COGS tracking and margin analysis
- Operations checklists
- Equipment recommendations

**Key files:**
- `Thunder_Menu_2026.md`
- `Thunder_COGS_*.csv`
- `Thunder_Comprehensive_Item_List.md`

---

### 4. Coffee Intelligence & Research
**Topics I track for you:**
- Pre-made/batch espresso developments
- Latte art competitions (WLAC vs Throwdowns)
- SCA/WBC industry critique
- Sustainability and fair trade coffee
- Equipment innovations

**How to use me:**
```
"Kimi, research [topic] and add to memory"
"Set up monitoring for [subject]"
"Find evidence supporting [claim]"
"What's the latest on [trend]?"
```

---

## 💬 Communication Patterns That Work

### ✅ Effective Prompts

**Research:**
- "Research [X] and save findings to memory"
- "Find 3 sources on [topic] with citations"
- "Compare [A] vs [B] for our use case"

**Documents:**
- "Create a [type] about [subject]"
- "Update [file] with [new information]"
- "Convert [file] to [PDF/HTML/etc]"

**Code/Tech:**
- "Deploy [project] to [platform]"
- "Fix the build error in [project]"
- "Add [feature] to [existing code]"

**Analysis:**
- "Calculate [metric] from [data]"
- "Analyze [file] and tell me [what to look for]"
- "Create projections for [scenario]"

### ❌ Less Effective
- Vague: "Help with coffee stuff" → Too broad
- Multi-step without context: "Do this then that then..." → Break it up
- Assuming I know: "Fix it" → Tell me what's broken

---

## 🧠 Memory System

### Files I Read Every Session
1. **SOUL.md** — My personality & voice
2. **USER.md** — About you
3. **MEMORY.md** — Long-term curated memories
4. **memory/YYYY-MM-DD.md** — Today's and yesterday's logs

### How to Make Me Remember
- **Explicit:** "Kimi, remember that [fact]"
- **Implicit:** I auto-save significant decisions, insights, mistakes
- **Review:** Ask me to "review and update MEMORY.md" periodically

### Memory Categories I Track
- Business decisions & rationale
- Research findings
- Failed approaches (so we don't repeat)
- Your preferences (communication style, formatting, etc.)
- Project timelines and deadlines
- Contact info and relationships

---

## 🛠️ Skills & Capabilities

### Web & Tech
- **Deploy websites** (Vercel, Netlify, GitHub Pages)
- **Build apps** (Next.js, React, PWA)
- **Database setup** (Supabase, PostgreSQL)
- **Git operations** (commit, push, PR)
- **Browser automation** (test sites, fill forms)

### Content Creation
- **Documents** (Markdown, Google Docs export)
- **Presentations** (HTML slides, PDF)
- **Visuals** (SVG diagrams, simple graphics)
- **Copywriting** (marketing, technical, conversational)

### Research
- **Web search** (real-time, with citations)
- **Deep research** (multi-source synthesis)
- **Monitoring** (periodic checks via cron/heartbeat)
- **Competitive analysis**

### Data
- **Spreadsheets** (CSV analysis, calculations)
- **Financial modeling** (projections, scenarios)
- **Data visualization** (charts, tables)

### Communication
- **Message sending** (Telegram, WhatsApp, Discord)
- **Email drafting** (you review before sending)
- **Calendar management** (check schedules, create events)

---

## 📋 Common Workflows

### Starting a New Project
1. "Kimi, create a project brief for [idea]"
2. "Research competitors and save to memory"
3. "Create a timeline with milestones"
4. "Draft initial budget/COGS"

### Preparing for a Meeting
1. "Summarize [project] status"
2. "Prepare talking points about [topic]"
3. "Create a one-pager on [subject]"
4. "Check if I need to bring anything specific"

### Research Deep-Dive
1. "Research [topic] thoroughly"
2. "Find primary sources and experts"
3. "Create a summary document"
4. "Add key findings to MEMORY.md"

### Building/Deploying Software
1. "Set up [type] project for [purpose]"
2. "Build [features]"
3. "Deploy to [platform]"
4. "Test and verify it's working"

### Content Creation
1. "Create [format] about [topic]"
2. "Follow our brand guidelines"
3. "Review and iterate"
4. "Export to [PDF/HTML/etc]"

---

## ⚡ Power User Tips

### Use "Kimi take note"
When you say this, I explicitly log something to memory. Use it for:
- Decisions you want to remember the reasoning for
- Insights that might be useful later
- Commitments or deadlines
- Things you want me to follow up on

### Batch Similar Requests
Instead of 5 separate messages, give me a list:
```
"Kimi, do these things:
1. Research X
2. Create document Y
3. Send message to Z
4. Update file W"
```

### Reference Previous Work
"Use the same format as the Espresso King brief"
"Follow the WEC brand guidelines from MEMORY.md"
"Update the Thunder COGS file we created yesterday"

### Set Up Monitoring
"Kimi, check [source] daily and report changes"
"Monitor [metric] and alert me if [condition]"
(This uses HEARTBEAT.md or cron jobs)

### Spawn Sub-Agents
For complex multi-part tasks, I'll spawn sub-agents automatically. You don't need to do anything — I manage the coordination.

---

## 🚨 When Things Go Wrong

### I don't remember something
→ Ask me to check specific files: "Check MEMORY.md for [topic]"

### I make a mistake
→ Tell me: "That's wrong, the correct info is [X]" — I'll update my memory

### Deployment fails
→ Paste the error message — I'll diagnose and fix

### I need credentials
→ I'll ask for tokens/keys, never passwords. Use environment variables when possible.

### You want me to stop
→ Just say "stop" or "cancel" — I honor it immediately

---

## 🔗 Quick Links

- **GitHub:** https://github.com/tristc
- **Latte Art Throwdown:** https://github.com/tristc/latte-art-throwdown
- **Supabase:** https://supabase.com/dashboard
- **Vercel:** https://vercel.com/dashboard

---

## 💬 Example Session

**You:** "Kimi, the WEC Milan event needs a sponsor prospectus. Research what other coffee competitions include, then draft ours following our brand guidelines."

**Me:** 
1. Research 3-4 coffee competition sponsor packages
2. Check WEC brand guidelines from memory
3. Draft a prospectus
4. Save it to workspace
5. Ask if you want changes

**You:** "Looks good, make it a PDF and also create a one-page summary version."

**Me:**
1. Generate PDF
2. Create one-pager
3. Provide download links
4. Log to memory: "Created WEC Milan sponsor prospectus [date]"

---

## 🎬 Summary

**I'm most effective when you:**
- Give clear, specific requests
- Tell me to remember important things
- Reference previous work for consistency
- Share context (who it's for, what it's for)
- Let me handle the execution details

**I'm not good at:**
- Reading your mind (tell me what you want)
- Remembering without writing (prompt me)
- Perfect first drafts (iterate with me)

---

*Last updated: April 8, 2026*
*Ask me to update this anytime your workflow changes!*
