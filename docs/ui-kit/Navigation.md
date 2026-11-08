# Navigation

## Today on dev

| Surface | Items |
|---|---|
| Phone tab bar | Home · Lessons · Missions · Words · More |
| More sheet | Speak · Hands-free · Scenes · Sounds · Daily Practice · Grammar · Alphabet · Poetry · My cards · Settings |
| Desktop sidebar | Core loop (Home, Lessons, Missions, Words), divider, extra practice, Settings at the bottom |
| Top bar | Logo · streak · XP |

Ten items under More is too many to scan, and four of them overlap with ways to review (Today plan, Daily Practice, the Words "Today" deck, My cards).

## Proposed: five tabs, each with one job

| Tab | Holds | Tone |
|---|---|---|
| **Today** | The daily plan and one Continue button; streak and goal | firuze |
| **Learn** | Lessons path, Alphabet (with tracing), Grammar | saffron |
| **Speak** | Missions, Scenes, Pronunciation (Speak), Sounds, Hands-free | anar |
| **Review** | One review queue for every item type, My cards, Dictionary search | sky |
| **Me** | Progress and badges, Poetry, Settings | plum |

Rules:
- Each tab opens on a hub page: a `PageHeader` and `Tile` rows for its sections, the most-used first.
- Review is a single queue: words, letters, grammar points, mission skills and weak sounds all feed it, so there is one "Review" button in the app.
- The More sheet goes away. Settings moves under Me.
- Sessions still hide all navigation.
- Desktop sidebar mirrors the five tabs with their sections listed beneath each.

Migration: keep every current URL working (`/app/missions/` stays, reached from Speak) so links and bookmarks don't break.
