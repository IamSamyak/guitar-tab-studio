import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";

export default function ResultsScreen({
  score,
  total,
  weakIntervals,
  recommendations,
  onRestart,
  onBack,
}) {
  const accuracy = total === 0 ? 0 : Math.round((score / total) * 100);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-black">🏁 Session Complete</h1>
        <p className="mt-2 text-zinc-400">Great work.</p>
      </div>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-3xl">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-zinc-400">
            Final Score
          </p>

          <div className="mt-3 text-6xl font-black">
            {score}
            <span className="text-zinc-500">/{total}</span>
          </div>

          <p className="mt-3 text-xl font-semibold text-cyan-300">
            {accuracy}% Accuracy
          </p>
        </div>
      </Card>

      {weakIntervals.length > 0 && (
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-3xl">
          <h2 className="mb-4 text-xl font-bold">Weak Intervals</h2>

          <div className="space-y-3">
            {weakIntervals.slice(0, 5).map((entry) => (
              <div
                key={entry.interval.id}
                className="flex items-center justify-between rounded-2xl bg-black/20 p-3"
              >
                <span className="font-semibold">
                  {entry.interval.label}
                </span>

                <span className="text-red-300">
                  {entry.wrong} wrong
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {recommendations.length > 0 && (
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-3xl">
          <h2 className="mb-4 text-xl font-bold">Recommendations</h2>

          <ul className="space-y-2 text-zinc-300">
            {recommendations.map((rec, index) => (
              <li key={index}>• {rec}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex gap-4">
        <Button onClick={onRestart} className="flex-1">
          Restart
        </Button>

        <Button onClick={onBack} variant="secondary" className="flex-1">
          Back
        </Button>
      </div>
    </div>
  );
}