# Phase 4.2 (v4.9) — Visibility patch files

Ты копируешь **эти файлы** в репозиторий (обычно в `patches/`), затем Claude Code:
- берёт полный текст `patches/Visibility_v4_9_FULL.md` и **заменяет** `docs/03_map/Visibility.md` целиком
- берёт `patches/SOURCE_OF_TRUTH_Visibility_v4_9_SECTION.md` и вставляет секцию в `docs/00_meta/SOURCE_OF_TRUTH.md`, плюс обновляет заголовок до v4.9
- берёт `patches/CHANGELOG_v4_9_ENTRY.md` и вставляет запись в начало `docs/00_meta/CHANGELOG.md`

Важно: не используем инструкции по распаковке архивов (переносишь руками).
