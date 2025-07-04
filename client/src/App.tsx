import { useState } from "react"
import type { IReview } from "./types/Review"
import ResumeUpload from "./components/Resume"
import ResumeReview from "./components/Review"

function App() {
  const [review, setReview] = useState<null | IReview>(mock)

  return (
    <main className="min-h-screen bg-zinc-900 p-8 space-y-6 flex flex-col items-center justify-center">
      {review ? (
        <>
          <ResumeReview review={review} />
          <button onClick={() => setReview(null)} className="mt-4 bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors text-white py-2 px-4 rounded-md">
            Get review for another resume
          </button>
        </>
      ) : (
        <ResumeUpload onReviewReceived={setReview} />
      )}
    </main>
  )
}

export default App

const mock: IReview = {
  pros:
    [
      "Clear focus on MERN stack development.",
      "Project descriptions highlight the use of AI and relevant technologies.",
      "Demonstrated teamwork and problem-solving skills through hackathon wins.",
      "Eagerness to learn and contribute to new challenges.",
      "Includes relevant skills like Git and Tailwind CSS."
    ],
  "cons":
    [
      "Resume lacks quantifiable achievements and metrics (e.g., impact of AI chatbot, performance improvements from interview platform).",
      "Education section lacks specific dates (only years provided).",
      "Inconsistent formatting and grammatical errors present.",
      "Skills section is basic; could be enhanced with specific proficiency levels or tools used within each skill.",
      "The 'Leadership', 'Presentation Skill', and 'TeamWork' should be integrated into project descriptions with concrete examples.",
      "Redundant 'GITHUB LINK' entries.",
      "The 'per.' abbreviation in the resume is unclear.",
      "No work experience listed.",
      "No mention of open-source contributions or personal projects outside of hackathons."
    ],
  "score": 6,
  "summary":
    "A MERN stack developer with a passion for AI-driven web applications. Demonstrated teamwork and problem-solving skills through hackathons. Needs improvement in quantifying achievements, addressing grammatical issues, and adding work experience.",
  "recommendations": [
    "Quantify achievements in project descriptions to demonstrate impact (e.g., 'Improved interview preparation scores by X%', 'Reduced chatbot response time by Y%').",
    "Provide specific dates (month/year) for education entries.",
    "Proofread the resume carefully to eliminate grammatical errors and inconsistencies in formatting.",
    "Expand the skills section with specific tools and proficiency levels.",
    "Incorporate soft skills like leadership, presentation, and teamwork into the project descriptions with concrete examples.",
    "Remove redundant entries like the duplicate 'GITHUB LINK'.", "Provide a more descriptive label for the 'per.' abbreviation (e.g., 'Percentage in 12th Grade').",
    "Add any relevant work experience, even if it's internships or part-time roles.", "Include links to live demos or GitHub repositories for the projects.",
    "Consider adding a section for awards, certifications, or volunteer experience."
  ],
  "job_fit": "Junior MERN Stack Developer, AI-focused Web Development",
  "verdict": "needs improvement",
  "grammar_issues": 3,
  "highlighted_projects": [
    "AI-INTERVIEW-PLATFROM - Brahma Code Hackathon Winner",
    "AI CHAT BOT - SOUINOVATION Hackathon"
  ],
  "tech_stack_strengths": [
    "MongoDB",
    "React",
    "Node.js",
    "Express",
    "Git & GitHub",
    "Tailwind CSS"
  ]
}