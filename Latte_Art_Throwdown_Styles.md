# Latte Art Throwdown Styles & Formats
## Software Requirements for All Competition Types

**Research Date:** 2026  
**Purpose:** Document all latte art throwdown styles for software implementation

---

## OVERVIEW

Latte art throwdowns come in multiple formats/styles. The software must support all of them, as organizers choose based on skill level, time constraints, and desired atmosphere.

---

## STYLE 1: MATCH/REPLICATION STYLE ("Match That Pattern")

### Description
The most common competitive format. One competitor (the challenger) chooses a pattern, and both competitors must pour that SAME pattern. The barista who executes it better wins.

### How It Works

```
MATCH FLOW:
┌─────────────────────────────────────────────────────────────┐
│  1. COIN TOSS                                               │
│     • Winner becomes "Defender" (pours first)               │
│     • Loser becomes "Challenger" (chooses pattern)          │
├─────────────────────────────────────────────────────────────┤
│  2. CHALLENGER DECLARES PATTERN                             │
│     • "I challenge you to a 3-stack tulip"                  │
│     • "I challenge you to a swan"                           │
│     • "I challenge you to a rosetta with 5 leaves"          │
├─────────────────────────────────────────────────────────────┤
│  3. DEFENDER POURS FIRST                                    │
│     • Sets the standard                                     │
│     • Cannot change pattern after seeing defender's pour    │
├─────────────────────────────────────────────────────────────┤
│  4. CHALLENGER POURS SECOND                                 │
│     • Must pour the EXACT same pattern                      │
│     • Must match stack count, design, complexity            │
├─────────────────────────────────────────────────────────────┤
│  5. JUDGE DECIDES                                           │
│     • Who executed the pattern better?                      │
│     • Execution quality, symmetry, contrast, definition     │
└─────────────────────────────────────────────────────────────┘
```

### Rules
- **Pattern must be agreed upon** before either competitor pours
- **Defender pours first** — sets the standard
- **Challenger must replicate exactly** — same number of stacks, same design elements
- **If challenger fails to match** (wrong number of stacks, different design), automatic loss
- **If both match successfully**, judge decides who executed better

### Common Patterns Used

| Pattern | Difficulty | Description |
|---------|-----------|-------------|
| **Heart** | Beginner | Single heart shape |
| **Rosetta** | Beginner-Intermediate | Fern/leaf pattern |
| **Tulip** | Intermediate | Stacked circles (2–5 stacks) |
| **Swan** | Intermediate-Advanced | Long neck with body/feathers |
| **Winged Tulip** | Advanced | Tulip with side wings |
| **Phoenix/Rising Tulip** | Advanced | Complex layered tulip |
| **Animal Designs** | Advanced | Bears, rabbits, etc. |
| **Multi-Pattern Combo** | Expert | Rosetta base + tulip top |

### Software Requirements

**Match Setup:**
- Pattern selection interface
- Pattern library with difficulty ratings
- Custom pattern text entry (for unique challenges)
- Defender/Challenger assignment
- Pattern confirmation (both competitors confirm before pouring)

**Scoring:**
- Did challenger successfully replicate? (Yes/No)
- If yes: Execution quality comparison
- If no: Automatic win for defender

---

## STYLE 2: FREESTYLE STYLE ("Show Your Best")

### Description
Each competitor pours their own choice of pattern. Judges evaluate purely on execution quality, not pattern matching. Most creative format.

### How It Works

```
MATCH FLOW:
┌─────────────────────────────────────────────────────────────┐
│  1. COIN TOSS                                               │
│     • Winner chooses to pour first or second                │
│     • OR winner chooses equipment/milk type                 │
├─────────────────────────────────────────────────────────────┤
│  2. COMPETITOR A POURS                                      │
│     • Any pattern they choose                               │
│     • No restrictions (within free-pour rules)              │
├─────────────────────────────────────────────────────────────┤
│  3. COMPETITOR B POURS                                      │
│     • Any pattern they choose                               │
│     • Can be completely different from Competitor A         │
├─────────────────────────────────────────────────────────────┤
│  5. JUDGE DECIDES                                           │
│     • Which pour was better overall?                        │
│     • Execution, creativity, difficulty all factor in       │
└─────────────────────────────────────────────────────────────┘
```

### Rules
- **No pattern declared** — free choice
- **Each competitor's best work** — bring your A-game
- **Difficulty matters** — a simple heart rarely beats a complex swan
- **Execution is king** — a perfect rosetta beats a sloppy phoenix

### Advantages
- Allows competitors to show their signature style
- Encourages creativity
- Higher entertainment value for audience
- Showcases individual skill strengths

### Software Requirements

**Match Setup:**
- Simple competitor order assignment
- No pattern declaration required
- Optional: "Surprise reveal" (competitors don't see each other's pour until both complete)

**Scoring:**
- Full criteria scoring (contrast, symmetry, difficulty, etc.)
- Pattern identification (what did they pour?)
- Difficulty rating by judges

---

## STYLE 3: ASSIGNED PATTERN ("Everyone Pours the Same")

### Description
Organizer/judge assigns a specific pattern that ALL competitors in that round must pour. Tests consistency and specific skills.

### How It Works

```
ROUND SETUP:
┌─────────────────────────────────────────────────────────────┐
│  Organizer/Judge announces:                                 │
│  "This round: 3-STACK TULIP"                                │
│  "This round: CLASSIC ROSETTA"                              │
│  "This round: SWAN WITH DETAILED WINGS"                     │
├─────────────────────────────────────────────────────────────┤
│  ALL competitors in the match pour the SAME pattern         │
│  Direct comparison of the same design                       │
└─────────────────────────────────────────────────────────────┘
```

### Rules
- **Pattern assigned** by organizer/judge
- **Both/all competitors pour identical pattern**
- **Best execution wins**
- Often used in early rounds to standardize skill assessment

### Software Requirements

**Match Setup:**
- Organizer pattern assignment interface
- Pattern locked for entire round/bracket
- Display pattern on screens for audience

**Scoring:**
- Standard execution scoring
- Direct comparison of same design

---

## STYLE 4: PROGRESSIVE DIFFICULTY ("Level Up")

### Description
Each round increases in pattern difficulty. Competitors must prove mastery of basics before advancing to advanced patterns.

### Round Progression Example

| Round | Pattern Requirement | Elimination |
|-------|--------------------|-------------|
| **Round 1** | Heart OR Rosetta | Bottom 50% eliminated |
| **Round 2** | Tulip (2-stack minimum) | Bottom 50% eliminated |
| **Round 3** | Tulip (3-stack+) OR Swan | Bottom 50% eliminated |
| **Final** | Freestyle (anything) | Winner takes all |

### Rules
- **Difficulty increases each round**
- **Minimum pattern requirements** announced before round
- **Competitors can choose harder** than minimum (risk/reward)
- If you can't complete the minimum pattern, you're eliminated

### Software Requirements

**Tournament Setup:**
- Round-by-round pattern configuration
- Minimum difficulty settings
- Progressive unlock of pattern options
- Elimination tracking by round

---

## STYLE 5: ETCH-AND-POUR VS. FREE POUR

### Description
Competition between two different latte art techniques. Etch-and-pour uses tools (toothpicks, etching needles) vs. pure free pour.

### Two Sub-Styles

**Etch-And-Pour:**
- Use tools to etch designs after pouring
- Allows more detailed, artistic designs
- Different skill set (artistic vs. pouring technique)

**Free Pour Only:**
- No tools allowed
- Pure pouring technique
- Traditional barista skill

### Software Requirements
- Style designation per event
- Rule enforcement tracking
- Different judging criteria for each style

---

## STYLE 6: SPEED POUR CHALLENGE

### Description
Timed format. Competitors have limited time (often 2–3 minutes) to complete their best pour. Tests speed under pressure.

### Rules
- **Strict time limit** (often 2:00 or 2:30)
- **Must serve drink** within time limit
- **Overtime = disqualification** or major penalty
- Pattern can be freestyle or assigned

### Software Requirements
- Precision timer integration
- Overtime alerts
- Auto-disqualification option
- Time remaining displays

---

## STYLE 7: TEAM/RELAY THROWDOWN

### Description
Teams of 2–3 baristas compete. Each team member completes part of the process (espresso, milk, pour).

### Formats

**Relay Style:**
- Barista 1: Pull shot
- Barista 2: Steam milk
- Barista 3: Pour latte art
- Fastest AND best execution wins

**Team Match:**
- Teams compete head-to-head
- Best combined score wins
- Individual scores aggregated

### Software Requirements
- Team registration and management
- Individual vs. team scoring
- Relay timing tracking
- Aggregate score calculations

---

## STYLE 8: SURVIVAL/ELIMINATION

### Description
Large group format where everyone pours simultaneously. Worst pours eliminated each round until winner remains.

### How It Works
- All competitors pour at once (or in rapid sequence)
- Judges rank all pours
- Bottom X% eliminated each round
- Continue until winner determined

### Software Requirements
- Multi-competitor match support
- Ranking system (not just winner/loser)
- Batch elimination tracking

---

## STYLE 9: MYSTERY PATTERN

### Description
Pattern is revealed only at match time. Competitors must adapt on the spot with no preparation.

### How It Works
- Pattern revealed by spinning wheel, drawing cards, or judge announcement
- Competitors have 30 seconds to prepare mentally
- Then pour immediately
- Tests adaptability and comprehensive skill

### Software Requirements
- Random pattern selector
- Pattern reveal interface
- Countdown to pour

---

## STYLE 10: SPECIALTY MILK CHALLENGES

### Description
Restrictions or challenges around milk type.

### Variations
- **Oat milk only** — tests alternative milk steaming
- **Non-dairy challenge** — almond, soy, coconut
- **Straight espresso** — no milk (design in crema only)
- **Split pour** — half dairy, half alternative

### Software Requirements
- Milk type tracking per match
- Alternative milk difficulty modifiers
- Equipment tracking for different milk types

---

## SOFTWARE ARCHITECTURE FOR MULTI-STYLE SUPPORT

### Database Schema Updates

```sql
-- Add to events table
ALTER TABLE events ADD COLUMN throwdown_style VARCHAR(50) DEFAULT 'freestyle';
-- Options: 'match_pattern', 'freestyle', 'assigned', 'progressive', 
--          'etch_vs_free', 'speed', 'team', 'survival', 'mystery', 'milk_challenge'

-- Add to matches table
ALTER TABLE matches ADD COLUMN assigned_pattern VARCHAR(100);
ALTER TABLE matches ADD COLUMN challenger_id UUID REFERENCES event_competitors(id);
ALTER TABLE matches ADD COLUMN defender_id UUID REFERENCES event_competitors(id);
ALTER TABLE matches ADD COLUMN pattern_chosen_by VARCHAR(20); -- 'challenger', 'organizer', 'random'
ALTER TABLE matches ADD COLUMN milk_type VARCHAR(50) DEFAULT 'whole';
ALTER TABLE matches ADD COLUMN time_limit_seconds INTEGER DEFAULT 240;

-- Pattern library table
CREATE TABLE pattern_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
    description TEXT,
    image_url TEXT,
    min_stacks INTEGER,
    category VARCHAR(50), -- 'heart', 'rosetta', 'tulip', 'swan', 'animal', 'combo'
    is_active BOOLEAN DEFAULT TRUE
);
```

### Style Configuration per Event

```javascript
const eventStyles = {
  match_pattern: {
    name: "Match/Replication",
    requiresPatternDeclaration: true,
    hasDefenderChallenger: true,
    patternSource: "challenger", // or "defender" depending on local rules
    description: "Challenger chooses pattern, both pour it"
  },
  
  freestyle: {
    name: "Freestyle",
    requiresPatternDeclaration: false,
    hasDefenderChallenger: false,
    description: "Each competitor pours their choice"
  },
  
  assigned: {
    name: "Assigned Pattern",
    requiresPatternDeclaration: true,
    hasDefenderChallenger: false,
    patternSource: "organizer",
    description: "Organizer assigns pattern for all"
  },
  
  progressive: {
    name: "Progressive Difficulty",
    requiresPatternDeclaration: true,
    hasDefenderChallenger: false,
    patternSource: "organizer_by_round",
    description: "Difficulty increases each round"
  },
  
  speed: {
    name: "Speed Pour",
    requiresPatternDeclaration: false,
    hasDefenderChallenger: false,
    defaultTimeLimit: 120, // 2 minutes
    description: "Fastest quality pour wins"
  },
  
  team: {
    name: "Team/Relay",
    requiresPatternDeclaration: false,
    hasDefenderChallenger: false,
    isTeamFormat: true,
    description: "Teams compete together"
  }
};
```

### UI Flow by Style

**Match Pattern Style Flow:**
1. Competitors enter match area
2. Coin toss → Assign Defender/Challenger
3. Challenger selects pattern from library
4. Both competitors confirm pattern
5. Defender pours first
6. Challenger pours second
7. Judging

**Freestyle Style Flow:**
1. Competitors enter match area
2. Coin toss → Choose order
3. Competitor A pours (any pattern)
4. Competitor B pours (any pattern)
5. Judging

**Assigned Pattern Style Flow:**
1. Organizer assigns pattern for the round
2. Pattern displayed on screens
3. Competitor A pours
4. Competitor B pours
5. Judging

---

## JUDGING CRITERIA BY STYLE

### Match Pattern Style
- **Replication Success** (Did challenger match the pattern?) — 40%
- **Contrast** — 15%
- **Symmetry** — 15%
- **Definition** — 15%
- **Overall Execution** — 15%

### Freestyle Style
- **Execution Quality** — 30%
- **Difficulty** — 25%
- **Contrast** — 15%
- **Symmetry** — 15%
- **Creativity** — 10%
- **Overall Appeal** — 5%

### Speed Style
- **Completion Within Time** — 40% (must finish!)
- **Execution Quality** — 35%
- **Difficulty** — 25%

---

## IMPLEMENTATION PRIORITY

### Phase 1: Core Styles (MVP)
1. **Freestyle** — Simplest to implement
2. **Match/Replication** — Most common format

### Phase 2: Popular Styles
3. **Assigned Pattern** — Tournament standard
4. **Speed Pour** — Easy timer addition

### Phase 3: Advanced Styles
5. **Progressive Difficulty** — Requires round configuration
6. **Team/Relay** — Requires team management
7. **Mystery Pattern** — Requires randomization
8. **Milk Challenges** — Requires equipment tracking

---

## SUMMARY

The software must support:
- **Freestyle** (competitors choose their pattern)
- **Match/Replication** (challenger chooses, both pour same)
- **Assigned** (organizer chooses for everyone)
- Plus timer controls, team formats, progressive difficulty

**Most Important for MVP:**
1. Freestyle (easiest)
2. Match/Replication (most common)

These two styles cover 90% of throwdowns.

