import type { IReview } from "../types/Review";
import {
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  CodeBracketIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

const ResumeReview = ({ review }: { review: IReview | null }) => {
  if (!review)
    return <div className="text-gray-500 text-center mt-8">No review available</div>;

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800 p-8 space-y-8 transition-all duration-300">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">📝 Resume Review</h2>
        <Badge verdict={review.verdict} />
      </div>

      {/* Summary */}
      <section className="bg-zinc-800/60 p-5 rounded-lg transition hover:bg-zinc-800/70">
        <h3 className="text-xl text-white font-semibold mb-3">📄 Summary</h3>
        <p className="text-gray-300 leading-relaxed">{review.summary}</p>
      </section>

      {/* Pros & Cons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-zinc-800/60 p-5 rounded-lg transition hover:bg-zinc-800/70">
          <h4 className="flex items-center text-green-300 font-semibold text-md mb-2 tracking-wide">
            <CheckCircleIcon className="h-5 w-5 mr-2" /> Pros
          </h4>
          <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
            {review.pros.map((item, idx) => (
              <li key={`pro-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-zinc-800/60 p-5 rounded-lg transition hover:bg-zinc-800/70">
          <h4 className="flex items-center text-red-300 font-semibold text-md mb-2 tracking-wide">
            <XCircleIcon className="h-5 w-5 mr-2" /> Cons
          </h4>
          <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
            {review.cons.map((item, idx) => (
              <li key={`con-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recommendations */}
      <section className="bg-zinc-800/60 p-5 rounded-lg transition hover:bg-zinc-800/70">
        <h4 className="flex items-center text-blue-300 font-semibold text-md mb-3 tracking-wide">
          <LightBulbIcon className="h-5 w-5 mr-2" /> Recommendations
        </h4>
        <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
          {review.recommendations.map((item, idx) => (
            <li key={`rec-${idx}`}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Meta Info */}
      <section className="flex flex-wrap gap-6 text-sm text-gray-400 bg-zinc-800/70 border border-zinc-700 rounded-lg p-5">
        <div>
          <span className="text-gray-200 font-semibold">Score:</span>{" "}
          {review.score} / 10
        </div>
        <div>
          <span className="text-gray-200 font-semibold">Grammar Issues:</span>{" "}
          {review.grammar_issues}
        </div>
        <div>
          <span className="text-gray-200 font-semibold">Job Fit:</span>{" "}
          {review.job_fit}
        </div>
      </section>

      {/* Highlighted Projects */}
      <section className="bg-zinc-800/60 p-5 rounded-lg transition hover:bg-zinc-800/70">
        <h4 className="flex items-center text-purple-300 font-semibold text-md mb-3 tracking-wide">
          <FireIcon className="h-5 w-5 mr-2" /> Highlighted Projects
        </h4>
        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
          {review.highlighted_projects.map((project, idx) => (
            <li key={`proj-${idx}`}>{project}</li>
          ))}
        </ul>
      </section>

      {/* Tech Stack */}
      <section>
        <h4 className="flex items-center text-teal-300 font-semibold text-md mb-3 tracking-wide">
          <CodeBracketIcon className="h-5 w-5 mr-2" /> Tech Stack Strengths
        </h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {review.tech_stack_strengths.map((tech, idx) => (
            <span
              key={`tech-${idx}`}
              className="bg-teal-500/10 text-teal-200 text-xs px-3 py-1 rounded-full font-medium border border-teal-500/50 hover:bg-teal-500/20 hover:text-white transition"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

const Badge = ({ verdict }: { verdict: string }) => {
  const baseStyles =
    "px-3 py-1 text-xs font-bold uppercase border rounded-full transition-all duration-200 shadow-sm hover:shadow-md";
  const colorMap: { [key: string]: string } = {
    "strong candidate":
      "bg-green-500/10 text-green-300 border-green-500 hover:bg-green-500/20",
    pass: "bg-yellow-500/10 text-yellow-300 border-yellow-500 hover:bg-yellow-500/20",
    "needs improvement":
      "bg-red-500/10 text-red-300 border-red-500 hover:bg-red-500/20",
  };

  return (
    <span
      className={`${baseStyles} ${
        colorMap[verdict] || "bg-gray-600 text-gray-100 border-gray-500"
      }`}
    >
      {verdict}
    </span>
  );
};

export default ResumeReview;
