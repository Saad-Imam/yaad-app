import { useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import Badge from "../components/Badge";
import { filterOptions, opportunities, deadlinesThisWeek } from "../data";

interface FilterState {
  types: string[];
  deadline: string;
  scope: string[];
}

const initialFilters: FilterState = {
  types: [],
  deadline: "all",
  scope: [],
};

function FiltersModal({
  draft,
  setDraft,
  onApply,
  onReset,
  onClose,
}: {
  draft: FilterState;
  setDraft: (f: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-surface-container-lowest shadow-card border border-border-subtle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-space-lg py-4">
          <h2 className="font-serif font-semibold text-headline-sm text-primary">
            Filters
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-charcoal-muted hover:bg-surface-cream-subtle"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        <div className="flex flex-col gap-space-lg px-space-lg py-space-md max-h-[60vh] overflow-y-auto">
          {filterOptions.map((group) => (
            <section key={group.groupId} className="flex flex-col gap-2">
              <h3 className="font-caption font-semibold uppercase tracking-wider text-charcoal-muted">
                {group.label}
              </h3>
              <div className="flex flex-col gap-0.5">
                {group.options.map((opt) => {
                  const selected =
                    group.type === "checkbox"
                      ? (draft[group.groupId] as string[]).includes(opt.id)
                      : draft.deadline === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2 font-label-md text-[#1b1b1d] hover:bg-surface-cream-subtle transition-colors text-left"
                      onClick={() => {
                        if (group.type === "checkbox") {
                          const list = draft[group.groupId] as string[];
                          const next = list.includes(opt.id)
                            ? list.filter((id) => id !== opt.id)
                            : [...list, opt.id];
                          setDraft({ ...draft, [group.groupId]: next });
                        } else {
                          setDraft({ ...draft, deadline: opt.id });
                        }
                      }}
                    >
                      <span>{opt.label}</span>
                      <span
                        className={`flex h-[18px] w-[18px] items-center justify-center border ${
                          group.type === "checkbox"
                            ? "rounded-sm"
                            : "rounded-full"
                        } ${
                          selected
                            ? "border-primary-container bg-primary-container text-on-primary"
                            : "border-border-subtle bg-surface-container-lowest"
                        }`}
                      >
                        {selected && (
                          <Icon name="check" className="text-[13px]" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-space-lg py-4">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg font-label-md text-charcoal-secondary hover:bg-surface-cream-subtle transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-5 py-2 rounded-lg bg-primary-container hover:bg-urdu-green-deep text-on-primary font-label-md font-semibold shadow-sm transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesFeed() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [draft, setDraft] = useState<FilterState>(initialFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [tracked, setTracked] = useState<Record<string, boolean>>({});

  const visible = useMemo(
    () =>
      opportunities.filter(
        (op) =>
          (filters.types.length === 0 || filters.types.includes(op.category)) &&
          (filters.deadline === "all" || op.flags.includes(filters.deadline)) &&
          (filters.scope.length === 0 ||
            filters.scope.every((flag) => op.flags.includes(flag))),
      ),
    [filters],
  );

  const activeCount =
    (filters.types.length > 0 ? filters.types.length : 0) +
    (filters.deadline !== "all" ? 1 : 0) +
    filters.scope.length;

  const applyDraft = () => {
    setFilters(draft);
    setModalOpen(false);
  };

  const resetDraft = () => {
    setDraft(initialFilters);
    setFilters(initialFilters);
  };

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Page header + filter trigger */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif font-bold text-headline-lg text-primary tracking-tight">
          Opportunities
        </h1>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block font-label-sm text-charcoal-muted">
            Showing {visible.length} of {opportunities.length}
          </span>
          <button
            onClick={() => {
              setDraft(filters);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-border-subtle shadow-sm hover:bg-surface-cream-subtle transition-colors font-label-md font-semibold text-[#1b1b1d]"
          >
            <Icon name="tune" className="text-[18px] text-primary-container" />
            Filters
            {activeCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-container text-on-primary font-caption font-bold">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-space-lg items-start">
        {/* Unified, generic post feed */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-space-md">
          {visible.map((op) => (
            <article
              key={op.id}
              className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-lg shadow-sm border border-transparent transition-all hover:shadow-card hover:-translate-y-0.5 hover:border-primary-container/60"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge label={op.type} />
                {op.verified && <Badge label="Verified" />}
                <Badge label={op.location} />
                <Badge
                  label={op.deadline}
                  tone={op.urgent ? "urgent" : "default"}
                  className="ml-auto"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm font-semibold tracking-wider text-charcoal-muted uppercase">
                  {op.org}
                </span>
                <h2 className="font-serif font-semibold text-headline-sm text-primary">
                  {op.title}
                </h2>
                <p className="font-body-sm text-[#1b1b1d]">{op.description}</p>
              </div>
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={op.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold hover:bg-urdu-green-deep transition-colors shadow-sm"
                  >
                    View Details
                  </a>
                  <button
                    onClick={() =>
                      setTracked((t) => ({ ...t, [op.id]: !t[op.id] }))
                    }
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-label-md transition-colors ${
                      tracked[op.id]
                        ? "bg-urdu-green-light text-urdu-green-deep"
                        : "bg-surface-cream-subtle text-[#1b1b1d] hover:bg-surface-muted"
                    }`}
                  >
                    {tracked[op.id] ? "Tracked" : "Track"}
                  </button>
                </div>
                <button
                  className="p-2 rounded-lg text-charcoal-muted hover:text-urgent-red hover:bg-surface-cream-subtle transition-colors"
                  title="Save"
                >
                  <Icon name="bookmark_border" className="text-[20px]" />
                </button>
              </div>
            </article>
          ))}

          {visible.length === 0 && (
            <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-xl text-center shadow-sm">
              <Icon
                name="search_off"
                className="text-[48px] text-charcoal-muted mb-2"
              />
              <h3 className="font-serif font-semibold text-headline-sm text-primary">
                No Opportunities Found
              </h3>
              <p className="font-body-sm text-charcoal-muted max-w-sm mt-1">
                Adjust your filters to see more results.
              </p>
              <button
                onClick={() => setFilters(initialFilters)}
                className="mt-4 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md font-semibold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Deadlines panel */}
        <aside className="col-span-12 xl:col-span-4 rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col gap-space-sm xl:sticky xl:top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="alarm_on" className="text-[20px] text-urgent-red" />
              <h3 className="font-serif font-semibold text-title-card text-primary">
                Deadlines This Week
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-urgent-red-bg text-urgent-red font-caption font-bold">
              2 Critical
            </span>
          </div>
          <div className="flex flex-col gap-2.5 pt-1">
            {deadlinesThisWeek.map((d) => (
              <div
                key={d.title}
                className="p-3 rounded-lg bg-surface-cream-subtle flex flex-col gap-1.5 transition-colors hover:bg-surface-muted"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-label-sm font-semibold flex items-center gap-1 ${
                      d.urgent ? "text-urgent-red" : "text-secondary"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${d.urgent ? "bg-urgent-red" : "bg-secondary"}`}
                    />
                    {d.status}
                  </span>
                </div>
                <div className="font-body-sm font-semibold text-primary">
                  {d.title}
                </div>
                <div className="flex items-center justify-between font-caption text-charcoal-muted pt-1">
                  <span>Required: {d.required}</span>
                  <a
                    href="#"
                    className="text-urdu-green-deep font-semibold hover:underline flex items-center gap-0.5"
                  >
                    {d.linkLabel}{" "}
                    <Icon name="chevron_right" className="text-[14px]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {modalOpen && (
        <FiltersModal
          draft={draft}
          setDraft={setDraft}
          onApply={applyDraft}
          onReset={resetDraft}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
