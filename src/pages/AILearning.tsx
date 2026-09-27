import {
  useEffect,
  useState
} from "react"


type LearningItem = {
  id: number

  title: string
  description: string

  minutes: number

  learn: string
  practice: string

  completed: boolean
}


const defaultLessons: LearningItem[] = [
  {
    id: 1,

    title: "Python for AI",

    description:
      "Review the Python ideas you will actually use in AI.",

    minutes: 10,

    learn:
      "Focus on lists, dictionaries, functions, loops and basic NumPy-style thinking. You do not need to relearn all of programming — the goal is to become comfortable using Python as a tool for AI experiments.",

    practice:
      "Write a Python function that takes a list of numbers and returns their average.",

    completed: false
  },

  {
    id: 2,

    title: "What Is a Neural Network?",

    description:
      "Understand neurons, weights, layers and predictions.",

    minutes: 12,

    learn:
      "A neural network is a function with many adjustable parameters called weights. During training, those weights are changed so the network produces better outputs for the examples it sees.",

    practice:
      "In your own words, explain what a weight does inside a neural network.",

    completed: false
  },

  {
    id: 3,

    title: "Training & Loss",

    description:
      "Learn how a model knows whether it is getting better.",

    minutes: 10,

    learn:
      "A loss function measures how wrong the model's prediction is. Training repeatedly makes predictions, calculates loss, and adjusts weights in a direction that reduces that loss.",

    practice:
      "Imagine a model predicts 7 when the correct answer is 10. What job does the loss function perform?",

    completed: false
  },

  {
    id: 4,

    title: "PyTorch Basics",

    description:
      "Meet tensors and the basic PyTorch workflow.",

    minutes: 15,

    learn:
      "PyTorch represents numerical data using tensors. A tensor is similar to an array, but PyTorch can track operations on tensors so gradients can later be calculated automatically.",

    practice:
      "Create a mental model for the difference between a normal array and a PyTorch tensor.",

    completed: false
  },

  {
    id: 5,

    title: "Tokens",

    description:
      "Learn how language is broken into pieces a model can process.",

    minutes: 10,

    learn:
      "Language models do not directly read words. Text is split into tokens, and every token is assigned an integer ID. Tokens may represent whole words, parts of words, punctuation or other text fragments.",

    practice:
      "Why might the word 'unbelievable' be represented by several tokens rather than one?",

    completed: false
  },

  {
    id: 6,

    title: "Embeddings",

    description:
      "See how token IDs become meaningful vectors.",

    minutes: 12,

    learn:
      "A token ID by itself has no useful meaning. An embedding maps each token to a vector of numbers. During training, these vectors develop relationships that help the model represent patterns in language.",

    practice:
      "Explain why token ID 500 being numerically close to token ID 501 does not mean the two tokens have similar meanings.",

    completed: false
  },

  {
    id: 7,

    title: "Attention",

    description:
      "Understand the core idea behind modern language models.",

    minutes: 15,

    learn:
      "Attention lets each token decide which other tokens in the context are important when building its representation. This allows the model to connect information even when words are far apart in a sentence.",

    practice:
      "In the sentence 'The dog chased the ball because it was moving,' what information might the word 'it' need to pay attention to?",

    completed: false
  },

  {
    id: 8,

    title: "The Transformer",

    description:
      "Put embeddings and attention together.",

    minutes: 15,

    learn:
      "Transformers process token representations through repeated layers containing attention and other neural-network operations. Each layer gradually builds richer contextual representations.",

    practice:
      "Describe the path: text → tokens → embeddings → attention → transformer layers.",

    completed: false
  },

  {
    id: 9,

    title: "How an LLM Generates Text",

    description:
      "Understand next-token prediction and inference.",

    minutes: 12,

    learn:
      "A language model produces probabilities for the next token. One token is selected, added to the context, and the process repeats. Long answers are therefore generated one token at a time.",

    practice:
      "Why does generating a 500-token answer require many model inference steps rather than one?",

    completed: false
  },

  {
    id: 10,

    title: "Fine-tuning & LoRA",

    description:
      "Learn how an existing model can be adapted.",

    minutes: 12,

    learn:
      "Fine-tuning trains a pretrained model on additional examples. LoRA is a technique that learns relatively small additional parameter matrices instead of updating every parameter in the original model.",

    practice:
      "Why might LoRA be attractive when the original model contains billions of parameters?",

    completed: false
  },

  {
    id: 11,

    title: "RAG",

    description:
      "Give an LLM access to information outside its training data.",

    minutes: 12,

    learn:
      "Retrieval-Augmented Generation first searches an external knowledge source for relevant information. That retrieved information is then placed into the model's context before it generates an answer.",

    practice:
      "Imagine MyDay stores your course syllabus. How could RAG help an AI answer 'When is my midterm?'",

    completed: false
  },

  {
    id: 12,

    title: "AI Agents",

    description:
      "Learn how language models can use tools and perform multi-step work.",

    minutes: 15,

    learn:
      "An AI agent combines a model with tools and a loop. Instead of only producing text, the model can decide to call a tool, inspect the result, and continue working toward a goal.",

    practice:
      "Imagine an AI agent inside MyDay. Name one tool it could use and one task that tool would allow it to perform.",

    completed: false
  }
]


function AILearning() {

  const [
    lessons,
    setLessons
  ] =
    useState<LearningItem[]>(() => {

      const saved =
        localStorage.getItem(
          "aiLessons"
        )


      if (!saved) {
        return defaultLessons
      }


      const oldLessons =
        JSON.parse(saved)


      /*
        Keep the new lesson content,
        but preserve completed status
        from localStorage.
      */

      return defaultLessons.map(
        (lesson) => {

          const savedLesson =
            oldLessons.find(
              (
                oldLesson:
                  LearningItem
              ) =>
                oldLesson.id ===
                lesson.id
            )


          return {
            ...lesson,

            completed:
              savedLesson?.completed ??
              false
          }
        }
      )
    })


  useEffect(() => {

    localStorage.setItem(
      "aiLessons",

      JSON.stringify(
        lessons
      )
    )

  }, [lessons])


  const currentLesson =
    lessons.find(
      (lesson) =>
        !lesson.completed
    )


  const completedCount =
    lessons.filter(
      (lesson) =>
        lesson.completed
    ).length


  const progress =
    Math.round(
      (
        completedCount /
        lessons.length
      ) * 100
    )


  function completeLesson(
    id: number
  ) {

    setLessons(
      lessons.map(
        (lesson) =>
          lesson.id === id

            ? {
                ...lesson,

                completed: true
              }

            : lesson
      )
    )
  }


  function reopenLesson(
    id: number
  ) {

    setLessons(
      lessons.map(
        (lesson) =>
          lesson.id === id

            ? {
                ...lesson,

                completed: false
              }

            : lesson
      )
    )
  }


  return (
    <div className="ai-learning-page">

      {/* HEADER */}

      <div className="page-top-header">

        <div className="page-title-block">

          <h1>
            AI Learning
          </h1>

          <p>
            Learn AI a little every day.
          </p>

        </div>

      </div>


      {/* PROGRESS */}

      <section className="ai-progress-card">

        <div>

          <span className="ai-progress-label">
            LEARNING PROGRESS
          </span>

          <h2>
            {completedCount}
            {" / "}
            {lessons.length}
          </h2>

        </div>


        <span className="ai-progress-percent">
          {progress}%
        </span>


        <div className="ai-progress-bar">

          <div
            className="ai-progress-fill"

            style={{
              width:
                `${progress}%`
            }}
          />

        </div>

      </section>


      {/* TODAY'S LESSON */}

      {currentLesson ? (

        <section className="daily-ai-card">

          <div className="daily-ai-top">

  <div className="daily-ai-title-block">

    <span className="daily-ai-label">
      TODAY'S LESSON
    </span>

    <h2>
      {currentLesson.title}
    </h2>

    <p>
      {currentLesson.description}
    </p>

  </div>


  <span className="lesson-time">
    {currentLesson.minutes} min
  </span>

</div>


          <div className="lesson-section">

            <span>
              Learn
            </span>

            <p>
              {currentLesson.learn}
            </p>

          </div>


          <div className="lesson-section lesson-practice">

            <span>
              Quick practice
            </span>

            <p>
              {currentLesson.practice}
            </p>

          </div>


          <button
            className="complete-lesson-button"

            onClick={() =>
              completeLesson(
                currentLesson.id
              )
            }
          >
            ✓ Complete Lesson
          </button>

        </section>

      ) : (

        <section className="daily-ai-card">

          <h2>
            Roadmap complete 🎉
          </h2>

          <p>
            You've completed the first
            MyDay AI learning roadmap.
          </p>

        </section>

      )}


      {/* ROADMAP */}

      <div className="ai-roadmap-header">

        <h2>
          Roadmap
        </h2>

        <span>
          {lessons.length} lessons
        </span>

      </div>


      <div className="ai-lesson-list">

        {lessons.map(
          (lesson) => (

            <div
              className={
                lesson.completed
                  ? "ai-lesson-card completed"
                  : currentLesson?.id ===
                    lesson.id
                    ? "ai-lesson-card current"
                    : "ai-lesson-card"
              }

              key={
                lesson.id
              }
            >

              <div className="lesson-number">

                {lesson.completed
                  ? "✓"
                  : lesson.id}

              </div>


              <div className="lesson-roadmap-info">

                <h3>
                  {lesson.title}
                </h3>

                <p>
                  {lesson.description}
                </p>

              </div>


              <span className="roadmap-time">
                {lesson.minutes} min
              </span>


              {lesson.completed && (

                <button
                  className="reopen-lesson-button"

                  onClick={() =>
                    reopenLesson(
                      lesson.id
                    )
                  }
                >
                  Undo
                </button>

              )}

            </div>

          )
        )}

      </div>

    </div>
  )
}


export default AILearning