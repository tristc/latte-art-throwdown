# Latte Art Throwdown Software Specification
## Complete Event Management System Requirements

**Document Version:** 1.0  
**Date:** 2026  
**Prepared for:** WEC/OCC Development Team  
**Purpose:** Comprehensive software specification for latte art throwdown management platform

---

## TABLE OF CONTENTS

1. [Executive Overview](#executive-overview)
2. [Competitor Journey](#competitor-journey)
3. [Volunteer/Staff Responsibilities](#volunteerstaff-responsibilities)
4. [Organizer Tasks](#organizer-tasks)
5. [Technical Requirements](#technical-requirements)
6. [Software Features by Role](#software-features-by-role)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [Competition Formats](#competition-formats)
9. [Judging & Scoring Systems](#judging--scoring-systems)
10. [Implementation Checklist](#implementation-checklist)

---

## EXECUTIVE OVERVIEW

### What is a Latte Art Throwdown?

A latte art throwdown (also called "smackdown" or "battle") is a head-to-head competition where baristas compete to create the best latte art. Competitors face off in pairs, with judges selecting winners to advance through a bracket until one champion remains.

### Standard Throwdown Characteristics

| Element | Specification |
|---------|---------------|
| **Format** | Head-to-head, single elimination bracket |
| **Competitors** | 8, 16, or 32 (powers of 2 for clean brackets) |
| **Time per competitor** | 4–6 minutes total (including prep, pour, cleanup) |
| **Patterns** | Free pour (no etching tools, stencils, or toothpicks) |
| **Cup contents** | Espresso + steamed milk only |
| **Judging** | 1–3 judges per match; visual criteria only (no taste) |
| **Atmosphere** | Casual, fun, community-focused (not formal like WBC) |

### Key Differentiators from Formal Competitions

| Aspect | Latte Art Throwdown | World Latte Art Championship |
|--------|--------------------|------------------------------|
| **Tone** | Casual, fun, party atmosphere | Formal, professional, serious |
| **Equipment** | Usually provided/standardized | Competitor brings own |
| **Patterns** | Free choice or simple draws | Complex, predetermined sets |
| **Judging** | Quick, often single judge | Multiple judges, detailed scoring |
| **Time** | 4–6 minutes per competitor | 6+ minutes with specific routines |
| **Feedback** | Minimal or informal | Detailed score sheets |
| **Prizes** | Often small/cash + bragging rights | Significant prize pools |

---

## COMPETITOR JOURNEY

### Phase 1: Pre-Event (Registration)

#### Step 1: Discovery
- Competitor learns about throwdown via:
  - Social media promotion
  - Host venue marketing
  - WEC platform notification
  - Word of mouth

#### Step 2: Registration
**Software handles:**
- Account creation (free tier)
- Event discovery and browsing
- One-click registration
- Terms & conditions acceptance
- Waiver signing (digital)
- Profile completion

**Required competitor info:**
- Name
- Email/phone
- Photo (for bracket display)
- Instagram/handle (optional)
- Skill level (beginner/intermediate/advanced)
- Equipment preference (if multiple options)
- Dietary restrictions (if milk alternatives offered)

**Registration limits:**
- Max competitors: Set by organizer (8/16/32)
- Waitlist functionality when full
- Cancellation with refund policy

#### Step 3: Preparation
**Software provides:**
- Event details (time, location, rules)
- Equipment list (what's provided)
- Judging criteria explanation
- Pattern inspiration gallery
- Training resources (optional)
- Competitor group chat/forum

**Pre-event communication:**
- Confirmation email
- Reminder 24 hours before
- Check-in instructions
- What to bring (ID, apron, etc.)

---

### Phase 2: Event Day (Competition Flow)

#### Step 4: Check-In
**Software handles:**
- Digital check-in (QR code scan)
- Late arrival management
- Walk-on registration (if space available)
- Bracket seeding/randomization

**At-venue process:**
1. Competitor arrives at venue
2. QR code scanned by staff
3. Confirmation of attendance
4. Competitor number assigned
5. Bracket position determined (random draw or seeding)
6. Brief orientation provided

#### Step 5: Pre-Competition
**Software displays:**
- Live bracket on screens
- Competitor order/schedule
- Current match status
- Upcoming matches (who's next)

**Competitor preparation:**
- Access to practice area (if available)
- Equipment familiarization
- Meeting judges/staff
- Photo opportunities

#### Step 6: Competition Rounds

**Standard Match Flow:**

```
MATCH START
    ↓
Competitor A prepares (espresso shot, steam milk)
Competitor B prepares (espresso shot, steam milk)
    ↓
POUR PHASE (simultaneous or sequential)
    ↓
Both present cups to judge(s)
    ↓
JUDGING (30 seconds - 2 minutes)
    ↓
Winner announced
    ↓
Winner advances on bracket
Loser eliminated (or moves to consolation)
    ↓
NEXT MATCH
```

**Time Management:**
- **Total time per competitor:** 4–6 minutes
- **Prep time:** Included in total
- **Pour time:** Unlimited within total time
- **Cleanup:** Included in total time
- **Overtime penalties:** Point deductions or disqualification

**Software timing features:**
- Countdown timer visible to competitors
- Overtime alerts
- Automatic disqualification option
- Match duration tracking

#### Step 7: Post-Match Feedback

**Immediate feedback options:**
- Judge announces winner (public)
- Brief verbal feedback (optional)
- Score display (if using points)

**Software feedback system:**
- Digital score cards (if applicable)
- Photo capture of each pour
- Video recording (optional)
- Competitor performance dashboard

**Sample feedback categories:**
1. **Visual Foam Quality** (silky/creamy vs. dry/matte)
2. **Contrast** (definition between milk and espresso)
3. **Symmetry** (balance of pattern)
4. **Position** (centering in cup)
5. **Difficulty** (complexity of pattern)
6. **Overall Appeal** (judges' holistic impression)

---

### Phase 3: Post-Event

#### Step 8: Results & Recognition
**Software provides:**
- Final bracket results
- Match history
- Photo gallery
- Video highlights
- Rankings for all competitors

#### Step 9: Certificates & Records
- Digital participation certificate
- Winner badges/achievements
- Profile update (competition history)
- Stats tracking (wins/losses/patterns used)

#### Step 10: Community Engagement
- Social media sharing tools
- Competitor networking
- Feedback survey
- Next event promotion

---

## VOLUNTEER/STAFF RESPONSIBILITIES

### Role Overview

A successful throwdown requires 8–15 volunteers depending on size. The software must coordinate, assign, and track all roles.

### Staff Roles & Software Integration

#### 1. EVENT COORDINATOR (Organizer)
**Responsibilities:**
- Overall event management
- Volunteer coordination
- Troubleshooting
- Sponsor liaison
- Timing oversight

**Software features needed:**
- Dashboard with all event metrics
- Real-time volunteer check-in
- Issue reporting system
- Communication hub
- Sponsor recognition displays

#### 2. MC (MASTER OF CEREMONIES)
**Responsibilities:**
- Welcome and orientation
- Competitor introductions
- Rule explanations
- Match announcements
- Crowd engagement
- Winner announcements
- Prize distribution

**Software features needed:**
- Script/notes display
- Competitor bio display
- Bracket visualization for audience
- Timer integration
- Next match alerts
- Music/announcement controls

#### 3. BRACKET MANAGER
**Responsibilities:**
- Bracket setup and display
- Match scheduling
- Results recording
- Advancement tracking
- Display updates

**Software features needed:**
- Digital bracket management
- Automatic advancement
- Results input interface
- Bracket display on screens
- Historical bracket archive

#### 4. STATION MANAGER
**Responsibilities:**
- Competition area setup
- Equipment management
- Station cleaning between matches
- Supplies restocking
- Technical troubleshooting

**Software features needed:**
- Equipment checklist
- Maintenance tracking
- Supply inventory alerts
- Technical issue logging

#### 5. SHOT PULLER / ESPRESSO TECH
**Responsibilities:**
- Pull espresso shots for competitors
- Grinder adjustment
- Shot timing
- Quality control

**Software features needed:**
- Shot timer integration
- Extraction parameters display
- Equipment status monitoring

#### 6. TIMEKEEPER
**Responsibilities:**
- Match timing
- Overtime tracking
- Penalty enforcement
- Schedule maintenance

**Software features needed:**
- Precision timer
- Overtime alerts
- Penalty tracking
- Schedule auto-adjustment

#### 7. REGISTRATION/STAFF CHECK-IN
**Responsibilities:**
- Competitor check-in
- Volunteer coordination
- Information desk
- Issue resolution

**Software features needed:**
- QR code scanning
- Check-in tracking
- Walk-on registration
- Late arrival handling

#### 8. RUNNER / CUP HANDLER
**Responsibilities:**
- Transport cups from station to judges
- Return cups to competitors
- Manage cup inventory
- Clean used cups

**Software features needed:**
- Cup tracking
- Inventory alerts
- Photo capture coordination

#### 9. JUDGE COORDINATOR
**Responsibilities:**
- Judge briefing
- Score collection
- Results compilation
- Dispute resolution

**Software features needed:**
- Digital scorecards
- Judge assignment rotation
- Results aggregation
- Dispute logging

#### 10. SOCIAL MEDIA / PHOTOGRAPHER
**Responsibilities:**
- Event photography
- Social media posting
- Live updates
- Content creation

**Software features needed:**
- Photo upload portal
- Instant social sharing
- Live bracket web view
- Competitor photo tagging

#### 11. CLEANUP CREW
**Responsibilities:**
- Station cleaning
- Equipment cleaning
- Venue restoration

**Software features needed:**
- Cleanup checklist
- Equipment return tracking

---

### Volunteer Management Features

**Pre-Event:**
- Role signup/assignment
- Shift scheduling
- Training materials
- Contact information collection

**During Event:**
- Check-in tracking
- Role assignment display
- Communication (group chat)
- Break scheduling

**Post-Event:**
- Volunteer hours tracking
- Thank you certificates
- Feedback collection
- Future event invitations

---

## ORGANIZER TASKS

### Pre-Event (2–4 Weeks Before)

#### Week -4: Planning
- [ ] Create event in software platform
- [ ] Set date, time, location
- [ ] Determine format (bracket size)
- [ ] Set registration limits
- [ ] Configure rules and timing
- [ ] Upload venue details

#### Week -3: Setup
- [ ] Open registration
- [ ] Promote event (social media, venues)
- [ ] Recruit volunteers
- [ ] Confirm equipment/sponsors
- [ ] Set up judging criteria
- [ ] Configure scoring system

#### Week -2: Management
- [ ] Monitor registrations
- [ ] Communicate with competitors
- [ ] Finalize volunteer assignments
- [ ] Order supplies
- [ ] Test equipment
- [ ] Prepare prizes/swag

#### Week -1: Final Prep
- [ ] Close registration (or keep open for walk-ons)
- [ ] Finalize bracket seeding
- [ ] Send competitor reminders
- [ ] Brief volunteers
- [ ] Print materials (if needed)
- [ ] Test all software systems

### Event Day

#### 2 Hours Before
- [ ] Venue setup
- [ ] Equipment testing
- [ ] Volunteer briefing
- [ ] Software system check
- [ ] Registration table setup

#### 1 Hour Before
- [ ] Competitor check-in opens
- [ ] Bracket finalization
- [ ] Judge briefing
- [ ] Sound/visual check
- [ ] Final walkthrough

#### During Event
- [ ] Monitor timeline
- [ ] Manage issues
- [ ] Coordinate volunteers
- [ ] Update bracket
- [ ] Engage audience
- [ ] Capture content

#### Post-Event
- [ ] Award ceremony
- [ ] Cleanup coordination
- [ ] Equipment return
- [ ] Thank you messages
- [ ] Results publishing
- [ ] Feedback collection

### Post-Event (1 Week After)

- [ ] Publish final results
- [ ] Share photos/videos
- [ ] Send thank you emails
- [ ] Collect feedback
- [ ] Analyze data
- [ ] Plan next event

---

## TECHNICAL REQUIREMENTS

### Hardware Requirements

#### For Venue Setup
- Tablets/smartphones for judges/staff (4–6 devices)
- Large display screens (2–3) for bracket viewing
- Sound system for MC
- Router/internet connection
- QR code scanners (optional - can use phone cameras)
- Photo/video cameras (optional)

#### For Competitors
- Personal smartphones for check-in
- Optional: Practice area tablet

### Software Architecture

#### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    LATTE ART THROWDOWN APP                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  COMPETITOR  │  │   ORGANIZER  │  │   VOLUNTEER  │      │
│  │    MODULE    │  │    MODULE    │  │    MODULE    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│                    ┌──────┴──────┐                        │
│                    │  CORE API   │                        │
│                    │   LAYER     │                        │
│                    └──────┬──────┘                        │
│                           │                                │
│         ┌─────────────────┼─────────────────┐              │
│         │                 │                 │              │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐      │
│  │   BRACKET   │  │   SCORING   │  │    USER     │      │
│  │   ENGINE    │  │   SYSTEM    │  │   SYSTEM    │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Database Schema (Key Entities)

```
USERS
├── id
├── name
├── email
├── phone
├── profile_photo
├── skill_level
├── competition_history
└── achievements

EVENTS
├── id
├── name
├── date
├── location
├── format (bracket_size)
├── rules
├── max_competitors
├── registration_open
├── status
└── organizer_id

COMPETITORS (event_user junction)
├── event_id
├── user_id
├── registration_date
├── check_in_status
├── check_in_time
├── competitor_number
├── seed_position
└── status (active/eliminated/winner)

MATCHES
├── id
├── event_id
├── round_number
├── match_number
├── competitor_a_id
├── competitor_b_id
├── winner_id
├── status (scheduled/in_progress/completed)
├── start_time
├── end_time
├── time_limit
└── notes

SCORES
├── match_id
├── judge_id
├── competitor_a_score
├── competitor_b_score
├── criteria_scores (JSON)
├── notes
└── timestamp

JUDGES
├── id
├── event_id
├── user_id
├── name
├── bio
└── photo

VOLUNTEERS
├── event_id
├── user_id
├── role
├── shift_start
├── shift_end
├── check_in_status
└── notes
```

### API Endpoints (Core)

```
AUTHENTICATION
POST /auth/register
POST /auth/login
POST /auth/logout

EVENTS
GET  /events                    # List all events
GET  /events/:id                # Event details
POST /events                    # Create event (organizer)
PUT  /events/:id                # Update event
DELETE /events/:id              # Cancel event

COMPETITORS
POST /events/:id/register       # Register for event
DELETE /events/:id/register     # Cancel registration
GET  /events/:id/competitors    # List competitors
POST /events/:id/checkin        # Check in competitor

MATCHES
GET  /events/:id/matches        # Get all matches
GET  /matches/:id               # Match details
POST /matches/:id/score         # Submit score
PUT  /matches/:id/winner        # Set winner

BRACKET
GET  /events/:id/bracket        # Get bracket visualization
POST /events/:id/bracket/generate  # Generate bracket

SCORING
GET  /scoring/criteria          # Get judging criteria
POST /matches/:id/scores        # Submit scores
GET  /matches/:id/scores        # Get scores

VOLUNTEERS
POST /events/:id/volunteers     # Add volunteer
GET  /events/:id/volunteers     # List volunteers
PUT  /volunteers/:id/role       # Assign role
```

---

## SOFTWARE FEATURES BY ROLE

### Competitor Features

#### Registration Phase
- Browse upcoming throwdowns
- One-click registration
- Digital waiver signing
- Profile management
- Skill level self-assessment
- Equipment preferences

#### Pre-Event
- Event details view
- Rules and criteria access
- Pattern inspiration gallery
- Competitor list view
- Direct messaging (optional)

#### Event Day
- QR code check-in
- Real-time bracket view
- Match notifications ("You're up next!")
- Timer visibility
- Score viewing
- Photo access

#### Post-Event
- Results viewing
- Match history
- Performance stats
- Photo/video downloads
- Social sharing
- Certificates

### Organizer Features

#### Event Creation
- Wizard-based event setup
- Venue information
- Date/time selection
- Format configuration (8/16/32 competitors)
- Rule customization
- Registration settings
- Pricing (if applicable)

#### Competitor Management
- Registration monitoring
- Waitlist management
- Check-in tracking
- Bracket seeding options (random/manual)
- Communication tools

#### Match Management
- Bracket visualization
- Match scheduling
- Timer control
- Score collection
- Results recording
- Dispute handling

#### Volunteer Management
- Role creation
- Volunteer signup
- Shift assignment
- Communication hub
- Check-in tracking

#### Analytics
- Registration metrics
- Attendance rates
- Demographics
- Performance data
- Engagement stats

### Volunteer Features

#### Pre-Event
- Role selection
- Shift signup
- Training materials
- Event information

#### Event Day
- Digital check-in
- Role assignment view
- Task checklist
- Communication tools
- Issue reporting

#### Post-Event
- Hours tracking
- Feedback submission
- Certificate download

---

## DATA FLOW DIAGRAMS

### Competitor Registration Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   BROWSE     │────▶│   REGISTER   │────▶│   PROFILE    │
│   EVENTS     │     │   (FORM)     │     │   UPDATE     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐            │
│  CONFIRMATION│◀────│   WAIVER     │◀───────────┘
│    EMAIL     │     │   SIGNING    │
└──────────────┘     └──────────────┘
```

### Match Execution Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  MATCH       │────▶│  COMPETITORS │────▶│   TIMER      │
│  CALLED      │     │  PREPARE     │     │   STARTS     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐            │
│  WINNER      │◀────│   JUDGE      │◀───────────┘
│  ADVANCES    │     │   DECIDES    │
└──────────────┘     └──────────────┘
        │
        ▼
┌──────────────┐
│  BRACKET     │
│  UPDATED     │
└──────────────┘
```

### Score Collection Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   JUDGE      │────▶│   DIGITAL    │────▶│   SYSTEM     │
│   OBSERVES   │     │   SCORECARD  │     │   AGGREGATES │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
┌──────────────┐     ┌──────────────┐            │
│  COMPETITOR  │◀────│   RESULT     │◀───────────┘
│  NOTIFIED    │     │   DISPLAYED  │
└──────────────┘     └──────────────┘
```

---

## COMPETITION FORMATS

### Format 1: Standard Single Elimination

**Best for:** Most throwdowns, casual events

```
Round 1: 16 competitors → 8 matches → 8 winners
Round 2: 8 competitors  → 4 matches → 4 winners  
Round 3: 4 competitors  → 2 matches → 2 winners
Round 4: 2 competitors  → 1 match   → 1 champion
```

**Time:** ~2–3 hours for 16 competitors

### Format 2: Double Elimination

**Best for:** More serious competitions, ensuring best competitor wins

- Competitors must lose twice to be eliminated
- Winners bracket + Losers bracket
- Grand finals may require two matches (if losers bracket winner beats winners bracket winner)

**Time:** ~4–5 hours for 16 competitors

### Format 3: Swiss System

**Best for:** Large groups, everyone gets multiple matches

- Everyone plays same number of rounds
- Paired with similar record each round
- Top performers advance to final bracket

**Time:** Variable based on rounds

### Format 4: Round Robin

**Best for:** Small groups (8 or fewer), everyone plays everyone

- Each competitor faces all others
- Most wins = champion
- Tiebreakers by head-to-head

**Time:** Longest format

### Format 5: LAGS Battle System

**Best for:** Skill-leveled competitions

- Competitors grouped by certification level (Green/Red/Black)
- Roll die to determine who challenges
- Challenger picks pattern and cup size
- Both attempt same pattern
- Winner advances

---

## JUDGING & SCORING SYSTEMS

### System 1: Head-to-Head Binary (Winner Takes All)

**Simplest form - no scores, just winner**

- Judge picks winner of each match
- No numerical scores
- Fastest method
- Best for casual throwdowns

### System 2: Point-Based Criteria

**Standard scoring with multiple criteria:**

| Criteria | Points | Description |
|----------|--------|-------------|
| **Contrast** | 0–10 | Definition between milk and espresso |
| **Symmetry** | 0–10 | Balance of pattern |
| **Difficulty** | 0–10 | Complexity of pattern |
| **Position** | 0–10 | Centering in cup |
| **Foam Quality** | 0–10 | Silkiness, gloss, texture |
| **Overall** | 0–20 | Holistic impression (weighted 2×) |
| **TOTAL** | **0–70** | |

### System 3: LAGS Grading System

**Professional certification-aligned:**

- Green Level: Basic patterns (heart, rosetta)
- Red Level: Intermediate (tulip variations)
- Black Level: Advanced (complex combinations)
- Gold Level: Expert (world championship caliber)

Competitors graded against level-specific criteria.

### System 4: Audience Voting

**Community engagement:**

- Audience votes via app
- Real-time voting during match
- Can be combined with judge voting
- Popular choice awards

### System 5: Consensus Judging

**Multiple judges, discussion-based:**

- 3 judges observe
- Brief discussion
- Consensus decision
- Reduces individual bias

---

## IMPLEMENTATION CHECKLIST

### Phase 1: MVP Features (Launch)

**Competitor Side:**
- [ ] Registration & account creation
- [ ] Event browsing
- [ ] Digital check-in
- [ ] Bracket viewing
- [ ] Results viewing

**Organizer Side:**
- [ ] Event creation
- [ ] Competitor management
- [ ] Bracket generation
- [ ] Match scheduling
- [ ] Winner recording

**Staff Side:**
- [ ] Role assignment
- [ ] Check-in scanning
- [ ] Score entry
- [ ] Timer control

### Phase 2: Enhanced Features

- [ ] Photo capture & gallery
- [ ] Video recording
- [ ] Advanced scoring criteria
- [ ] Social sharing
- [ ] Competitor profiles
- [ ] Stats tracking
- [ ] Volunteer management

### Phase 3: Advanced Features

- [ ] Live streaming integration
- [ ] Multiple location support
- [ ] Payment processing
- [ ] Merchandise sales
- [ ] Sponsor integration
- [ ] Analytics dashboard
- [ ] Mobile apps (iOS/Android)

---

## APPENDIX

### Sample Rules (Standard Throwdown)

1. **Free pour only** — No etching tools, stencils, toothpicks, or other aids
2. **Cup contents** — Espresso + steamed milk only
3. **Time limit** — 4–6 minutes per competitor (including prep/cleanup)
4. **Patterns** — Competitor's choice (or assigned for specific rounds)
5. **Equipment** — Provided by host (or specified standard)
6. **Judging** — Visual criteria only; taste not evaluated
7. **Sportsmanship** — Professional behavior required
8. **Disqualification** — Breaking rules or unsportsmanlike conduct

### Sample Judging Criteria Card

```
LATTE ART THROWDOWN — JUDGE SCORECARD
Match #: _______ Round: _______
Competitor A: _________________ Competitor B: _________________

CRITERIA (Circle score for each):

CONTRAST (definition):
A: 1 2 3 4 5 6 7 8 9 10    B: 1 2 3 4 5 6 7 8 9 10

SYMMETRY (balance):
A: 1 2 3 4 5 6 7 8 9 10    B: 1 2 3 4 5 6 7 8 9 10

DIFFICULTY (complexity):
A: 1 2 3 4 5 6 7 8 9 10    B: 1 2 3 4 5 6 7 8 9 10

POSITION (centering):
A: 1 2 3 4 5 6 7 8 9 10    B: 1 2 3 4 5 6 7 8 9 10

FOAM QUALITY (texture):
A: 1 2 3 4 5 6 7 8 9 10    B: 1 2 3 4 5 6 7 8 9 10

OVERALL IMPRESSION (×2 weight):
A: 2 4 6 8 10 12 14 16 18 20    B: 2 4 6 8 10 12 14 16 18 20

TOTAL:
A: _______    B: _______

WINNER: ☐ A    ☐ B    ☐ TIE (rematch)

Notes:
_______________________________________________
_______________________________________________

Judge Signature: _________________ Date: _______
```

### Glossary

- **Bracket:** Tournament structure showing matchups
- **Free Pour:** Creating latte art by pouring only (no tools)
- **Head-to-Head:** Two competitors facing each other directly
- **Knockout:** Single elimination — lose once and you're out
- **LAGS:** Latte Art Grading System (certification)
- **Seed:** Initial ranking/position in bracket
- **Throwdown:** Casual latte art competition

---

*Document prepared for WEC/OCC Latte Art Throwdown Software Development*
*Research compiled from 20+ industry sources, competition rulebooks, and event management best practices*
