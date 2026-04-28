import { motion, useReducedMotion } from 'framer-motion'
import {
  GlassesIcon,
  Home09Icon,
  Stethoscope02Icon,
} from '@hugeicons/core-free-icons'
import {
  CareButton,
  CareCard,
  CareEyebrow,
  CareScreen,
  SummaryBar,
  careSpring,
} from '../components/CareScreen'
import { scenario } from '../data/scenario'
import type { ClarifyingAnswer } from '../hooks/useScenarioState'

type RecommendationScreenProps = {
  selectedAnswer: ClarifyingAnswer
  onBack: () => void
  onBook: () => void
  onInspectHandoff: () => void
}

export function RecommendationScreen({
  selectedAnswer,
  onBack,
  onBook,
  onInspectHandoff,
}: RecommendationScreenProps) {
  const reduceMotion = useReducedMotion()
  const answerCopy = getAnswerCopy(selectedAnswer)

  return (
    <CareScreen title="Recommendation" onBack={onBack} className="items-center gap-10">
      <SummaryBar />

      <motion.section
        className="flex w-full flex-col gap-5"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...careSpring, delay: reduceMotion ? 0 : 0.06 }}
      >
        <CareEyebrow icon={Stethoscope02Icon}>Recommended next step</CareEyebrow>
        <div>
          <h1 className="text-[32px] font-semibold leading-[1.08] tracking-normal text-[#1a1a1a]">
            Same-day or next day GP appointment
          </h1>
          <p className="mt-3 text-[16px] font-medium leading-5 text-[#8a8a8a]">
            {answerCopy}
          </p>
        </div>
      </motion.section>

      <CareCard>
        <div className="flex flex-col gap-3">
          <CareEyebrow icon={Stethoscope02Icon} tone="muted">
            Why this recommendation
          </CareEyebrow>
          <p className="text-[16px] font-medium leading-5 text-[#8a8a8a]">
            {scenario.recommendation.reason}
          </p>
          <button
            type="button"
            className="w-fit text-left text-[16px] font-semibold leading-5 text-[#7a9e94] decoration-dotted underline underline-offset-4"
          >
            How we arrived at this recommendation
          </button>
        </div>
      </CareCard>

      <section className="flex w-full flex-col gap-3">
        <p className="text-[14px] font-medium uppercase leading-[18px] text-[#5a5a55]">
          Other options considered
        </p>

        {scenario.recommendation.otherOptions.map((option) => (
          <CareCard key={option.title} tone="muted">
            <div className="flex flex-col gap-3">
              <CareEyebrow
                icon={option.title === 'Optician check' ? GlassesIcon : Home09Icon}
                tone="muted"
              >
                {option.title === 'Optician check' ? 'Optician' : 'Self-care only'}
              </CareEyebrow>
              <p className="text-[16px] font-medium leading-5 text-[#8a8a8a]">
                {option.body}
              </p>
            </div>
          </CareCard>
        ))}
      </section>

      <CareCard tone="warning">
        <div className="flex flex-col gap-3">
          <CareEyebrow icon={Stethoscope02Icon} tone="warning">
            When to act faster
          </CareEyebrow>
          <ul className="list-disc pl-6 text-[16px] font-medium leading-5 text-[#8a8a8a]">
            {scenario.recommendation.urgency.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </CareCard>

      <div className="flex w-full flex-col items-center gap-5">
        <CareButton onClick={onBook} className="w-[calc(100%-32px)]">
          Find a GP appointment
        </CareButton>
        <CareButton
          variant="outline"
          onClick={onInspectHandoff}
          className="w-[calc(100%-32px)]"
        >
          See and edit what will be shared
        </CareButton>
      </div>
    </CareScreen>
  )
}

function getAnswerCopy(selectedAnswer: ClarifyingAnswer) {
  if (selectedAnswer === 'Yes') {
    return 'Your extra symptoms make it more important to get clinical advice soon'
  }

  if (selectedAnswer === 'Some of these') {
    return 'Because some extra symptoms may be present, a prompt GP conversation is the clearest next step'
  }

  if (selectedAnswer === 'No') {
    return 'Even without those extra symptoms, the changing pattern and vision changes are worth checking'
  }

  return 'The pattern you described is enough to suggest speaking with a GP soon'
}
