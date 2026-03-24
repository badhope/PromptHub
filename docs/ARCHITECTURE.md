# AI Agent Ecosystem - Core Architecture Design

**Document**: Architecture Design
**Version**: 1.0
**Date**: 2026-03-24
**Status**: Draft

---

## 1. Design Principles

### 1.1 Core Principles

| Principle | Description | Implementation |
|:----------|:------------|:----------------|
| **Modularity** | Each component should be independent and reusable | Agent prompts as self-contained modules |
| **Extensibility** | System should easily accommodate new features | Category-based organization |
| **Portability** | Agents should work across platforms | GitHub Raw-based activation |
| **Quality** | Maintain high standards for all components | Template-driven development |
| **Accessibility** | Easy to use and deploy | No installation required |

### 1.2 Design Philosophy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DESIGN PHILOSOPHY                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  "Simple for users, powerful for developers"                            │
│                                                                         │
│  USER VIEW                    DEVELOPER VIEW                            │
│  ─────────                    ─────────────                            │
│  • One-click activation       • Modular architecture                    │
│  • Cross-platform access      • API-extensible                                                 │
│  • Instant results            • Customizable templates                   │
│  • No technical knowledge     • Integration-ready                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. System Architecture

### 2.1 Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      THREE-LAYER ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      PRESENTATION LAYER                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │  Raw Link   │  │   Web UI    │  │   Future: Mobile App   │ │   │
│  │  │  Activation │  │  (Optional) │  │                       │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                      │
│                                   ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        AGENT LAYER                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │   Role      │  │   Skill     │  │   Personality          │ │   │
│  │  │   Module    │  │   Module    │  │   Module              │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │   Memory    │  │  Response   │  │   Interaction          │ │   │
│  │  │   Module    │  │   Module    │  │   Module              │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                   │                                      │
│                                   ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       DATA LAYER                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │   Agent     │  │   User     │  │   Platform             │ │   │
│  │  │   Files     │  │   Data     │  │   Config               │ │   │
│  │  │   (MD+YAML) │  │            │  │                        │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT CONNECTIONS                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│     ┌──────────────┐                                                    │
│     │   GitHub     │◄────── Raw URL Protocol ──────► ┌──────────────┐   │
│     │   Repository │                                    │  AI Platform │   │
│     │              │                                    │  (Claude,    │   │
│     │  ┌────────┐  │                                    │   ChatGPT)   │   │
│     │  │ Agent  │  │                                    └──────┬───────┘   │
│     │  │ Files  │  │                                           │           │
│     │  └────────┘  │                                           │           │
│     └──────────────┘                                           │           │
│            │                                                        │           │
│            ▼                                                        ▼           │
│     ┌──────────────────────────────────────────────────────────────┐        │
│     │                    AGENT ACTIVATION FLOW                      │        │
│     │                                                               │        │
│     │   1. User copies Raw URL                                      │        │
│     │   2. User pastes to AI platform                               │        │
│     │   3. AI platform fetches agent file                           │        │
│     │   4. AI loads agent prompt                                     │        │
│     │   5. Agent mode activated                                     │        │
│     │   6. User interacts with agent                               │        │
│     │                                                               │        │
│     └───────────────────────────────────────────────────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Agent Architecture

### 3.1 Agent Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AGENT FILE STRUCTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  FRONTMATTER (YAML Metadata)                                    │   │
│  │  ┌─────────────────────────────────────────────────────────────┐ │   │
│  │  │ agent_id: unique-id          # Unique identifier             │ │   │
│  │  │ category: category-name      # Matches directory name       │ │   │
│  │  │ language: zh                 # Primary language              │ │   │
│  │  │ description: "..."           # Brief description            │ │   │
│  │  │ best_for: "..."              # Use case tags                 │ │   │
│  │  │ activation_prompt: "..."     # How to activate              │ │   │
│  │  └─────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CONTENT (Markdown)                                             │   │
│  │                                                                 │   │
│  │  # Role Definition                                              │   │
│  │  ## Core Mission                                                │   │
│  │  ## Personality                                                 │   │
│  │  ## Skills & Capabilities                                       │   │
│  │  ## Response Patterns                                          │   │
│  │  ## Output Formats                                              │   │
│  │  ## Boundaries                                                  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Agent Module Types

#### Professional Agent Module

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROFESSIONAL AGENT MODULE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  MODULE           DESCRIPTION                    STATUS         │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  Identity         Core role definition              Required     │   │
│  │  Expertise        Domain knowledge base            Required     │   │
│  │  Methodology      Professional workflow            Required     │   │
│  │  Output Format    Structured response templates    Required     │   │
│  │  Quality Control  Output validation rules           Optional     │   │
│  │  Compliance       Regulatory guidelines             Domain-specific│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Character Agent Module

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CHARACTER AGENT MODULE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  MODULE           DESCRIPTION                    STATUS         │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │  Identity         Name, background, appearance     Required     │   │
│  │  Personality      Traits, emotions, behaviors       Required     │   │
│  │  Speech Pattern   Catchphrases, expressions         Required     │   │
│  │  Body Language    Actions, gestures (text-based)    Required     │   │
│  │  Memory           Relationship history              Required     │   │
│  │  Story Arc        Character development             Optional     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Category System

### 4.1 Category Definition

| Category ID | Directory | Purpose | Example Agents |
|:------------|:----------|:--------|:---------------|
| functional | functional/ | Task execution tools | Smart Planner, Data Analyst |
| professional | professional/ | Domain experts | Legal Advisor, HR Specialist |
| healthcare | healthcare/ | Health & wellness | Medical Advisor, Nutritionist |
| finance | finance/ | Financial services | Investment Advisor, Tax Consultant |
| psychology | psychology/ | Mental health | Psychologist, Career Counselor |
| design-build | design-build/ | Design & architecture | Code Architect, Product Manager |
| research-analysis | research-analysis/ | Research & insights | Research Analyst |
| writing-creative | writing-creative/ | Content creation | Writer, Copywriter |
| learning-education | learning-education/ | Teaching methods | Socratic Tutor |
| subject-tutoring | subject-tutoring/ | Subject-specific tutoring | Math Tutor, Language Teacher |
| lifestyle-companion | lifestyle-companion/ | Life support | Wise Sage, Landlord Uncle |
| entertainment-character | entertainment-character/ | Roleplay characters | Anime characters, Original chars |
| gaming | gaming/ | Game-related | Game Master, Dungeon Master |
| historical-culture | historical-culture/ | Historical figures | Philosopher King, Alchemist |
| social-vocation | social-vocation/ | Social roles | Chef, Detective, Journalist |
| creative-arts | creative-arts/ | Creative fields | Music Composer, Visual Artist |

### 4.2 Category Decision Tree

```
                    Does it require deep professional domain expertise?
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                   YES                              NO
                    │                               │
            ┌───────▼───────┐              Is the primary task teaching?
            │ Is it legal,  │              or explaining?
            │ financial,    │                      │
            │ medical, or   │              ┌───────┴───────┐
            │ technical?    │              │               │
            └───────┬───────┘             YES             NO
                    │                           │             │
            ┌───────┴───────┐                  │       ┌─────▼─────┐
            │               │                 NO       │ Is it for │
           YES              NO                  │    entertainment?
            │               │                   │        │
    ┌───────┴───────┐       │            ┌─────┴─────┐   │
    │               │       │            │           │   │
Professional    Other    ┌───┴────┐      ▼           ▼   │
(Domain Expert)    │  Subject  │  ┌─────────┐   ┌────────────┐
                   │  Tutoring │  │Learning │   │Entertainment│
                   │           │  │Education│   │ (Character)│
                   └───────────┘  └─────────┘   └────────────┘
```

---

## 5. Integration Architecture

### 5.1 Integration Points

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      INTEGRATION ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     PLATFORM INTEGRATION                         │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │   │
│  │   │ Claude  │  │ ChatGPT │  │  Gemini │  │  Local  │        │   │
│  │   │         │  │         │  │         │  │   AI   │        │   │
│  │   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │   │
│  │        │            │            │            │              │   │
│  │        └────────────┼────────────┼────────────┘              │   │
│  │                      │            │                           │   │
│  │                      ▼            ▼                           │   │
│  │            ┌─────────────────────────────────┐               │   │
│  │            │      RAW URL PROTOCOL           │               │   │
│  │            │   https://raw.githubusercontent │               │   │
│  │            │   /badhope/mobile-skills/main/   │               │   │
│  │            │   agents/[cat]/[file].md        │               │   │
│  │            └─────────────────────────────────┘               │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     SERVICE INTEGRATION                          │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │   │
│  │   │ GitHub  │  │GitHub   │  │ Slack/  │  │  Email  │        │   │
│  │   │  API    │  │ Pages   │  │Discord  │  │  Notify │        │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘        │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 API Design (Future)

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/agents` | GET | List all available agents |
| `/api/agents/{id}` | GET | Get specific agent details |
| `/api/agents/search` | POST | Search agents by criteria |
| `/api/categories` | GET | List all categories |
| `/api/contribute` | POST | Submit new agent |
| `/api/vote/{id}` | POST | Vote for agent |

---

## 6. Security Architecture

### 6.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LAYER 1: INPUT VALIDATION                                             │
│  ├── URL validation (GitHub Raw URLs only)                             │
│  ├── Content-type verification                                          │
│  └── Size limits                                                       │
│                                                                         │
│  LAYER 2: CONTENT FILTERING                                            │
│  ├── YAML parsing validation                                            │
│  ├── Markdown sanitization                                              │
│  └── Sensitive data detection                                           │
│                                                                         │
│  LAYER 3: ACCESS CONTROL                                                │
│  ├── GitHub permissions                                                 │
│  ├── Rate limiting (future)                                              │
│  └── Admin authentication (future)                                     │
│                                                                         │
│  LAYER 4: AUDIT & MONITORING                                            │
│  ├── Access logging                                                      │
│  ├── Anomaly detection                                                   │
│  └── Compliance reporting                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Content Safety

| Check | Implementation | Action on Failure |
|:------|:---------------|:------------------|
| YAML Validation | Parse and validate structure | Reject submission |
| Markdown Sanitization | Strip executable content | Clean content |
| Sensitive Data | Pattern matching for secrets | Block and alert |
| Profanity Filter | Word list matching | Flag for review |

---

## 7. Performance Architecture

### 7.1 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CACHING STRATEGY                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        CDN CACHING                             │   │
│  │                                                                 │   │
│  │   GitHub Raw ──► CDN Edge ──► User                             │   │
│  │      │              │                                          │   │
│  │      │         Cache TTL: 5 min                                │   │
│  │      │              │                                          │   │
│  │      └──────────────┴─────── Cache Miss ──────► Fetch Fresh    │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     BROWSER CACHING                             │   │
│  │                                                                 │   │
│  │   First Visit ──► Fetch & Cache ──► Subsequent Visits        │   │
│  │                                  │                             │   │
│  │                            Cache from CDN                       │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Performance Targets

| Metric | Target | Current Status |
|:-------|:-------|:---------------|
| Agent activation time | < 2 seconds | ~1.5 seconds |
| Page load (README) | < 1 second | ~0.8 seconds |
| Search response | < 500ms | ~300ms |
| Mobile compatibility | 100% | 100% |

---

## 8. Scalability Architecture

### 8.1 Scaling Dimensions

| Dimension | Current | v2.0 Target | Strategy |
|:----------|:--------|:-------------|:---------|
| Agent count | 77 | 200+ | Category expansion |
| Concurrent users | N/A (stateless) | Unlimited | CDN + stateless |
| Geographic distribution | Limited | Global | Multi-CDN |
| Integration platforms | 1 (GitHub) | 5+ | API gateway |

### 8.2 Growth Projection

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GROWTH PROJECTION                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Agents    │                                                          │
│     200+ ─ ┤                                          ┌──────────    │
│            │                                    ┌──────┘              │
│     150+ ─ ┤                              ┌──────┘                     │
│            │                        ┌────┘                            │
│     100+ ─ ┤                   ┌─────┘                                 │
│            │              ┌────┘                                      │
│      50+ ─ ┤         ┌─────┘                                          │
│            │    ┌────┘                                                │
│       0+ ─ ┴────┴────────────────────────────────────────────────     │
│           v1.0   v1.5   v1.7   v2.0   v3.0                             │
│                                                                         │
│      Users │                                                          │
│    1000+ ─ ┤                                                   ┌──────  │
│            │                                            ┌──────┘        │
│     500+ ─ ┤                                       ┌──────┘             │
│            │                                  ┌────┘                    │
│     100+ ─ ┤                             ┌────┘                          │
│            │                        ┌────┘                              │
│       0+ ─ ┴────────────────────────┴────────────────────────────────  │
│           v1.0   v1.5   v1.7   v2.0   v3.0                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Module Interface Definitions

### 9.1 Agent Loader Interface

```typescript
interface AgentLoader {
  loadAgent(category: string, agentId: string): Promise<Agent>;
  listAgents(category?: string): Promise<Agent[]>;
  searchAgents(query: SearchQuery): Promise<Agent[]>;
  validateAgent(fileContent: string): ValidationResult;
}

interface Agent {
  metadata: AgentMetadata;
  content: string;
  category: string;
  loadedAt: Date;
}
```

### 9.2 Agent Executor Interface

```typescript
interface AgentExecutor {
  execute(agent: Agent, context: ExecutionContext): Promise<Response>;
  validateInput(input: string): ValidationResult;
  sanitizeOutput(output: string): string;
}
```

---

## 10. Future Architecture Considerations

### 10.1 Planned Enhancements

| Enhancement | Justification | Priority |
|:------------|:--------------|:---------|
| Web Dashboard | Better user experience | P1 |
| API System | Developer integrations | P1 |
| Mobile App | Expanded reach | P2 |
| Admin Panel | Community management | P2 |
| Analytics | Usage insights | P3 |

### 10.2 Technology Evolution

| Component | Current | Future | Rationale |
|:----------|:--------|:-------|:----------|
| Storage | GitHub Raw | Distributed | Better performance |
| Activation | Manual copy/paste | Deep link | Better UX |
| Search | Manual browse | AI-powered | Better discovery |
| Review | Manual | Hybrid AI+human | Better scalability |

---

**Document Status**: Draft for Review
**Next Review**: After user feedback