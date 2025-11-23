---
name: /openspec-archive
id: openspec-archive
category: OpenSpec
description: Archive a deployed OpenSpec change and update specs.
---
<!-- OPENSPEC:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.

**Steps**
1. Determine the change ID to archive:
   - If this prompt already includes a specific change ID (for example inside a `<ChangeId>` block populated by slash-command arguments), use that value after trimming whitespace.
   - If the conversation references a change loosely (for example by title or summary), run `openspec list` to surface likely IDs, share the relevant candidates, and confirm which one the user intends.
   - Otherwise, review the conversation, run `openspec list`, and ask the user which change to archive; wait for a confirmed change ID before proceeding.
   - If you still cannot identify a single change ID, stop and tell the user you cannot archive anything yet.
2. Validate the change ID by running `openspec list` (or `openspec show <id>`) and stop if the change is missing, already archived, or otherwise not ready to archive.
3. **Check for duplicate archives**: Before archiving, check if an archive version already exists in `changes/archive/*-<change-id>/`. If found, compare the contents (especially proposal.md) to determine if this is a duplicate. If identical, inform the user and skip archiving.
4. Run `openspec archive <id> --yes` so the CLI moves the change and applies spec updates without prompts (use `--skip-specs` only for tooling-only work).
5. **Verify archive completion**: After the archive command:
   - Confirm that `changes/<change-id>/` no longer exists (should be moved)
   - Confirm that `changes/archive/<date>-<change-id>/` exists (should be created)
   - If the source directory still exists, the archive likely failed due to spec conflicts (e.g., "already exists" error)
6. **Handle archive failures gracefully**: If archive fails with "already exists" error:
   - Check if the requirement is already in the target spec
   - If yes, this indicates the change was previously archived
   - Offer to manually delete the duplicate: `rmdir /s /q openspec\changes\<change-id>`
7. Validate with `openspec validate --specs` and inspect with `openspec show <id>` if anything looks off.

**Reference**
- Use `openspec list` to confirm change IDs before archiving.
- Inspect refreshed specs with `openspec list --specs` and address any validation issues before handing off.
<!-- OPENSPEC:END -->
