/**
 * Shown while a lazily-loaded route chunk is fetched.
 *
 * Deliberately minimal and non-animated: on a fast connection it appears for a
 * few frames, and a spinner that flashes in and out reads as jank. It reserves
 * viewport height so the layout does not jump when the real page arrives.
 */
export default function RouteFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none" />
    </div>
  )
}
